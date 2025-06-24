"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { RealTimeChat } from "@/components/dashboard/real-time-chat"
import { AdvancedAnalytics } from "@/components/dashboard/advanced-analytics"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { usePlatform, useInvestorData } from "@/contexts/platform-context"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  TrendingUp,
  Car,
  CheckCircle,
  Clock,
  Eye,
  ThumbsUp,
  Send,
  Wallet,
  Bell,
  Activity,
  BarChart3,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"

export default function InvestorDashboard() {
  const { state, dispatch } = usePlatform()
  const [currentInvestorId] = useState("investor1") // In real app, get from auth
  const investorData = useInvestorData(currentInvestorId)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const { toast } = useToast()

  // Set current user on mount
  useEffect(() => {
    dispatch({
      type: "SET_CURRENT_USER",
      payload: {
        id: currentInvestorId,
        role: "investor",
        name: investorData.investor?.name || "Investor",
      },
    })
  }, [dispatch, currentInvestorId, investorData.investor?.name])

  const handleApproveLoan = (loanId: string, amount: number) => {
    if (!investorData.investor || amount > investorData.investor.availableBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this investment",
        variant: "destructive",
      })
      return
    }

    dispatch({
      type: "APPROVE_LOAN",
      payload: {
        loanId,
        investorId: currentInvestorId,
        amount,
      },
    })

    toast({
      title: "Loan Approved",
      description: `You have approved $${amount.toLocaleString()} for this loan`,
    })

    setInvestmentAmount("")
  }

  const handleReleaseFunds = (loanId: string) => {
    dispatch({
      type: "RELEASE_FUNDS",
      payload: {
        loanId,
        investorId: currentInvestorId,
      },
    })

    toast({
      title: "Funds Released",
      description: "Funds have been released to the driver",
    })
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

  const unreadNotifications = investorData.notifications.filter((n) => !n.read).length
  const totalInvested = investorData.investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalReturns = investorData.investments.reduce((sum, inv) => sum + inv.monthlyReturn * inv.paymentsReceived, 0)
  const monthlyIncome = investorData.investments
    .filter((inv) => inv.status === "Active")
    .reduce((sum, inv) => sum + inv.monthlyReturn, 0)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        role="investor" 
        className="md:w-64 lg:w-72"
        mobileWidth="w-64"
      />

      <div className="md:ml-64 lg:ml-72">
        <Header
          userName={investorData.investor?.name || "Investor"}
          userStatus="Verified Investor"
          notificationCount={unreadNotifications}
          className="md:pl-6 lg:pl-8"
        />

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
          {/* Real-time Portfolio Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
                <Wallet className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  ${investorData.investor?.availableBalance.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-green-500 dark:text-green-400">Ready to invest</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
                <TrendingUp className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">${totalInvested.toLocaleString()}</div>
                <p className="text-xs text-blue-500 dark:text-blue-400">Active investments</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Returns</CardTitle>
                <DollarSign className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">${totalReturns.toLocaleString()}</div>
                <p className="text-xs text-green-500 dark:text-green-400">
                  +{totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : 0}% ROI
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                <BarChart3 className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">${monthlyIncome.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">Expected monthly</p>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Notifications */}
          {unreadNotifications > 0 && (
            <Card className="bg-card/50 border-border/50 hover:bg-card/70 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-foreground" />
                  <span>New Opportunities ({unreadNotifications})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {investorData.notifications
                    .filter((n) => !n.read)
                    .slice(0, 3)
                    .map((notification) => (
                      <div 
                        key={notification.id} 
                        className="flex items-start gap-3 p-3 bg-card/20 rounded-lg hover:bg-card/30 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-400 dark:hover:bg-green-500 dark:text-white"
                        >
                          Mark Read
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Investment Management Tabs */}
          <Tabs defaultValue="opportunities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-muted">
              <TabsTrigger
                value="opportunities"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Active
              </TabsTrigger>
              <TabsTrigger
                value="approvals"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                Approvals
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

            {/* Loan Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Available Loan Applications ({investorData.availableLoans.length})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Review and approve driver loan applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {investorData.availableLoans.length > 0 ? (
                    <div className="space-y-6">
                      {investorData.availableLoans.map((loan) => {
                        const driver = state.drivers.find((d) => d.id === loan.driverId)
                        const vehicle = state.vehicles.find((v) => v.id === loan.vehicleId)

                        return (
                          <Card key={loan.id} className="bg-muted border-border">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <Image
                                    src={vehicle?.image || "/placeholder.svg"}
                                    alt={vehicle?.name || "Vehicle"}
                                    width={80}
                                    height={60}
                                    className="rounded-lg object-cover"
                                  />
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground">{vehicle?.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      Driver: {driver?.name} • Rating: {driver?.rating}/5
                                    </p>
                                    <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-foreground">
                                    ${loan.requestedAmount.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{loan.loanTerm} months</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                                  <p className="font-semibold text-foreground">${loan.monthlyPayment}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                                  <p className="font-semibold text-foreground">{loan.interestRate}%</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Credit Score</p>
                                  <p className="font-semibold text-foreground">{loan.creditScore}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Risk Level</p>
                                  <Badge
                                    className={`bg-${loan.riskAssessment === "Low" ? "green" : loan.riskAssessment === "Medium" ? "yellow" : "red"}-100 text-${loan.riskAssessment === "Low" ? "green" : loan.riskAssessment === "Medium" ? "yellow" : "red"}-800`}
                                  >
                                    {loan.riskAssessment}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-muted-foreground">Funding Progress</span>
                                  <span className="text-sm text-foreground">{loan.fundingProgress.toFixed(1)}%</span>
                                </div>
                                <Progress 
                                  value={loan.fundingProgress} 
                                  className="h-2 dark:bg-muted/50"
                                  indicatorClassName="bg-[#E57700] dark:bg-orange-400 transition-colors duration-200"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>${loan.totalFunded.toLocaleString()} funded</span>
                                  <span>${loan.remainingAmount.toLocaleString()} remaining</span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="relative w-full">
                                  <Label htmlFor="investmentAmount" className="absolute left-3 top-2 text-xs text-muted-foreground">
                                    Investment Amount
                                  </Label>
                                  <div className="relative w-full">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
                                    <Input
                                      id="investmentAmount"
                                      type="number"
                                      value={investmentAmount}
                                      onChange={(e) => setInvestmentAmount(e.target.value)}
                                      className="pl-8 w-full h-10 text-lg"
                                      placeholder="0.00"
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <Button
                                    onClick={() => handleApproveLoan(loan.id, parseFloat(investmentAmount))}
                                    className="w-full h-10 text-lg bg-[#E57700] hover:bg-[#E57700]/90 text-white dark:bg-orange-400 dark:hover:bg-orange-500 transition-all duration-200"
                                  >
                                    Approve Loan
                                  </Button>
                                  <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Loan Applications</h3>
                      <p className="text-muted-foreground">
                        There are currently no loan applications available for review
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Active Investments Tab */}
            <TabsContent value="active" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Active Investments ({investorData.investments.length})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Monitor your current investments and returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {investorData.investments.length > 0 ? (
                    <div className="space-y-4">
                      {investorData.investments.map((investment) => {
                        const loan = state.loanApplications.find((l) => l.id === investment.loanId)
                        const driver = state.drivers.find((d) => d.id === loan?.driverId)
                        const vehicle = state.vehicles.find((v) => v.id === loan?.vehicleId)

                        return (
                          <Card key={investment.id} className="bg-muted border-border">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <Image
                                    src={vehicle?.image || "/placeholder.svg"}
                                    alt={vehicle?.name || "Vehicle"}
                                    width={60}
                                    height={45}
                                    className="rounded-lg object-cover"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-foreground">{vehicle?.name}</h4>
                                    <p className="text-sm text-muted-foreground">Driver: {driver?.name}</p>
                                    <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-foreground">
                                    ${investment.amount.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-green-500">
                                    +${(investment.monthlyReturn * investment.paymentsReceived).toFixed(2)} earned
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {investment.paymentsReceived}/{investment.totalPayments} payments
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4">
                                <Progress
                                  value={(investment.paymentsReceived / investment.totalPayments) * 100}
                                  className="h-2"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Active Investments</h3>
                      <p className="text-muted-foreground">
                        You haven't made any investments yet. Start by reviewing loan applications.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pending Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pending Fund Releases
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Release approved funds to drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  {investorData.pendingReleases.length > 0 ? (
                    <div className="space-y-4">
                      {investorData.pendingReleases.map((loan) => {
                        const approval = loan.investorApprovals.find(
                          (a) => a.investorId === currentInvestorId && a.status === "Approved",
                        )
                        const driver = state.drivers.find((d) => d.id === loan.driverId)
                        const vehicle = state.vehicles.find((v) => v.id === loan.vehicleId)

                        return (
                          <Card key={loan.id} className="bg-yellow-50 border-yellow-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <Image
                                    src={vehicle?.image || "/placeholder.svg"}
                                    alt={vehicle?.name || "Vehicle"}
                                    width={60}
                                    height={45}
                                    className="rounded-lg object-cover"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-yellow-900">{vehicle?.name}</h4>
                                    <p className="text-sm text-yellow-700">Driver: {driver?.name}</p>
                                    <p className="text-xs text-yellow-600">
                                      Approved: {new Date(approval?.approvedDate || "").toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right space-y-2">
                                  <p className="text-lg font-bold text-yellow-900">
                                    ${approval?.amount.toLocaleString()}
                                  </p>
                                  <Button
                                    onClick={() => handleReleaseFunds(loan.id)}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Release Funds
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Pending Releases</h3>
                      <p className="text-muted-foreground">All approved funds have been released to drivers</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <AdvancedAnalytics userRole="investor" userId={currentInvestorId} />
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              <RealTimeChat currentUserId={currentInvestorId} currentUserRole="investor" />
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <NotificationCenter userId={currentInvestorId} userRole="investor" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
