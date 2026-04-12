import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function GET(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    const users = await User.find({})
      .select("name fullName email role privyUserId createdAt")
      .sort({ createdAt: -1 })
      .lean()

    const response = NextResponse.json({ users })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("USERS_LIST_ERROR", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
