import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

// Helper to get the current user's ID from the token
async function getUserIdFromToken() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get("token")?.value
  if (!tokenCookie) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(tokenCookie, secret)
    return payload.userId as string
  } catch (e) {
    return null
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  try {
    // This should be protected by admin-only middleware
    const { id } = await params // Await params here
    const { role } = await request.json()

    if (!["admin", "driver", "investor"].includes(role)) {
      return NextResponse.json({ message: "Invalid role specified" }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User role updated successfully", user: updatedUser })
  } catch (error) {
    console.error("Error updating user role:", error) // Added console.error for debugging
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  try {
    // This should also be protected by admin-only middleware
    const { id: userIdToDelete } = await params // Await params here
    const currentUserId = await getUserIdFromToken()

    // Security check: an admin cannot delete themselves
    if (userIdToDelete === currentUserId) {
      return NextResponse.json(
        { message: "You cannot delete your own account." },
        { status: 403 }, // Forbidden
      )
    }

    const deletedUser = await User.findByIdAndDelete(userIdToDelete)
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error) // Added console.error for debugging
    return NextResponse.json({ message: "Server error during deletion" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const { id } = await params // Await params here
    const user = await User.findById(id).select(
      // Use the awaited id
      "name email availableBalance totalInvested totalReturns role status joinedDate",
    )
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({
      ...user.toObject(),
      availableBalance: user.availableBalance || 0,
      totalInvested: user.totalInvested || 0,
      totalReturns: user.totalReturns || 0,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
