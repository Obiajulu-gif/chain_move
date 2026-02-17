import Link from "next/link"
import { redirect } from "next/navigation"
import { CalendarDays, RefreshCw } from "lucide-react"

import { getSessionFromCookies } from "@/lib/auth/session"
import dbConnect from "@/lib/dbConnect"
import { formatNaira, formatPercent } from "@/lib/currency"
import User from "@/models/User"
import { MetricsRow, type OverviewMetricItem } from "@/components/dashboard/investor-overview/metrics-row"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAdminDashboardAnalytics, parseAdminAnalyticsRange, type AdminAnalyticsRange } from "@/src/server/analytics/adminAnalytics"

export const dynamic = "force-dynamic"

interface AdminDashboardPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const RANGE_OPTIONS: Array<{ value: AdminAnalyticsRange; label: string }> = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
]

function formatCount(value: number) {
  return new Intl.NumberFormat("en-NG").format(value)
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateOnly(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function truncatePrivyId(privyUserId: string | null) {
  if (!privyUserId) return "Not linked"
  if (privyUserId.length <= 16) return privyUserId
  return `${privyUserId.slice(0, 8)}...${privyUserId.slice(-6)}`
}

function resolveRangeFromSearchParams(rawRange: string | string[] | undefined) {
  if (Array.isArray(rawRange)) {
    return parseAdminAnalyticsRange(rawRange[0])
  }

  return parseAdminAnalyticsRange(rawRange)
}

async function ensureAdminAccess() {
  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect("/signin")
  }

  await dbConnect()
  const user = await User.findById(session.userId).select("role")
  if (!user || user.role !== "admin") {
    redirect("/signin")
  }
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const resolvedSearchParams = (await searchParams) || {}
  const range = resolveRangeFromSearchParams(resolvedSearchParams.range)

  await ensureAdminAccess()

  const analytics = await getAdminDashboardAnalytics({ range })
  const selectedRangeLabel = RANGE_OPTIONS.find((option) => option.value === analytics.range)?.label || "Last 30 Days"

  const metrics: OverviewMetricItem[] = [
    {
      id: "total-users",
      label: "Total Users",
      value: formatCount(analytics.totals.totalUsers),
      hint: `${formatCount(analytics.totals.privyMappedUsers)} users mapped from Privy.`,
    },
    {
      id: "verified-users",
      label: "Verified Users",
      value: formatCount(analytics.totals.verifiedUsers),
      hint: "Users with approved or completed verification status.",
    },
    {
      id: "total-deposits",
      label: "Total Deposits",
      value: formatNaira(analytics.totals.totalDepositsNgn),
      hint: "Successful Paystack and wallet-funding deposits.",
    },
    {
      id: "total-invested",
      label: "Total Invested",
      value: formatNaira(analytics.totals.totalInvestedNgn),
      hint: "Confirmed investment amounts across pools and assets.",
    },
    {
      id: "total-returns",
      label: "Total Returns Paid",
      value: formatNaira(analytics.totals.totalReturnsPaidNgn),
      hint: "Completed return/payout transactions.",
    },
    {
      id: "active-pools",
      label: "Active Pools",
      value: formatCount(analytics.totals.activePoolsCount),
      hint: "Open + funded pools currently in circulation.",
    },
    {
      id: "open-opportunities",
      label: "Open Opportunities",
      value: formatCount(analytics.totals.openPoolsCount),
      hint: `Funded pools: ${formatCount(analytics.totals.fundedPoolsCount)}.`,
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <section className="rounded-[10px] border border-border/70 bg-card px-4 py-4 md:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">Admin Dashboard</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Platform overview and performance.</p>
            <p className="mt-1 text-xs text-muted-foreground">Updated {formatDateTime(analytics.generatedAt)}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {selectedRangeLabel}
            </div>
            <Button asChild variant="outline" className="h-9">
              <Link href={analytics.range === "all" ? "/dashboard/admin" : `/dashboard/admin?range=${analytics.range}`}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((option) => {
            const href = option.value === "all" ? "/dashboard/admin" : `/dashboard/admin?range=${option.value}`
            const isActive = option.value === analytics.range
            return (
              <Button key={option.value} asChild variant={isActive ? "default" : "outline"} size="sm">
                <Link href={href}>{option.label}</Link>
              </Button>
            )
          })}
        </div>
      </section>

      <MetricsRow metrics={metrics} />

      {analytics.notes.length > 0 ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
          {analytics.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Platform Activity</CardTitle>
            <CardDescription>Recent users, deposits, and investments across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.platformActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity found for this period.</p>
            ) : (
              <div className="space-y-3">
                {analytics.platformActivity.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border/70 px-3 py-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {item.kind}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.timestamp)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Key Breakdowns</CardTitle>
            <CardDescription>Deposits and pool performance summaries.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Deposits Breakdown</h3>
              <div className="mt-2 space-y-2">
                {analytics.breakdowns.depositMethods.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No successful deposits in this period.</p>
                ) : (
                  analytics.breakdowns.depositMethods.map((method) => (
                    <div key={method.method} className="rounded-lg border border-border/70 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-foreground">{method.method}</p>
                        <p className="text-sm font-semibold text-foreground">{formatNaira(method.totalAmountNgn)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatCount(method.count)} successful transactions</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Pools Summary</h3>
              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Open</span>
                  <span>{formatCount(analytics.breakdowns.pools.openPoolsCount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Funded</span>
                  <span>{formatCount(analytics.breakdowns.pools.fundedPoolsCount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Closed</span>
                  <span>{formatCount(analytics.breakdowns.pools.closedPoolsCount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Raised</span>
                  <span>{formatNaira(analytics.breakdowns.pools.totalRaisedAcrossPoolsNgn)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">Top Assets</h3>
              <div className="mt-2 space-y-2">
                {analytics.breakdowns.topAssets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No assets available in this period.</p>
                ) : (
                  analytics.breakdowns.topAssets.map((asset) => (
                    <div key={asset.assetType} className="rounded-lg border border-border/70 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{asset.assetType}</p>
                        <p className="text-xs text-muted-foreground">{formatCount(asset.poolsCount)} pools</p>
                      </div>
                      <p className="text-sm text-foreground">{formatNaira(asset.raisedNgn)}</p>
                      <p className="text-xs text-muted-foreground">
                        Progress: {formatPercent(asset.progressRatio * 100, 1)} | Investors: {formatCount(asset.investorCount)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
            <CardDescription>Newest internal user records mapped from auth flow.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email / Privy ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recent.users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No users found for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.recent.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{user.email || "No email"}</p>
                          <p className="text-muted-foreground">{truncatePrivyId(user.privyUserId)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="text-right text-xs">{formatDateOnly(user.createdAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Deposits</CardTitle>
            <CardDescription>Latest successful wallet funding transactions.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recent.deposits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No deposits found for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.recent.deposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium text-foreground">{deposit.userName}</p>
                          <p className="text-muted-foreground">{deposit.userEmail || "No email"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{deposit.method}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{deposit.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{formatDateOnly(deposit.timestamp)}</TableCell>
                      <TableCell className="text-right font-medium">{formatNaira(deposit.amountNgn)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Investments</CardTitle>
            <CardDescription>Latest investment activity across pools and legacy assets.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Ownership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recent.investments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No investments found for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.recent.investments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium text-foreground">{investment.userName}</p>
                          <p className="text-muted-foreground">{investment.userEmail || "No email"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{investment.assetLabel}</TableCell>
                      <TableCell className="text-xs">
                        {investment.ownershipBps === null ? "N/A" : formatPercent(investment.ownershipBps / 100, 2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={investment.status.toUpperCase() === "CONFIRMED" ? "default" : "secondary"}>
                          {investment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{formatDateOnly(investment.timestamp)}</TableCell>
                      <TableCell className="text-right font-medium">{formatNaira(investment.amountNgn)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
