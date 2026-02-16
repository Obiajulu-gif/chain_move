import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { extractPrivyTokenFromRequest, getPrivyProfileFromPayload, verifyPrivyToken } from "@/lib/auth/privy"
import { setSessionCookie, signSessionToken } from "@/lib/auth/session"

type UserRole = "driver" | "investor" | "admin"

function normalizeRole(role: unknown): UserRole {
  if (role === "driver" || role === "investor" || role === "admin") return role
  return "investor"
}

function fallbackName(fullName: string | undefined, email: string | undefined, walletAddress: string | undefined) {
  if (fullName && fullName.trim().length > 0) return fullName.trim()
  if (email && email.includes("@")) return email.split("@")[0]
  if (walletAddress) return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
  return "ChainMove User"
}

export async function POST(request: Request) {
  try {
    const privyToken = extractPrivyTokenFromRequest(request)
    if (!privyToken) {
      return NextResponse.json({ message: "Missing Privy token." }, { status: 401 })
    }

    const privyPayload = await verifyPrivyToken(privyToken)
    const profile = getPrivyProfileFromPayload(privyPayload)

    const body = await request
      .json()
      .catch(() => ({}) as { fullName?: string; role?: UserRole })
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : undefined
    const role = normalizeRole(body.role)

    await dbConnect()

    const matchConditions: Array<Record<string, unknown>> = [{ privyUserId: profile.privyUserId }]
    if (profile.email) matchConditions.push({ email: profile.email.toLowerCase() })
    if (profile.walletAddress) {
      matchConditions.push({ walletAddress: profile.walletAddress })
      matchConditions.push({ walletaddress: profile.walletAddress })
    }

    let user = await User.findOne({ $or: matchConditions })

    if (!user) {
      user = await User.create({
        name: fallbackName(fullName, profile.email, profile.walletAddress),
        fullName: fallbackName(fullName, profile.email, profile.walletAddress),
        role,
        email: profile.email?.toLowerCase(),
        phoneNumber: profile.phoneNumber,
        privyUserId: profile.privyUserId,
        walletAddress: profile.walletAddress,
        walletaddress: profile.walletAddress,
      })
    } else {
      if (fullName) {
        user.name = fullName
        user.fullName = fullName
      }
      if (!user.privyUserId) user.privyUserId = profile.privyUserId
      if (profile.email && !user.email) user.email = profile.email.toLowerCase()
      if (profile.phoneNumber && !user.phoneNumber) user.phoneNumber = profile.phoneNumber
      if (profile.walletAddress) {
        if (!user.walletAddress) user.walletAddress = profile.walletAddress
        if (!user.walletaddress) user.walletaddress = profile.walletAddress
      }
      if (!user.role) user.role = role
      await user.save()
    }

    const sessionToken = await signSessionToken({
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      privyUserId: user.privyUserId,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        fullName: user.fullName || user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        walletAddress: user.walletAddress || user.walletaddress,
        availableBalance: user.availableBalance || 0,
        totalInvested: user.totalInvested || 0,
        totalReturns: user.totalReturns || 0,
      },
    })

    setSessionCookie(response, sessionToken)
    return response
  } catch (error) {
    console.error("PRIVY_SYNC_ERROR", error)
    return NextResponse.json({ message: "Unable to sync account with Privy." }, { status: 500 })
  }
}
