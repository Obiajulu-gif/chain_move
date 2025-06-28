"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { RealTimeChat } from "@/components/dashboard/real-time-chat"
import { AdvancedAnalytics } from "@/components/dashboard/advanced-analytics"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { usePlatform, useDriverData } from "@/contexts/platform-context"
import { useToast } from "@/hooks/use-toast"
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
  Activity,
  MessageCircle,
  BarChart3,
  Loader2,
} from "lucide-react"

// Define types for our data
interface Payment {
  id: string
  status: string
  amount: number
  dueDate: string
  paymentNumber: number
  loanId: string
}

interface InvestorApproval {
  id: string
  investorId: string
  amount: number
  status: string
  approvedDate: string
}

interface LoanApplication {
  id: string
  requestedAmount: number
  monthlyPayment: number
  interestRate: number
  loanTerm: number
  fundingProgress: number
  totalFunded: number
  remainingAmount: number
  investorApprovals: InvestorApproval[]
  status: string
  startDate: string
  endDate: string
}

interface DriverData {
  driver?: {
    id: string
    name: string
    rating: number
    status: string
  }
  notifications: Array<{
    id: string
    title: string
    message: string
    read: boolean
    timestamp: string
  }>
  repayments: Payment[]
  activeLoan?: LoanApplication
  pendingLoans: LoanApplication[]
}

// Helper function to get status badge color
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}

export default function DriverDashboard() {
  const { state, dispatch } = usePlatform()
  const [currentDriverId] = useState("driver1") // In real app, get from auth
  const driverData = useDriverData(currentDriverId)
  const { toast } = useToast()

  if (state.isLoading || !driverData.driver) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Set current user on mount
  useEffect(() => {
    dispatch({
      type: "SET_CURRENT_USER",
      payload: {
        id: currentDriverId,
        role: "driver",
        name: driverData.driver?.name || "Driver",
      },
    })
  }, [dispatch, currentDriverId, driverData.driver?.name])

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

  const activeLoan = driverData.loans.find((l) => l.status === "Active" || l.status === "Approved")
  const pendingLoans = driverData.loans.filter((l) => l.status === "Pending" || l.status === "Under Review")
  const totalFundsReceived = activeLoan ? activeLoan.totalFunded : 0
  const nextPaymentAmount = activeLoan ? activeLoan.monthlyPayment : 0
  const unreadNotifications = driverData.notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="driver" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={driverData.driver?.name || "Driver"}
          userStatus="Verified Driver"
          notificationCount={unreadNotifications}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Real-time Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Loan Status</CardTitle>
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#E57700]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    {activeLoan ? "Active" : pendingLoans.length > 0 ? "Pending" : "No Loan"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {activeLoan
                      ? `$${activeLoan.requestedAmount.toLocaleString()} approved`
                      : pendingLoans.length > 0
                        ? "Under review"
                        : "No active loan"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Funds Received</CardTitle>
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-[#E57700]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-lg sm:text-xl font-bold text-foreground">${totalFundsReceived.toLocaleString()}</div>
                  <p className="text-xs text-green-500">Available for withdrawal</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#E57700]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    {nextPaymentAmount > 0 ? `$${nextPaymentAmount}` : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeLoan ? "Due in 15 days" : "No active loan"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Driver Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#E57700]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    {driverData.driver?.rating || "N/A"}
                  </div>
                  <p className="text-xs text-green-500">Excellent performance</p>
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
                            <p className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                              {notification.title}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              {notification.message}
                            </p>
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

            {/* Enhanced Dashboard Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <div className="overflow-x-auto">
                <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 bg-muted p-1 h-auto">
                  <TabsTrigger
                    value="overview"
                    className="text-xs sm:text-sm py-2 px-1 sm:px-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="repayments"
                    className="text-xs sm:text-sm py-2 px-1 sm:px-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    Repayments
                  </TabsTrigger>
                  <TabsTrigger
                    value="funding"
                    className="text-xs sm:text-sm py-2 px-1 sm:px-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    Funding
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="hidden sm:flex items-center justify-center text-xs sm:text-sm py-2 px-1 sm:px-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="hidden sm:flex items-center justify-center text-xs sm:text-sm py-2 px-1 sm:px-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="hidden sm:flex items-center justify-center text-xs sm:text-sm py-2 px-1 sm:px-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                    <span>Alerts</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-4">
                {activeLoan ? (
                  <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
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
                          <span className="text-sm text-foreground">{activeLoan.fundingProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={activeLoan.fundingProgress} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>${activeLoan.totalFunded.toLocaleString()} funded</span>
                          <span>${activeLoan.remainingAmount.toLocaleString()} remaining</span>
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
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                          <FileText className="h-4 w-4 mr-2" />
                          View Contract
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
                    <CardContent className="text-center py-12">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Active Loan</h3>
                      <p className="text-muted-foreground mb-4">
                        {pendingLoans.length > 0
                          ? "Your loan application is under review"
                          : "Apply for vehicle financing to get started"}
                      </p>
                      {pendingLoans.length === 0 && (
                        <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">Apply for Loan</Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Repayments Tab */}
              <TabsContent value="repayments" className="space-y-6">
                <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
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
                          <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/30 dark:bg-muted/10 rounded-lg">
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
                                <p className="text-sm text-muted-foreground">
                                  {payment.status}
                                </p>
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
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No repayment history found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Funding Tab */}
              <TabsContent value="funding" className="space-y-6">
                <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
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
                              {activeLoan.fundingProgress.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={activeLoan.fundingProgress} className="h-3" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>${activeLoan.totalFunded.toLocaleString()} funded</span>
                            <span>${activeLoan.remainingAmount.toLocaleString()} remaining</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">Investor Commitments</h4>
                          <div className="space-y-3">
                            {activeLoan.investorApprovals.length > 0 ? (
                              activeLoan.investorApprovals.map((approval) => {
                                const investor = state.investors.find(inv => inv.id === approval.investorId);
                                return (
                                  <div key={approval.id} className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/10 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-xs font-medium">
                                          {investor ? investor.name.charAt(0).toUpperCase() : '?'}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="font-medium text-foreground">{investor ? investor.name : 'Unknown Investor'}</p>
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
                                );
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
        </main>
      </div>
    </div>
  )
}

