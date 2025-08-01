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

    // Include kycStatus, kycDocuments, physicalMeetingDate, physicalMeetingStatus, wallet details and notifications
    const user = await User.findById(payload.userId).select(
      "name email role availableBalance totalInvested totalReturns kycStatus kycDocuments physicalMeetingDate physicalMeetingStatus notifications walletAddress smartWalletAddress privateKey",
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    // console.log("priv key ", user.privateKey);
    // I'll make use of the private key later

    delete user.privateKey; // Remove private key from response
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      availableBalance: user.availableBalance,
      totalInvested: user.totalInvested,
      totalReturns: user.totalReturns,
      kycStatus: user.kycStatus,
      kycDocuments: user.kycDocuments,
      physicalMeetingDate: user.physicalMeetingDate,
      physicalMeetingStatus: user.physicalMeetingStatus,
      notifications: user.notifications,
      smartWalletAddress: user.smartWalletAddress || '',
      walletAddress: user.walletAddress || '',
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
