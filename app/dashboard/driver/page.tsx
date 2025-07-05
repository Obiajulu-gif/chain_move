"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [loanApplication, setLoanApplication] = useState({
    requestedAmount: "",
    loanTerm: "12",
    purpose: "",
    creditScore: "",
    collateral: "",
    monthlyIncome: "",
    employmentStatus: "",
    documents: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        },
      })
    }
  }, [dispatch, authUser])

  const handleMakePayment = (loanId: string, amount: number) => {
    // Find next pending payment
    const nextPayment = driverData.repayments.find((r) => r.loanId === loanId && r.status === "Pending")
    if (nextPayment) {
      dispatch({
        type: "MAKE_PAYMENT",
        payload: {
          loanId,
          amount,
          paymentId: nextPayment.id,
        },
      })
      toast({
        title: "Payment Successful",
        description: `Payment of $${amount.toLocaleString()} has been processed`,
      })
    }
  }

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle)
    setLoanApplication((prev) => ({
      ...prev,
      requestedAmount: vehicle.price.toString(),
    }))
  }

  const handleLoanApplicationSubmit = async () => {
    if (!selectedVehicle || !loanApplication.requestedAmount) {
      toast({
        title: "Incomplete Application",
        description: "Please select a vehicle and fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Calculate monthly payment (simple calculation)
      const principal = Number.parseFloat(loanApplication.requestedAmount)
      const rate = 0.15 / 12 // 15% annual rate
      const term = Number.parseInt(loanApplication.loanTerm)
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

      const newLoanApplication = {
        id: `loan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        driverId: currentDriverId,
        vehicleId: selectedVehicle._id,
        requestedAmount: principal,
        loanTerm: term,
        monthlyPayment: Math.round(monthlyPayment),
        interestRate: 15,
        status: "Pending" as const,
        submittedDate: new Date().toISOString(),
        documents: loanApplication.documents,
        creditScore: Number.parseInt(loanApplication.creditScore) || 650,
        collateral: loanApplication.collateral,
        purpose: loanApplication.purpose,
        riskAssessment: "Medium" as const,
        fundingProgress: 0,
        totalFunded: 0,
        remainingAmount: principal,
      }

      // Add to platform state
      dispatch({
        type: "ADD_LOAN_APPLICATION",
        payload: newLoanApplication,
      })

      // Update vehicle status to Reserved
      dispatch({
        type: "UPDATE_VEHICLE",
        payload: {
          id: selectedVehicle._id,
          updates: { status: "Reserved", driverId: currentDriverId },
        },
      })

      toast({
        title: "Application Submitted",
        description: `Your loan application for ${selectedVehicle.name} has been submitted for review.`,
      })

      // Reset form and close dialog
      setIsLoanDialogOpen(false)
      setSelectedVehicle(null)
      setLoanApplication({
        requestedAmount: "",
        loanTerm: "12",
        purpose: "",
        creditScore: "",
        collateral: "",
        monthlyIncome: "",
        employmentStatus: "",
        documents: [],
      })
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Approved":
        return "bg-green-600"
      case "Under Review":
        return "bg-blue-600"
      case "Pending":
        return "bg-yellow-600"
      case "Rejected":
        return "bg-red-600"
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
  const nextPaymentAmount = activeLoan ? activeLoan.monthlyPayment || 0 : 0
  const unreadNotifications = driverData.notifications.filter((n) => !n.read).length

  // Get available vehicles for loan application
  const availableVehicles = state.vehicles.filter((v) => v.status === "Financed")

  return (
    <>
      <div className="min-h-screen bg-background">
        <Sidebar role="driver" className="md:w-64 lg:w-72" mobileWidth="w-64" />
        <div className="md:ml-64 lg:ml-72">
          <Header
            userName={authUser.name || "Driver"}
            userStatus="Verified Driver"
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
                  <p className="text-xs text-green-500 dark:text-green-400">Available for withdrawal</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {nextPaymentAmount > 0 ? `$${nextPaymentAmount}` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">{activeLoan ? "Due in 15 days" : "No active loan"}</p>
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
                        <div
                          key={notification.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-800"
                        >
                          <div>
                            <p className="font-medium text-blue-900 dark:text-blue-100 text-sm">{notification.title}</p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">{notification.message}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", payload: notification.id })}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                          >
                            Mark Read
                          </Button>
                        </div>
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
                          <p className="text-sm text-muted-foreground">Monthly Payment</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${activeLoan.monthlyPayment.toLocaleString()}
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
                          onClick={() => handleMakePayment(activeLoan.id, activeLoan.monthlyPayment)}
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
                        <Dialog open={isLoanDialogOpen} onOpenChange={setIsLoanDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                              <Plus className="h-4 w-4 mr-2" />
                              Apply for Loan
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Apply for Vehicle Loan</DialogTitle>
                              <DialogDescription>Select a vehicle and complete your loan application</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* Vehicle Selection */}
                              <div>
                                <h4 className="text-lg font-semibold mb-4">Select a Vehicle</h4>
                                {availableVehicles.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                                    {availableVehicles.map((vehicle) => (
                                      <Card
                                        key={vehicle._id}
                                        className={`cursor-pointer transition-all ${
                                          selectedVehicle?._id === vehicle._id
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
                                                  ${vehicle.price.toLocaleString()}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                  {vehicle.roi}% ROI
                                                </Badge>
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
                                        type="number"
                                        value={loanApplication.requestedAmount}
                                        onChange={(e) =>
                                          setLoanApplication((prev) => ({
                                            ...prev,
                                            requestedAmount: e.target.value,
                                          }))
                                        }
                                        placeholder="Enter loan amount"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="loanTerm">Loan Term (months)</Label>
                                      <Select
                                        value={loanApplication.loanTerm}
                                        onValueChange={(value) =>
                                          setLoanApplication((prev) => ({
                                            ...prev,
                                            loanTerm: value,
                                          }))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="6">6 months</SelectItem>
                                          <SelectItem value="12">12 months</SelectItem>
                                          <SelectItem value="18">18 months</SelectItem>
                                          <SelectItem value="24">24 months</SelectItem>
                                          <SelectItem value="36">36 months</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label htmlFor="creditScore">Credit Score</Label>
                                      <Input
                                        id="creditScore"
                                        type="number"
                                        value={loanApplication.creditScore}
                                        onChange={(e) =>
                                          setLoanApplication((prev) => ({
                                            ...prev,
                                            creditScore: e.target.value,
                                          }))
                                        }
                                        placeholder="e.g., 650"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="monthlyIncome">Monthly Income ($)</Label>
                                      <Input
                                        id="monthlyIncome"
                                        type="number"
                                        value={loanApplication.monthlyIncome}
                                        onChange={(e) =>
                                          setLoanApplication((prev) => ({
                                            ...prev,
                                            monthlyIncome: e.target.value,
                                          }))
                                        }
                                        placeholder="Enter monthly income"
                                      />
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
                                      value={loanApplication.collateral}
                                      onChange={(e) =>
                                        setLoanApplication((prev) => ({
                                          ...prev,
                                          collateral: e.target.value,
                                        }))
                                      }
                                      placeholder="Describe any collateral you can provide"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsLoanDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleLoanApplicationSubmit}
                                disabled={!selectedVehicle || isSubmitting}
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
                              {payment.status === "Paid" ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : payment.status === "Overdue" ? (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-500" />
                              )}
                              <div>
                                <p className="font-medium text-foreground">
                                  {new Date(payment.dueDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">{payment.status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">${payment.amount.toLocaleString()}</p>
                              {payment.status === "Pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleMakePayment(payment.loanId, payment.amount)}
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
                <NotificationCenter userId={currentDriverId} userRole="driver" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
