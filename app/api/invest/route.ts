import { NextResponse } from "next/server"
import mongoose from "mongoose"
import dbConnect from "@/lib/dbConnect"
import Vehicle from "@/models/Vehicle"
import Investment from "@/models/Investment"
import User from "@/models/User"
import Transaction from "@/models/Transaction"

export async function POST(request: Request) {
  await dbConnect()

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { vehicleId, investorId, amount, term } = await request.json()

    if (!vehicleId || !investorId || !amount || amount <= 0) {
      return NextResponse.json({ message: "Missing required fields or invalid amount" }, { status: 400 })
    }

    const vehicle = await Vehicle.findById(vehicleId).session(session)
    const investor = await User.findById(investorId).session(session)

    if (!vehicle) {
      throw new Error("Vehicle not found.")
    }

    if (!investor) {
      throw new Error("Investor not found.")
    }

    if (vehicle.fundingStatus !== "Open") {
      throw new Error("This vehicle is no longer open for investment.")
    }

    if (amount > investor.availableBalance) {
      throw new Error("Insufficient balance for this investment.")
    }

    if (amount > vehicle.price - vehicle.totalFundedAmount) {
      throw new Error("Investment amount exceeds the remaining funding required.")
    }

    // Handle term and ROI logic
    let finalTerm: number
    let finalROI: number

    if (!vehicle.isTermSet) {
      // First investor - set the term and ROI
      if (!term) {
        throw new Error("Term must be specified for the first investment.")
      }
      
      // Calculate ROI based on term
      const roiMap: { [key: number]: number } = {
        12: 32.5,
        24: 57.5,
        36: 82.5,
        48: 107.5
      }
      
      finalROI = roiMap[term]
      if (!finalROI) {
        throw new Error("Invalid term. Must be 12, 24, 36, or 48 months.")
      }
      
      finalTerm = term
      
      // Update vehicle with term and ROI
      vehicle.investmentTerm = finalTerm
      vehicle.roi = finalROI
      vehicle.isTermSet = true
    } else {
      // Subsequent investors - use existing term and ROI
      finalTerm = vehicle.investmentTerm!
      finalROI = vehicle.roi!
    }

    // Calculate investment returns
    const totalReturn = amount * (1 + finalROI / 100)
    const totalProfit = totalReturn - amount
    const monthlyReturn = totalProfit / finalTerm

    // Generate unique investment ID
    const investmentId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create the Investment Record
    await Investment.create(
      [
        {
          id: investmentId,
          investorId,
          vehicleId,
          amount,
          expectedROI: finalROI,
          monthlyReturn,
          investmentTerm: finalTerm,
          status: "Active",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + finalTerm * 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentsReceived: 0,
          totalPayments: finalTerm,
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          totalReturns: 0,
        },
      ],
      { session },
    )

    // Update the Vehicle's Funding Progress
    vehicle.totalFundedAmount += amount
    if (vehicle.totalFundedAmount >= vehicle.price) {
      vehicle.fundingStatus = "Funded"
      vehicle.status = "Financed"
    }
    await vehicle.save({ session })

    // Update the Investor's Balance
    investor.availableBalance -= amount
    investor.totalInvested = (investor.totalInvested || 0) + amount
    await investor.save({ session })

    // Create a Transaction Record
    await Transaction.create(
      [
        {
          userId: investorId,
          userType: "investor",
          amount: amount,
          status: "Completed",
          type: "investment",
          method: "wallet",
          description: `Investment in ${vehicle.name} (${finalTerm} months, ${finalROI}% ROI)`,
          timestamp: new Date().toISOString(),
        },
      ],
      { session },
    )

    await session.commitTransaction()

    return NextResponse.json({
      success: true,
      message: "Investment successful!",
      investment: {
        id: investmentId,
        amount,
        expectedROI: finalROI,
        monthlyReturn: monthlyReturn.toFixed(2),
        term: finalTerm,
        vehicleName: vehicle.name,
        isFirstInvestor: !vehicle.isTermSet,
      },
    })
  } catch (error) {
    await session.abortTransaction()
    const message = error instanceof Error ? error.message : "An unknown error occurred."
    console.error("Investment transaction failed:", message)
    return NextResponse.json({ message }, { status: 500 })
  } finally {
    session.endSession()
  }
}
