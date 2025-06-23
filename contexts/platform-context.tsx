"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

// Types
interface Driver {
  id: string
  name: string
  email: string
  phone: string
  rating: number
  experience: number
  trips: number
  status: "Active" | "Pending" | "Suspended"
  location: string
  joinedDate: string
  totalEarnings: number
  activeLoans: number
  completedLoans: number
}

interface Vehicle {
  id: string
  name: string
  type: string
  year: number
  image: string
  price: number
  driverId?: string
  status: "Available" | "Financed" | "Maintenance" | "Reserved"
  specifications: {
    engine: string
    fuelType: string
    mileage: string
    transmission: string
    color: string
    vin: string
  }
  addedDate: string
  roi: number
  popularity: number
  features: string[]
}

interface LoanApplication {
  id: string
  driverId: string
  vehicleId: string
  requestedAmount: number
  loanTerm: number
  monthlyPayment: number
  interestRate: number
  status: "Pending" | "Under Review" | "Approved" | "Rejected" | "Active" | "Completed"
  submittedDate: string
  reviewedDate?: string
  approvedDate?: string
  documents: string[]
  creditScore: number
  collateral: string
  purpose: string
  investorApprovals: InvestorApproval[]
  fundingProgress: number
  totalFunded: number
  remainingAmount: number
  riskAssessment: "Low" | "Medium" | "High"
  adminNotes?: string
}

interface InvestorApproval {
  investorId: string
  amount: number
  approvedDate: string
  status: "Pending" | "Approved" | "Released"
  releaseDate?: string
}

interface Investment {
  id: string
  investorId: string
  loanId: string
  amount: number
  expectedROI: number
  monthlyReturn: number
  status: "Active" | "Completed" | "Overdue"
  startDate: string
  endDate: string
  paymentsReceived: number
  totalPayments: number
  nextPaymentDate: string
  totalReturns: number
}

interface RepaymentSchedule {
  id: string
  loanId: string
  paymentNumber: number
  dueDate: string
  amount: number
  principal: number
  interest: number
  status: "Pending" | "Paid" | "Overdue"
  paidDate?: string
  paidAmount?: number
}

interface Investor {
  id: string
  name: string
  email: string
  availableBalance: number
  totalInvested: number
  totalReturns: number
  riskTolerance: "Low" | "Medium" | "High"
  status: "Active" | "Pending" | "Suspended"
  joinedDate: string
  activeInvestments: number
  completedInvestments: number
}

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "investment" | "loan_disbursement" | "repayment" | "return"
  userId: string
  userType: "driver" | "investor"
  amount: number
  status: "pending" | "completed" | "failed"
  timestamp: string
  description: string
  relatedId?: string // loan ID, investment ID, etc.
}

interface PlatformMetrics {
  totalUsers: number
  totalDrivers: number
  totalInvestors: number
  totalVehicles: number
  totalLoans: number
  totalInvestments: number
  totalFundsInvested: number
  totalFundsAvailable: number
  totalReturns: number
  averageROI: number
  platformRevenue: number
  successRate: number
  averageProcessingTime: string
  systemUptime: string
}

interface PlatformState {
  drivers: Driver[]
  investors: Investor[]
  vehicles: Vehicle[]
  loanApplications: LoanApplication[]
  investments: Investment[]
  repaymentSchedules: RepaymentSchedule[]
  transactions: Transaction[]
  currentUser: {
    id: string
    role: "driver" | "investor" | "admin"
    name: string
  } | null
  notifications: Notification[]
  metrics: PlatformMetrics
  isLoading: boolean
  lastUpdated: string
}

interface Notification {
  id: string
  userId: string
  type:
    | "loan_approved"
    | "payment_due"
    | "investment_return"
    | "fund_released"
    | "application_submitted"
    | "vehicle_added"
    | "system_alert"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

// Actions
type PlatformAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CURRENT_USER"; payload: PlatformState["currentUser"] }
  | { type: "ADD_VEHICLE"; payload: Vehicle }
  | { type: "UPDATE_VEHICLE"; payload: { id: string; updates: Partial<Vehicle> } }
  | { type: "REMOVE_VEHICLE"; payload: string }
  | { type: "SUBMIT_LOAN_APPLICATION"; payload: LoanApplication }
  | { type: "UPDATE_LOAN_STATUS"; payload: { loanId: string; status: LoanApplication["status"]; adminNotes?: string } }
  | { type: "APPROVE_LOAN"; payload: { loanId: string; investorId: string; amount: number } }
  | { type: "RELEASE_FUNDS"; payload: { loanId: string; investorId: string } }
  | { type: "MAKE_PAYMENT"; payload: { loanId: string; amount: number; paymentId: string } }
  | { type: "UPDATE_INVESTOR_BALANCE"; payload: { investorId: string; amount: number; type: "add" | "subtract" } }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "UPDATE_FUNDING_PROGRESS"; payload: { loanId: string; amount: number } }
  | { type: "UPDATE_METRICS"; payload: Partial<PlatformMetrics> }
  | { type: "SYNC_DATA"; payload: { timestamp: string } }
  | { type: "ADD_DRIVER"; payload: Driver }
  | { type: "UPDATE_DRIVER"; payload: { id: string; updates: Partial<Driver> } }
  | { type: "ADD_INVESTOR"; payload: Investor }
  | { type: "UPDATE_INVESTOR"; payload: { id: string; updates: Partial<Investor> } }

// Initial State with comprehensive data
const initialState: PlatformState = {
  drivers: [
    {
      id: "driver1",
      name: "Samuel Adebayo",
      email: "samuel@chainmove.com",
      phone: "+234 801 234 5678",
      rating: 4.8,
      experience: 5,
      trips: 2450,
      status: "Active",
      location: "Lagos, Nigeria",
      joinedDate: "2023-06-15",
      totalEarnings: 45000,
      activeLoans: 1,
      completedLoans: 2,
    },
    {
      id: "driver2",
      name: "Kwame Asante",
      email: "kwame@chainmove.com",
      phone: "+233 20 123 4567",
      rating: 4.9,
      experience: 7,
      trips: 3200,
      status: "Active",
      location: "Accra, Ghana",
      joinedDate: "2023-03-20",
      totalEarnings: 62000,
      activeLoans: 0,
      completedLoans: 3,
    },
    {
      id: "driver3",
      name: "Amina Hassan",
      email: "amina@chainmove.com",
      phone: "+234 802 345 6789",
      rating: 4.7,
      experience: 3,
      trips: 1800,
      status: "Active",
      location: "Abuja, Nigeria",
      joinedDate: "2023-09-10",
      totalEarnings: 28000,
      activeLoans: 1,
      completedLoans: 0,
    },
  ],
  investors: [
    {
      id: "investor1",
      name: "Marcus Chen",
      email: "marcus@chainmove.com",
      availableBalance: 25000,
      totalInvested: 45000,
      totalReturns: 8500,
      riskTolerance: "Medium",
      status: "Active",
      joinedDate: "2023-05-01",
      activeInvestments: 3,
      completedInvestments: 2,
    },
    {
      id: "investor2",
      name: "Sarah Johnson",
      email: "sarah@chainmove.com",
      availableBalance: 15000,
      totalInvested: 30000,
      totalReturns: 5200,
      riskTolerance: "Low",
      status: "Active",
      joinedDate: "2023-07-12",
      activeInvestments: 2,
      completedInvestments: 1,
    },
    {
      id: "investor3",
      name: "David Okonkwo",
      email: "david@chainmove.com",
      availableBalance: 50000,
      totalInvested: 75000,
      totalReturns: 12800,
      riskTolerance: "High",
      status: "Active",
      joinedDate: "2023-04-18",
      activeInvestments: 5,
      completedInvestments: 4,
    },
  ],
  vehicles: [
    {
      id: "vehicle1",
      name: "Tricycle (Keke NAPEP) 2024",
      type: "Tricycle",
      year: 2024,
      image: "/images/tricycle-keke.jpg",
      price: 2500,
      status: "Available",
      specifications: {
        engine: "200cc Single Cylinder",
        fuelType: "Petrol",
        mileage: "New",
        transmission: "Manual",
        color: "Yellow",
        vin: "KEKE2024001",
      },
      addedDate: "2024-01-15",
      roi: 22.5,
      popularity: 98,
      features: ["Fuel Efficient", "High Demand", "Quick ROI", "Urban Transport"],
    },
    {
      id: "vehicle2",
      name: "Bajaj Okada (Motorcycle) 2024",
      type: "Motorcycle",
      year: 2024,
      image: "/images/okada-motorcycle.jpg",
      price: 1800,
      status: "Available",
      specifications: {
        engine: "150cc Single Cylinder",
        fuelType: "Petrol",
        mileage: "New",
        transmission: "Manual",
        color: "Red",
        vin: "OKADA2024001",
      },
      addedDate: "2024-01-20",
      roi: 25.0,
      popularity: 95,
      features: ["High Mobility", "Low Maintenance", "Fast Returns", "Rural Access"],
    },
    {
      id: "vehicle3",
      name: "Toyota Hiace Mini Bus 2023",
      type: "Mini Bus",
      year: 2023,
      image: "/images/mini-bus.jpg",
      price: 35000,
      driverId: "driver1",
      status: "Financed",
      specifications: {
        engine: "2.7L 4-Cylinder",
        fuelType: "Petrol",
        mileage: "15,000 km",
        transmission: "Manual",
        color: "White",
        vin: "HIACE2023001",
      },
      addedDate: "2024-02-01",
      roi: 18.5,
      popularity: 88,
      features: ["High Capacity", "Durable", "Commercial Use", "Inter-city Transport"],
    },
    {
      id: "vehicle4",
      name: "Coaster 18-Seater Bus 2022",
      type: "18-Seater Bus",
      year: 2022,
      image: "/images/18-seater-bus.jpg",
      price: 45000,
      status: "Available",
      specifications: {
        engine: "4.0L Diesel",
        fuelType: "Diesel",
        mileage: "25,000 km",
        transmission: "Manual",
        color: "Blue/White",
        vin: "COASTER2022001",
      },
      addedDate: "2024-02-05",
      roi: 19.2,
      popularity: 82,
      features: ["High Passenger Capacity", "Long Distance", "Comfortable", "School/Church Transport"],
    },
    {
      id: "vehicle5",
      name: "Toyota Hilux Carter 2023",
      type: "Pickup Truck",
      year: 2023,
      image: "/images/toyota-carter.jpg",
      price: 28000,
      driverId: "driver2",
      status: "Financed",
      specifications: {
        engine: "2.4L Turbo Diesel",
        fuelType: "Diesel",
        mileage: "18,000 km",
        transmission: "Manual",
        color: "Silver",
        vin: "HILUX2023001",
      },
      addedDate: "2024-02-10",
      roi: 17.8,
      popularity: 90,
      features: ["Heavy Duty", "Cargo Transport", "Construction", "Reliable"],
    },
    {
      id: "vehicle6",
      name: "Mazda BT-50 Carter 2023",
      type: "Pickup Truck",
      year: 2023,
      image: "/images/mazda-carter.jpg",
      price: 26000,
      status: "Available",
      specifications: {
        engine: "2.2L Turbo Diesel",
        fuelType: "Diesel",
        mileage: "12,000 km",
        transmission: "Manual",
        color: "Black",
        vin: "MAZDA2023001",
      },
      addedDate: "2024-02-12",
      roi: 17.5,
      popularity: 85,
      features: ["Fuel Efficient", "Cargo Capacity", "Durable", "Commercial Use"],
    },
    {
      id: "vehicle7",
      name: "Mitsubishi L200 Carter 2022",
      type: "Pickup Truck",
      year: 2022,
      image: "/images/mitsubishi-carter.jpg",
      price: 24000,
      status: "Available",
      specifications: {
        engine: "2.4L Diesel",
        fuelType: "Diesel",
        mileage: "22,000 km",
        transmission: "Manual",
        color: "White",
        vin: "MITSU2022001",
      },
      addedDate: "2024-02-15",
      roi: 17.2,
      popularity: 80,
      features: ["Affordable", "Reliable", "Good Resale", "Versatile"],
    },
    {
      id: "vehicle8",
      name: "TVS Apache Okada 2024",
      type: "Motorcycle",
      year: 2024,
      image: "/images/okada-motorcycle.jpg",
      price: 2200,
      status: "Available",
      specifications: {
        engine: "160cc Single Cylinder",
        fuelType: "Petrol",
        mileage: "New",
        transmission: "Manual",
        color: "Blue",
        vin: "TVS2024001",
      },
      addedDate: "2024-02-18",
      roi: 24.5,
      popularity: 92,
      features: ["Sport Design", "Fuel Efficient", "Fast", "Urban Mobility"],
    },
    {
      id: "vehicle9",
      name: "Piaggio Ape Tricycle 2024",
      type: "Tricycle",
      year: 2024,
      image: "/images/tricycle-keke.jpg",
      price: 2800,
      driverId: "driver3",
      status: "Financed",
      specifications: {
        engine: "230cc Single Cylinder",
        fuelType: "Petrol",
        mileage: "New",
        transmission: "Manual",
        color: "Green",
        vin: "PIAGGIO2024001",
      },
      addedDate: "2024-02-20",
      roi: 23.0,
      popularity: 96,
      features: ["Italian Quality", "Durable", "Low Maintenance", "High Demand"],
    },
    {
      id: "vehicle10",
      name: "Nissan NP300 Carter 2023",
      type: "Pickup Truck",
      year: 2023,
      image: "/images/toyota-carter.jpg",
      price: 27000,
      status: "Available",
      specifications: {
        engine: "2.5L Diesel",
        fuelType: "Diesel",
        mileage: "16,000 km",
        transmission: "Manual",
        color: "Grey",
        vin: "NISSAN2023001",
      },
      addedDate: "2024-02-22",
      roi: 17.6,
      popularity: 87,
      features: ["Robust Build", "Good Payload", "Reliable", "Commercial Grade"],
    },
  ],
  loanApplications: [
    {
      id: "loan1",
      driverId: "driver1",
      vehicleId: "vehicle1",
      requestedAmount: 20000,
      loanTerm: 36,
      monthlyPayment: 650,
      interestRate: 8.5,
      status: "Active",
      submittedDate: "2024-01-15",
      approvedDate: "2024-01-18",
      documents: ["ID", "License", "Income Proof", "Insurance"],
      creditScore: 720,
      collateral: "Vehicle + Insurance",
      purpose: "Ride-hailing business expansion",
      investorApprovals: [
        {
          investorId: "investor1",
          amount: 12000,
          approvedDate: "2024-01-17",
          status: "Released",
          releaseDate: "2024-01-18",
        },
        {
          investorId: "investor2",
          amount: 8000,
          approvedDate: "2024-01-17",
          status: "Released",
          releaseDate: "2024-01-18",
        },
      ],
      fundingProgress: 100,
      totalFunded: 20000,
      remainingAmount: 0,
      riskAssessment: "Low",
      adminNotes: "Excellent credit history and stable income",
    },
    {
      id: "loan2",
      driverId: "driver3",
      vehicleId: "vehicle3",
      requestedAmount: 28000,
      loanTerm: 42,
      monthlyPayment: 780,
      interestRate: 9.2,
      status: "Under Review",
      submittedDate: "2024-02-01",
      documents: ["ID", "License", "Income Proof"],
      creditScore: 680,
      collateral: "Vehicle + Insurance",
      purpose: "Commercial delivery services",
      investorApprovals: [
        {
          investorId: "investor3",
          amount: 15000,
          approvedDate: "2024-02-02",
          status: "Approved",
        },
      ],
      fundingProgress: 53.6,
      totalFunded: 15000,
      remainingAmount: 13000,
      riskAssessment: "Medium",
      adminNotes: "Pending additional documentation",
    },
  ],
  investments: [
    {
      id: "inv1",
      investorId: "investor1",
      loanId: "loan1",
      amount: 12000,
      expectedROI: 16.5,
      monthlyReturn: 165,
      status: "Active",
      startDate: "2024-01-18",
      endDate: "2027-01-18",
      paymentsReceived: 2,
      totalPayments: 36,
      nextPaymentDate: "2024-03-18",
      totalReturns: 330,
    },
    {
      id: "inv2",
      investorId: "investor2",
      loanId: "loan1",
      amount: 8000,
      expectedROI: 16.5,
      monthlyReturn: 110,
      status: "Active",
      startDate: "2024-01-18",
      endDate: "2027-01-18",
      paymentsReceived: 2,
      totalPayments: 36,
      nextPaymentDate: "2024-03-18",
      totalReturns: 220,
    },
  ],
  repaymentSchedules: [
    {
      id: "pay1",
      loanId: "loan1",
      paymentNumber: 1,
      dueDate: "2024-02-18",
      amount: 650,
      principal: 550,
      interest: 100,
      status: "Paid",
      paidDate: "2024-02-18",
      paidAmount: 650,
    },
    {
      id: "pay2",
      loanId: "loan1",
      paymentNumber: 2,
      dueDate: "2024-03-18",
      amount: 650,
      principal: 555,
      interest: 95,
      status: "Paid",
      paidDate: "2024-03-18",
      paidAmount: 650,
    },
    {
      id: "pay3",
      loanId: "loan1",
      paymentNumber: 3,
      dueDate: "2024-04-18",
      amount: 650,
      principal: 560,
      interest: 90,
      status: "Pending",
    },
  ],
  transactions: [
    {
      id: "tx1",
      type: "investment",
      userId: "investor1",
      userType: "investor",
      amount: 12000,
      status: "completed",
      timestamp: "2024-01-17T10:30:00Z",
      description: "Investment in Toyota Corolla loan",
      relatedId: "loan1",
    },
    {
      id: "tx2",
      type: "loan_disbursement",
      userId: "driver1",
      userType: "driver",
      amount: 20000,
      status: "completed",
      timestamp: "2024-01-18T14:15:00Z",
      description: "Loan disbursement for Toyota Corolla",
      relatedId: "loan1",
    },
    {
      id: "tx3",
      type: "repayment",
      userId: "driver1",
      userType: "driver",
      amount: 650,
      status: "completed",
      timestamp: "2024-02-18T09:00:00Z",
      description: "Monthly loan repayment",
      relatedId: "loan1",
    },
  ],
  currentUser: null,
  notifications: [],
  metrics: {
    totalUsers: 6,
    totalDrivers: 3,
    totalInvestors: 3,
    totalVehicles: 3,
    totalLoans: 2,
    totalInvestments: 2,
    totalFundsInvested: 20000,
    totalFundsAvailable: 90000,
    totalReturns: 550,
    averageROI: 16.5,
    platformRevenue: 2750,
    successRate: 94.2,
    averageProcessingTime: "2.3 hours",
    systemUptime: "99.9%",
  },
  isLoading: false,
  lastUpdated: new Date().toISOString(),
}

// Utility functions
const calculateMetrics = (state: PlatformState): PlatformMetrics => {
  const totalFundsInvested = state.investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalFundsAvailable = state.investors.reduce((sum, inv) => sum + inv.availableBalance, 0)
  const totalReturns = state.investments.reduce((sum, inv) => sum + inv.totalReturns, 0)
  const averageROI =
    state.investments.length > 0
      ? state.investments.reduce((sum, inv) => sum + inv.expectedROI, 0) / state.investments.length
      : 0
  const platformRevenue = totalReturns * 0.05 // 5% platform fee

  return {
    totalUsers: state.drivers.length + state.investors.length,
    totalDrivers: state.drivers.length,
    totalInvestors: state.investors.length,
    totalVehicles: state.vehicles.length,
    totalLoans: state.loanApplications.length,
    totalInvestments: state.investments.length,
    totalFundsInvested,
    totalFundsAvailable,
    totalReturns,
    averageROI,
    platformRevenue,
    successRate: 94.2,
    averageProcessingTime: "2.3 hours",
    systemUptime: "99.9%",
  }
}

const generateNotification = (
  type: Notification["type"],
  userId: string,
  title: string,
  message: string,
  priority: Notification["priority"] = "medium",
  actionUrl?: string,
): Notification => ({
  id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  userId,
  type,
  title,
  message,
  timestamp: new Date().toISOString(),
  read: false,
  priority,
  actionUrl,
})

// Reducer
function platformReducer(state: PlatformState, action: PlatformAction): PlatformState {
  let newState = { ...state }

  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload }

    case "ADD_VEHICLE":
      const newVehicle = action.payload
      newState = {
        ...state,
        vehicles: [...state.vehicles, newVehicle],
        lastUpdated: new Date().toISOString(),
      }

      // Notify all drivers about new vehicle
      const driverNotifications = state.drivers.map((driver) =>
        generateNotification(
          "vehicle_added",
          driver.id,
          "New Vehicle Available",
          `${newVehicle.name} is now available for financing`,
          "medium",
          `/dashboard/driver/vehicles/${newVehicle.id}`,
        ),
      )

      // Notify all investors about new investment opportunity
      const investorNotifications = state.investors.map((investor) =>
        generateNotification(
          "vehicle_added",
          investor.id,
          "New Investment Opportunity",
          `${newVehicle.name} available for investment with ${newVehicle.roi}% ROI`,
          "medium",
          `/dashboard/investor/opportunities/${newVehicle.id}`,
        ),
      )

      newState.notifications = [...state.notifications, ...driverNotifications, ...investorNotifications]
      break

    case "UPDATE_VEHICLE":
      newState = {
        ...state,
        vehicles: state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id ? { ...vehicle, ...action.payload.updates } : vehicle,
        ),
        lastUpdated: new Date().toISOString(),
      }
      break

    case "REMOVE_VEHICLE":
      newState = {
        ...state,
        vehicles: state.vehicles.filter((vehicle) => vehicle.id !== action.payload),
        lastUpdated: new Date().toISOString(),
      }
      break

    case "SUBMIT_LOAN_APPLICATION":
      const newApplication = action.payload
      newState = {
        ...state,
        loanApplications: [...state.loanApplications, newApplication],
        lastUpdated: new Date().toISOString(),
      }

      // Update vehicle status
      newState.vehicles = newState.vehicles.map((vehicle) =>
        vehicle.id === newApplication.vehicleId ? { ...vehicle, status: "Reserved" } : vehicle,
      )

      // Notify investors about new application
      const applicationNotifications = state.investors.map((investor) =>
        generateNotification(
          "application_submitted",
          investor.id,
          "New Loan Application",
          `${newApplication.requestedAmount.toLocaleString()} loan application from ${
            state.drivers.find((d) => d.id === newApplication.driverId)?.name
          }`,
          "high",
          `/dashboard/investor/loans/${newApplication.id}`,
        ),
      )

      // Notify admin
      const adminNotification = generateNotification(
        "application_submitted",
        "admin",
        "New Loan Application Submitted",
        `${state.drivers.find((d) => d.id === newApplication.driverId)?.name} submitted a loan application for ${newApplication.requestedAmount.toLocaleString()}`,
        "high",
        `/dashboard/admin/loans/${newApplication.id}`,
      )

      newState.notifications = [...state.notifications, ...applicationNotifications, adminNotification]
      break

    case "UPDATE_LOAN_STATUS":
      const { loanId, status, adminNotes } = action.payload
      const loan = state.loanApplications.find((l) => l.id === loanId)
      if (!loan) return state

      newState = {
        ...state,
        loanApplications: state.loanApplications.map((l) =>
          l.id === loanId
            ? {
                ...l,
                status,
                adminNotes,
                reviewedDate: status === "Under Review" ? new Date().toISOString() : l.reviewedDate,
                approvedDate: status === "Approved" ? new Date().toISOString() : l.approvedDate,
              }
            : l,
        ),
        lastUpdated: new Date().toISOString(),
      }

      // Update vehicle status based on loan status
      if (status === "Approved") {
        newState.vehicles = newState.vehicles.map((vehicle) =>
          vehicle.id === loan.vehicleId ? { ...vehicle, status: "Financed" } : vehicle,
        )
      } else if (status === "Rejected") {
        newState.vehicles = newState.vehicles.map((vehicle) =>
          vehicle.id === loan.vehicleId ? { ...vehicle, status: "Available" } : vehicle,
        )
      }

      // Notify driver about status change
      const statusNotification = generateNotification(
        "loan_approved",
        loan.driverId,
        `Loan ${status}`,
        `Your loan application has been ${status.toLowerCase()}${adminNotes ? `: ${adminNotes}` : ""}`,
        status === "Approved" ? "high" : "medium",
        `/dashboard/driver/loans/${loanId}`,
      )

      newState.notifications = [...newState.notifications, statusNotification]
      break

    case "APPROVE_LOAN":
      const { loanId: approveLoanId, investorId, amount } = action.payload
      const approvalLoan = state.loanApplications.find((l) => l.id === approveLoanId)
      if (!approvalLoan) return state

      const approval: InvestorApproval = {
        investorId,
        amount,
        approvedDate: new Date().toISOString(),
        status: "Approved",
      }

      const updatedLoan = {
        ...approvalLoan,
        investorApprovals: [...approvalLoan.investorApprovals, approval],
        totalFunded: approvalLoan.totalFunded + amount,
        remainingAmount: approvalLoan.remainingAmount - amount,
        fundingProgress: ((approvalLoan.totalFunded + amount) / approvalLoan.requestedAmount) * 100,
        status:
          approvalLoan.totalFunded + amount >= approvalLoan.requestedAmount
            ? ("Approved" as const)
            : approvalLoan.status,
      }

      // Update investor balance
      const updatedInvestors = state.investors.map((inv) =>
        inv.id === investorId
          ? {
              ...inv,
              availableBalance: inv.availableBalance - amount,
              totalInvested: inv.totalInvested + amount,
              activeInvestments: inv.activeInvestments + 1,
            }
          : inv,
      )

      // Create investment record
      const newInvestment: Investment = {
        id: `inv_${Date.now()}`,
        investorId,
        loanId: approveLoanId,
        amount,
        expectedROI: 16.5,
        monthlyReturn: (amount * 0.165) / 12,
        status: "Active",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + approvalLoan.loanTerm * 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentsReceived: 0,
        totalPayments: approvalLoan.loanTerm,
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        totalReturns: 0,
      }

      // Add transaction
      const investmentTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "investment",
        userId: investorId,
        userType: "investor",
        amount,
        status: "completed",
        timestamp: new Date().toISOString(),
        description: `Investment in ${state.vehicles.find((v) => v.id === approvalLoan.vehicleId)?.name || "vehicle"} loan`,
        relatedId: approveLoanId,
      }

      newState = {
        ...state,
        loanApplications: state.loanApplications.map((l) => (l.id === approveLoanId ? updatedLoan : l)),
        investors: updatedInvestors,
        investments: [...state.investments, newInvestment],
        transactions: [...state.transactions, investmentTransaction],
        lastUpdated: new Date().toISOString(),
      }

      // Notify driver about approval
      const driverApprovalNotification = generateNotification(
        "loan_approved",
        approvalLoan.driverId,
        "Loan Funding Progress",
        `Your loan has received $${amount.toLocaleString()} in funding (${updatedLoan.fundingProgress.toFixed(1)}% complete)`,
        "high",
        `/dashboard/driver/loans/${approveLoanId}`,
      )

      // Notify admin about investment
      const adminInvestmentNotification = generateNotification(
        "investment_return",
        "admin",
        "New Investment Made",
        `${state.investors.find((i) => i.id === investorId)?.name} invested $${amount.toLocaleString()} in loan ${approveLoanId}`,
        "medium",
        `/dashboard/admin/investments/${newInvestment.id}`,
      )

      newState.notifications = [...newState.notifications, driverApprovalNotification, adminInvestmentNotification]
      break

    case "RELEASE_FUNDS":
      const { loanId: releaseLoanId, investorId: releaseInvestorId } = action.payload
      const releaseApproval = state.loanApplications
        .find((l) => l.id === releaseLoanId)
        ?.investorApprovals.find((a) => a.investorId === releaseInvestorId)

      if (!releaseApproval) return state

      const updatedApprovals = state.loanApplications.map((loan) =>
        loan.id === releaseLoanId
          ? {
              ...loan,
              investorApprovals: loan.investorApprovals.map((approval) =>
                approval.investorId === releaseInvestorId
                  ? { ...approval, status: "Released" as const, releaseDate: new Date().toISOString() }
                  : approval,
              ),
            }
          : loan,
      )

      // Add disbursement transaction
      const disbursementTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "loan_disbursement",
        userId: state.loanApplications.find((l) => l.id === releaseLoanId)?.driverId || "",
        userType: "driver",
        amount: releaseApproval.amount,
        status: "completed",
        timestamp: new Date().toISOString(),
        description: "Loan funds disbursement",
        relatedId: releaseLoanId,
      }

      newState = {
        ...state,
        loanApplications: updatedApprovals,
        transactions: [...state.transactions, disbursementTransaction],
        lastUpdated: new Date().toISOString(),
      }

      // Notify driver about fund release
      const fundReleaseNotification = generateNotification(
        "fund_released",
        state.loanApplications.find((l) => l.id === releaseLoanId)?.driverId || "",
        "Funds Released",
        `$${releaseApproval.amount.toLocaleString()} has been released to your account`,
        "high",
        `/dashboard/driver/loans/${releaseLoanId}`,
      )

      newState.notifications = [...newState.notifications, fundReleaseNotification]
      break

    case "MAKE_PAYMENT":
      const { loanId: paymentLoanId, amount: paymentAmount, paymentId } = action.payload

      // Update repayment schedule
      const updatedSchedules = state.repaymentSchedules.map((schedule) =>
        schedule.id === paymentId
          ? {
              ...schedule,
              status: "Paid" as const,
              paidDate: new Date().toISOString(),
              paidAmount: paymentAmount,
            }
          : schedule,
      )

      // Update investments with payment received
      const updatedInvestments = state.investments.map((investment) =>
        investment.loanId === paymentLoanId
          ? {
              ...investment,
              paymentsReceived: investment.paymentsReceived + 1,
              totalReturns: investment.totalReturns + investment.monthlyReturn,
            }
          : investment,
      )

      // Update investor balances with returns
      const investmentsForLoan = state.investments.filter((inv) => inv.loanId === paymentLoanId)
      const updatedInvestorsWithReturns = state.investors.map((investor) => {
        const investment = investmentsForLoan.find((inv) => inv.investorId === investor.id)
        if (investment) {
          return {
            ...investor,
            availableBalance: investor.availableBalance + investment.monthlyReturn,
            totalReturns: investor.totalReturns + investment.monthlyReturn,
          }
        }
        return investor
      })

      // Add repayment transaction
      const repaymentTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: "repayment",
        userId: state.loanApplications.find((l) => l.id === paymentLoanId)?.driverId || "",
        userType: "driver",
        amount: paymentAmount,
        status: "completed",
        timestamp: new Date().toISOString(),
        description: "Monthly loan repayment",
        relatedId: paymentLoanId,
      }

      newState = {
        ...state,
        repaymentSchedules: updatedSchedules,
        investments: updatedInvestments,
        investors: updatedInvestorsWithReturns,
        transactions: [...state.transactions, repaymentTransaction],
        lastUpdated: new Date().toISOString(),
      }

      // Notify investors about payment received
      const paymentNotifications = investmentsForLoan.map((investment) =>
        generateNotification(
          "investment_return",
          investment.investorId,
          "Payment Received",
          `Monthly return of $${investment.monthlyReturn.toFixed(2)} received from your investment`,
          "medium",
          `/dashboard/investor/investments/${investment.id}`,
        ),
      )

      newState.notifications = [...newState.notifications, ...paymentNotifications]
      break

    case "UPDATE_INVESTOR_BALANCE":
      const { investorId: balanceInvestorId, amount: balanceAmount, type } = action.payload
      newState = {
        ...state,
        investors: state.investors.map((investor) =>
          investor.id === balanceInvestorId
            ? {
                ...investor,
                availableBalance:
                  type === "add"
                    ? investor.availableBalance + balanceAmount
                    : investor.availableBalance - balanceAmount,
              }
            : investor,
        ),
        lastUpdated: new Date().toISOString(),
      }
      break

    case "ADD_TRANSACTION":
      newState = {
        ...state,
        transactions: [action.payload, ...state.transactions],
        lastUpdated: new Date().toISOString(),
      }
      break

    case "ADD_NOTIFICATION":
      newState = {
        ...state,
        notifications: [action.payload, ...state.notifications],
        lastUpdated: new Date().toISOString(),
      }
      break

    case "MARK_NOTIFICATION_READ":
      newState = {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, read: true } : notif,
        ),
        lastUpdated: new Date().toISOString(),
      }
      break

    case "ADD_DRIVER":
      newState = {
        ...state,
        drivers: [...state.drivers, action.payload],
        lastUpdated: new Date().toISOString(),
      }
      break

    case "UPDATE_DRIVER":
      newState = {
        ...state,
        drivers: state.drivers.map((driver) =>
          driver.id === action.payload.id ? { ...driver, ...action.payload.updates } : driver,
        ),
        lastUpdated: new Date().toISOString(),
      }
      break

    case "ADD_INVESTOR":
      newState = {
        ...state,
        investors: [...state.investors, action.payload],
        lastUpdated: new Date().toISOString(),
      }
      break

    case "UPDATE_INVESTOR":
      newState = {
        ...state,
        investors: state.investors.map((investor) =>
          investor.id === action.payload.id ? { ...investor, ...action.payload.updates } : investor,
        ),
        lastUpdated: new Date().toISOString(),
      }
      break

    case "SYNC_DATA":
      newState = {
        ...state,
        lastUpdated: action.payload.timestamp,
      }
      break

    default:
      return state
  }

  // Recalculate metrics after any state change
  newState.metrics = calculateMetrics(newState)

  return newState
}

// Context
const PlatformContext = createContext<{
  state: PlatformState
  dispatch: React.Dispatch<PlatformAction>
} | null>(null)

// Provider
export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(platformReducer, initialState)

  // Real-time synchronization simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      dispatch({
        type: "SYNC_DATA",
        payload: { timestamp: new Date().toISOString() },
      })

      // Simulate periodic system notifications
      if (Math.random() > 0.98) {
        const systemNotification = generateNotification(
          "system_alert",
          "admin",
          "System Health Check",
          "All systems operating normally",
          "low",
        )
        dispatch({ type: "ADD_NOTIFICATION", payload: systemNotification })
      }
    }, 5000) // Sync every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return <PlatformContext.Provider value={{ state, dispatch }}>{children}</PlatformContext.Provider>
}

// Hook
export function usePlatform() {
  const context = useContext(PlatformContext)
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider")
  }
  return context
}

// Enhanced Selectors
export const useDriverData = (driverId: string) => {
  const { state } = usePlatform()
  return {
    driver: state.drivers.find((d) => d.id === driverId),
    loans: state.loanApplications.filter((l) => l.driverId === driverId),
    vehicles: state.vehicles.filter((v) => v.driverId === driverId),
    repayments: state.repaymentSchedules.filter((r) =>
      state.loanApplications.some((l) => l.driverId === driverId && l.id === r.loanId),
    ),
    transactions: state.transactions.filter((t) => t.userId === driverId),
    notifications: state.notifications.filter((n) => n.userId === driverId),
    availableVehicles: state.vehicles.filter((v) => v.status === "Available"),
  }
}

export const useInvestorData = (investorId: string) => {
  const { state } = usePlatform()
  return {
    investor: state.investors.find((i) => i.id === investorId),
    investments: state.investments.filter((i) => i.investorId === investorId),
    availableLoans: state.loanApplications.filter((l) => l.status === "Under Review" || l.status === "Pending"),
    transactions: state.transactions.filter((t) => t.userId === investorId),
    notifications: state.notifications.filter((n) => n.userId === investorId),
    pendingReleases: state.loanApplications.filter((loan) =>
      loan.investorApprovals.some((approval) => approval.investorId === investorId && approval.status === "Approved"),
    ),
  }
}

export const useAdminData = () => {
  const { state } = usePlatform()
  return {
    ...state.metrics,
    pendingLoans: state.loanApplications.filter((l) => l.status === "Pending" || l.status === "Under Review").length,
    activeLoans: state.loanApplications.filter((l) => l.status === "Active").length,
    completedLoans: state.loanApplications.filter((l) => l.status === "Completed").length,
    recentActivity: state.notifications.slice(0, 10),
    recentTransactions: state.transactions.slice(0, 10),
    topPerformingDrivers: state.drivers.sort((a, b) => b.rating - a.rating).slice(0, 5),
    topInvestors: state.investors.sort((a, b) => b.totalInvested - a.totalInvested).slice(0, 5),
    vehicleUtilization: {
      available: state.vehicles.filter((v) => v.status === "Available").length,
      financed: state.vehicles.filter((v) => v.status === "Financed").length,
      maintenance: state.vehicles.filter((v) => v.status === "Maintenance").length,
      reserved: state.vehicles.filter((v) => v.status === "Reserved").length,
    },
    loanStatusDistribution: {
      pending: state.loanApplications.filter((l) => l.status === "Pending").length,
      underReview: state.loanApplications.filter((l) => l.status === "Under Review").length,
      approved: state.loanApplications.filter((l) => l.status === "Approved").length,
      active: state.loanApplications.filter((l) => l.status === "Active").length,
      completed: state.loanApplications.filter((l) => l.status === "Completed").length,
      rejected: state.loanApplications.filter((l) => l.status === "Rejected").length,
    },
  }
}
