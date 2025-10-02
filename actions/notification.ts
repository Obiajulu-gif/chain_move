"use server"

import User from "@/models/User"
import dbConnect from "@/lib/dbConnect"
import { revalidatePath } from "next/cache"

export async function markNotificationsAsRead(userId: string, notificationIds: string[]) {
  try {
    await dbConnect()

    const user = await User.findById(userId)

    if (!user) {
      return { success: false, message: "User not found." }
    }

    // Mark specified notifications as read
    user.notifications = user.notifications.map((notif: any) => {
      if (notificationIds.includes(notif.id)) {
        return { ...notif, read: true }
      }
      return notif
    })

    await user.save()

    // Revalidate paths to reflect changes in UI
    revalidatePath(`/dashboard/driver`)
    revalidatePath(`/dashboard/driver/notifications`)
    revalidatePath(`/dashboard/driver/kyc/status`) // In case notification count is shown here

    return { success: true, message: "Notifications marked as read." }
  } catch (error) {
    console.error("Failed to mark notifications as read:", error)
    return { success: false, message: "Failed to mark notifications as read." }
  }
}
