import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import Issue from "@/models/Issue"
import User from "@/models/User"

export async function GET(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    await dbConnect()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const issueType = searchParams.get("type")
    const q = (searchParams.get("q") || "").trim()

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (issueType) query.issueType = issueType
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
      query.$or = [{ title: regex }, { description: regex }, { reportedByLabel: regex }]
    }

    const issues = await Issue.find(query)
      .populate("reportedByUserId", "name fullName email")
      .sort({ createdAt: -1 })
      .lean()

    const response = NextResponse.json({ success: true, issues })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_ISSUES_GET_ERROR", error)
    return NextResponse.json({ message: "Failed to fetch issues." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    await dbConnect()
    const payload = await request.json()

    const title = String(payload.title || "").trim()
    const issueType = String(payload.issueType || "").trim()
    const description = String(payload.description || "").trim()
    const severity = String(payload.severity || "Medium").trim()
    const reportedBy = String(payload.reportedBy || "").trim()

    if (!title || !description || !["Payment", "KYC", "Vehicle", "Pool", "Withdrawal"].includes(issueType)) {
      return NextResponse.json({ message: "Invalid issue payload." }, { status: 400 })
    }

    let reportedByUserId: string | undefined
    let reportedByLabel = reportedBy || "System"

    if (reportedBy) {
      const linkedUser = await User.findOne({ $or: [{ email: reportedBy.toLowerCase() }, { _id: reportedBy }] })
        .select("_id name fullName email")
        .lean()
        .catch(() => null)

      if (linkedUser) {
        reportedByUserId = linkedUser._id.toString()
        reportedByLabel = linkedUser.fullName || linkedUser.name || linkedUser.email || reportedByLabel
      }
    }

    const issue = await Issue.create({
      title,
      issueType,
      description,
      severity,
      status: "Open",
      reportedByUserId,
      reportedByLabel,
      notes: [
        {
          body: `Issue opened by ${user.name || "admin"}.`,
          authorUserId: user._id,
          createdAt: new Date(),
        },
      ],
    })

    const response = NextResponse.json({ success: true, issue }, { status: 201 })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_ISSUES_POST_ERROR", error)
    return NextResponse.json({ message: "Failed to create issue." }, { status: 500 })
  }
}

