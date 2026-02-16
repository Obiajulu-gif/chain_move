"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ArrowRight, ChevronRight, Layers, RefreshCw, Wallet } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardRouteLoading } from "@/components/dashboard/dashboard-route-loading"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { formatNaira } from "@/lib/currency"

const InvestorWalletPanel = dynamic(
  () => import("@/components/dashboard/investor-wallet-panel").then((module) => module.InvestorWalletPanel),
  {
    loading: () => (
      <Card id="wallet">
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    ),
  },
)

type PoolPreview = {
  id: string
  assetType: "SHUTTLE" | "KEKE"
  targetAmountNgn: number
  currentRaisedNgn: number
  investorCount: number
  status: "OPEN" | "FUNDED" | "CLOSED"
  progressRatio: number
}

export default function InvestorOverviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser, loading: authLoading, refetch } = useAuth()

  const [openPools, setOpenPools] = useState<PoolPreview[]>([])
  const [isPoolsLoading, setIsPoolsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const investorName = getUserDisplayName(authUser, "Investor")

  const loadOpenPools = useCallback(async () => {
    setIsPoolsLoading(true)
    try {
      const response = await fetch("/api/pools?status=OPEN")
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || "Unable to load opportunities.")
      }
      setOpenPools((payload.pools || []).slice(0, 4))
    } catch (error) {
      toast({
        title: "Unable to load opportunities",
        description: error instanceof Error ? error.message : "Try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsPoolsLoading(false)
    }
  }, [toast])

  const refreshOverview = async () => {
    setIsRefreshing(true)
    await Promise.all([loadOpenPools(), refetch?.()])
    setIsRefreshing(false)
  }

  useEffect(() => {
    void loadOpenPools()
  }, [loadOpenPools])

  const keyStats = useMemo(() => {
    return [
      {
        label: "Internal balance",
        value: formatNaira(authUser?.availableBalance || 0),
        hint: "Available for pool investments",
      },
      {
        label: "Total invested",
        value: formatNaira(authUser?.totalInvested || 0),
        hint: "Lifetime investor capital deployed",
      },
      {
        label: "Total returns",
        value: formatNaira(authUser?.totalReturns || 0),
        hint: "Recorded returns to date",
      },
    ]
  }, [authUser?.availableBalance, authUser?.totalInvested, authUser?.totalReturns])

  if (authLoading) {
    return <DashboardRouteLoading title="Loading investor overview" description="Preparing wallet and opportunity data." />
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
    <div className="min-h-screen bg-background">
      <Sidebar role="investor" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Investor" />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  Overview
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {investorName}</h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Monitor your internal wallet, fund your account, and deploy capital into fractional mobility pools.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={refreshOverview} disabled={isRefreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  className="bg-[#E57700] text-white hover:bg-[#E57700]/90"
                  onClick={() => router.push("/dashboard/investor/opportunities")}
                >
                  Open opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {keyStats.map((item) => (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle>{item.value}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">{item.hint}</CardContent>
              </Card>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5 text-[#E57700]" />
                  Open opportunities snapshot
                </CardTitle>
                <CardDescription>Latest pool opportunities with live funding progress.</CardDescription>
              </CardHeader>
              <CardContent>
                {isPoolsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="rounded-xl border p-4">
                        <Skeleton className="mb-2 h-5 w-36" />
                        <Skeleton className="mb-2 h-4 w-52" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : openPools.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <h3 className="font-semibold">No open pools</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create one from Open opportunities to begin funding.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {openPools.map((pool) => {
                      const progress = Math.min(pool.progressRatio * 100, 100)
                      return (
                        <div key={pool.id} className="rounded-xl border p-4">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <p className="font-semibold">{pool.assetType}</p>
                            <Badge variant="secondary">{pool.investorCount} investors</Badge>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Raised</span>
                              <span>{formatNaira(pool.currentRaisedNgn)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Target</span>
                              <span>{formatNaira(pool.targetAmountNgn)}</span>
                            </div>
                          </div>

                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Funding progress</span>
                              <span>{progress.toFixed(1)}%</span>
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
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5 text-[#E57700]" />
                  Wallet quick actions
                </CardTitle>
                <CardDescription>Fund and manage your wallet from one place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full bg-[#E57700] text-white hover:bg-[#E57700]/90"
                  onClick={() => router.push("/dashboard/investor#wallet")}
                >
                  Open wallet funding
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/investor/opportunities")}>
                  Invest in pools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </section>

          <InvestorWalletPanel sectionId="wallet" />
        </main>
      </div>
    </div>
  )
}
