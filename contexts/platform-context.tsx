"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type Dispatch } from "react"

// Core Types
export interface User {
  id: string
  _id?: string
  name: string
  email: string
  role: "driver" | "investor" | "admin"
  status: "Active" | "Pending" | "Suspended"
  joinedDate: string
  availableBalance?: number
  totalInvested?: number
  totalReturns?: number
}

export interface Vehicle {
  _id: string
  name: string
  type: string
  year: number
  price: number
  image?: string
  status: "Available" | "Financed" | "Reserved" | "Maintenance"
  roi: number
  features: string[]
  specifications: {
    engine: string
    fuelType: string
    mileage: string
    transmission: string
    color: string
    vin: string
  }
  addedDate: string
  popularity: number
  driverId?: string
}

export interface LoanApplication {
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
  riskAssessment: "Low" | "Medium" | "High"
  adminNotes?: string
  investorApprovals?: InvestorApproval[]
  fundingProgress?: number
  totalFunded?: number
  remainingAmount?: number
}

export interface InvestorApproval {
  investorId: string
  amount: number
  approvedDate: string
  status: "Pending" | "Approved" | "Released"
  releaseDate?: string
}

export interface Investment {
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

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "investment" | "loan_disbursement" | "repayment" | "return"
  userId: string
  userType: "driver" | "investor"
  amount: number
  status: "pending" | "completed" | "failed"
  timestamp: string
  description: string
  relatedId?: string
}

export interface DashboardStats {
  totalUsers: number
  totalDrivers: number
  totalInvestors: number
  activeLoans: number
  pendingLoans: number
  totalFundsInvested: number
  totalFundsAvailable: number
  platformRevenue: number
  successRate: number
  systemUptime: string
  averageROI: number
  vehicleUtilization: {
    available: number
    financed: number
    reserved: number
    maintenance: number
  }
  totalVehicles: number
  recentActivity: Array<{
    id: number
    title: string
    message: string
    timestamp: string
    priority: string
  }>
}

export interface Notification {
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

// Platform State
export interface PlatformState {
  currentUser: User | null
  users: User[]
  vehicles: Vehicle[]
  loanApplications: LoanApplication[]
  investments: Investment[]
  transactions: Transaction[]
  notifications: Notification[]
  dashboardStats: DashboardStats | null
  isLoading: boolean
  error: string | null
  lastUpdated: string
}

// Actions
type PlatformAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_DATA"; payload: { users: User[]; vehicles: Vehicle[] } }
  | { type: "SET_VEHICLES"; payload: Vehicle[] }
  | { type: "ADD_VEHICLE"; payload: Vehicle }
  | { type: "UPDATE_VEHICLE"; payload: { id: string; updates: Partial<Vehicle> } }
  | { type: "REMOVE_VEHICLE"; payload: string }
  | { type: "SET_LOAN_APPLICATIONS"; payload: LoanApplication[] }
  | { type: "ADD_LOAN_APPLICATION"; payload: LoanApplication }
  | { type: "UPDATE_LOAN_STATUS"; payload: { loanId: string; status: LoanApplication["status"]; adminNotes?: string } }
  | { type: "SET_INVESTMENTS"; payload: Investment[] }
  | { type: "ADD_INVESTMENT"; payload: Investment }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "SET_DASHBOARD_STATS"; payload: DashboardStats }
  | { type: "UPDATE_USER_ROLE"; payload: { userId: string; role: User["role"] } }
  | { type: "DELETE_USER"; payload: string }
  | { type: "UPDATE_USER_BALANCE"; payload: { userId: string; balance: number } }
  | { type: "APPROVE_LOAN"; payload: { loanId: string; investorId: string; amount: number } }
  | { type: "RELEASE_FUNDS"; payload: { loanId: string; investorId: string } }
  | { type: "SYNC_DATA"; payload: { timestamp: string } }

// Initial State
const initialState: PlatformState = {
  currentUser: null,
  users: [],
  vehicles: [],
  loanApplications: [],
  investments: [],
  transactions: [],
  notifications: [],
  dashboardStats: null,
  isLoading: true,
  error: null,
  lastUpdated: new Date().toISOString(),
}

// Utility Functions
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
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }

    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload }

    case "SET_USERS":
      return { ...state, users: action.payload, lastUpdated: new Date().toISOString() }

    case "SET_DATA":
      return {
        ...state,
        users: action.payload.users,
        vehicles: action.payload.vehicles,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      }

    case "SET_VEHICLES":
      return { ...state, vehicles: action.payload, lastUpdated: new Date().toISOString() }

    case "ADD_VEHICLE":
      return {
        ...state,
        vehicles: [...state.vehicles, action.payload],
        lastUpdated: new Date().toISOString(),
      }

    case "UPDATE_VEHICLE":
      return {
        ...state,
        vehicles: state.vehicles.map((vehicle) =>
          vehicle._id === action.payload.id ? { ...vehicle, ...action.payload.updates } : vehicle,
        ),
        lastUpdated: new Date().toISOString(),
      }

    case "REMOVE_VEHICLE":
      return {
        ...state,
        vehicles: state.vehicles.filter((vehicle) => vehicle._id !== action.payload),
        lastUpdated: new Date().toISOString(),
      }

    case "SET_LOAN_APPLICATIONS":
      return { ...state, loanApplications: action.payload, lastUpdated: new Date().toISOString() }

    case "ADD_LOAN_APPLICATION":
      return {
        ...state,
        loanApplications: [...state.loanApplications, action.payload],
        lastUpdated: new Date().toISOString(),
      }

    case "UPDATE_LOAN_STATUS":
      const { loanId, status, adminNotes } = action.payload
      return {
        ...state,
        loanApplications: state.loanApplications.map((loan) =>
          loan.id === loanId
            ? {
                ...loan,
                status,
                adminNotes,
                reviewedDate: status === "Under Review" ? new Date().toISOString() : loan.reviewedDate,
                approvedDate: status === "Approved" ? new Date().toISOString() : loan.approvedDate,
              }
            : loan,
        ),
        lastUpdated: new Date().toISOString(),
      }

    case "APPROVE_LOAN":
      const { loanId: approveLoanId, investorId, amount } = action.payload
      return {
        ...state,
        loanApplications: state.loanApplications.map((loan) =>
          loan.id === approveLoanId
            ? {
                ...loan,
                investorApprovals: [
                  ...(loan.investorApprovals || []),
                  {
                    investorId,
                    amount,
                    approvedDate: new Date().toISOString(),
                    status: "Approved" as const,
                  },
                ],
                totalFunded: (loan.totalFunded || 0) + amount,
                fundingProgress: Math.min((((loan.totalFunded || 0) + amount) / loan.requestedAmount) * 100, 100),
                remainingAmount: Math.max(loan.requestedAmount - ((loan.totalFunded || 0) + amount), 0),
              }
            : loan,
        ),
        // Update investor balance
        users: state.users.map((user) =>
          user.id === investorId || user._id === investorId
            ? { ...user, availableBalance: (user.availableBalance || 0) - amount }
            : user,
        ),
        lastUpdated: new Date().toISOString(),
      }

    case "RELEASE_FUNDS":
      const { loanId: releaseLoanId, investorId: releaseInvestorId } = action.payload
      return {
        ...state,
        loanApplications: state.loanApplications.map((loan) =>
          loan.id === releaseLoanId
            ? {
                ...loan,
                investorApprovals: loan.investorApprovals?.map((approval) =>
                  approval.investorId === releaseInvestorId && approval.status === "Approved"
                    ? { ...approval, status: "Released" as const, releaseDate: new Date().toISOString() }
                    : approval,
                ),
              }
            : loan,
        ),
        lastUpdated: new Date().toISOString(),
      }

    case "SET_INVESTMENTS":
      return { ...state, investments: action.payload, lastUpdated: new Date().toISOString() }

    case "ADD_INVESTMENT":
      return {
        ...state,
        investments: [...state.investments, action.payload],
        lastUpdated: new Date().toISOString(),
      }

    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload, lastUpdated: new Date().toISOString() }

    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        lastUpdated: new Date().toISOString(),
      }

    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload, lastUpdated: new Date().toISOString() }

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        lastUpdated: new Date().toISOString(),
      }

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, read: true } : notif,
        ),
        lastUpdated: new Date().toISOString(),
      }

    case "SET_DASHBOARD_STATS":
      return { ...state, dashboardStats: action.payload, lastUpdated: new Date().toISOString() }

    case "UPDATE_USER_ROLE":
      const { userId: roleUserId, role } = action.payload
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === roleUserId || user._id === roleUserId ? { ...user, role } : user,
        ),
        lastUpdated: new Date().toISOString(),
      }

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload && user._id !== action.payload),
        lastUpdated: new Date().toISOString(),
      }

    case "UPDATE_USER_BALANCE":
      const { userId: balanceUserId, balance } = action.payload
      return {
        ...state,
        // Update the current user if it matches
        currentUser:
          state.currentUser && (state.currentUser.id === balanceUserId || state.currentUser._id === balanceUserId)
            ? { ...state.currentUser, availableBalance: balance }
            : state.currentUser,
        // Update users array
        users: state.users.map((user) =>
          user.id === balanceUserId || user._id === balanceUserId ? { ...user, availableBalance: balance } : user,
        ),
        lastUpdated: new Date().toISOString(),
      }

    case "SYNC_DATA":
      return {
        ...state,
        lastUpdated: action.payload.timestamp,
      }

    default:
      return state
  }
}

// Context
const PlatformContext = createContext<{
  state: PlatformState
  dispatch: Dispatch<PlatformAction>
  fetchData?: () => Promise<void>
}>({
  state: initialState,
  dispatch: () => null,
})

// Provider
export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(platformReducer, initialState)

  const fetchInitialData = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      // Fetch users and vehicles
      const [vehiclesRes, usersRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/users"), // Add the fetch call for users
      ])

      if (!vehiclesRes.ok || !usersRes.ok) {
        throw new Error("Failed to fetch initial platform data")
      }

      const vehiclesData = await vehiclesRes.json()
      const usersData = await usersRes.json()

      // Dispatch both sets of data to the global state
      dispatch({
        type: "SET_DATA",
        payload: {
          users: usersData.users || [],
          vehicles: vehiclesData.data || [],
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred"
      dispatch({ type: "SET_ERROR", payload: message })
    }
  }

  useEffect(() => {
    fetchInitialData()
    window.addEventListener("focus", fetchInitialData)

    // Clean up the event listener
    return () => {
      window.removeEventListener("focus", fetchInitialData)
    }
  }, []) // Runs once on app load

  const contextValue = {
    state,
    dispatch,
    fetchData: fetchInitialData, // Pass the function through the context
  }

  return <PlatformContext.Provider value={contextValue}>{children}</PlatformContext.Provider>
}

// Hook
export function usePlatform() {
  const context = useContext(PlatformContext)
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider")
  }
  return context
}

// Specialized Hooks
export const useCurrentUser = () => {
  const { state } = usePlatform()
  return state.currentUser
}

export const useUsersByRole = (role?: User["role"]) => {
  const { state } = usePlatform()
  return role ? state.users.filter((user) => user.role === role) : state.users
}

export const useVehiclesByStatus = (status?: Vehicle["status"]) => {
  const { state } = usePlatform()
  return status ? state.vehicles.filter((vehicle) => vehicle.status === status) : state.vehicles
}

export const useLoansByStatus = (status?: LoanApplication["status"]) => {
  const { state } = usePlatform()
  return status ? state.loanApplications.filter((loan) => loan.status === status) : state.loanApplications
}

export const useUserNotifications = (userId?: string) => {
  const { state } = usePlatform()
  const currentUserId = userId || state.currentUser?.id || state.currentUser?._id
  return currentUserId ? state.notifications.filter((notif) => notif.userId === currentUserId) : []
}

export const useDashboardStats = () => {
  const { state } = usePlatform()
  return state.dashboardStats
}

// Enhanced Selectors for specific user data
export const useDriverData = (driverId: string) => {
  const { state } = usePlatform()

  return {
    driver: state.users.find((u: User) => (u._id === driverId || u.id === driverId) && u.role === "driver"),
    loans: state.loanApplications.filter((l: LoanApplication) => l.driverId === driverId),
    vehicles: state.vehicles.filter((v: Vehicle) => v.driverId === driverId),
    transactions: state.transactions.filter((t: Transaction) => t.userId === driverId),
    notifications: state.notifications.filter((n: Notification) => n.userId === driverId),
    availableVehicles: state.vehicles.filter((v: Vehicle) => v.status === "Available"),
    repayments: [], // Remove mock data, use empty array for now
  }
}

export const useInvestorData = (investorId: string) => {
  const { state } = usePlatform()

  return {
    investor: state.users.find((u: User) => (u._id === investorId || u.id === investorId) && u.role === "investor"),
    investments: state.investments.filter((i: Investment) => i.investorId === investorId),
    availableLoans: state.loanApplications.filter(
      (l: LoanApplication) => l.status === "Under Review" || l.status === "Pending",
    ),
    availableVehicles: state.vehicles.filter((v: Vehicle) => v.status === "Available"),
    transactions: state.transactions.filter((t: Transaction) => t.userId === investorId),
    notifications: state.notifications.filter((n: Notification) => n.userId === investorId),
    pendingReleases: state.loanApplications.filter((loan: LoanApplication) =>
      loan.investorApprovals?.some(
        (approval: InvestorApproval) => approval.investorId === investorId && approval.status === "Approved",
      ),
    ),
  }
}

export const useAdminData = () => {
  const { state } = usePlatform()
  const stats = state.dashboardStats

  return {
    ...stats,
    pendingLoans: state.loanApplications.filter((l) => l.status === "Pending" || l.status === "Under Review").length,
    activeLoans: state.loanApplications.filter((l) => l.status === "Active").length,
    completedLoans: state.loanApplications.filter((l) => l.status === "Completed").length,
    recentActivity: state.notifications.slice(0, 10),
    recentTransactions: state.transactions.slice(0, 10),
    topPerformingDrivers: state.users.filter((u) => u.role === "driver").slice(0, 5),
    topInvestors: state.users.filter((u) => u.role === "investor").slice(0, 5),
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
