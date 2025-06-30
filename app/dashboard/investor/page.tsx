"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger  } from "@/components/ui/dialog"
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
  Search,
  PlusCircle
} from "lucide-react"
import Image from "next/image"


import { VehicleCard } from "@/components/dashboard/investor/VehicleCard"

export default function InvestorDashboard() {
  const { state, dispatch } = usePlatform()
  const [currentInvestorId] = useState("investor1") // In real app, get from auth
  const { availableVehicles, ...investorData } = useInvestorData(currentInvestorId)
  const { toast } = useToast()

  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isFunding, setIsFunding] = useState(false);

  // Set current user on mount
  useEffect(() => {
    if (investorData.investor) {
      dispatch({
        type: "SET_CURRENT_USER",
        payload: { id: currentInvestorId, role: "investor", name: investorData.investor.name },
      })
    }
  }, [dispatch, currentInvestorId, investorData.investor])
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
  const handleInvestNow = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsInvestDialogOpen(true)
  }

  const submitInvestment = () => {
    const amount = parseFloat(investmentAmount)
    if (!selectedVehicle || isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount to invest.", variant: "destructive" })
      return
    }

    const availableBalance = investorData.investor?.availableBalance || 0;

    if (amount > availableBalance) {
      toast({
        title: "Insufficient Funds",
        description: `Your investment of $${amount.toLocaleString()} exceeds your available balance of $${availableBalance.toLocaleString()}.`,
        variant: "destructive"
      })
      return;
    }
    // Here you would call the POST /api/invest endpoint
    console.log(`Investing $${amount} in vehicle ${selectedVehicle._id}`)
    toast({ title: "Investment Submitted", description: `Your investment of $${amount.toLocaleString()} for ${selectedVehicle.name} is being processed.` })

    // Close dialog and reset state
    setIsInvestDialogOpen(false)
    setSelectedVehicle(null)
    setInvestmentAmount("")
  }
  const handleFundWallet = async () => {
    setIsFunding(true);
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      setIsFunding(false);
      return;
    }

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositAmount,
          email: state.currentUser?.email, // Get email from context
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Paystack's payment page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error(data.message || 'Failed to initialize payment.');
      }
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
      setIsFunding(false);
    }
  };

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

  const unreadNotifications = state.notifications.filter((n) => n.userId === currentInvestorId && !n.read).length
  const totalInvested = investorData.investor?.totalInvested || 0
  const totalReturns = investorData.investor?.totalReturns || 0
  const monthlyIncome = investorData.investments
    .filter((inv) => inv.status === "Active")
    .reduce((sum, inv) => sum + inv.monthlyReturn, 0)

  return (
    <>
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
                <CardContent>
                  {/* ... Balance display ... */}
                  {/* --- MODIFIED BUTTON TO OPEN DIALOG --- */}
                  <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Fund Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Fund Your Wallet</DialogTitle>
                        <DialogDescription>
                          Enter the amount you would like to deposit. You will be redirected to our secure payment partner to complete the transaction.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="deposit-amount">Amount (NGN)</Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="e.g., 50000"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFundDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleFundWallet} disabled={isFunding} className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                          {isFunding ? 'Processing...' : 'Proceed to Payment'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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

            {/* Main Content Tabs */}
            <Tabs defaultValue="investments" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                <TabsTrigger value="investments">My Investments</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              {/* Investments Tab */}
              <TabsContent value="investments" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">
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

              <TabsContent value="opportunities" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Investment Opportunities</CardTitle>
                    <CardDescription className="text-muted-foreground">Browse available vehicles to fund and earn returns.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {availableVehicles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {availableVehicles.map((vehicle) => (
                          <VehicleCard key={vehicle._id} vehicle={vehicle} onInvest={handleInvestNow} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Opportunities Available</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          There are currently no new vehicles available for investment. Please check back later.
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
                    <CardDescription className="text-muted-foreground">
                      Release approved funds to drivers
                    </CardDescription>
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

      <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in {selectedVehicle?.name}</DialogTitle>
            <DialogDescription>
              Enter the amount you would like to invest in this vehicle. The total funding goal is ${selectedVehicle?.price.toLocaleString()}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="investment-amount">Investment Amount ($)</Label>
            <Input
              id="investment-amount"
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="e.g., 5000"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvestDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitInvestment} className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">Confirm Investment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

