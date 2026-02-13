import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import Transaction from "@/models/Transaction"
import Loan from "@/models/Loan"

async function getExchangeRate(): Promise<number> {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/NGN")
    const data = await res.json()
    if (data.rates?.USD) return data.rates.USD
    throw new Error("rate")
  } catch {
    return 1 / 1600
  }
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ message: "Config error" }, { status: 500 })

  try {
    const { reference } = await request.json()
    if (!reference) return NextResponse.json({ message: "Reference required" }, { status: 400 })

    await dbConnect()

    const existing = await Transaction.findOne({ gatewayReference: reference })
    if (existing) {
      return NextResponse.json({ success: true, alreadyProcessed: true, type: existing.type, loanId: existing.relatedId, amountUSD: existing.amount })
    }

    const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    const payload = await resp.json()
    if (!resp.ok || payload?.data?.status !== "success") {
      return NextResponse.json({ message: payload?.message || "Verification failed" }, { status: 400 })
    }

    const data = payload.data
    const amountNGN = data.amount / 100
    const email = data.customer?.email
    const metadata = data.metadata || {}
    if (!email) return NextResponse.json({ message: "Email missing" }, { status: 400 })

    const rate = await getExchangeRate()
    const amountUSD = amountNGN * rate
    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

    if (metadata.paymentType === "down_payment" && metadata.loanId) {
      const loanId = metadata.loanId
      const loan = await Loan.findById(loanId)
      if (loan && !loan.downPaymentMade) {
        await Loan.findByIdAndUpdate(loanId, { downPaymentMade: true, downPaymentAmount: amountUSD, downPaymentDate: new Date() })
        await Transaction.create({
          userId: user._id,
          userType: "driver",
          amount: amountUSD,
          amountOriginal: amountNGN,
          currency: "USD",
          originalCurrency: "NGN",
          exchangeRate: rate,
          status: "Completed",
          type: "down_payment",
          method: "gateway",
          gatewayReference: reference,
          description: `Down payment for Loan #${loanId}`,
          relatedId: loanId,
        })
      }
      return NextResponse.json({ success: true, type: "down_payment", loanId, amountUSD, amountNGN, exchangeRate: rate })
    }

    await User.findOneAndUpdate({ email }, { $inc: { availableBalance: amountUSD } }, { new: true })
    await Transaction.create({
      userId: user._id,
      userType: "investor",
      amount: amountUSD,
      amountOriginal: amountNGN,
      currency: "USD",
      originalCurrency: "NGN",
      exchangeRate: rate,
      status: "Completed",
      type: "deposit",
      method: "gateway",
      gatewayReference: reference,
      description: `Wallet funded via Paystack`,
    })

    return NextResponse.json({ success: true, type: "deposit", amountUSD, amountNGN, exchangeRate: rate })
  } catch (e) {
    console.error("Verify error", e)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}