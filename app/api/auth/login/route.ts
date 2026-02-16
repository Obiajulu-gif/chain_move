import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message: "Legacy login has been removed. Use Privy authentication via /signin.",
    },
    { status: 410 },
  )
}
