import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message: "Legacy vehicle investment is disabled. Use the authenticated pool investment flow instead.",
    },
    { status: 410 },
  )
}
