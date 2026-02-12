"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Loader2, Wallet } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { usePlatform, useInvestorData } from "@/contexts/platform-context"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatNaira, formatPercent } from "@/lib/currency"
import { DashboardRouteLoading } from "@/components/dashboard/dashboard-route-loading"

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

const MIN_TICKET = 25000

export default function InvestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { state, fetchData } = usePlatform()
  const { user: authUser, loading: authLoading } = useAuth()

  const investorId = authUser?.id || ""
  const investorName = getUserDisplayName(authUser, "Investor")
  const { availableVehicles } = useInvestorData(investorId)

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("")
  const [amountInput, setAmountInput] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedVehicle = useMemo(() => {
    return availableVehicles.find((vehicle) => vehicle._id === selectedVehicleId) as InvestmentVehicle | undefined
  }, [availableVehicles, selectedVehicleId])

  const amount = Number.parseFloat(amountInput)
  const availableBalance = authUser?.availableBalance || 0
  const amountIsValid = Number.isFinite(amount) && amount >= MIN_TICKET
  const hasSufficientBalance = amountIsValid && amount <= availableBalance

  const handleInvest = async () => {
    if (!authUser?.id || !selectedVehicle) {
      toast({
        title: "Choose a vehicle",
        description: "Select an opportunity before continuing.",
        variant: "destructive",
      })
      return
    }

    if (!amountIsValid) {
      toast({
        title: "Invalid amount",
        description: `Minimum ticket size is ${formatNaira(MIN_TICKET)}.`,
        variant: "destructive",
      })
      return
    }

    if (!hasSufficientBalance) {
      toast({
        title: "Insufficient balance",
        description: `You currently have ${formatNaira(availableBalance)} available.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
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

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || "Investment failed")
      }

      toast({
        title: "Investment submitted",
        description: `${formatNaira(amount)} deployed to ${selectedVehicle.name}.`,
      })

      setAmountInput("")
      setSelectedVehicleId("")
      await fetchData?.()
      router.push("/dashboard/investor")
    } catch (error) {
      toast({
        title: "Investment failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return <DashboardRouteLoading title="Loading invest flow" description="Preparing opportunities and wallet data." />
  }

  if (!authUser || authUser.role !== "investor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need an investor account to use this page.</CardDescription>
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
    <div className="min-h-screen bg-background">
      <Sidebar role="investor" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Investor" />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  Capital deployment
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Invest with confidence, {investorName}</h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Pick an opportunity, choose an amount, and confirm in one flow. All investments route through your
                  existing investor wallet.
                </p>
              </div>

              <Card className="w-full md:max-w-xs">
                <CardHeader className="pb-2">
                  <CardDescription>Available wallet balance</CardDescription>
                  <CardTitle className="text-xl">{formatNaira(availableBalance)}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Minimum ticket size: {formatNaira(MIN_TICKET)}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                title: "1. Select opportunity",
                copy: "Review open vehicle listings and ROI profile.",
              },
              {
                title: "2. Enter amount",
                copy: "Set your ticket size based on wallet liquidity.",
              },
              {
                title: "3. Confirm allocation",
                copy: "Submit and track performance from your dashboard.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.copy}</CardContent>
              </Card>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Open opportunities</CardTitle>
                <CardDescription>Select one listing to continue.</CardDescription>
              </CardHeader>
              <CardContent>
                {state.isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="rounded-xl border p-4">
                        <Skeleton className="mb-2 h-4 w-44" />
                        <Skeleton className="mb-2 h-3 w-28" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : availableVehicles.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <h3 className="font-semibold">No opportunities available</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Current listings are fully funded. Check back soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableVehicles.map((vehicle) => {
                      const fundedAmount = vehicle.totalFundedAmount || 0
                      const progress = vehicle.price > 0 ? (fundedAmount / vehicle.price) * 100 : 0
                      const isSelected = selectedVehicleId === vehicle._id

                      return (
                        <button
                          key={vehicle._id}
                          type="button"
                          className={`w-full rounded-xl border p-4 text-left transition-colors ${
                            isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                          }`}
                          onClick={() => setSelectedVehicleId(vehicle._id)}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-medium">{vehicle.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {vehicle.year} • {vehicle.type}
                              </p>
                            </div>
                            <Badge className="w-fit bg-emerald-600 text-white">{formatPercent(vehicle.roi)}</Badge>
                          </div>

                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Funding progress</span>
                              <span>{progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {vehicle.features.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment summary</CardTitle>
                <CardDescription>Confirm ticket size and deploy capital.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedVehicle ? (
                  <div className="rounded-xl border p-4">
                    <p className="font-medium">{selectedVehicle.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Target raise: {formatNaira(selectedVehicle.price)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Expected annual return: <span className="font-medium text-foreground">{formatPercent(selectedVehicle.roi)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    Select an opportunity to continue.
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="invest-amount">Amount (NGN)</Label>
                  <Input
                    id="invest-amount"
                    type="number"
                    inputMode="decimal"
                    value={amountInput}
                    onChange={(event) => setAmountInput(event.target.value)}
                    placeholder="25000"
                  />
                  <div className="space-y-1 text-xs">
                    <p className={amountIsValid ? "text-muted-foreground" : "text-destructive"}>
                      Minimum: {formatNaira(MIN_TICKET)}
                    </p>
                    <p className={hasSufficientBalance || !amountIsValid ? "text-muted-foreground" : "text-destructive"}>
                      Wallet balance: {formatNaira(availableBalance)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleInvest}
                  className="w-full bg-[#E57700] text-white hover:bg-[#E57700]/90"
                  disabled={isSubmitting || !selectedVehicle || !amountIsValid || !hasSufficientBalance}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing investment
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Invest now
                    </>
                  )}
                </Button>

                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/investor")}>
                  Back to dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  Investments are submitted to the existing backend flow and immediately reflected on your dashboard.
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
