import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("token")?.value

    if (!tokenCookie) {
      return NextResponse.json({ error: "No token found" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(tokenCookie, secret)

    await dbConnect()
    const user = await User.findById(payload.userId).select(
      "name email role availableBalance totalInvested totalReturns",
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      availableBalance: user.availableBalance,
      totalInvested: user.totalInvested,
      totalReturns: user.totalReturns,
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
