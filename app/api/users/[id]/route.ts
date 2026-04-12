import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import dbConnect from "@/lib/dbConnect"
import { logAuditEvent } from "@/lib/security/audit-log"
import { getClientIpAddress } from "@/lib/security/rate-limit"
import User from "@/models/User"

type RouteContext = { params: { id: string } }
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

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAdmin(request)
    if ("error" in auth) return auth.error

    await dbConnect()

    const user = await User.findById(params.id).select(
      "name fullName email phoneNumber role walletAddress walletaddress privyUserId availableBalance totalInvested totalReturns createdAt",
    )

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const response = NextResponse.json({
      ...user.toObject(),
      availableBalance: user.availableBalance || 0,
      totalInvested: user.totalInvested || 0,
      totalReturns: user.totalReturns || 0,
    })

    return auth.shouldRefreshSession ? withSessionRefresh(response, auth.user) : response
  } catch (error) {
    console.error("USER_GET_ERROR", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAdmin(request)
    if ("error" in auth) return auth.error

    await dbConnect()

    const body = await request.json().catch(() => ({}))
    const role = typeof body.role === "string" ? (body.role as UserRole) : null

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ message: "Invalid role specified" }, { status: 400 })
    }

    if (params.id === auth.user._id.toString() && role !== "admin") {
      return NextResponse.json({ message: "You cannot remove your own admin access." }, { status: 403 })
    }

    const existingUser = await User.findById(params.id).select("role")
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (existingUser.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" })
      if (adminCount <= 1) {
        return NextResponse.json({ message: "At least one admin account must remain active." }, { status: 400 })
      }
    }

    existingUser.role = role
    await existingUser.save()

    await logAuditEvent({
      actor: auth.user,
      action: "user.role.update",
      targetType: "user",
      targetId: params.id,
      ipAddress: getClientIpAddress(request),
      metadata: {
        newRole: role,
      },
    })

    const updatedUser = await User.findById(params.id)
      .select("name fullName email role privyUserId createdAt")
      .lean()

    const response = NextResponse.json({
      message: role === "admin" ? "User promoted to admin successfully" : "User role updated successfully",
      user: updatedUser,
    })

    return auth.shouldRefreshSession ? withSessionRefresh(response, auth.user) : response
  } catch (error) {
    console.error("USER_ROLE_UPDATE_ERROR", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const auth = await requireAdmin(request)
    if ("error" in auth) return auth.error

    await dbConnect()

    if (params.id === auth.user._id.toString()) {
      return NextResponse.json({ message: "You cannot delete your own account." }, { status: 403 })
    }

    const existingUser = await User.findById(params.id).select("role")
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (existingUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" })
      if (adminCount <= 1) {
        return NextResponse.json({ message: "At least one admin account must remain active." }, { status: 400 })
      }
    }

    await User.findByIdAndDelete(params.id)

    await logAuditEvent({
      actor: auth.user,
      action: "user.delete",
      targetType: "user",
      targetId: params.id,
      ipAddress: getClientIpAddress(request),
      metadata: {
        deletedRole: existingUser.role,
      },
    })

    const response = NextResponse.json({ message: "User deleted successfully" })
    return auth.shouldRefreshSession ? withSessionRefresh(response, auth.user) : response
  } catch (error) {
    console.error("USER_DELETE_ERROR", error)
    return NextResponse.json({ message: "Server error during deletion" }, { status: 500 })
  }
}
