import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { extractPrivyTokenFromRequest, getPrivyProfileFromPayload, verifyPrivyToken } from "@/lib/auth/privy"
import { getSessionFromCookies, setSessionCookie, signSessionToken } from "@/lib/auth/session"
import { NextResponse } from "next/server"

export async function getAuthenticatedUser(request: Request) {
  await dbConnect()

  const session = await getSessionFromCookies()
  if (session?.userId) {
    const user = await User.findById(session.userId)
    if (user) return { user, shouldRefreshSession: false }
  }

  const privyToken = extractPrivyTokenFromRequest(request)
  if (!privyToken) return { user: null, shouldRefreshSession: false }

  const privyPayload = await verifyPrivyToken(privyToken)
  const profile = getPrivyProfileFromPayload(privyPayload)

  const user = await User.findOne({
    $or: [{ privyUserId: profile.privyUserId }, ...(profile.email ? [{ email: profile.email.toLowerCase() }] : [])],
  })

  return { user, shouldRefreshSession: Boolean(user) }
}

export async function withSessionRefresh(response: NextResponse, user: any) {
  const sessionToken = await signSessionToken({
    userId: user._id.toString(),
    role: user.role,
    name: user.name,
    privyUserId: user.privyUserId,
  })
  setSessionCookie(response, sessionToken)
  return response
}
