import { NextResponse } from "next/server"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import Transaction from "@/models/Transaction"

export async function GET(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const transactions = await Transaction.find({
      userId: user._id,
      type: { $in: ["deposit", "wallet_funding", "pool_investment", "wallet_debit"] },
    })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean()

    const response = NextResponse.json({
      success: true,
      wallet: {
        internalBalanceNgn: user.availableBalance || 0,
        walletAddress: user.walletAddress || user.walletaddress || null,
      },
      transactions: transactions.map((tx: any) => ({
        id: tx._id.toString(),
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency || "NGN",
        status: tx.status,
        method: tx.method,
        description: tx.description,
        reference: tx.gatewayReference,
        timestamp: tx.timestamp,
      })),
    })

    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("WALLET_SUMMARY_ERROR", error)
    return NextResponse.json({ message: "Failed to load wallet summary." }, { status: 500 })
  }
}
