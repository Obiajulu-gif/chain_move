import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message: "This legacy vehicle endpoint has been disabled. Use the authenticated /api/vehicles routes instead.",
    },
    { status: 410 },
  )
}
