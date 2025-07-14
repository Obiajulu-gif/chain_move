"use server"

import User from "@/models/User" // Adjust path as necessary to your User model
import dbConnect from "@/lib/dbConnect" // Assuming you have a utility to connect to DB

export async function updateUserKycStatus(
  userId: string,
  status: "none" | "pending" | "approved" | "rejected",
  documents: string[] = [],
  rejectionReason: string | null = null, // Added rejectionReason parameter
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
    // Set rejection reason only if status is rejected
    user.kycRejectionReason = status === "rejected" ? rejectionReason : null

    await user.save()

    return { success: true, message: `KYC status updated to ${status}.` }
  } catch (error) {
    console.error("Failed to update KYC status:", error)
    return { success: false, message: "Failed to update KYC status." }
  }
}
