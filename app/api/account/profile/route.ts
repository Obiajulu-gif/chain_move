import { NextResponse } from "next/server"
import { z } from "zod"

import { finalizeAuthenticatedResponse, requireAuthenticatedUser } from "@/lib/api/route-guard"
import { parseJsonBody } from "@/lib/api/validation"
import dbConnect from "@/lib/dbConnect"
import { toUserProfileSnapshot, USER_PROFILE_SELECT } from "@/lib/users/user-profile"
import User from "@/models/User"

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  phoneNumber: z.string().trim().min(5).max(32).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
})

function normalizeOptionalString(value: string | undefined) {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function toProfileResponse(user: any) {
  return toUserProfileSnapshot(user)
}

export async function GET(request: Request) {
  try {
    await dbConnect()

    const authContext = await requireAuthenticatedUser(request, ["driver", "investor", "admin"])
    if ("response" in authContext) return authContext.response

    const user = await User.findById(authContext.user._id).select(USER_PROFILE_SELECT)

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    const response = NextResponse.json({ profile: toProfileResponse(user) })
    return finalizeAuthenticatedResponse(response, authContext)
  } catch (error) {
    console.error("ACCOUNT_PROFILE_GET_ERROR", error)
    return NextResponse.json({ message: "Failed to load account profile." }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect()

    const authContext = await requireAuthenticatedUser(request, ["driver", "investor", "admin"])
    if ("response" in authContext) return authContext.response

    const parsed = await parseJsonBody(request, updateProfileSchema)
    if ("response" in parsed) return parsed.response

    const user = await User.findById(authContext.user._id).select(USER_PROFILE_SELECT)

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    const nextFullName = parsed.data.fullName.trim()
    const requestedEmail = typeof parsed.data.email === "string" ? parsed.data.email.trim().toLowerCase() : undefined
    const nextPhoneNumber = normalizeOptionalString(parsed.data.phoneNumber)
    const nextAddress = normalizeOptionalString(parsed.data.address)
    const nextBio = normalizeOptionalString(parsed.data.bio)

    if (user.privyUserId && typeof requestedEmail === "string" && requestedEmail !== (user.email || "").toLowerCase()) {
      return NextResponse.json(
        { message: "Email is managed by Privy for this account and cannot be changed from Settings." },
        { status: 400 },
      )
    }

    if (!user.privyUserId && typeof requestedEmail === "string") {
      user.email = requestedEmail || undefined
    }

    user.fullName = nextFullName
    user.name = nextFullName
    user.phoneNumber = nextPhoneNumber
    user.address = nextAddress
    user.bio = nextBio

    await user.save()

    const response = NextResponse.json({
      message: "Settings updated successfully.",
      profile: toProfileResponse(user),
    })
    return finalizeAuthenticatedResponse(response, authContext)
  } catch (error: any) {
    console.error("ACCOUNT_PROFILE_PATCH_ERROR", error)

    if (typeof error?.code === "number" && error.code === 11000) {
      return NextResponse.json({ message: "That email address is already in use." }, { status: 409 })
    }

    return NextResponse.json({ message: "Failed to update account settings." }, { status: 500 })
  }
}
