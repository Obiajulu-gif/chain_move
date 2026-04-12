import { NextResponse } from "next/server"
import { z } from "zod"

import dbConnect from "@/lib/dbConnect"
import { finalizeAuthenticatedResponse, requireAuthenticatedUser } from "@/lib/api/route-guard"
import { parseJsonBody } from "@/lib/api/validation"
import { confirmDriverPayment } from "@/lib/services/driver-contracts.service"
import { processGatewayCharge } from "@/lib/services/paystack-processing.service"
import { buildRateLimitKey, consumeRateLimit, getClientIpAddress, rateLimitExceededResponse } from "@/lib/security/rate-limit"

const bodySchema = z.object({
  reference: z.string().trim().min(6).max(200),
})

async function fetchPaystackVerification(reference: string, secretKey: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  const payload = await response.json()
  return { response, payload }
}

function resolvePaymentType(metadata: Record<string, unknown>) {
  const rawType = typeof metadata.paymentType === "string" ? metadata.paymentType.toLowerCase() : "wallet_funding"
  if (rawType === "down_payment") return "down_payment"
  if (rawType === "driver_repayment") return "driver_repayment"
  return "wallet_funding"
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: "Paystack is not configured." }, { status: 500 })
  }

  try {
    const authContext = await requireAuthenticatedUser(request)
    if ("response" in authContext) return authContext.response

    const body = await parseJsonBody(request, bodySchema)
    if ("response" in body) return body.response

    const rateLimit = consumeRateLimit({
      key: buildRateLimitKey(
        "payments:verify",
        authContext.user._id.toString(),
        body.data.reference,
        getClientIpAddress(request),
      ),
      limit: 12,
      windowMs: 10 * 60 * 1000,
    })
    if (!rateLimit.allowed) {
      return rateLimitExceededResponse(rateLimit)
    }

    await dbConnect()

    const { response: verifyResponse, payload } = await fetchPaystackVerification(body.data.reference, secretKey)
    if (!verifyResponse.ok || payload?.data?.status !== "success") {
      return NextResponse.json({ message: payload?.message || "Verification failed." }, { status: 400 })
    }

    const charge = payload.data
    const metadata = charge.metadata || {}
    const amountNgn = Number(charge.amount) / 100
    const email = charge.customer?.email as string | undefined
    const paymentType = resolvePaymentType(metadata)

    if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
      return NextResponse.json({ message: "Invalid payment amount." }, { status: 400 })
    }

    if (paymentType === "driver_repayment") {
      const repaymentResult = await confirmDriverPayment(body.data.reference, {
        verifiedAmountNgn: amountNgn,
        channel: typeof charge.channel === "string" ? charge.channel : null,
        metadata,
      })

      const response = NextResponse.json({
        success: true,
        type: "driver_repayment",
        alreadyProcessed: repaymentResult.alreadyProcessed,
        amountNgn: repaymentResult.payment.amountNgn,
        appliedAmountNgn: repaymentResult.payment.appliedAmountNgn,
        remainingBalanceNgn: repaymentResult.contract.remainingBalanceNgn,
        contractStatus: repaymentResult.contract.status,
        investorCreditsPosted: repaymentResult.distribution.investorCreditsCount,
      })

      return finalizeAuthenticatedResponse(response, authContext)
    }

    const settlementResult = await processGatewayCharge({
      reference: body.data.reference,
      paymentType: paymentType === "down_payment" ? "down_payment" : "wallet_funding",
      amountNgn,
      metadata,
      email,
      fallbackUserId: authContext.user._id.toString(),
      channel: typeof charge.channel === "string" ? charge.channel : null,
      processedVia: "verify",
    })

    const response = NextResponse.json({
      success: true,
      ...settlementResult,
    })

    return finalizeAuthenticatedResponse(response, authContext)
  } catch (error) {
    console.error("PAYSTACK_VERIFY_ERROR", error)
    const message = error instanceof Error ? error.message : "Internal server error."
    return NextResponse.json({ message }, { status: 500 })
  }
}
