import mongoose from "mongoose"
import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import dbConnect from "@/lib/dbConnect"
import { logAuditEvent } from "@/lib/security/audit-log"
import { getClientIpAddress } from "@/lib/security/rate-limit"
import Vehicle from "@/models/Vehicle"

const VEHICLE_STATUS_VALUES = ["Available", "Financed", "Reserved", "Maintenance", "Retired"] as const
const FUNDING_STATUS_VALUES = ["Open", "Funded", "Active"] as const

function isObjectId(value: unknown): value is string {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function buildVehiclePayload(body: unknown, partial = false) {
  if (!isRecord(body)) {
    throw new Error("Invalid vehicle payload.")
  }

  const payload: Record<string, unknown> = {}

  if (partial || "name" in body) payload.name = normalizeString(body.name)
  if (partial || "identifier" in body) payload.identifier = normalizeString(body.identifier) || undefined
  if (partial || "type" in body) payload.type = normalizeString(body.type)

  const year = normalizeNumber(body.year)
  if (partial || "year" in body) payload.year = year

  const price = normalizeNumber(body.price)
  if (partial || "price" in body) payload.price = price

  const roi = normalizeNumber(body.roi)
  if (partial || "roi" in body) payload.roi = roi

  if (Array.isArray(body.features)) {
    payload.features = body.features
      .map((feature) => normalizeString(feature))
      .filter(Boolean)
      .slice(0, 50)
  } else if (!partial && !("features" in body)) {
    payload.features = []
  }

  if (partial || "image" in body) payload.image = normalizeString(body.image) || undefined

  const status = normalizeString(body.status)
  if ((partial || "status" in body) && VEHICLE_STATUS_VALUES.includes(status as (typeof VEHICLE_STATUS_VALUES)[number])) {
    payload.status = status
  }

  const fundingStatus = normalizeString(body.fundingStatus)
  if (
    (partial || "fundingStatus" in body) &&
    FUNDING_STATUS_VALUES.includes(fundingStatus as (typeof FUNDING_STATUS_VALUES)[number])
  ) {
    payload.fundingStatus = fundingStatus
  }

  const totalFundedAmount = normalizeNumber(body.totalFundedAmount)
  if ((partial || "totalFundedAmount" in body) && totalFundedAmount !== null) {
    payload.totalFundedAmount = totalFundedAmount
  }

  const popularity = normalizeNumber(body.popularity)
  if ((partial || "popularity" in body) && popularity !== null) {
    payload.popularity = popularity
  }

  const addedDateRaw = normalizeString(body.addedDate)
  if (partial || "addedDate" in body) {
    payload.addedDate = addedDateRaw ? new Date(addedDateRaw) : undefined
  }

  const driverId = normalizeString(body.driverId)
  if ((partial || "driverId" in body) && driverId) {
    if (!isObjectId(driverId)) {
      throw new Error("Invalid driverId.")
    }
    payload.driverId = driverId
  }

  const specificationsSource = isRecord(body.specifications) ? body.specifications : {}
  const vin = normalizeString(specificationsSource.vin)
  const specifications: Record<string, string> = {}

  for (const key of ["engine", "fuelType", "mileage", "transmission", "color"] as const) {
    const value = normalizeString(specificationsSource[key])
    if (value) {
      specifications[key] = value
    }
  }

  if (vin) {
    specifications.vin = vin
  }

  if (partial || "specifications" in body) {
    payload.specifications = specifications
  }

  return payload
}

function validateVehiclePayload(payload: Record<string, unknown>) {
  const name = typeof payload.name === "string" ? payload.name : ""
  const type = typeof payload.type === "string" ? payload.type : ""
  const year = typeof payload.year === "number" ? payload.year : null
  const price = typeof payload.price === "number" ? payload.price : null
  const roi = typeof payload.roi === "number" ? payload.roi : null
  const specifications = isRecord(payload.specifications) ? payload.specifications : {}
  const vin = typeof specifications.vin === "string" ? specifications.vin : ""

  if (!name || !type || !Number.isFinite(year) || !Number.isFinite(price) || !Number.isFinite(roi) || !vin) {
    return "Missing required vehicle fields."
  }

  return null
}

async function requireAdmin(request: Request) {
  const authContext = await getAuthenticatedUser(request)
  if (!authContext.user) {
    return { response: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) }
  }

  if (authContext.user.role !== "admin") {
    return { response: NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 }) }
  }

  return authContext
}

export async function GET(request: Request) {
  await dbConnect()

  try {
    const authContext = await requireAdmin(request)
    if ("response" in authContext) return authContext.response

    const vehicles = await Vehicle.find({}).sort({ addedDate: -1 })
    const response = NextResponse.json({ success: true, data: vehicles })
    return authContext.shouldRefreshSession ? withSessionRefresh(response, authContext.user) : response
  } catch (error) {
    console.error("VEHICLES_GET_ERROR", error)
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()

  try {
    const authContext = await requireAdmin(request)
    if ("response" in authContext) return authContext.response

    const body = await request.json().catch(() => ({}))
    const payload = buildVehiclePayload(body)
    const validationError = validateVehiclePayload(payload)
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 })
    }

    const newVehicle = await Vehicle.create(payload)

    await logAuditEvent({
      actor: authContext.user,
      action: "vehicle.create",
      targetType: "vehicle",
      targetId: newVehicle._id.toString(),
      ipAddress: getClientIpAddress(request),
      metadata: {
        status: newVehicle.status,
        fundingStatus: newVehicle.fundingStatus,
      },
    })

    const response = NextResponse.json({ success: true, data: newVehicle }, { status: 201 })
    return authContext.shouldRefreshSession ? withSessionRefresh(response, authContext.user) : response
  } catch (error) {
    if (error instanceof Error && (error.name === "ValidationError" || /Invalid/.test(error.message))) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }

    console.error("VEHICLES_POST_ERROR", error)
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }
}
