import { NextResponse } from "next/server"
import { getPoolById } from "@/lib/services/pools.service"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"

export async function GET(request: Request, context: { params: Promise<{ poolId: string }> }) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { poolId } = await context.params
    const pool = await getPoolById(poolId, user._id.toString())
    const response = NextResponse.json({ success: true, pool })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch pool."
    console.error("POOL_GET_ERROR", error)
    return NextResponse.json({ message }, { status: 400 })
  }
}
