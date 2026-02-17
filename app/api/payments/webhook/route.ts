import crypto from "crypto"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { confirmDriverPayment } from "@/lib/services/driver-contracts.service"
import Loan from "@/models/Loan"
import Transaction from "@/models/Transaction"
import User from "@/models/User"

function isObjectId(value: unknown): value is string {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
}

async function resolveUserByMetadata({
  metadataUserId,
  email,
}: {
  metadataUserId?: string
  email?: string
}) {
  if (isObjectId(metadataUserId)) {
    const byMetadataId = await User.findById(metadataUserId)
    if (byMetadataId) return byMetadataId
  }

  if (email) {
    return User.findOne({ email: email.toLowerCase() })
  }

  return null
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

    const existingTx = await Transaction.findOne({ gatewayReference: reference, status: "Completed" })
    if (existingTx) {
      return NextResponse.json({ message: "Webhook already processed." }, { status: 200 })
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

    if (paymentType === "down_payment" && metadata.loanId) {
      const loan = await Loan.findById(metadata.loanId)
      const user = await resolveUserByMetadata({
        metadataUserId: metadata.userId,
        email,
      })

      if (!loan || !user) {
        return NextResponse.json({ message: "Unable to resolve down payment context." }, { status: 200 })
      }

      if (!loan.downPaymentMade) {
        loan.downPaymentMade = true
        loan.downPaymentAmount = amountNgn
        loan.downPaymentDate = new Date()
        await loan.save()
      }

      await Transaction.create({
        userId: user._id,
        userType: user.role || "driver",
        amount: amountNgn,
        currency: "NGN",
        status: "Completed",
        type: "down_payment",
        method: "paystack",
        gatewayReference: reference,
        description: `Down payment for Loan #${loan._id.toString()}`,
        relatedId: loan._id.toString(),
      })

      return NextResponse.json({ message: "Down payment processed." }, { status: 200 })
    }

    const user = await resolveUserByMetadata({
      metadataUserId: metadata.userId,
      email,
    })

    if (!user) {
      return NextResponse.json({ message: "User not found for webhook payment." }, { status: 200 })
    }

    user.availableBalance = (user.availableBalance || 0) + amountNgn
    await user.save()

    await Transaction.create({
      userId: user._id,
      userType: user.role || "investor",
      amount: amountNgn,
      currency: "NGN",
      status: "Completed",
      type: "wallet_funding",
      method: "paystack",
      gatewayReference: reference,
      description: "Wallet funded via Paystack",
      metadata: {
        paymentType: "wallet_funding",
        channel: charge.channel,
      },
    })

    return NextResponse.json({ status: "success" }, { status: 200 })
  } catch (error) {
    console.error("PAYSTACK_WEBHOOK_ERROR", error)
    return NextResponse.json({ message: "Error processing webhook." }, { status: 500 })
  }
}
