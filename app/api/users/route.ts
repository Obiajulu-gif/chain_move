import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import dbConnect from "@/lib/dbConnect"
import { logAuditEvent } from "@/lib/security/audit-log"
import { getClientIpAddress } from "@/lib/security/rate-limit"
import User from "@/models/User"

type UserRole = "admin" | "driver" | "investor"

const VALID_ROLES: UserRole[] = ["admin", "driver", "investor"]

async function requireAdmin(request: Request) {
  const auth = await getAuthenticatedUser(request)
  if (!auth.user) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) }
  }

  if (auth.user.role !== "admin") {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) }
  }

  return auth
}

function normalizeRequiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function normalizeEmail(value: unknown) {
  const email = normalizeOptionalString(value)
  return email ? email.toLowerCase() : undefined
}

function normalizeWalletAddress(value: unknown) {
  const walletAddress = normalizeOptionalString(value)
  return walletAddress ? walletAddress.toLowerCase() : undefined
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

function resolveDuplicateKeyMessage(error: unknown) {
  if (!isDuplicateKeyError(error)) return "A unique user field is already in use."

  const duplicateField = typeof error === "object" && error !== null && "keyPattern" in error
    ? Object.keys((error as { keyPattern?: Record<string, unknown> }).keyPattern || {})[0]
    : null

  if (duplicateField === "email") return "That email address is already assigned to another user."
  if (duplicateField === "privyUserId") return "That Privy ID is already assigned to another user."
  if (duplicateField === "walletAddress" || duplicateField === "walletaddress") {
    return "That wallet address is already assigned to another user."
  }

  return "A unique user field is already in use."
}

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if ("error" in auth) return auth.error

    await dbConnect()

    const users = await User.find({})
      .select("name fullName email phoneNumber role privyUserId walletAddress walletaddress createdAt")
      .sort({ createdAt: -1 })
      .lean()

    const response = NextResponse.json({ users })
    return auth.shouldRefreshSession ? withSessionRefresh(response, auth.user) : response
  } catch (error) {
    console.error("USERS_LIST_ERROR", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)
    if ("error" in auth) return auth.error

    await dbConnect()

    const body = await request.json().catch(() => ({}))

    const role = typeof body.role === "string" ? (body.role as UserRole) : "investor"
    const name = normalizeRequiredString(body.name)
    const fullName = normalizeOptionalString(body.fullName) || name
    const email = normalizeEmail(body.email)
    const phoneNumber = normalizeOptionalString(body.phoneNumber)
    const privyUserId = normalizeOptionalString(body.privyUserId)
    const walletAddress = normalizeWalletAddress(body.walletAddress)

    if (!name) {
      return NextResponse.json({ message: "Name is required." }, { status: 400 })
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ message: "Invalid role specified." }, { status: 400 })
    }

    const createdUser = await User.create({
      name,
      fullName,
      email,
      phoneNumber,
      role,
      privyUserId,
      walletAddress,
      walletaddress: walletAddress,
    })

    await logAuditEvent({
      actor: auth.user,
      action: "user.create",
      targetType: "user",
      targetId: createdUser._id.toString(),
      ipAddress: getClientIpAddress(request),
      metadata: {
        role,
        email: email || null,
        privyUserId: privyUserId || null,
      },
    })

    const response = NextResponse.json(
      {
        message: role === "admin" ? "Admin user created successfully." : "User created successfully.",
        user: {
          id: createdUser._id.toString(),
          name: createdUser.name,
          fullName: createdUser.fullName || createdUser.name,
          email: createdUser.email || null,
          phoneNumber: createdUser.phoneNumber || null,
          role: createdUser.role,
          privyUserId: createdUser.privyUserId || null,
          walletAddress: createdUser.walletAddress || createdUser.walletaddress || null,
        },
      },
      { status: 201 },
    )

    return auth.shouldRefreshSession ? withSessionRefresh(response, auth.user) : response
  } catch (error) {
    console.error("USER_CREATE_ERROR", error)

    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ message: resolveDuplicateKeyMessage(error) }, { status: 409 })
    }

    return NextResponse.json({ message: "Server error while creating user." }, { status: 500 })
  }
}
