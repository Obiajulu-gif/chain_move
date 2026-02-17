import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import Issue from "@/models/Issue"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    await dbConnect()
    const { id } = await context.params
    const issue = await Issue.findById(id).populate("reportedByUserId", "name fullName email").lean()

    if (!issue) {
      return NextResponse.json({ message: "Issue not found." }, { status: 404 })
    }

    const response = NextResponse.json({ success: true, issue })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_ISSUE_GET_ERROR", error)
    return NextResponse.json({ message: "Failed to fetch issue." }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    await dbConnect()
    const { id } = await context.params
    const payload = await request.json()

    const status = payload.status ? String(payload.status).trim() : null
    const note = payload.note ? String(payload.note).trim() : ""

    if (status && !["Open", "In Progress", "Resolved"].includes(status)) {
      return NextResponse.json({ message: "Invalid issue status." }, { status: 400 })
    }

    const issue = await Issue.findById(id)
    if (!issue) {
      return NextResponse.json({ message: "Issue not found." }, { status: 404 })
    }

    if (status) {
      issue.status = status as any
    }

    if (note) {
      issue.notes.push({
        body: note,
        authorUserId: user._id,
        createdAt: new Date(),
      })
    }

    await issue.save()

    const response = NextResponse.json({ success: true, issue })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_ISSUE_PATCH_ERROR", error)
    return NextResponse.json({ message: "Failed to update issue." }, { status: 500 })
  }
}

