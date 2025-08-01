import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Loan from "@/models/Loan"
import User from "@/models/User"
import Vehicle from "@/models/Vehicle"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

// GET - Fetch all loans or loans by user
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Verify JWT token
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("token")?.value
    
    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(tokenCookie, secret)
    
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    let query: any = {}
    
    if (userId) {
      query.driverId = userId
    }
    
    if (status) {
      query.status = status
    }

    const loans = await Loan.find(query)
      .populate('driverId', 'name email')
      .populate('vehicleId', 'name type year price image')
      .sort({ submittedDate: -1 })

    // Convert ObjectIds to strings for frontend compatibility
    const formattedLoans = loans.map(loan => ({
      ...loan.toObject(),
      id: loan._id.toString(),
      // REMOVE these lines that convert populated objects back to IDs:
      // driverId: loan.driverId._id ? loan.driverId._id.toString() : loan.driverId.toString(),
      // vehicleId: loan.vehicleId._id ? loan.vehicleId._id.toString() : loan.vehicleId.toString()
      // Keep the populated objects intact:
      driverId: loan.driverId,
      vehicleId: loan.vehicleId
    }))

    return NextResponse.json({ loans: formattedLoans }, { status: 200 })
  } catch (error) {
    console.error("Error fetching loans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new loan application
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    // Verify JWT token
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("token")?.value
    
    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(tokenCookie, secret)
    
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const {
      driverId,
      vehicleId,
      requestedAmount,
      loanTerm,
      monthlyPayment,
      weeklyPayment,
      interestRate,
      purpose,
      creditScore = 0,
      collateral,
      riskAssessment = "Medium"
    } = body

    // Validate required fields
    if (!driverId || !vehicleId || !requestedAmount || !loanTerm || !monthlyPayment || !weeklyPayment || !interestRate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user exists and is a driver
    const user = await User.findById(driverId)
    if (!user || user.role !== "driver") {
      return NextResponse.json({ error: "Invalid driver" }, { status: 400 })
    }

    // Verify vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId)
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    // Calculate total amount to pay back (principal + interest)
    const totalAmountToPayBack = monthlyPayment * loanTerm

    // Create new loan application
    const newLoan = new Loan({
      driverId,
      vehicleId,
      requestedAmount,
      totalAmountToPayBack,
      loanTerm,
      monthlyPayment,
      weeklyPayment, // Add weeklyPayment to loan creation
      interestRate,
      purpose,
      creditScore,
      collateral,
      riskAssessment,
      status: "Pending",
      submittedDate: new Date(),
      totalFunded: 0,
      fundingProgress: 0
    })

    const savedLoan = await newLoan.save()

    // Update vehicle status to Reserved
    await Vehicle.findByIdAndUpdate(vehicleId, {
      status: "Reserved",
      driverId: driverId
    })

    // Populate the saved loan with user and vehicle details
    const populatedLoan = await Loan.findById(savedLoan._id)
      .populate('driverId', 'name email')
      .populate('vehicleId', 'name type year price image')

    // Format the loan data with string IDs for frontend compatibility
    const formattedLoan = {
      ...populatedLoan.toObject(),
      id: populatedLoan._id.toString(),
      // Keep populated objects intact:
      driverId: populatedLoan.driverId,
      vehicleId: populatedLoan.vehicleId
    }

    return NextResponse.json({ 
      message: "Loan application submitted successfully",
      loan: formattedLoan 
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating loan application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update loan status (for admin approval/rejection)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    // Verify JWT token
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("token")?.value
    
    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(tokenCookie, secret)
    
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { loanId, status, adminNotes } = body

    if (!loanId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updateData: any = {
      status,
      ...(adminNotes && { adminNotes })
    }

    if (status === "Approved") {
      updateData.approvedDate = new Date()
    } else if (status === "Rejected") {
      updateData.reviewedDate = new Date()
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId,
      updateData,
      { new: true }
    ).populate('driverId', 'name email')
     .populate('vehicleId', 'name type year price image')

    if (!updatedLoan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 })
    }

    // Update vehicle status based on loan status
    if (status === "Approved") {
      await Vehicle.findByIdAndUpdate(updatedLoan.vehicleId, {
        status: "Financed"
      })
    } else if (status === "Rejected") {
      await Vehicle.findByIdAndUpdate(updatedLoan.vehicleId, {
        status: "Financed",
        $unset: { driverId: 1 }
      })
    }

    // Format the loan data with string IDs for frontend compatibility
    const formattedLoan = {
      ...updatedLoan.toObject(),
      id: updatedLoan._id.toString(),
      // Keep populated objects intact:
      driverId: updatedLoan.driverId,
      vehicleId: updatedLoan.vehicleId
    }

    return NextResponse.json({ 
      message: "Loan status updated successfully",
      loan: formattedLoan 
    }, { status: 200 })

  } catch (error) {
    console.error("Error updating loan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}