import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      message: "Public admin registration is disabled. An existing admin must promote users from the dashboard.",
    },
    { status: 403 },
  )
}
