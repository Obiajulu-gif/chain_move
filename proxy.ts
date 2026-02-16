import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

function getSessionSecret() {
  const raw = process.env.JWT_SECRET || process.env.AUTH_SESSION_SECRET || process.env.PRIVY_APP_SECRET
  return raw ? new TextEncoder().encode(raw) : null
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const tokenCookie = request.cookies.get("token")?.value
  const secret = getSessionSecret()

  if (pathname.startsWith("/dashboard")) {
    if (!tokenCookie || !secret) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }

    try {
      await jwtVerify(tokenCookie, secret)
      return NextResponse.next()
    } catch {
      const response = NextResponse.redirect(new URL("/signin", request.url))
      response.cookies.delete("token")
      return response
    }
  }

  if ((pathname === "/signin" || pathname === "/auth") && tokenCookie && secret) {
    try {
      const { payload } = await jwtVerify(tokenCookie, secret)
      const role = typeof payload.role === "string" ? payload.role : null
      if (role) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
      }
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/auth"],
}
