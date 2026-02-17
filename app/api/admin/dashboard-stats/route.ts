import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import { getAdminDashboardAnalytics, parseAdminAnalyticsRange } from "@/src/server/analytics/adminAnalytics"

export async function GET(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = parseAdminAnalyticsRange(searchParams.get("range"))
    const analytics = await getAdminDashboardAnalytics({ range })

    const response = NextResponse.json({ success: true, analytics })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_DASHBOARD_ANALYTICS_ERROR", error)
    return NextResponse.json({ message: "Failed to load admin dashboard analytics." }, { status: 500 })
  }
}

