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
} from "lucide-react"

export default function DriverDashboard() {
  const { state, dispatch } = usePlatform()
  const [currentDriverId] = useState("driver1") // In real app, get from auth
  const driverData = useDriverData(currentDriverId)
  const { toast } = useToast()

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
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64">
        <Header
          userName={driverData.driver?.name || "Driver"}
          userStatus="Verified Driver"
          notificationCount={unreadNotifications}
        />

        <div className="p-3 md:p-6 space-y-4 md:space-y-8">
          {/* Real-time Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Loan Status</CardTitle>
                <FileText className="h-4 w-4 text-[#E57700]" />
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
                      : "Apply for financing"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Funds Received</CardTitle>
                <Wallet className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${totalFundsReceived.toLocaleString()}</div>
                <p className="text-xs text-green-500">Available for withdrawal</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Payment</CardTitle>
                <Calendar className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {nextPaymentAmount > 0 ? `$${nextPaymentAmount}` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">{activeLoan ? "Due in 15 days" : "No active loan"}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Driver Rating</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{driverData.driver?.rating || "N/A"}</div>
                <p className="text-xs text-green-500">Excellent performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Notifications */}
          {unreadNotifications > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Updates ({unreadNotifications})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {driverData.notifications
                    .filter((n) => !n.read)
                    .slice(0, 3)
                    .map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-blue-900">{notification.title}</p>
                          <p className="text-sm text-blue-700">{notification.message}</p>
                          <p className="text-xs text-blue-600">{new Date(notification.timestamp).toLocaleString()}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", payload: notification.id })}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-muted">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="repayments"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                Repayments
              </TabsTrigger>
              <TabsTrigger value="funding" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Funding Status
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                <Bell className="h-4 w-4 mr-1" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
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
                      <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">Apply for Loan</Button>
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
                        <div key={payment.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            {payment.status === "Paid" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : payment.status === "Overdue" ? (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            )}
                            <div>
                              <p className="font-medium text-foreground">Payment #{payment.paymentNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: {new Date(payment.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">${payment.amount.toLocaleString()}</p>
                            <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No repayment schedule available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Funding Status Tab */}
            <TabsContent value="funding" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Investor Funding Status
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Real-time updates on investor approvals and fund releases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeLoan && activeLoan.investorApprovals.length > 0 ? (
                    <div className="space-y-4">
                      {activeLoan.investorApprovals.map((approval, index) => {
                        const investor = state.investors.find((inv) => inv.id === approval.investorId)
                        return (
                          <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#E57700] rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">{investor?.name.charAt(0) || "I"}</span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{investor?.name || "Investor"}</p>
                                <p className="text-sm text-muted-foreground">
                                  Approved: {new Date(approval.approvedDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">${approval.amount.toLocaleString()}</p>
                              <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {activeLoan ? "Waiting for investor approvals" : "No active loan to fund"}
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
  )
}
