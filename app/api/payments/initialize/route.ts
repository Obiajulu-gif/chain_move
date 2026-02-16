import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"

function resolveCallbackUrl(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
  return `${appUrl}/dashboard/investor`
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: "Paystack is not configured." }, { status: 500 })
  }

  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!user.email) {
      return NextResponse.json({ message: "An email is required for Paystack funding." }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    const amountNgn = Number(body.amountNgn ?? body.amount)
    if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
      return NextResponse.json({ message: "A valid amount is required." }, { status: 400 })
    }

    const amountInKobo = Math.round(amountNgn * 100)
    const reference = `cm_wallet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInKobo,
        email: user.email,
        reference,
        callback_url: resolveCallbackUrl(request),
        metadata: {
          paymentType: "wallet_funding",
          userId: user._id.toString(),
          role: user.role,
          amountNgn,
        },
      }),
    })

    const payload = await paystackResponse.json()
    if (!paystackResponse.ok || payload?.status === false) {
      const message = payload?.message || "Failed to initialize payment."
      return NextResponse.json({ message }, { status: 500 })
    }

    const response = NextResponse.json(payload)
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("PAYSTACK_INITIALIZE_ERROR", error)
    return NextResponse.json({ message: "Failed to initialize payment." }, { status: 500 })
  }
}
