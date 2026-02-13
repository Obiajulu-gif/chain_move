import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  // The filename and request body are automatically passed by the Vercel Blob SDK.
  if (!filename || !request.body) {
    return NextResponse.json({ message: "No filename or file body provided." }, { status: 400 })
  }

  try {
    // Generate a unique filename by adding timestamp and random suffix
    const fileExtension = filename.split(".").pop()
    const baseName = filename.replace(/\.[^/.]+$/, "")
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const uniqueFilename = `${baseName}_${timestamp}_${randomSuffix}.${fileExtension}`

    // Use the put method to upload the file to Vercel Blob
    const blob = await put(uniqueFilename, request.body, {
      access: "public",
      addRandomSuffix: true, // This adds additional randomness if needed
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
