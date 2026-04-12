import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import dbConnect from "@/lib/dbConnect"
import Vehicle from "@/models/Vehicle"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 })
    }

    const result = await Vehicle.updateMany({ fundingStatus: "Funded" }, { $set: { status: "Financed" } })

    const response = NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} vehicles with fundingStatus 'Funded' to status 'Financed'`,
      modifiedCount: result.modifiedCount,
    })

    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("VEHICLE_STATUS_MIGRATION_ERROR", error)
    return NextResponse.json(
      { success: false, error: "Failed to migrate vehicle status" },
      { status: 500 },
    )
  }
}
