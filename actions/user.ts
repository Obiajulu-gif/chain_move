"use server"

import User from "@/models/User" // Adjust path as necessary to your User model
import dbConnect from "@/lib/dbConnect" // Assuming you have a utility to connect to DB

// Helper function to send email (calls the new API route)
async function sendEmailNotification(to: string, subject: string, body: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, body }),
    })
    if (!res.ok) {
      const errorData = await res.json()
      console.error("Failed to send email:", errorData.message)
      return { success: false, message: errorData.message }
    }
    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, message: "Network error or unexpected issue." }
  }
}

export async function updateUserKycStatus(
  userId: string,
  status: "none" | "pending" | "approved_stage1" | "pending_stage2" | "approved_stage2" | "rejected", // Updated status enum
  documents: string[] = [],
  rejectionReason: string | null = null,
  physicalMeetingDate: Date | null = null, // New parameter
  physicalMeetingStatus:
    | "none"
    | "scheduled"
    | "approved"
    | "rescheduled"
    | "completed"
    | "rejected_stage2"
    | null = null, // New parameter
) {
  try {
    await dbConnect() // Ensure database connection is established

    const user = await User.findById(userId)

    if (!user) {
      return { success: false, message: "User not found." }
    }

    const oldKycStatus = user.kycStatus
    const oldPhysicalMeetingStatus = user.physicalMeetingStatus

    // Update kycStatus if explicitly provided and different from current,
    // unless it's a specific physical meeting transition that overrides it.
    if (status !== user.kycStatus) {
      user.kycStatus = status
    }

    if (documents.length > 0) {
      user.kycDocuments = documents
    }
    // Set rejection reason only if status is rejected
    user.kycRejectionReason =
      status === "rejected" || physicalMeetingStatus === "rejected_stage2" ? rejectionReason : null

    // Update physical meeting details if provided
    if (physicalMeetingDate !== null) {
      user.physicalMeetingDate = physicalMeetingDate
    }

    // Handle physicalMeetingStatus and its impact on kycStatus
    if (physicalMeetingStatus !== null) {
      user.physicalMeetingStatus = physicalMeetingStatus

      // Specific transition: If admin approves a scheduled meeting, move kycStatus to pending_stage2
      if (oldPhysicalMeetingStatus === "scheduled" && physicalMeetingStatus === "approved") {
        user.kycStatus = "pending_stage2" // This is the key change for the admin flow
      }
    }

    await user.save()

    // --- Notification and Email Logic ---
    let notificationTitle = ""
    let notificationMessage = ""
    let emailSubject = ""
    let emailBody = ""
    let sendNotification = false

    if (oldKycStatus === "pending" && user.kycStatus === "approved_stage1") {
      notificationTitle = "KYC Stage 1 Approved!"
      notificationMessage =
        "Your first stage KYC verification has been successfully approved. Please proceed to schedule your physical meeting for the second stage."
      emailSubject = "ChainMove: KYC Stage 1 Approved!"
      emailBody = `Dear ${user.name},\n\nYour first stage KYC verification has been successfully approved. Please log in to your dashboard to schedule your physical meeting for the second stage of verification.\n\nThank you,\nChainMove Team`
      sendNotification = true
    } else if (oldKycStatus === "pending" && user.kycStatus === "rejected") {
      notificationTitle = "KYC Rejected"
      notificationMessage = `Your KYC verification was rejected. Reason: ${rejectionReason || "No reason provided"}. Please re-submit.`
      emailSubject = "ChainMove: KYC Rejected"
      emailBody = `Dear ${user.name},\n\nUnfortunately, your KYC verification was rejected. Reason: ${rejectionReason || "No reason provided"}. Please log in to your dashboard to review the requirements and re-submit your documents.\n\nThank you,\nChainMove Team`
      sendNotification = true
    } else if (oldPhysicalMeetingStatus === "scheduled" && user.physicalMeetingStatus === "approved") {
      notificationTitle = "Physical Meeting Date Approved!"
      notificationMessage = `Your physical meeting for KYC Stage 2 on ${new Date(physicalMeetingDate!).toLocaleDateString()} has been approved.`
      emailSubject = "ChainMove: Physical Meeting Date Approved"
      emailBody = `Dear ${user.name},\n\nYour physical meeting for KYC Stage 2 on ${new Date(physicalMeetingDate!).toLocaleDateString()} has been approved. Please prepare for the inspection.\n\nThank you,\nChainMove Team`
      sendNotification = true
    } else if (oldPhysicalMeetingStatus === "scheduled" && user.physicalMeetingStatus === "rescheduled") {
      notificationTitle = "Physical Meeting Rescheduled"
      notificationMessage = `Your physical meeting for KYC Stage 2 has been rescheduled to ${new Date(physicalMeetingDate!).toLocaleDateString()}.`
      emailSubject = "ChainMove: Physical Meeting Rescheduled"
      emailBody = `Dear ${user.name},\n\nYour physical meeting for KYC Stage 2 has been rescheduled to ${new Date(physicalMeetingDate!).toLocaleDateString()}. Please check your dashboard for details.\n\nThank you,\nChainMove Team`
      sendNotification = true
    } else if (oldKycStatus === "pending_stage2" && user.kycStatus === "approved_stage2") {
      notificationTitle = "KYC Fully Approved!"
      notificationMessage = "Congratulations! Your KYC verification is fully approved. You can now access all features."
      emailSubject = "ChainMove: KYC Fully Approved!"
      emailBody = `Dear ${user.name},\n\nCongratulations! Your KYC verification has been successfully approved. You can now fully access all features, including applying for vehicle loans.\n\nThank you,\nChainMove Team`
      sendNotification = true
    } else if (oldKycStatus === "pending_stage2" && user.physicalMeetingStatus === "rejected_stage2") {
      notificationTitle = "KYC Stage 2 Rejected"
      notificationMessage = `Your second stage KYC (physical meeting) was rejected. Reason: ${rejectionReason || "No reason provided"}. Please contact support.`
      emailSubject = "ChainMove: KYC Stage 2 Rejected"
      emailBody = `Dear ${user.name},\n\nUnfortunately, your second stage KYC (physical meeting) was rejected. Reason: ${rejectionReason || "No reason provided"}. Please contact support for assistance.\n\nThank you,\nChainMove Team`
      sendNotification = true
    }

    if (sendNotification) {
      user.notifications.push({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: notificationTitle,
        message: notificationMessage,
        read: false,
        timestamp: new Date(),
        link: "/dashboard/driver/kyc/status", // Link to KYC status page
      })
      await user.save() // Save user with new notification

      // Send email
      await sendEmailNotification(user.email, emailSubject, emailBody)
    }

    return { success: true, message: `KYC status updated to ${user.kycStatus}.` }
  } catch (error) {
    console.error("Failed to update KYC status:", error)
    return { success: false, message: "Failed to update KYC status." }
  }
}
