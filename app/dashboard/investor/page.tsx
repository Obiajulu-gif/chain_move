"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { RealTimeChat } from "@/components/dashboard/real-time-chat"
import { AdvancedAnalytics } from "@/components/dashboard/advanced-analytics"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { CurrencySwitcher } from "@/components/ui/currency-switcher"
import { usePlatform, useInvestorData } from "@/contexts/platform-context"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import { useRouter, useSearchParams } from "next/navigation"
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Send,
  Wallet,
  BarChart3,
  Search,
  PlusCircle,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"
import { VehicleCard } from "@/components/dashboard/investor/VehicleCard"
import { InvestmentModalEnhanced } from "@/components/dashboard/investment-modal-enhanced"

export default function InvestorDashboard() {
  const { state, dispatch, fetchData } = usePlatform()
  const { user: authUser, loading: authLoading, setUser } = useAuth()
  const currentInvestorId = authUser?.id || ""
  const { availableVehicles, ...investorData } = useInvestorData(currentInvestorId)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Currency hook
  const {
    selectedCurrency,
    setSelectedCurrency,
    exchangeRate,
    isLoadingRate,
    formatCurrency,
    convertAmount,
    getDisplayAmount,
    supportedCurrencies
  } = useCurrency('USD')

  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [isFunding, setIsFunding] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Add state for real-time balance - use authUser balance as primary source
  const [currentBalance, setCurrentBalance] = useState(authUser?.availableBalance || 0)
  const [totalInvested, setTotalInvested] = useState(authUser?.totalInvested || 0)

  // Function to refresh user data
  const refreshUserData = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/users/${currentInvestorId}`)
      if (response.ok) {
        const userData = await response.json()
        setCurrentBalance(userData.availableBalance || 0)
        setTotalInvested(userData.totalInvested || 0)

        // Update the auth user data
        if (setUser) {
          setUser({
            ...authUser,
            availableBalance: userData.availableBalance,
            totalInvested: userData.totalInvested,
            totalReturns: userData.totalReturns,
          })
        }

        // Update the platform context
        dispatch({
          type: "UPDATE_USER_BALANCE",
          payload: {
            userId: currentInvestorId,
            balance: userData.availableBalance,
          },
        })

        toast({
          title: "Data Updated",
          description: `Balance: $${userData.availableBalance?.toLocaleString() || 0} | Invested: $${userData.totalInvested?.toLocaleString() || 0}`,
        })
      } else {
        throw new Error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
      toast({
        title: "Refresh Failed",
        description: "Could not update data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Function to fetch investments
  const fetchInvestments = async () => {
    try {
      const response = await fetch(`/api/investments?investorId=${currentInvestorId}`)
      if (response.ok) {
        const investmentsData = await response.json()
        dispatch({
          type: "SET_INVESTMENTS",
          payload: investmentsData.investments || [],
        })
      }
    } catch (error) {
      console.error("Error fetching investments:", error)
    }
  }

  // Add a state to track if we're returning from payment
  const [isReturningFromPayment, setIsReturningFromPayment] = useState(false)

  // Update the useEffect that handles payment returns
  useEffect(() => {
    // Get the transaction reference from the URL
    const reference = searchParams.get("reference")
    const trxref = searchParams.get("trxref")

    // If a reference exists, it means the user just returned from a payment
    if (reference || trxref) {
      setIsReturningFromPayment(true)
      toast({
        title: "Processing Payment...",
        description: "Verifying your transaction. Your balance will update shortly.",
      })

      // Wait a moment for webhook processing, then refresh data
      setTimeout(() => {
        refreshUserData()
        setIsReturningFromPayment(false)
      }, 3000) // Wait 3 seconds for webhook to process

      // Clean up URL by removing the reference parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete("reference")
      newUrl.searchParams.delete("trxref")
      router.replace(newUrl.pathname + newUrl.search)
    }
  }, [searchParams, router])

  // Update local balance when authUser changes
  useEffect(() => {
    if (authUser?.availableBalance !== undefined) {
      setCurrentBalance(authUser.availableBalance)
    }
    if (authUser?.totalInvested !== undefined) {
      setTotalInvested(authUser.totalInvested)
    }
  }, [authUser?.availableBalance, authUser?.totalInvested])

  // Fetch investments when component mounts or user changes
  useEffect(() => {
    if (currentInvestorId) {
      fetchInvestments()
    }
  }, [currentInvestorId])

  // Set current user on mount
  useEffect(() => {
    if (authUser) {
      dispatch({
        type: "SET_CURRENT_USER",
        payload: {
          id: authUser.id,
          role: authUser.role as "investor",
          name: authUser.name,
          email: authUser.email,
          availableBalance: authUser.availableBalance,
        },
      })
    }
  }, [dispatch, authUser])

  const handleApproveLoan = (loanId, amount) => {
    if (!authUser || amount > currentBalance) {
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

    // Update local balance
    setCurrentBalance((prev) => prev - amount)

    toast({
      title: "Loan Approved",
      description: `You have approved $${amount.toLocaleString()} for this loan`,
    })
    setInvestmentAmount("")
  }

  const handleReleaseFunds = (loanId) => {
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

  // Update the handleInvestNow function
  const handleInvestNow = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsInvestDialogOpen(true)
  }

  // Update the submitInvestment function
  const submitInvestment = async (amount: number, term: number) => {
    if (!selectedVehicle || !currentInvestorId) {
      toast({
        title: "Error",
        description: "Missing investment details",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/invest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle._id,
          investorId: currentInvestorId,
          amount: amount,
          term: term,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Investment Successful",
          description: data.message,
        })

        // Refresh data
        await refreshUserData()
        await fetchInvestments()
        await fetchData()

        setIsInvestDialogOpen(false)
        setSelectedVehicle(null)
      } else {
        throw new Error(data.message || "Investment failed")
      }
    } catch (error) {
      toast({
        title: "Investment Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
    }
  }

  const handleFundWallet = async () => {
    setIsFunding(true)
    const amount = Number.parseFloat(depositAmount)

    if (!authUser?.email) {
      toast({
        title: "Authentication Error",
        description: "Could not find user email. Please log in again.",
        variant: "destructive",
      })
      setIsFunding(false)
      return
    }

    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" })
      setIsFunding(false)
      return
    }

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: depositAmount,
          email: authUser.email,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        // Close dialog before redirect
        setIsFundDialogOpen(false)
        setDepositAmount("")
        // Redirect to Paystack's payment page
        window.location.href = data.data.authorization_url
      } else {
        throw new Error(data.message || "Failed to initialize payment.")
      }
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    } finally {
      setIsFunding(false)
    }
  }

  const getStatusColor = (status) => {
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
  
  const monthlyIncome = investorData.investments
    .filter((inv) => inv.status === "Active")
    .reduce((sum, inv) => sum + inv.monthlyReturn, 0)
  
  // Calculate weekly income (monthly income divided by approximately 4.33 weeks per month)
  const weeklyIncome = monthlyIncome / 4.33

  // Get investments from the investorData hook for consistency
  const investments = investorData.investments || []
  const calculatedTotalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
  const displayTotalInvested = totalInvested > 0 ? totalInvested : calculatedTotalInvested
  
  // Calculate total returns based on actual investment data
  // Total returns = sum of (invested amount + ROI for each investment)
  const calculatedTotalReturns = investments.reduce((sum, inv) => {
    const investedAmount = inv.amount || 0
    const expectedROI = inv.expectedROI || 0
    const roiAmount = (investedAmount * expectedROI) / 100
    return sum + investedAmount + roiAmount
  }, 0)
  
  // Use calculated total returns instead of authUser.totalReturns
  const totalReturns = calculatedTotalReturns
  
  // const monthlyIncome = investorData.investments
  //   .filter((inv) => inv.status === "Active")
  //   .reduce((sum, inv) => sum + inv.monthlyReturn, 0)

  // Get investments from the investorData hook for consistency
  // const investments = investorData.investments || []
  // const calculatedTotalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0)
  // const displayTotalInvested = totalInvested > 0 ? totalInvested : calculatedTotalInvested

  // Update the loading condition
  if (authLoading || isReturningFromPayment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            {isReturningFromPayment ? "Processing Payment..." : "Loading..."}
          </h2>
          <p className="text-muted-foreground">
            {isReturningFromPayment
              ? "Please wait while we verify your transaction and update your balance."
              : "Please wait while we fetch your account information."}
          </p>
        </div>
      </div>
    )
  }

  // Update the access control check to be more lenient during payment processing
  if (!authUser || (authUser.role !== "investor" && !isReturningFromPayment)) {
    // Don't show access denied immediately if we're still loading auth or returning from payment
    if (authLoading || isReturningFromPayment) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your account information.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Updating Your Account</h2>
          <p className="text-muted-foreground">Please wait while we refresh your balance and account information.</p>
          <Button onClick={() => window.location.reload()} className="mt-4 mr-2" variant="outline">
            Refresh Page
          </Button>
          {/* <Button onClick={() => router.push("/signin")} className="mt-4">
            Sign In
          </Button> */}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Sidebar role="investor" className="md:w-64 lg:w-72" mobileWidth="w-64" />
        <div className="md:ml-64 lg:ml-72">
          <Header
            userName={authUser.name || "Investor"}
            userStatus="Verified Investor"
            notificationCount={unreadNotifications}
            className="md:pl-6 lg:pl-8"
          />

          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
            {/* Currency Switcher */}
            <Card className="bg-card/50 border-border/50">
              
              <CardContent>
                <CurrencySwitcher
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={setSelectedCurrency}
                  supportedCurrencies={supportedCurrencies}
                  exchangeRate={exchangeRate}
                  isLoadingRate={isLoadingRate}
                  baseCurrency="USD"
                  showExchangeRate={true}
                />
              </CardContent>
            </Card>

            {/* Real-time Portfolio Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshUserData}
                      disabled={isRefreshing}
                      className="h-6 w-6 p-0"
                    >
                      <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mr-4">{formatCurrency(currentBalance)}</div>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(currentBalance, 'USD')} USD
                    </p>
                  )}
                  <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Fund Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Fund Your Wallet</DialogTitle>
                        <DialogDescription>
                          Enter the amount you would like to deposit. You will be redirected to our secure payment
                          partner to complete the transaction.
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
                        <Button variant="outline" onClick={() => setIsFundDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleFundWallet}
                          disabled={isFunding}
                          className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                        >
                          {isFunding ? "Processing..." : "Proceed to Payment"}
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
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(displayTotalInvested)}</div>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(displayTotalInvested, 'USD')} USD
                    </p>
                  )}
                  <p className="text-xs text-blue-500 dark:text-blue-400">Active investments</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Returns</CardTitle>
                  <DollarSign className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(totalReturns)}</div>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(totalReturns, 'USD')} USD
                    </p>
                  )}
                  {/* <p className="text-xs text-green-500 dark:text-green-400">
                    +{totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : 0}% ROI
                  </p> */}
                </CardContent>
              </Card>

              <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                  <BarChart3 className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(monthlyIncome)}</div>
                  {selectedCurrency !== 'USD' && (
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(monthlyIncome, 'USD')} USD
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-sm font-medium text-muted-foreground">Weekly Income</p>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(weeklyIncome)}</p>
                    {selectedCurrency !== 'USD' && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(weeklyIncome, 'USD')} USD
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Expected income</p>
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
                    <CardTitle>My Active Investments ({investments.length})</CardTitle>
                    <CardDescription>Monitor your current investments and returns.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {investments.length > 0 ? (
                      <div className="space-y-4">
                        {investments.map((investment) => {
                          // Try to get vehicle directly from vehicleId, fallback to loan lookup
                          const vehicle = investment.vehicleId 
                            ? state.vehicles.find((v) => v._id === investment.vehicleId)
                            : (() => {
                                const loan = state.loanApplications.find((l) => l.id === investment.loanId)
                                return loan ? state.vehicles.find((v) => v._id === loan.vehicleId) : null
                              })()
                          return (
                            <Card key={investment.id || investment._id} className="bg-muted border-border">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <Image
                                      src={vehicle?.image || "/placeholder.svg"}
                                      alt={vehicle?.name || ""}
                                      width={60}
                                      height={45}
                                      className="rounded-lg object-cover"
                                    />
                                    <div>
                                      <h4 className="font-semibold text-foreground">{vehicle?.name}</h4>
                                      <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Started:{" "}
                                        {investment.date || investment.startDate
                                          ? new Date(investment.date || investment.startDate).toLocaleDateString()
                                          : "Recently"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-foreground">
                                      ${investment.amount.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-green-500">+{investment.expectedROI}% ROI</p>
                                    <p className="text-xs text-muted-foreground">
                                      ${investment.monthlyReturn?.toFixed(2)}/month
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>
                                      {investment.paymentsReceived || 0}/{investment.totalPayments || 12} payments
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      ((investment.paymentsReceived || 0) / (investment.totalPayments || 12)) * 100
                                    }
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
                        <h3 className="text-lg font-medium">No Active Investments</h3>
                        <p className="text-muted-foreground">Explore opportunities to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Investment Opportunities</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Browse available vehicles to fund and earn returns.
                    </CardDescription>
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
                          const driver = state.drivers?.find((d) => d.id === loan.driverId)
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

      {/* Enhanced Investment Modal */}
      <InvestmentModalEnhanced
        isOpen={isInvestDialogOpen}
        onClose={() => setIsInvestDialogOpen(false)}
        vehicle={selectedVehicle}
        availableBalance={currentBalance}
        onInvestmentComplete={submitInvestment}
      />
    </>
  )
}
