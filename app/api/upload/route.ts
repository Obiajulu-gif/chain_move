import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export async function POST(request: Request): Promise<NextResponse> {
  const cookieStore = cookies()
  const tokenCookie = await cookieStore.get("token")?.value

  if (!tokenCookie) {
    return NextResponse.json({ error: "No token found" }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(tokenCookie, secret)

    await dbConnect()
    const user = await User.findById(payload.userId).select("role")

    // Ensure the user exists and is authenticated
    if (!user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename || !request.body) {
      return NextResponse.json({ message: "No filename or file body provided." }, { status: 400 })
    }

    // Generate a unique filename by adding timestamp and random suffix
    // The `addRandomSuffix: true` option in `put` also adds randomness,
    // but this manual approach ensures a more readable unique name.
    const fileExtension = filename.split(".").pop()
    const baseName = filename.replace(/\.[^/.]+$/, "")
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const uniqueFilename = `${baseName}_${timestamp}_${randomSuffix}.${fileExtension}`

    // Use the put method to upload the file to Vercel Blob
    const blob = await put(uniqueFilename, request.body, {
      access: "public",
      // addRandomSuffix: true, // Removed as we're manually adding a unique suffix
    })

    // Return the blob object, which includes the URL
    return NextResponse.json(blob)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { message: "Failed to upload file", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
