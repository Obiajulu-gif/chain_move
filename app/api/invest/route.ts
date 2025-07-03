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
    const { vehicleId, investorId, amount } = await request.json()

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

    // Calculate investment terms
    const expectedROI = vehicle.roi || 15 // Default 15% ROI if not specified
    const loanTermMonths = 12 // Default 12 months
    const totalReturn = amount * (1 + expectedROI / 100)
    const monthlyReturn = (totalReturn - amount) / loanTermMonths

    // Generate unique investment ID
    const investmentId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // --- Core Database Operations ---

    // 1. Create the Investment Record with all required fields
    await Investment.create(
      [
        {
          id: investmentId,
          investorId,
          vehicleId,
          amount,
          expectedROI,
          monthlyReturn,
          status: "Active", // Use valid enum value
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + loanTermMonths * 30 * 24 * 60 * 60 * 1000).toISOString(), // 12 months from now
          paymentsReceived: 0,
          totalPayments: loanTermMonths,
          nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          totalReturns: 0,
        },
      ],
      { session },
    )

    // 2. Update the Vehicle's Funding Progress
    vehicle.totalFundedAmount += amount
    if (vehicle.totalFundedAmount >= vehicle.price) {
      vehicle.fundingStatus = "Funded" // Mark as fully funded
      vehicle.status = "Financed" // Update vehicle status
    }
    await vehicle.save({ session })

    // 3. Update the Investor's Balance
    investor.availableBalance -= amount
    investor.totalInvested = (investor.totalInvested || 0) + amount
    await investor.save({ session })

    // 4. Create a Transaction Record for Bookkeeping
    await Transaction.create(
      [
        {
          userId: investorId,
          userType: "investor",
          amount: amount,
          status: "Completed",
          type: "investment",
          method: "wallet",
          description: `Investment in ${vehicle.name}`,
          timestamp: new Date().toISOString(),
        },
      ],
      { session },
    )

    // If all operations succeed, commit the transaction
    await session.commitTransaction()

    return NextResponse.json({
      success: true,
      message: "Investment successful!",
      investment: {
        id: investmentId,
        amount,
        expectedROI,
        monthlyReturn: monthlyReturn.toFixed(2),
        vehicleName: vehicle.name,
      },
    })
  } catch (error) {
    // If any operation fails, abort the transaction
    await session.abortTransaction()

    const message = error instanceof Error ? error.message : "An unknown error occurred."
    console.error("Investment transaction failed:", message)

    return NextResponse.json({ message }, { status: 500 })
  } finally {
    session.endSession()
  }
}
