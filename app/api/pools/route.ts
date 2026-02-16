import { NextResponse } from "next/server"
import { createPool, listPools } from "@/lib/services/pools.service"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"

export async function GET(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get("status")

    const pools = await listPools(user._id.toString())
    const filteredPools = statusParam
      ? pools.filter((pool) => pool.status.toLowerCase() === statusParam.toLowerCase())
      : pools

    const response = NextResponse.json({ success: true, pools: filteredPools })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("POOLS_GET_ERROR", error)
    return NextResponse.json({ message: "Failed to load pools." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!["admin", "investor"].includes(user.role)) {
      return NextResponse.json({ message: "Only investors or admins can create pools." }, { status: 403 })
    }

    const body = await request.json()
    const targetAmountNgn =
      body.targetAmountNgn === undefined || body.targetAmountNgn === null || body.targetAmountNgn === ""
        ? undefined
        : Number(body.targetAmountNgn)
    const minContributionNgn =
      body.minContributionNgn === undefined || body.minContributionNgn === null || body.minContributionNgn === ""
        ? undefined
        : Number(body.minContributionNgn)

    const pool = await createPool({
      assetType: body.assetType,
      createdBy: user._id.toString(),
      targetAmountNgn,
      minContributionNgn,
      description: body.description,
    })

    const response = NextResponse.json({ success: true, pool }, { status: 201 })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create pool."
    console.error("POOLS_CREATE_ERROR", error)
    return NextResponse.json({ message }, { status: 400 })
  }
}
