import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import PlatformSetting from "@/models/PlatformSetting"

export async function GET(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    await dbConnect()
    const settings = await PlatformSetting.findOne({ singletonKey: "default" }).lean()

    const response = NextResponse.json({ success: true, settings })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_PLATFORM_SETTINGS_GET_ERROR", error)
    return NextResponse.json({ message: "Failed to fetch platform settings." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    await dbConnect()
    const payload = await request.json()

    const minimumContributionNgn = Number.parseFloat(String(payload.minimumContributionNgn ?? 0))
    const platformFeeRateBps = Number.parseFloat(String(payload.platformFeeRateBps ?? 0))
    const defaultRepaymentDurationWeeks = Number.parseInt(String(payload.defaultRepaymentDurationWeeks ?? 0), 10)
    const defaultRoiPercent = Number.parseFloat(String(payload.defaultRoiPercent ?? 0))

    if (
      !Number.isFinite(minimumContributionNgn) ||
      minimumContributionNgn < 0 ||
      !Number.isFinite(platformFeeRateBps) ||
      platformFeeRateBps < 0 ||
      platformFeeRateBps > 10000 ||
      !Number.isFinite(defaultRepaymentDurationWeeks) ||
      defaultRepaymentDurationWeeks < 1 ||
      !Number.isFinite(defaultRoiPercent) ||
      defaultRoiPercent < 0 ||
      defaultRoiPercent > 100
    ) {
      return NextResponse.json({ message: "Invalid settings payload." }, { status: 400 })
    }

    const settings = await PlatformSetting.findOneAndUpdate(
      { singletonKey: "default" },
      {
        minimumContributionNgn,
        platformFeeRateBps,
        defaultRepaymentDurationWeeks,
        defaultRoiPercent,
        updatedByUserId: user._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean()

    const response = NextResponse.json({ success: true, settings })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_PLATFORM_SETTINGS_PUT_ERROR", error)
    return NextResponse.json({ message: "Failed to update platform settings." }, { status: 500 })
  }
}

