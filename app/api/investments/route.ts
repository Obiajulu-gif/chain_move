import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Investment from "@/models/Investment"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const investorId = searchParams.get("investorId")

    if (!investorId) {
      return NextResponse.json({ error: "Investor ID is required" }, { status: 400 })
    }

    const investments = await Investment.find({ investorId }).sort({ startDate: -1 })

    return NextResponse.json({
      success: true,
      investments,
    })
  } catch (error) {
    console.error("Error fetching investments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
