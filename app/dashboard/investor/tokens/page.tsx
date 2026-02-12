"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Coins, RefreshCw, ShieldCheck, Vote, Wallet } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { formatNaira } from "@/lib/currency"

type TokenInvestment = {
  _id?: string
  id?: string
  amount: number
  monthlyReturn?: number
  date?: string
  startDate?: string
  status?: string
}

const TOKEN_SYMBOL = "CHMV"
const TOKEN_PRICE_NGN = 125

export default function GovernanceTokensPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()

  const [investments, setInvestments] = useState<TokenInvestment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const investorId = authUser?.id || ""
  const investorName = getUserDisplayName(authUser, "Investor")

  const fetchInvestments = useCallback(async () => {
    if (!investorId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/investments?investorId=${investorId}`)
      if (!response.ok) {
        throw new Error("Unable to load token activity")
      }

      const payload = await response.json()
      setInvestments(payload.investments || [])
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load token activity")
    } finally {
      setLoading(false)
    }
  }, [investorId])

  useEffect(() => {
    if (investorId) {
      fetchInvestments()
    }
  }, [fetchInvestments, investorId])

  const tokenStats = useMemo(() => {
    const totalInvested = investments.reduce((sum, item) => sum + item.amount, 0)
    const generatedTokens = Math.max(0, Math.round(totalInvested / 1000))
    const baseTokens = 250
    const totalTokens = baseTokens + generatedTokens
    const stakedTokens = Math.round(totalTokens * 0.4)
    const availableTokens = totalTokens - stakedTokens
    const pendingRewardTokens = Math.round(
      investments
        .filter((item) => (item.status || "active").toLowerCase() === "active")
        .reduce((sum, item) => sum + (item.monthlyReturn || 0), 0) /
        TOKEN_PRICE_NGN,
    )

    return {
      totalTokens,
      stakedTokens,
      availableTokens,
      pendingRewardTokens,
    }
  }, [investments])

  const tokenValue = useMemo(() => {
    return {
      total: tokenStats.totalTokens * TOKEN_PRICE_NGN,
      staked: tokenStats.stakedTokens * TOKEN_PRICE_NGN,
      available: tokenStats.availableTokens * TOKEN_PRICE_NGN,
      rewards: tokenStats.pendingRewardTokens * TOKEN_PRICE_NGN,
    }
  }, [tokenStats])

  const votingPower = useMemo(() => {
    const governanceSupply = 100000
    return ((tokenStats.totalTokens / governanceSupply) * 100).toFixed(2)
  }, [tokenStats.totalTokens])

  const recentActivity = useMemo(() => {
    return investments.slice(0, 6).map((investment) => {
      const rewardTokens = Math.round((investment.monthlyReturn || 0) / TOKEN_PRICE_NGN)
      return {
        id: investment._id || investment.id || `${investment.amount}-${investment.date}`,
        title: "Monthly reward accrual",
        date: new Date(investment.date || investment.startDate || Date.now()).toLocaleDateString(),
        tokenDelta: rewardTokens,
        nairaValue: rewardTokens * TOKEN_PRICE_NGN,
      }
    })
  }, [investments])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading token dashboard...</p>
      </div>
    )
  }

  if (!authUser || authUser.role !== "investor") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need an investor account to view governance tokens.</CardDescription>
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
        <Header userName={investorName} userStatus="Verified Investor" />

        <main className="p-4 sm:p-6 space-y-6">
          <section className="rounded-xl border bg-card p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Governance Tokens</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor your token balance, staking position, and governance influence.
                </p>
              </div>

              <Button variant="outline" onClick={fetchInvestments} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Tokens</CardDescription>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  {tokenStats.totalTokens.toLocaleString()} {TOKEN_SYMBOL}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Value: {formatNaira(tokenValue.total)}</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Staked</CardDescription>
                <CardTitle>{tokenStats.stakedTokens.toLocaleString()} {TOKEN_SYMBOL}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Value: {formatNaira(tokenValue.staked)}</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Available</CardDescription>
                <CardTitle>{tokenStats.availableTokens.toLocaleString()} {TOKEN_SYMBOL}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Value: {formatNaira(tokenValue.available)}</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Voting Power</CardDescription>
                <CardTitle>{votingPower}%</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Estimated governance share</CardContent>
            </Card>
          </section>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Token Portfolio Value
                  </CardTitle>
                  <CardDescription>All monetary values are shown in Naira (NGN).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-xl font-semibold">{formatNaira(tokenValue.total)}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Pending Rewards</p>
                      <p className="text-xl font-semibold">{formatNaira(tokenValue.rewards)}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Governance Readiness</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span>Voting eligibility</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      Keep at least 100 {TOKEN_SYMBOL} available to submit proposals.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staking">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Vote className="h-5 w-5" />
                    Staking Position
                  </CardTitle>
                  <CardDescription>Track staked tokens and their estimated fiat value.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Staked ratio</span>
                    <span>{Math.round((tokenStats.stakedTokens / Math.max(tokenStats.totalTokens, 1)) * 100)}%</span>
                  </div>
                  <Progress value={(tokenStats.stakedTokens / Math.max(tokenStats.totalTokens, 1)) * 100} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Staked Value</p>
                      <p className="text-lg font-semibold">{formatNaira(tokenValue.staked)}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Claimable Rewards</p>
                      <p className="text-lg font-semibold">{formatNaira(tokenValue.rewards)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Token Activity</CardTitle>
                  <CardDescription>Derived from your investment return activity.</CardDescription>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
                      <p className="font-medium text-destructive">Failed to load activity</p>
                      <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                  ) : loading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading token activity...</div>
                  ) : recentActivity.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No token activity yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <article key={activity.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>

                            <div className="text-right">
                              <p className="font-medium text-green-600">+{activity.tokenDelta} {TOKEN_SYMBOL}</p>
                              <p className="text-xs text-muted-foreground">{formatNaira(activity.nairaValue)}</p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
