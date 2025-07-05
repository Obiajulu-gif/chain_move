"use client"

import { useEffect } from "react"
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
  MessageCircle,
  BarChart3,
  Loader2,
} from "lucide-react"

export default function DriverDashboard() {
  const { state, dispatch } = usePlatform()
  const { user: authUser, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const currentDriverId = authUser?.id || ""
  const driverData = useDriverData(currentDriverId)

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
  const nextPaymentAmount = activeLoan ? activeLoan.monthlyPayment : 0
  const unreadNotifications = driverData.notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="driver" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={authUser.name || "Driver"}
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
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    ${totalFundsReceived.toLocaleString()}
                  </div>
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
                  <p className="text-xs text-muted-foreground">{activeLoan ? "Due in 15 days" : "No active loan"}</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:bg-card transition-colors duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Driver Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#E57700]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-lg sm:text-xl font-bold text-foreground">
                    {driverData.driver?.rating || "4.8"}
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
        </main>
      </div>
    </div>
  )
}
