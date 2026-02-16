import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import type { ParsedPrivyProfile } from "@/lib/auth/privy"
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

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "number" &&
    (error as { code: number }).code === 11000
  )
}

function normalizeWalletAddress(walletAddress: string | undefined) {
  if (!walletAddress) return undefined
  const trimmed = walletAddress.trim().toLowerCase()
  return trimmed.length > 0 ? trimmed : undefined
}

function buildMatchConditions(profile: ParsedPrivyProfile) {
  const conditions: Array<Record<string, unknown>> = [{ privyUserId: profile.privyUserId }]
  const email = profile.email?.toLowerCase()
  const walletAddress = normalizeWalletAddress(profile.walletAddress)

  if (email) conditions.push({ email })
  if (walletAddress) {
    conditions.push({ walletAddress })
    conditions.push({ walletaddress: walletAddress })
  }

  return conditions
}

async function findUserByPrivyProfile(profile: ParsedPrivyProfile) {
  const matchConditions = buildMatchConditions(profile)
  return User.findOne({ $or: matchConditions })
}

export async function POST(request: Request) {
  try {
    const privyToken = extractPrivyTokenFromRequest(request)
    if (!privyToken) {
      return NextResponse.json({ message: "Missing Privy token." }, { status: 401 })
    }

    const privyPayload = await verifyPrivyToken(privyToken)
    const profile = getPrivyProfileFromPayload(privyPayload)

    const body = await request.json().catch(() => ({} as { fullName?: string; role?: UserRole }))
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : undefined
    const role = normalizeRole(body.role)
    const normalizedEmail = profile.email?.toLowerCase()
    const normalizedWalletAddress = normalizeWalletAddress(profile.walletAddress)
    const defaultName = fallbackName(fullName, normalizedEmail, normalizedWalletAddress)

    await dbConnect()

    if (!profile.privyUserId) {
      return NextResponse.json({ message: "Invalid Privy profile." }, { status: 401 })
    }

    let user = await findUserByPrivyProfile({
      ...profile,
      email: normalizedEmail,
      walletAddress: normalizedWalletAddress,
    })

    if (!user) {
      try {
        user = await User.create({
          name: defaultName,
          fullName: defaultName,
          role,
          email: normalizedEmail,
          phoneNumber: profile.phoneNumber,
          privyUserId: profile.privyUserId,
          walletAddress: normalizedWalletAddress,
          walletaddress: normalizedWalletAddress,
        })
      } catch (createError) {
        if (!isDuplicateKeyError(createError)) throw createError

        user = await findUserByPrivyProfile({
          ...profile,
          email: normalizedEmail,
          walletAddress: normalizedWalletAddress,
        })
        if (!user) throw createError
      }
    }

    if (!user) {
      return NextResponse.json({ message: "Unable to resolve user profile." }, { status: 500 })
    }

    if (fullName) {
      user.name = fullName
      user.fullName = fullName
    } else {
      if (!user.name) user.name = defaultName
      if (!user.fullName) user.fullName = defaultName
    }

    if (!user.privyUserId) user.privyUserId = profile.privyUserId

    if (normalizedEmail && user.email !== normalizedEmail) {
      const emailInUse = await User.exists({
        _id: { $ne: user._id },
        email: normalizedEmail,
      })
      if (!emailInUse) {
        user.email = normalizedEmail
      }
    }

    if (profile.phoneNumber && !user.phoneNumber) user.phoneNumber = profile.phoneNumber

    if (normalizedWalletAddress) {
      const currentWallet = normalizeWalletAddress(user.walletAddress || user.walletaddress)
      if (currentWallet !== normalizedWalletAddress) {
        const walletInUse = await User.exists({
          _id: { $ne: user._id },
          $or: [{ walletAddress: normalizedWalletAddress }, { walletaddress: normalizedWalletAddress }],
        })

        if (!walletInUse) {
          user.walletAddress = normalizedWalletAddress
          user.walletaddress = normalizedWalletAddress
        }
      }
    }

    if (!user.role) user.role = role

    try {
      await user.save()
    } catch (saveError) {
      if (!isDuplicateKeyError(saveError)) throw saveError

      const fallbackUser = await findUserByPrivyProfile({
        ...profile,
        email: normalizedEmail,
        walletAddress: normalizedWalletAddress,
      })

      if (!fallbackUser) throw saveError
      user = fallbackUser
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
    if (error instanceof Error && /jwt|jwks|signature|issuer|audience/i.test(error.message)) {
      return NextResponse.json({ message: "Unable to verify Privy identity. Please sign in again." }, { status: 401 })
    }

    if (error instanceof Error && /session signing|JWT secret/i.test(error.message)) {
      return NextResponse.json({ message: "Server authentication is not configured correctly." }, { status: 500 })
    }

    return NextResponse.json({ message: "Unable to sync account with Privy." }, { status: 500 })
  }
}
