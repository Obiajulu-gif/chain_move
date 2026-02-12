"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpRight, CheckCircle2, Coins, Loader2, PlusCircle, RefreshCw, Wallet } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { usePlatform, useInvestorData } from "@/contexts/platform-context"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatNaira, formatPercent } from "@/lib/currency"
import { DashboardRouteLoading } from "@/components/dashboard/dashboard-route-loading"

type DashboardInvestment = {
  _id?: string
  id?: string
  vehicleId: string
  amount: number
  monthlyReturn?: number
  status?: string
  paymentsReceived?: number
  totalPayments?: number
  date?: string
  startDate?: string
}

type InvestmentVehicle = {
  _id: string
  name: string
  type: string
  year: number
  price: number
  roi: number
  features: string[]
  totalFundedAmount?: number
}

export default function InvestorDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { state, dispatch, fetchData } = usePlatform()
  const { user: authUser, loading: authLoading, setUser } = useAuth()

  const investorId = authUser?.id || ""
  const investorName = getUserDisplayName(authUser, "Investor")
  const { availableVehicles, pendingReleases } = useInvestorData(investorId)

  const [investments, setInvestments] = useState<DashboardInvestment[]>([])
  const [investmentsError, setInvestmentsError] = useState<string | null>(null)
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(false)

  const [availableBalance, setAvailableBalance] = useState(authUser?.availableBalance || 0)
  const [totalInvested, setTotalInvested] = useState(authUser?.totalInvested || 0)
  const [totalReturns, setTotalReturns] = useState(authUser?.totalReturns || 0)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false)
  const [isFunding, setIsFunding] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")

  const [selectedVehicle, setSelectedVehicle] = useState<InvestmentVehicle | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false)
  const [isSubmittingInvestment, setIsSubmittingInvestment] = useState(false)

  const unreadNotifications = useMemo(() => {
    if (!investorId) return 0
    return state.notifications.filter((item) => item.userId === investorId && !item.read).length
  }, [investorId, state.notifications])

  const monthlyIncome = useMemo(() => {
    return investments
      .filter((item) => (item.status || "").toLowerCase() === "active")
      .reduce((sum, item) => sum + (item.monthlyReturn || 0), 0)
  }, [investments])

  const roi = useMemo(() => {
    if (totalInvested <= 0) return 0
    return (totalReturns / totalInvested) * 100
  }, [totalInvested, totalReturns])

  const vehicleById = useMemo(() => {
    const map = new Map<string, InvestmentVehicle>()
    state.vehicles.forEach((vehicle) => {
      map.set(vehicle._id, vehicle as InvestmentVehicle)
    })
    return map
  }, [state.vehicles])

  const refreshUserData = useCallback(async () => {
    if (!investorId) return

    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/users/${investorId}`)
      if (!response.ok) {
        throw new Error("Could not refresh account data")
      }

      const payload = await response.json()
      const nextBalance = payload.availableBalance || 0
      const nextTotalInvested = payload.totalInvested || 0
      const nextTotalReturns = payload.totalReturns || 0

      setAvailableBalance(nextBalance)
      setTotalInvested(nextTotalInvested)
      setTotalReturns(nextTotalReturns)

      setUser?.({
        ...authUser,
        availableBalance: nextBalance,
        totalInvested: nextTotalInvested,
        totalReturns: nextTotalReturns,
      })

      dispatch({
        type: "UPDATE_USER_BALANCE",
        payload: {
          userId: investorId,
          balance: nextBalance,
        },
      })

      toast({
        title: "Account refreshed",
        description: `Available balance: ${formatNaira(nextBalance)}`,
      })
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [authUser, dispatch, investorId, setUser, toast])

  const fetchInvestments = useCallback(async () => {
    if (!investorId) return

    setIsLoadingInvestments(true)
    setInvestmentsError(null)

    try {
      const response = await fetch(`/api/investments?investorId=${investorId}`)
      if (!response.ok) {
        throw new Error("Unable to load investments")
      }

      const payload = await response.json()
      const nextInvestments = payload.investments || []

      setInvestments(nextInvestments)
      dispatch({ type: "SET_INVESTMENTS", payload: nextInvestments })
    } catch (error) {
      setInvestmentsError(error instanceof Error ? error.message : "Unable to load investments")
    } finally {
      setIsLoadingInvestments(false)
    }
  }, [dispatch, investorId])

  const handleFundWallet = async () => {
    const amount = Number.parseFloat(depositAmount)

    if (!authUser?.email) {
      toast({
        title: "Authentication error",
        description: "Could not find your account email. Please sign in again.",
        variant: "destructive",
      })
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Enter a valid amount in Naira.",
        variant: "destructive",
      })
      return
    }

    setIsFunding(true)
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
      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment")
      }

      setDepositAmount("")
      setIsFundDialogOpen(false)
      window.location.href = data.data.authorization_url
    } catch (error) {
      toast({
        title: "Funding failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFunding(false)
    }
  }

  const submitInvestment = async () => {
    if (!authUser?.id || !selectedVehicle) return

    const amount = Number.parseFloat(investmentAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Enter a valid amount in Naira.",
        variant: "destructive",
      })
      return
    }

    if (amount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: `You can invest up to ${formatNaira(availableBalance)}.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmittingInvestment(true)
    try {
      const response = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicle._id,
          investorId: authUser.id,
          amount,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Investment failed")
      }

      toast({
        title: "Investment successful",
        description: `${formatNaira(amount)} invested in ${selectedVehicle.name}.`,
      })

      setAvailableBalance((prev) => Math.max(prev - amount, 0))
      setTotalInvested((prev) => prev + amount)
      setInvestmentAmount("")
      setSelectedVehicle(null)
      setIsInvestDialogOpen(false)

      await Promise.all([refreshUserData(), fetchInvestments(), fetchData?.()])
    } catch (error) {
      toast({
        title: "Investment failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingInvestment(false)
    }
  }

  useEffect(() => {
    if (authUser?.availableBalance !== undefined) setAvailableBalance(authUser.availableBalance)
    if (authUser?.totalInvested !== undefined) setTotalInvested(authUser.totalInvested)
    if (authUser?.totalReturns !== undefined) setTotalReturns(authUser.totalReturns)
  }, [authUser])

  useEffect(() => {
    if (!authUser || !investorId) return

    dispatch({
      type: "SET_CURRENT_USER",
      payload: {
        id: authUser.id,
        role: "investor",
        name: investorName,
        email: authUser.email || "",
        status: "Active",
        joinedDate: new Date().toISOString(),
        availableBalance,
        totalInvested,
        totalReturns,
      },
    })
  }, [authUser, availableBalance, dispatch, investorId, investorName, totalInvested, totalReturns])

  useEffect(() => {
    if (investorId) {
      fetchInvestments()
    }
  }, [fetchInvestments, investorId])

  useEffect(() => {
    const paymentReference = searchParams.get("reference")
    if (!paymentReference) return

    toast({
      title: "Verifying payment",
      description: "Checking your transaction and refreshing wallet balance.",
    })

    const timerId = window.setTimeout(() => {
      refreshUserData()
    }, 3000)

    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.delete("reference")
    router.replace(nextUrl.pathname + nextUrl.search)

    return () => window.clearTimeout(timerId)
  }, [refreshUserData, router, searchParams, toast])

  if (authLoading) {
    return <DashboardRouteLoading title="Loading investor dashboard" description="Preparing your portfolio data." />
  }

  if (!authUser || authUser.role !== "investor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need an investor account to access this dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Sidebar role="investor" />

        <div className="md:ml-64 lg:ml-72">
          <Header userStatus="Verified Investor" notificationCount={unreadNotifications} />

          <main className="space-y-6 p-4 sm:p-6 lg:p-8">
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    Investor workspace
                  </Badge>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {investorName}</h1>
                  <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Manage liquidity, deploy capital into vehicle opportunities, and track return performance from one
                    place.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" onClick={refreshUserData} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>

                  <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Fund Wallet
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Fund your wallet</DialogTitle>
                        <DialogDescription>
                          Add capital to your wallet. You will be redirected to complete payment securely.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-2 py-1">
                        <Label htmlFor="wallet-fund-amount">Amount (NGN)</Label>
                        <Input
                          id="wallet-fund-amount"
                          type="number"
                          inputMode="decimal"
                          placeholder="50000"
                          value={depositAmount}
                          onChange={(event) => setDepositAmount(event.target.value)}
                        />
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFundDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleFundWallet} disabled={isFunding} className="bg-[#E57700] text-white">
                          {isFunding ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing
                            </>
                          ) : (
                            "Continue to payment"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Available Balance</CardDescription>
                  <CardTitle>{formatNaira(availableBalance)}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Capital ready for deployment</CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Invested</CardDescription>
                  <CardTitle>{formatNaira(totalInvested)}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">Current active principal</CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Returns</CardDescription>
                  <CardTitle>{formatNaira(totalReturns)}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-green-600">Portfolio ROI: {formatPercent(roi)}</CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Projected Monthly Returns</CardDescription>
                  <CardTitle>{formatNaira(monthlyIncome)}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">From active positions</CardContent>
              </Card>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Portfolio activity</CardTitle>
                    <CardDescription>Recent investments and payout progress.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={fetchInvestments} disabled={isLoadingInvestments}>
                    <RefreshCw className={`h-4 w-4 ${isLoadingInvestments ? "animate-spin" : ""}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoadingInvestments ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-xl border p-4">
                          <Skeleton className="mb-2 h-4 w-40" />
                          <Skeleton className="mb-3 h-3 w-28" />
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : investmentsError ? (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
                      <p className="font-medium text-destructive">Unable to load investments</p>
                      <p className="mt-1 text-sm text-muted-foreground">{investmentsError}</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={fetchInvestments}>
                        Retry
                      </Button>
                    </div>
                  ) : investments.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                      <Wallet className="mx-auto h-9 w-9 text-muted-foreground" />
                      <h3 className="mt-3 font-semibold">No investments yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Fund your wallet and pick an open vehicle opportunity to start.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {investments.slice(0, 8).map((investment) => {
                        const vehicle = vehicleById.get(investment.vehicleId)
                        const progress =
                          (investment.totalPayments || 0) > 0
                            ? ((investment.paymentsReceived || 0) / (investment.totalPayments || 1)) * 100
                            : 0

                        return (
                          <div key={investment._id || investment.id} className="rounded-xl border p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold">{vehicle?.name || "Vehicle investment"}</p>
                                <p className="text-sm text-muted-foreground">
                                  Started {new Date(investment.date || investment.startDate || Date.now()).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="font-semibold">{formatNaira(investment.amount)}</p>
                                <p className="text-xs text-green-600">
                                  Monthly return: {formatNaira(investment.monthlyReturn || 0)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Payout progress</span>
                                <span>
                                  {investment.paymentsReceived || 0}/{investment.totalPayments || 0}
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending approvals</CardTitle>
                  <CardDescription>Loan commitments waiting for release.</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingReleases.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                      <CheckCircle2 className="mx-auto h-9 w-9 text-muted-foreground" />
                      <h3 className="mt-3 font-semibold">All clear</h3>
                      <p className="mt-1 text-sm text-muted-foreground">No pending fund release approvals right now.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingReleases.map((loan) => {
                        const approval = loan.investorApprovals?.find(
                          (item) => item.investorId === investorId && item.status === "Approved",
                        )
                        const vehicle = state.vehicles.find((item) => item._id === loan.vehicleId)

                        return (
                          <div key={loan.id} className="rounded-xl border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium">{vehicle?.name || "Vehicle loan"}</p>
                                <p className="text-xs text-muted-foreground">
                                  Approved on{" "}
                                  {new Date(approval?.approvedDate || Date.now()).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatNaira(approval?.amount || 0)}</p>
                                <Badge variant="secondary">Approved</Badge>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Open opportunities</h2>
                  <p className="text-sm text-muted-foreground">Review currently fundable vehicles and deploy capital.</p>
                </div>
                <Button variant="outline" onClick={() => router.push("/dashboard/investor/dao")}>
                  <Coins className="mr-2 h-4 w-4" />
                  Open DAO Governance
                </Button>
              </div>

              {state.isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : availableVehicles.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <h3 className="font-semibold">No open opportunities</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      All listed vehicles are currently funded. Check back shortly for new listings.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {availableVehicles.map((vehicle) => {
                    const fundedAmount = vehicle.totalFundedAmount || 0
                    const progress = vehicle.price > 0 ? (fundedAmount / vehicle.price) * 100 : 0

                    return (
                      <Card key={vehicle._id} className="flex h-full flex-col">
                        <CardHeader className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <CardTitle className="text-base">{vehicle.name}</CardTitle>
                              <CardDescription>
                                {vehicle.year} • {vehicle.type}
                              </CardDescription>
                            </div>
                            <Badge className="bg-emerald-600 text-white">{formatPercent(vehicle.roi)}</Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="flex flex-1 flex-col gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target</span>
                              <span className="font-medium">{formatNaira(vehicle.price)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Funded</span>
                              <span className="font-medium">{formatNaira(fundedAmount)}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Funding progress</span>
                                <span>{progress.toFixed(0)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {vehicle.features.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            className="mt-auto bg-[#E57700] text-white hover:bg-[#E57700]/90"
                            onClick={() => {
                              setSelectedVehicle(vehicle as InvestmentVehicle)
                              setIsInvestDialogOpen(true)
                            }}
                          >
                            Invest now
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in {selectedVehicle?.name || "vehicle"}</DialogTitle>
            <DialogDescription>
              Enter your preferred amount. Available balance: {formatNaira(availableBalance)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-1">
            <Label htmlFor="investment-amount">Investment amount (NGN)</Label>
            <Input
              id="investment-amount"
              type="number"
              inputMode="decimal"
              placeholder="100000"
              value={investmentAmount}
              onChange={(event) => setInvestmentAmount(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvestDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitInvestment}
              disabled={isSubmittingInvestment}
              className="bg-[#E57700] text-white hover:bg-[#E57700]/90"
            >
              {isSubmittingInvestment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Confirm investment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
