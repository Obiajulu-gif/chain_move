import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required email fields" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@rchainmove.xyz", 
      to: to,
      subject: subject,
      html: html,
    })

    if (error) {
      console.error("Resend email error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data }, { status: 200 })
  } catch (error) {
    console.error("API error sending email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
