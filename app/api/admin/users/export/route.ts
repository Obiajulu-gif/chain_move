import { NextResponse } from "next/server"

import dbConnect from "@/lib/dbConnect"
import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import User from "@/models/User"

function csvEscape(value: unknown): string {
  const raw = value == null ? "" : String(value)
  if (raw.includes(",") || raw.includes("\"") || raw.includes("\n")) {
    return `"${raw.replace(/"/g, "\"\"")}"`
  }
  return raw
}

export async function GET(request: Request) {
  try {
    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    if (user.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    await dbConnect()

    const users = await User.find({})
      .select("name fullName email role privyUserId createdAt")
      .sort({ createdAt: -1 })
      .lean()

    const headers = ["Name", "Email", "Role", "Privy User ID", "Created At"]
    const lines = [headers.map(csvEscape).join(",")]

    for (const entry of users) {
      lines.push(
        [
          entry.fullName || entry.name || "",
          entry.email || "",
          entry.role || "",
          entry.privyUserId || "",
          entry.createdAt ? new Date(entry.createdAt).toISOString() : "",
        ]
          .map(csvEscape)
          .join(","),
      )
    }

    const response = new NextResponse(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"users.csv\"",
      },
    })

    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("ADMIN_USERS_EXPORT_ERROR", error)
    return NextResponse.json({ message: "Failed to export users." }, { status: 500 })
  }
}

