import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message: "Legacy signup has been removed. Use Privy authentication via /auth.",
    },
    { status: 410 },
  )
}
