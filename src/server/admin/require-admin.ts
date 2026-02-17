import { redirect } from "next/navigation"

import { getSessionFromCookies } from "@/lib/auth/session"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export interface AdminUserSession {
  id: string
  name: string
  email: string | null
}

export async function requireAdminAccess(redirectTo = "/signin"): Promise<AdminUserSession> {
  await dbConnect()

  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect(redirectTo)
  }

  const user = await User.findById(session.userId).select("name email role").lean()
  if (!user || user.role !== "admin") {
    redirect(redirectTo)
  }

  return {
    id: user._id.toString(),
    name: user.name || "Admin",
    email: user.email || null,
  }
}

