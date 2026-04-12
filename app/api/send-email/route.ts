import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

import { finalizeAuthenticatedResponse, requireAuthenticatedUser } from "@/lib/api/route-guard"
import { parseJsonBody } from "@/lib/api/validation"
import { logAuditEvent } from "@/lib/security/audit-log"
import { buildRateLimitKey, consumeRateLimit, getClientIpAddress, rateLimitExceededResponse } from "@/lib/security/rate-limit"

function normalizeRecipients(value: unknown) {
  const items = Array.isArray(value) ? value : [value]
  return items
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
    .filter(Boolean)
    .slice(0, 10)
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const bodySchema = z.object({
  to: z.union([z.string(), z.array(z.string())]),
  subject: z.string().trim().min(1).max(160),
  html: z.string().trim().min(1).max(50000),
})

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Email service is not configured" }, { status: 500 })
    }

    const authContext = await requireAuthenticatedUser(request, ["admin"], {
      forbiddenMessage: "Admin access required",
    })
    if ("response" in authContext) return authContext.response

    const rateLimit = consumeRateLimit({
      key: buildRateLimitKey("send-email", authContext.user._id.toString(), getClientIpAddress(request)),
      limit: 20,
      windowMs: 60 * 60 * 1000,
    })
    if (!rateLimit.allowed) {
      return rateLimitExceededResponse(rateLimit)
    }

    const body = await parseJsonBody(request, bodySchema)
    if ("response" in body) return body.response

    const recipients = normalizeRecipients(body.data.to)
    const subject = body.data.subject
    const html = body.data.html

    if (recipients.length === 0 || recipients.some((recipient) => !isValidEmail(recipient))) {
      return NextResponse.json({ error: "A valid recipient email is required" }, { status: 400 })
    }

    if (!subject || subject.length > 160) {
      return NextResponse.json({ error: "A valid subject is required" }, { status: 400 })
    }

    if (!html || html.length > 50000) {
      return NextResponse.json({ error: "Email content is required" }, { status: 400 })
    }

    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: "onboarding@chainmove.xyz",
      to: recipients,
      subject,
      html,
    })

    if (error) {
      console.error("RESEND_EMAIL_ERROR", error)
      await logAuditEvent({
        actor: authContext.user,
        action: "email.send",
        targetType: "email",
        status: "failure",
        ipAddress: getClientIpAddress(request),
        metadata: {
          recipientsCount: recipients.length,
          subject,
          providerError: error.message,
        },
      })
      return NextResponse.json({ error: "Unable to send email" }, { status: 502 })
    }

    await logAuditEvent({
      actor: authContext.user,
      action: "email.send",
      targetType: "email",
      status: "success",
      ipAddress: getClientIpAddress(request),
      metadata: {
        recipientsCount: recipients.length,
        subject,
      },
    })

    const response = NextResponse.json({ success: true, data }, { status: 200 })
    return finalizeAuthenticatedResponse(response, authContext)
  } catch (error) {
    console.error("SEND_EMAIL_ROUTE_ERROR", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
