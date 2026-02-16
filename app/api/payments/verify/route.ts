import mongoose from "mongoose"
import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import Loan from "@/models/Loan"
import Transaction from "@/models/Transaction"
import User from "@/models/User"

function isObjectId(value: unknown): value is string {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
}

async function fetchPaystackVerification(reference: string, secretKey: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  const payload = await response.json()
  return { response, payload }
}

async function resolveUserByMetadata({
  metadataUserId,
  email,
  fallbackUserId,
}: {
  metadataUserId?: string
  email?: string
  fallbackUserId?: string
}) {
  if (isObjectId(metadataUserId)) {
    const byMetadataId = await User.findById(metadataUserId)
    if (byMetadataId) return byMetadataId
  }

  if (isObjectId(fallbackUserId)) {
    const byFallbackId = await User.findById(fallbackUserId)
    if (byFallbackId) return byFallbackId
  }

  if (email) {
    return User.findOne({ email: email.toLowerCase() })
  }

  return null
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: "Paystack is not configured." }, { status: 500 })
  }

  try {
    const authContext = await getAuthenticatedUser(request).catch(() => ({ user: null, shouldRefreshSession: false }))
    const authUserId = authContext.user?._id?.toString()

    const { reference } = await request.json()
    if (!reference || typeof reference !== "string") {
      return NextResponse.json({ message: "Reference is required." }, { status: 400 })
    }

    await dbConnect()

    const existingTx = await Transaction.findOne({ gatewayReference: reference, status: "Completed" })
    if (existingTx) {
      const response = NextResponse.json({
        success: true,
        alreadyProcessed: true,
        type: existingTx.type,
        amountNgn: existingTx.amount,
      })
      return authContext.user && authContext.shouldRefreshSession
        ? withSessionRefresh(response, authContext.user)
        : response
    }

    const { response: verifyResponse, payload } = await fetchPaystackVerification(reference, secretKey)
    if (!verifyResponse.ok || payload?.data?.status !== "success") {
      return NextResponse.json({ message: payload?.message || "Verification failed." }, { status: 400 })
    }

    const charge = payload.data
    const metadata = charge.metadata || {}
    const amountNgn = Number(charge.amount) / 100
    const email = charge.customer?.email as string | undefined
    const paymentType = metadata.paymentType === "down_payment" ? "down_payment" : "wallet_funding"

    if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
      return NextResponse.json({ message: "Invalid payment amount." }, { status: 400 })
    }

    if (paymentType === "down_payment" && metadata.loanId) {
      const loan = await Loan.findById(metadata.loanId)
      const user = await resolveUserByMetadata({
        metadataUserId: metadata.userId,
        email,
        fallbackUserId: authUserId,
      })

      if (!loan || !user) {
        return NextResponse.json({ message: "Unable to resolve down payment context." }, { status: 404 })
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

      const response = NextResponse.json({
        success: true,
        type: "down_payment",
        loanId: loan._id.toString(),
        amountNgn,
      })
      return authContext.user && authContext.shouldRefreshSession
        ? withSessionRefresh(response, authContext.user)
        : response
    }

    const user = await resolveUserByMetadata({
      metadataUserId: metadata.userId,
      email,
      fallbackUserId: authUserId,
    })

    if (!user) {
      return NextResponse.json({ message: "User not found for this transaction." }, { status: 404 })
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

    const response = NextResponse.json({
      success: true,
      type: "wallet_funding",
      amountNgn,
      internalBalanceNgn: user.availableBalance || 0,
    })

    return authContext.user && authContext.shouldRefreshSession ? withSessionRefresh(response, authContext.user) : response
  } catch (error) {
    console.error("PAYSTACK_VERIFY_ERROR", error)
    return NextResponse.json({ message: "Internal server error." }, { status: 500 })
  }
}
