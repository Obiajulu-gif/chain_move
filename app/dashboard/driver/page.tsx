"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { RealTimeChat } from "@/components/dashboard/real-time-chat"
import { AdvancedAnalytics } from "@/components/dashboard/advanced-analytics"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { usePlatform, useDriverData } from "@/contexts/platform-context"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link" // Import Link
import {
  Car,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wallet,
  FileText,
  Bell,
  CreditCard,
  Loader2,
  Plus,
} from "lucide-react"
import Image from "next/image"

export default function DriverDashboard() {
  const { state, dispatch } = usePlatform()
  const { user: authUser, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const currentDriverId = authUser?.id || ""
  const driverData = useDriverData(currentDriverId)

  // Loan application state
  const [isApplyLoanDialogOpen, setIsApplyLoanDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [loanApplication, setLoanApplication] = useState({
    loanTerm: "12", // Default value, will be overridden if vehicle has investmentTerm
    purpose: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Currency selector state
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN'>('USD')
  const [exchangeRate, setExchangeRate] = useState<number>(1)
  const [isLoadingRate, setIsLoadingRate] = useState(false)

  // Currency formatting function
  const formatCurrency = (amount: number, currency: 'USD' | 'NGN' = selectedCurrency) => {
    if (currency === 'NGN') {
      return `₦${(amount * exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    }
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  }

  // Get display amount for dual currency display
  const getDisplayAmount = (usdAmount: number) => {
    if (selectedCurrency === 'NGN') {
      return `${formatCurrency(usdAmount, 'NGN')} (${formatCurrency(usdAmount, 'USD')})`
    }
    return formatCurrency(usdAmount, 'USD')
  }

  // KYC state for the dialog
  const [showKycPromptDialog, setShowKycPromptDialog] = useState(false)
  const [kycPromptMessage, setKycPromptMessage] = useState("")
  const [kycPromptAction, setKycPromptAction] = useState<{ label: string; href: string } | null>(null)

  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (selectedCurrency === 'NGN') {
        setIsLoadingRate(true)
        try {
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
          const data = await response.json()
          setExchangeRate(data.rates.NGN || 1600) // Fallback to 1600 if API fails
        } catch (error) {
          console.error('Failed to fetch exchange rate:', error)
          setExchangeRate(1600) // Fallback rate
        } finally {
          setIsLoadingRate(false)
        }
      } else {
        setExchangeRate(1)
        setIsLoadingRate(false)
      }
    }

    fetchExchangeRate()
  }, [selectedCurrency])

  // Set current user on mount
  useEffect(() => {
    if (authUser) {
      dispatch({
        type: "SET_CURRENT_USER",
        payload: {
          id: authUser.id,
          role: authUser.role as "driver",
          name: authUser.name,
          email: authUser.email,
          // Assuming kycStatus is part of authUser or driverData
          kycStatus: (authUser as any).kycStatus || "none", // Add kycStatus to the user object
          physicalMeetingStatus: (authUser as any).physicalMeetingStatus || "none", // Add physicalMeetingStatus
          notifications: (authUser as any).notifications || [], // Add notifications
        },
      })
    }
  }, [dispatch, authUser])

  // Fetch driver's specific loans when they log in
  useEffect(() => {
    const fetchDriverLoans = async () => {
      if (authUser?.id && authUser.role === "driver") {
        try {
          const response = await fetch(`/api/loans?userId=${authUser.id}`)
          if (response.ok) {
            const data = await response.json()
            const loans = data.loans || []
            // Update the platform context with the driver's loans
            dispatch({
              type: "SET_LOAN_APPLICATIONS",
              payload: loans,
            })
          }
        } catch (error) {
          console.error("Error fetching driver loans:", error)
        }
      }
    }

    fetchDriverLoans()
  }, [authUser?.id, authUser?.role, dispatch])

  const handleMakePayment = (loanId: string, amount: number) => {
    // Find next pending payment
    const nextPayment = driverData.repayments.find((r) => r.relatedId === loanId && r.status === "pending")
    if (nextPayment) {
      // In a real app, you'd integrate with a payment gateway here
      // For simulation, we'll directly update the state
      dispatch({
        type: "ADD_TRANSACTION", // Assuming a generic ADD_TRANSACTION action exists
        payload: {
          id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "repayment",
          userId: currentDriverId,
          userType: "driver",
          amount: amount,
          status: "completed",
          timestamp: new Date().toISOString(),
          description: `Weekly repayment for Loan #${loanId}`,
          relatedId: loanId,
        },
      })
      // Update the repayment status (if you have a specific action for it)
      // For now, we'll just rely on the transaction being added.
      toast({
        title: "Payment Successful",
        description: `Payment of $${amount.toLocaleString()} has been processed`,
      })
    }
  }

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle)
    // Set loan term based on vehicle's investmentTerm or keep it editable
    if (vehicle.investmentTerm) {
      setLoanApplication(prev => ({
        ...prev,
        loanTerm: vehicle.investmentTerm.toString()
      }))
    } else {
      // Reset to default if no investmentTerm
      setLoanApplication(prev => ({
        ...prev,
        loanTerm: "12"
      }))
    }
  }

  const handleLoanApplicationSubmit = async () => {
    if (!selectedVehicle) {
      // Only check for selectedVehicle
      toast({
        title: "Incomplete Application",
        description: "Please select a vehicle.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const principal = selectedVehicle.price // Use selected vehicle price directly

      // New interest rate calculation based on investment term
      const term = Number.parseInt(loanApplication.loanTerm)
      let annualInterestRate

      switch (term) {
        case 12:
          annualInterestRate = 157.5 // 157.5% for 12 months
          break
        case 24:
          annualInterestRate = 195 // 195% for 24 months
          break
        case 36:
          annualInterestRate = 225 // 225% for 36 months
          break
        case 48:
          annualInterestRate = 255 // 255% for 48 months
          break
        default:
          // Default to 12 months rate if term doesn't match
          annualInterestRate = 157.5
      }

      // New total payback calculation: interest rate * vehicle price
      const totalPayback = (annualInterestRate / 100) * principal
      const monthlyPayment = totalPayback / term

      const downPaymentAmount = (principal * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 })
      const collateralString = `You will have to pay 15% down payment of the loan amount for you to be approved for the loan: $${downPaymentAmount}`

      const newLoanApplication = {
        id: `loan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        driverId: currentDriverId,
        vehicleId: selectedVehicle._id,
        requestedAmount: principal, // Use the vehicle's price
        totalAmountToPayBack: totalPayback,
        loanTerm: term,
        monthlyPayment: monthlyPayment,
        weeklyPayment: monthlyPayment / 4.33,
        interestRate: annualInterestRate, // Use the new interest rate
        status: "Pending" as const,
        submittedDate: new Date().toISOString(),
        documents: [], // Documents are not part of this form currently
        creditScore: 0, // Default value, assuming it's not collected here
        collateral: collateralString, // Use the calculated string
        purpose: loanApplication.purpose,
        riskAssessment: "Medium" as const, // Default value
        fundingProgress: 0,
        totalFunded: 0,
        remainingAmount: principal,
        downPaymentMade: false, // Initialize downPaymentMade to false
      }
      // Save to database via API
      const loanResponse = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverId: currentDriverId,
          vehicleId: selectedVehicle._id,
          requestedAmount: principal,
          totalAmountToPayBack: totalPayback,
          loanTerm: term,
          monthlyPayment: monthlyPayment,
          weeklyPayment: monthlyPayment / 4.33,
          interestRate: annualInterestRate,
          purpose: loanApplication.purpose,
          creditScore: 0,
          collateral: collateralString,
          riskAssessment: "Medium",
          downPaymentMade: false
        }),
      })

      if (!loanResponse.ok) {
        const errorData = await loanResponse.json()
        throw new Error(errorData.error || 'Failed to submit loan application')
      }

      const { loan: savedLoan } = await loanResponse.json()

      // Add to platform state for immediate UI update
      dispatch({
        type: "ADD_LOAN_APPLICATION",
        payload: {
          ...newLoanApplication,
          id: savedLoan._id, // Use the database ID
        },
      })
      // Update vehicle status to Reserved
      dispatch({
        type: "UPDATE_VEHICLE",
        payload: {
          id: selectedVehicle._id,
          updates: { status: "Reserved", driverId: currentDriverId },
        },
      })

      // Send email notification
      try {
        const emailSubject = "Loan Application Submitted"
        const weeklyPayment = monthlyPayment / 4.33 // Calculate weekly payment (monthly payment / 4.33 weeks per month)
        const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #E57700; margin-bottom: 20px;">Loan Application Submitted</h2>
      <p style="margin-bottom: 15px;">Your loan application for ${selectedVehicle.name} has been submitted for review.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333;">Loan Details:</h3>
        <p><strong>Vehicle:</strong> ${selectedVehicle.name} (${selectedVehicle.year})</p>
        <p><strong>Loan Amount:</strong> $${principal.toLocaleString()}</p>
        <p><strong>Term:</strong> ${term} months</p>
        <p><strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}</p>
        <p><strong>Weekly Payment:</strong> $${weeklyPayment.toFixed(2)}</p>
        <p><strong>Interest Rate:</strong> ${annualInterestRate}%</p>
        <p><strong>Total Payback:</strong> $${totalPayback.toFixed(2)}</p>
        <p><strong>Down Payment Required:</strong> $${downPaymentAmount}</p>
      </div>
            <p style="margin-bottom: 15px;">Our team will review your application and you will be notified once a decision has been made.</p>
            <p style="margin-bottom: 15px;">Please log in to your dashboard to check the status of your application.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://chainmove.xyz'}/dashboard/driver/loan-terms" style="display: inline-block; background-color: #E57700; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Application Status</a>
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 12px; color: #666;">This is an automated message from Chain Move. Please do not reply to this email.</p>
            </div>
          </div>
        `

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: authUser.email,
            subject: emailSubject,
            html: emailHtml,
          }),
        })

        if (!response.ok) {
          console.error('Failed to send email notification')
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError)
        // Continue with the process even if email fails
      }

      toast({
        title: "✅ Application Submitted Successfully!",
        description: `Your loan application for ${selectedVehicle.name} has been submitted for review. You will receive an email confirmation shortly.`,
        duration: 5000,
      })

      // Reset form and close dialog
      setIsApplyLoanDialogOpen(false)
      setSelectedVehicle(null)
      setLoanApplication({
        loanTerm: "12",
        purpose: "",
      })

      // Redirect to loan-terms page after a brief delay to show the success message
      setTimeout(() => {
        router.push('/dashboard/driver/loan-terms')
      }, 2000)
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApplyForLoanClick = () => {
    const kycStatus = (authUser as any)?.kycStatus || "none"
    const physicalMeetingStatus = (authUser as any)?.physicalMeetingStatus || "none"

    if (kycStatus === "approved_stage2") {
      // Fully approved, proceed to loan application
      setIsApplyLoanDialogOpen(true)
    } else {
      // Not fully approved, show KYC prompt
      setShowKycPromptDialog(true)
      if (kycStatus === "none") {
        setKycPromptMessage("Please complete your KYC verification first to apply for a loan.")
        setKycPromptAction({ label: "Go to KYC Page", href: "/dashboard/driver/kyc" })
      } else if (kycStatus === "pending") {
        setKycPromptMessage(
          "Your first stage KYC verification is currently under review. Please wait for approval before proceeding.",
        )
        setKycPromptAction(null) // No action button for pending
      } else if (kycStatus === "approved_stage1") {
        setKycPromptMessage(
          "Your first stage KYC is approved. Please proceed with the second stage of verification (physical meeting) to apply for a loan.",
        )
        setKycPromptAction({ label: "Proceed with Second KYC", href: "/dashboard/driver/kyc" })
      } else if (kycStatus === "pending_stage2") {
        setKycPromptMessage(
          "Your second stage KYC (physical meeting) is currently under review. Please wait for approval before applying for a loan.",
        )
        setKycPromptAction(null) // No action button for pending
      } else if (kycStatus === "rejected") {
        setKycPromptMessage(
          "Your KYC verification was rejected. Please review the requirements and re-submit or contact support.",
        )
        setKycPromptAction({ label: "Re-submit KYC", href: "/dashboard/driver/kyc" })
      } else if (physicalMeetingStatus === "rejected_stage2") {
        setKycPromptMessage(
          "Your second stage KYC (physical meeting) was rejected. Please contact support for assistance.",
        )
        setKycPromptAction({ label: "Contact Support", href: "/dashboard/driver/support" })
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Approved":
      case "approved_stage2": // New status
        return "bg-green-600"
      case "Under Review":
      case "pending_stage2": // New status
        return "bg-blue-600"
      case "pending":
        return "bg-yellow-600"
      case "rejected":
      case "rejected_stage2": // New status
        return "bg-red-600"
      case "approved_stage1": // New status
        return "bg-purple-600" // Or any other distinct color
      default:
        return "bg-gray-600"
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your account information.</p>
        </div>
      </div>
    )
  }

  // Check authentication and role
  if (!authUser || authUser.role !== "driver") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need to be logged in as a driver to access this page.</p>
          <Button onClick={() => router.push("/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  // Show loading while platform data is loading
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your driver dashboard.</p>
        </div>
      </div>
    )
  }

  const activeLoan = driverData.loans.find((l) => l.status === "Active" || l.status === "Approved")
  const pendingLoans = driverData.loans.filter((l) => l.status === "Pending" || l.status === "Under Review")
  const totalFundsReceived = activeLoan ? activeLoan.totalFunded || 0 : 0
  const weeklyPaymentAmount = activeLoan ? (activeLoan.weeklyPayment || (activeLoan.monthlyPayment ? activeLoan.monthlyPayment / 4.33 : 0)) : 0
  const nextPaymentAmount = weeklyPaymentAmount
  const nextPaymentDueLabel = (() => {
    if (!activeLoan) return "No active loan"
    const today = new Date()
    const day = today.getDay() // 0-6 Sun-Sat, Wednesday=3
    let daysToAdd = (3 - day + 7) % 7
    if (daysToAdd === 0) daysToAdd = 7
    const nextWed = new Date(today)
    nextWed.setDate(today.getDate() + daysToAdd)
    const daysUntil = Math.ceil((nextWed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const dateStr = nextWed.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    return `Due ${dateStr} (${daysUntil} days)`
  })()
  const unreadNotifications = driverData.notifications.filter((n) => !n.read).length
  // Get available vehicles for loan application
  const availableVehicles = state.vehicles.filter((v) => v.fundingStatus === "Funded")

  // Calculate down payment for display based on total payback amount
  const downPaymentAmount = selectedVehicle ? (() => {
    const principal = selectedVehicle.price;
    const term = Number.parseInt(loanApplication.loanTerm || "12"); // Default to 12 if not set

    // Use the new interest rate calculation
    let annualInterestRate
    switch (term) {
      case 12:
        annualInterestRate = 157.5
        break
      case 24:
        annualInterestRate = 195
        break
      case 36:
        annualInterestRate = 225
        break
      case 48:
        annualInterestRate = 255
        break
      default:
        annualInterestRate = 157.5
    }

    const totalPayback = (annualInterestRate / 100) * principal;
    return (principal * 0.15).toLocaleString(undefined, { maximumFractionDigits: 2 });
  })() : "0"
  const collateralDisplayText = selectedVehicle
    ? `You will have to pay 15% down payment of the loan amount for you to be approved for the loan: $${downPaymentAmount}`
    : ""

  return (
    <>
      <div className="min-h-screen bg-background">
        <Sidebar role="driver" />
        <div className="md:ml-64 lg:ml-72">
          <Header
            userName={authUser.name || "Driver"}
            userStatus="Driver"
            notificationCount={unreadNotifications}
            className="md:pl-6 lg:pl-8"
          />
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
            {/* Real-time Portfolio Stats - Match investor dashboard layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Loan Status</CardTitle>
                  <FileText className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {activeLoan ? "Active" : pendingLoans.length > 0 ? "Pending" : "No Loan"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeLoan
                      ? `$${activeLoan.requestedAmount.toLocaleString()} approved`
                      : pendingLoans.length > 0
                        ? "Under review"
                        : "No active loan"}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Funds Received</CardTitle>
                  <Wallet className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${totalFundsReceived.toLocaleString()}</div>
                  <p className="text-xs text-green-500 dark:text-green-400">Assigned</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {nextPaymentAmount > 0 ? `$${nextPaymentAmount.toLocaleString()}` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">{nextPaymentDueLabel}</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Driver Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {driverData.driver?.rating ? driverData.driver.rating.toFixed(1) : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {driverData.driver?.rating ? "Current rating" : "No rating yet"}
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Real-time Notifications */}
            {unreadNotifications > 0 && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="p-4">
                  <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center text-sm sm:text-base">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Recent Updates ({unreadNotifications})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    {driverData.notifications
                      .filter((n) => !n.read)
                      .slice(0, 3)
                      .map((notification) => (
                        <Link
                          key={notification.id}
                          href={notification.actionUrl || "/dashboard/driver/notifications"} // Link to the notification's specific link or general notifications page
                          className="flex items-center justify-between p-3 bg-white dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-blue-900 dark:text-blue-100 text-sm">{notification.title}</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">{notification.message}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {/* Removed "Mark Read" button from here, as it will be handled on the dedicated page */}
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Main Content Tabs - Match investor dashboard layout */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="repayments">Repayments</TabsTrigger>
                <TabsTrigger value="funding">Funding</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="notifications">Alerts</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6">
                {activeLoan ? (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center">
                        <Car className="h-5 w-5 mr-2" />
                        Active Loan Details
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">Current loan status and terms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${activeLoan.requestedAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Weekly Payment</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${weeklyPaymentAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="text-2xl font-bold text-foreground">{activeLoan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Term</p>
                          <p className="text-2xl font-bold text-foreground">{activeLoan.loanTerm} months</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Funding Progress</span>
                          <span className="text-sm text-foreground">
                            {(activeLoan.fundingProgress || 0).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={activeLoan.fundingProgress || 0} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>${(activeLoan.totalFunded || 0).toLocaleString()} funded</span>
                          <span>${(activeLoan.remainingAmount || 0).toLocaleString()} remaining</span>
                        </div>
                      </div>
                      <div className="mt-6 flex space-x-2">
                        <Button
                          className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                          onClick={() => handleMakePayment(activeLoan.id, weeklyPaymentAmount)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Make Payment
                        </Button>
                        <Button
                          variant="outline"
                          className="border-border text-foreground hover:bg-muted bg-transparent"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Contract
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-card border-border">
                    <CardContent className="text-center py-12">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Active Loan</h3>
                      <p className="text-muted-foreground mb-4">
                        {pendingLoans.length > 0
                          ? "Your loan application is under review"
                          : "Apply for vehicle financing to get started"}
                      </p>
                      {pendingLoans.length === 0 && (
                        <Dialog
                          open={isApplyLoanDialogOpen} // Use the new state for overall dialog control
                          onOpenChange={(open) => {
                            setIsApplyLoanDialogOpen(open)
                            if (!open) {
                              // Reset states when dialog closes
                              setShowKycPromptDialog(false) // Ensure KYC prompt is hidden when dialog closes
                              setSelectedVehicle(null) // Clear selected vehicle
                              setSelectedCurrency('USD')
                              setExchangeRate(1)
                              setLoanApplication({
                                // Reset loan application form
                                loanTerm: "12",
                                purpose: "",
                              })
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                              onClick={handleApplyForLoanClick}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Apply for Loan
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {showKycPromptDialog ? "KYC Verification Required" : "Apply for Vehicle Loan"}
                              </DialogTitle>
                              <DialogDescription>
                                {showKycPromptDialog
                                  ? kycPromptMessage
                                  : "Select a vehicle and complete your loan application"}
                              </DialogDescription>
                            </DialogHeader>
                            {/* Currency Selection Card */}
                            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center text-orange-800 dark:text-orange-200">
                                  <CreditCard className="h-5 w-5 mr-2" />
                                  Currency Selection
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Label htmlFor="currency" className="text-sm font-medium min-w-[80px]">
                                    Currency:
                                  </Label>
                                  <Select
                                    value={selectedCurrency}
                                    onValueChange={(value: 'USD' | 'NGN') => setSelectedCurrency(value)}
                                    disabled={isLoadingRate}
                                  >
                                    <SelectTrigger className="w-[200px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="USD">🇺🇸 USD (US Dollar)</SelectItem>
                                      <SelectItem value="NGN">🇳🇬 NGN (Nigerian Naira)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {isLoadingRate && (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                  )}
                                </div>
                                {selectedCurrency === 'NGN' && (
                                  <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border">
                                    {/* <p className="text-sm text-muted-foreground">
                              <strong>Live Exchange Rate:</strong> 1 USD = ₦{exchangeRate.toLocaleString()}
                            </p> */}
                                    {/* <p className="text-xs text-muted-foreground mt-1">
                              All calculations are done in USD and converted to NGN for display
                            </p> */}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                            {showKycPromptDialog ? (
                              <div className="py-6 text-center">
                                <p className="text-lg text-foreground mb-4">{kycPromptMessage}</p>
                                {kycPromptAction && (
                                  <Button
                                    onClick={() => router.push(kycPromptAction.href)}
                                    className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                                  >
                                    {kycPromptAction.label}
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-6">
                                {/* Vehicle Selection */}
                                <div>
                                  <h4 className="text-lg font-semibold mb-4">Select a Vehicle</h4>
                                  {availableVehicles.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                                      {availableVehicles.map((vehicle) => (
                                        <Card
                                          key={vehicle._id}
                                          className={`cursor-pointer transition-all ${selectedVehicle?._id === vehicle._id
                                              ? "ring-2 ring-[#E57700] bg-orange-50 dark:bg-orange-950/20"
                                              : "hover:shadow-md"
                                            }`}
                                          onClick={() => handleVehicleSelect(vehicle)}
                                        >
                                          <CardContent className="p-4">
                                            <div className="flex items-center space-x-4">
                                              <Image
                                                src={vehicle.image || "/placeholder.svg"}
                                                alt={vehicle.name}
                                                width={80}
                                                height={60}
                                                className="rounded-lg object-cover"
                                              />
                                              <div className="flex-1">
                                                <h5 className="font-semibold">{vehicle.name}</h5>
                                                <p className="text-sm text-muted-foreground">
                                                  {vehicle.type} • {vehicle.year}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                  <span className="text-lg font-bold text-[#E57700]">
                                                    {getDisplayAmount(vehicle.price)}
                                                  </span>
                                                  {/* <Badge variant="outline" className="text-xs">
                                                    {vehicle.roi}% ROI
                                                  </Badge> */}
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                      <p className="text-muted-foreground">
                                        No vehicles available for loan at the moment
                                      </p>
                                    </div>
                                  )}
                                </div>
                                {/* Loan Application Form */}
                                {selectedVehicle && (
                                  <div className="space-y-4">
                                    <h4 className="text-lg font-semibold">Loan Application Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="requestedAmount">Requested Amount ($)</Label>
                                        <Input
                                          id="requestedAmount"
                                          type="text" // Changed to text as it's non-editable
                                          value={getDisplayAmount(selectedVehicle.price)} // Display selected vehicle price
                                          readOnly // Make it non-editable
                                          disabled // Make it non-editable
                                          className="bg-muted cursor-not-allowed" // Style as non-editable
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="loanTerm">Loan Term (months)</Label>
                                        {selectedVehicle?.investmentTerm ? (
                                          // If vehicle has investmentTerm, show it as read-only
                                          <Input
                                            id="loanTerm"
                                            type="text"
                                            value={`${selectedVehicle.investmentTerm} months`}
                                            readOnly
                                            disabled
                                            className="bg-muted cursor-not-allowed"
                                          />
                                        ) : (
                                          // If no investmentTerm, show editable select
                                          <Select
                                            value={loanApplication.loanTerm}
                                            onValueChange={(value) =>
                                              setLoanApplication((prev) => ({
                                                ...prev,
                                                loanTerm: value,
                                              }))}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="12">12 months</SelectItem>
                                              <SelectItem value="24">24 months</SelectItem>
                                              <SelectItem value="36">36 months</SelectItem>
                                              <SelectItem value="48">48 months</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        )}
                                        {selectedVehicle?.investmentTerm && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            This term was set by the  investor and cannot be changed.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="paybackAmount">Total Amount to Pay Back ($)</Label>
                                        <Input
                                          id="paybackAmount"
                                          type="text"
                                          value={getDisplayAmount(
                                            (() => {
                                              const principal = selectedVehicle.price;
                                              const term = Number.parseInt(loanApplication.loanTerm);

                                              // Use the new interest rate calculation
                                              let annualInterestRate
                                              switch (term) {
                                                case 12:
                                                  annualInterestRate = 157.5
                                                  break
                                                case 24:
                                                  annualInterestRate = 195
                                                  break
                                                case 36:
                                                  annualInterestRate = 225
                                                  break
                                                case 48:
                                                  annualInterestRate = 255
                                                  break
                                                default:
                                                  annualInterestRate = 157.5
                                              }

                                              // New total payback calculation: interest rate * vehicle price
                                              return (annualInterestRate / 100) * principal;
                                            })()
                                          )}
                                          readOnly
                                          disabled
                                          className="bg-muted cursor-not-allowed"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="monthlyPayment">Monthly Payment ($)</Label>
                                        <Input
                                          id="monthlyPayment"
                                          type="text"
                                          value={getDisplayAmount(
                                            (() => {
                                              const principal = selectedVehicle.price;
                                              const term = Number.parseInt(loanApplication.loanTerm);

                                              // Use the new interest rate calculation
                                              let annualInterestRate
                                              switch (term) {
                                                case 12:
                                                  annualInterestRate = 157.5
                                                  break
                                                case 24:
                                                  annualInterestRate = 195
                                                  break
                                                case 36:
                                                  annualInterestRate = 225
                                                  break
                                                case 48:
                                                  annualInterestRate = 255
                                                  break
                                                default:
                                                  annualInterestRate = 157.5
                                              }

                                              // Calculate total payback and divide by term for monthly payment
                                              const totalPayback = (annualInterestRate / 100) * principal;
                                              return totalPayback / term;
                                            })()
                                          )}
                                          readOnly
                                          disabled
                                          className="bg-muted cursor-not-allowed"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="weeklyPayment">Weekly Payment ($)</Label>
                                        <Input
                                          id="weeklyPayment"
                                          type="text"
                                          value={getDisplayAmount(
                                            (() => {
                                              const principal = selectedVehicle.price;
                                              const term = Number.parseInt(loanApplication.loanTerm);

                                              // Use the new interest rate calculation
                                              let annualInterestRate
                                              switch (term) {
                                                case 12:
                                                  annualInterestRate = 157.5
                                                  break
                                                case 24:
                                                  annualInterestRate = 195
                                                  break
                                                case 36:
                                                  annualInterestRate = 225
                                                  break
                                                case 48:
                                                  annualInterestRate = 255
                                                  break
                                                default:
                                                  annualInterestRate = 157.5
                                              }

                                              // Calculate total payback, monthly payment, then weekly payment
                                              const totalPayback = (annualInterestRate / 100) * principal;
                                              const monthlyPayment = totalPayback / term;
                                              // Calculate weekly payment (monthly payment / 4.33 weeks per month)
                                              return monthlyPayment / 4.33;
                                            })()
                                          )}
                                          readOnly
                                          disabled
                                          className="bg-muted cursor-not-allowed"
                                        />
                                      </div>
                                      <div>
                                        {/* Empty div to maintain grid layout */}
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="purpose">Loan Purpose</Label>
                                      <Textarea
                                        id="purpose"
                                        value={loanApplication.purpose}
                                        onChange={(e) =>
                                          setLoanApplication((prev) => ({
                                            ...prev,
                                            purpose: e.target.value,
                                          }))
                                        }
                                        placeholder="Describe how you plan to use this vehicle..."
                                        rows={3}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="collateral">Collateral/Security</Label>
                                      <Input
                                        id="collateral"
                                        value={collateralDisplayText} // Display calculated collateral text
                                        readOnly // Make it non-editable
                                        disabled // Make it non-editable
                                        className="bg-muted cursor-not-allowed" // Style as non-editable
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsApplyLoanDialogOpen(false)
                                  setShowKycPromptDialog(false)
                                }}
                              >
                                Cancel
                              </Button>
                              {!showKycPromptDialog && (
                                <Button
                                  onClick={handleLoanApplicationSubmit}
                                  disabled={!selectedVehicle || isSubmitting || isLoadingRate}
                                  className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Submitting...
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Submit Application
                                    </>
                                  )}
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              {/* Repayments Tab */}
              <TabsContent value="repayments" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Repayment Schedule
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Track your payment history and upcoming payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {driverData.repayments.length > 0 ? (
                      <div className="space-y-4">
                        {driverData.repayments.slice(0, 5).map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-4 bg-muted/30 dark:bg-muted/10 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {payment.status === "completed" ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : payment.status === "failed" ? (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-500" />
                              )}
                              <div>
                                <p className="font-medium text-foreground">
                                  {new Date(payment.timestamp).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">{payment.status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">${payment.amount.toLocaleString()}</p>
                              {payment.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleMakePayment(payment.relatedId, payment.amount)}
                                  className="mt-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                                >
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Repayment Schedule</h3>
                        <p className="text-muted-foreground">
                          {activeLoan
                            ? "Your repayment schedule will appear here once payments begin"
                            : "Apply for a loan to see your repayment schedule"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Funding Tab */}
              <TabsContent value="funding" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Funding Status
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Track your loan funding progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeLoan ? (
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Funding Progress</span>
                            <span className="text-sm font-medium text-foreground">
                              {(activeLoan.fundingProgress || 0).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={activeLoan.fundingProgress || 0} className="h-3" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>${(activeLoan.totalFunded || 0).toLocaleString()} funded</span>
                            <span>${(activeLoan.remainingAmount || 0).toLocaleString()} remaining</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Investor Commitments</h4>
                          <div className="space-y-3">
                            {activeLoan.investorApprovals && activeLoan.investorApprovals.length > 0 ? (
                              activeLoan.investorApprovals.map((approval, index) => {
                                const investor = state.users.find(
                                  (user) => user.id === approval.investorId || user._id === approval.investorId,
                                )
                                return (
                                  <div
                                    key={`${approval.investorId}-${index}`}
                                    className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/10 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-xs font-medium">
                                          {investor ? investor.name.charAt(0).toUpperCase() : "?"}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium text-foreground">
                                          {investor ? investor.name : "Unknown Investor"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(approval.approvedDate).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-foreground">${approval.amount.toLocaleString()}</p>
                                      <Badge variant="outline" className="text-xs">
                                        {approval.status}
                                      </Badge>
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-muted-foreground">No investor commitments yet</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {pendingLoans.length > 0
                            ? "Your loan application is under review"
                            : "No active loan to track"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <AdvancedAnalytics userRole="driver" userId={currentDriverId} />
              </TabsContent>
              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-6">
                <RealTimeChat currentUserId={currentDriverId} currentUserRole="driver" />
              </TabsContent>
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                {/* This tab will now render the full NotificationCenter */}
                <NotificationCenter
                  userId={currentDriverId}
                  userRole="driver"
                  notifications={authUser.notifications || []}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
