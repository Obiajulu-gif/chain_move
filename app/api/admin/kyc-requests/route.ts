import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function GET() {
  try {
    // Await cookies() here
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("token")?.value

    if (!tokenCookie) {
      return NextResponse.json({ error: "No token found" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(tokenCookie, secret)

    await dbConnect()

    // Verify if the authenticated user is an admin
    const adminUser = await User.findById(payload.userId).select("role")
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Access Denied: Not an admin" }, { status: 403 })
    }

    // Fetch all users with role 'driver' and their KYC related fields, including new physical meeting fields
    const kycRequests = await User.find({ role: "driver" }).select(
      "name email kycStatus kycDocuments createdAt updatedAt physicalMeetingDate physicalMeetingStatus",
    )

    return NextResponse.json(kycRequests, { status: 200 })
  } catch (error) {
    console.error("Error fetching KYC requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
