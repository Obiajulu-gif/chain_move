import mongoose from "mongoose"
import { NextResponse } from "next/server"

import { getAuthenticatedUser, withSessionRefresh } from "@/lib/auth/current-user"
import dbConnect from "@/lib/dbConnect"
import { logAuditEvent } from "@/lib/security/audit-log"
import { getClientIpAddress } from "@/lib/security/rate-limit"
import Loan from "@/models/Loan"
import Vehicle from "@/models/Vehicle"

const LOAN_STATUS_VALUES = ["Pending", "Under Review", "Approved", "Rejected", "Active", "Completed"] as const

function isObjectId(value: unknown): value is string {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value)
}

function isApprovedDriver(user: any) {
  return user?.role === "driver" && (user?.kycStatus === "approved_stage2" || user?.isKycVerified === true || user?.kycVerified === true)
}

function formatLoan(loan: any) {
  return {
    ...loan.toObject(),
    id: loan._id.toString(),
    driverId: loan.driverId,
    vehicleId: loan.vehicleId,
  }
}

function toPositiveNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "admin" && user.role !== "driver") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get("userId")
    const requestedStatus = searchParams.get("status")
    const query: Record<string, unknown> = {}

    if (user.role === "admin") {
      if (requestedUserId) {
        if (!isObjectId(requestedUserId)) {
          return NextResponse.json({ error: "Invalid userId" }, { status: 400 })
        }
        query.driverId = requestedUserId
      }
    } else {
      query.driverId = user._id
    }

    if (requestedStatus) {
      if (!LOAN_STATUS_VALUES.includes(requestedStatus as (typeof LOAN_STATUS_VALUES)[number])) {
        return NextResponse.json({ error: "Invalid loan status filter" }, { status: 400 })
      }
      query.status = requestedStatus
    }

    const loans = await Loan.find(query)
      .populate("driverId", "name email")
      .populate("vehicleId", "name type year price image")
      .sort({ submittedDate: -1 })

    const response = NextResponse.json({ loans: loans.map(formatLoan) }, { status: 200 })
    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("LOANS_GET_ERROR", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isApprovedDriver(user)) {
      return NextResponse.json({ error: "Only KYC-approved drivers can create loan applications." }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const requestedDriverId = typeof body.driverId === "string" ? body.driverId : undefined
    const vehicleId = typeof body.vehicleId === "string" ? body.vehicleId : ""
    const requestedAmount = toPositiveNumber(body.requestedAmount)
    const loanTerm = toPositiveNumber(body.loanTerm)
    const monthlyPayment = toPositiveNumber(body.monthlyPayment)
    const weeklyPayment = toPositiveNumber(body.weeklyPayment)
    const interestRate = toPositiveNumber(body.interestRate)
    const creditScore = Number.isFinite(Number(body.creditScore)) ? Number(body.creditScore) : 0
    const purpose = typeof body.purpose === "string" ? body.purpose.trim() : ""
    const collateral = typeof body.collateral === "string" ? body.collateral.trim() : ""
    const riskAssessment = body.riskAssessment === "Low" || body.riskAssessment === "High" ? body.riskAssessment : "Medium"

    if (requestedDriverId && requestedDriverId !== user._id.toString()) {
      return NextResponse.json({ error: "You can only submit a loan for your own account." }, { status: 403 })
    }

    if (!isObjectId(vehicleId) || !requestedAmount || !loanTerm || !monthlyPayment || !weeklyPayment || !interestRate) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 })
    }

    const vehicle = await Vehicle.findById(vehicleId)
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    if (vehicle.status !== "Available") {
      return NextResponse.json({ error: "This vehicle is not available for financing." }, { status: 409 })
    }

    const existingLoan = await Loan.findOne({
      driverId: user._id,
      vehicleId: vehicle._id,
      status: { $in: ["Pending", "Under Review", "Approved", "Active"] },
    }).select("_id")

    if (existingLoan) {
      return NextResponse.json({ error: "You already have an active application for this vehicle." }, { status: 409 })
    }

    const newLoan = await Loan.create({
      driverId: user._id,
      vehicleId: vehicle._id,
      requestedAmount,
      totalAmountToPayBack: monthlyPayment * loanTerm,
      loanTerm,
      monthlyPayment,
      weeklyPayment,
      interestRate,
      purpose,
      creditScore,
      collateral,
      riskAssessment,
      status: "Pending",
      submittedDate: new Date(),
      totalFunded: 0,
      fundingProgress: 0,
    })

    await Vehicle.findByIdAndUpdate(vehicle._id, {
      status: "Reserved",
      driverId: user._id,
    })

    const populatedLoan = await Loan.findById(newLoan._id)
      .populate("driverId", "name email")
      .populate("vehicleId", "name type year price image")

    await logAuditEvent({
      actor: user,
      action: "loan.create",
      targetType: "loan",
      targetId: newLoan._id.toString(),
      ipAddress: getClientIpAddress(request),
      metadata: {
        vehicleId: vehicle._id.toString(),
        requestedAmount,
        loanTerm,
      },
    })

    const response = NextResponse.json(
      {
        message: "Loan application submitted successfully",
        loan: populatedLoan ? formatLoan(populatedLoan) : null,
      },
      { status: 201 },
    )

    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("LOANS_POST_ERROR", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect()

    const { user, shouldRefreshSession } = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const loanId = typeof body.loanId === "string" ? body.loanId : ""
    const status = typeof body.status === "string" ? body.status : ""
    const adminNotes = typeof body.adminNotes === "string" ? body.adminNotes.trim() : ""

    if (!isObjectId(loanId) || !LOAN_STATUS_VALUES.includes(status as (typeof LOAN_STATUS_VALUES)[number])) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 })
    }

    const loan = await Loan.findById(loanId)
    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }

    loan.status = status
    loan.adminNotes = adminNotes || undefined
    await loan.save()

    if (status === "Approved") {
      await Vehicle.findByIdAndUpdate(loan.vehicleId, {
        status: "Financed",
        driverId: loan.driverId,
      })
    } else if (status === "Rejected") {
      await Vehicle.findByIdAndUpdate(loan.vehicleId, {
        status: "Available",
        $unset: { driverId: 1 },
      })
    }

    const populatedLoan = await Loan.findById(loan._id)
      .populate("driverId", "name email")
      .populate("vehicleId", "name type year price image")

    await logAuditEvent({
      actor: user,
      action: "loan.status.update",
      targetType: "loan",
      targetId: loan._id.toString(),
      ipAddress: getClientIpAddress(request),
      metadata: {
        status,
        vehicleId: loan.vehicleId.toString(),
        driverId: loan.driverId.toString(),
      },
    })

    const response = NextResponse.json(
      {
        message: "Loan status updated successfully",
        loan: populatedLoan ? formatLoan(populatedLoan) : null,
      },
      { status: 200 },
    )

    return shouldRefreshSession ? withSessionRefresh(response, user) : response
  } catch (error) {
    console.error("LOANS_PUT_ERROR", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
