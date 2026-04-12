import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function GET() {
  try {
    await dbConnect()
    const adminCount = await User.countDocuments({ role: "admin" })

    return NextResponse.json({
      isOpen: false,
      publicSignupEnabled: false,
      hasExistingAdmin: adminCount > 0,
    })
  } catch {
    return NextResponse.json(
      {
        isOpen: false,
        publicSignupEnabled: false,
        hasExistingAdmin: false,
        message: "Server error",
      },
      { status: 500 },
    )
  }
}
