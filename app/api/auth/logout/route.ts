import { NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/auth/session"

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })
    clearSessionCookie(response)
    return response
  } catch {
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}
