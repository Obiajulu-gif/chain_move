import crypto from "crypto"
import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { confirmDriverPayment } from "@/lib/services/driver-contracts.service"
import { processGatewayCharge } from "@/lib/services/paystack-processing.service"

function resolvePaymentType(metadata: Record<string, unknown>) {
  const rawType = typeof metadata.paymentType === "string" ? metadata.paymentType.toLowerCase() : "wallet_funding"
  if (rawType === "down_payment") return "down_payment"
  if (rawType === "driver_repayment") return "driver_repayment"
  return "wallet_funding"
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: "Server configuration error." }, { status: 500 })
  }

  const body = await request.text()
  const hash = crypto.createHmac("sha512", secretKey).update(body).digest("hex")
  const signature = request.headers.get("x-paystack-signature")

  if (!signature || hash !== signature) {
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 })
  }

  const event = JSON.parse(body)
  if (event.event !== "charge.success") {
    return NextResponse.json({ status: "ignored" }, { status: 200 })
  }

  try {
    await dbConnect()

    const charge = event.data
    const reference = charge.reference as string
    if (!reference) {
      return NextResponse.json({ message: "Missing transaction reference." }, { status: 400 })
    }

    const metadata = charge.metadata || {}
    const paymentType = resolvePaymentType(metadata)
    const amountNgn = Number(charge.amount) / 100
    const email = charge.customer?.email as string | undefined

    if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
      return NextResponse.json({ message: "Invalid payment amount." }, { status: 400 })
    }

    if (paymentType === "driver_repayment") {
      await confirmDriverPayment(reference, {
        verifiedAmountNgn: amountNgn,
        channel: typeof charge.channel === "string" ? charge.channel : null,
        metadata,
      })
      return NextResponse.json({ message: "Driver repayment processed." }, { status: 200 })
    }

    const settlementResult = await processGatewayCharge({
      reference,
      paymentType: paymentType === "down_payment" ? "down_payment" : "wallet_funding",
      amountNgn,
      metadata,
      email,
      channel: typeof charge.channel === "string" ? charge.channel : null,
      processedVia: "webhook",
    })

    return NextResponse.json(
      {
        status: "success",
        alreadyProcessed: settlementResult.alreadyProcessed,
        type: settlementResult.type,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("PAYSTACK_WEBHOOK_ERROR", error)
    return NextResponse.json({ message: "Error processing webhook." }, { status: 500 })
  }
}
