import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Notification from "@/models/Notification"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const notificationData = await request.json()
    
    const notification = new Notification(notificationData)
    await notification.save()
    
    return NextResponse.json({ success: true, notification })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }
    
    const notifications = await Notification.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50)
    
    return NextResponse.json({ success: true, notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}