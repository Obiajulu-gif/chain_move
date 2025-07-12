"use server"

import User from "@/models/User" // Adjust path as necessary to your User model
import dbConnect from "@/lib/dbConnect" // Assuming you have a utility to connect to DB

export async function updateUserKycStatus(
  userId: string,
  status: "none" | "pending" | "approved" | "rejected",
  documents: string[] = [],
) {
  try {
    await dbConnect() // Ensure database connection is established

    const user = await User.findById(userId)

    if (!user) {
      return { success: false, message: "User not found." }
    }

    user.kycStatus = status
    if (documents.length > 0) {
      user.kycDocuments = documents
    }
    await user.save()

    return { success: true, message: `KYC status updated to ${status}.` }
  } catch (error) {
    console.error("Failed to update KYC status:", error)
    return { success: false, message: "Failed to update KYC status." }
  }
}
