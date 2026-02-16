import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextResponse } from "next/server"

export const SESSION_COOKIE_NAME = "token"

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

export interface SessionPayload {
  userId: string
  role: "driver" | "investor" | "admin"
  name?: string
  privyUserId?: string
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SESSION_SECRET || process.env.PRIVY_APP_SECRET
  if (!secret) {
    throw new Error("JWT secret is required for session signing (JWT_SECRET or AUTH_SESSION_SECRET)")
  }

  return new TextEncoder().encode(secret)
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getJwtSecret())
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret())
  return payload as unknown as SessionPayload
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  try {
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  })
}
