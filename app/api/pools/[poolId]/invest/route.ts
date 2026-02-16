import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import { investInPool } from "@/lib/services/investments.service"

export async function POST(request: Request, context: { params: Promise<{ poolId: string }> }) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!["investor", "admin"].includes(user.role)) {
      return NextResponse.json({ message: "Only investors or admins can invest in pools." }, { status: 403 })
    }

    const body = await request.json()
    const amountNgn = Number(body.amountNgn)
    const { poolId } = await context.params

    const investment = await investInPool({
      poolId,
      userId: user._id.toString(),
      amountNgn,
      txRef: typeof body.txRef === "string" ? body.txRef : undefined,
    })

    const response = NextResponse.json({ success: true, investment }, { status: 201 })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to invest in pool."
    console.error("POOL_INVEST_ERROR", error)
    return NextResponse.json({ message }, { status: 400 })
  }
}
