import Link from "next/link"
import { redirect } from "next/navigation"
import { Calendar, Receipt, Wallet } from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/investor-overview/dashboard-header"
import { DriverPaymentsTable } from "@/components/dashboard/driver-hire-purchase/driver-payments-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"
import dbConnect from "@/lib/dbConnect"
import { getSessionFromCookies } from "@/lib/auth/session"
import { getDriverContract, getDriverPayments } from "@/lib/services/driver-contracts.service"
import User from "@/models/User"

export const dynamic = "force-dynamic"

type PaymentRange = "30d" | "90d" | "all"

interface PaymentsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const RANGE_OPTIONS: Array<{ value: PaymentRange; label: string }> = [
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "all", label: "All Time" },
]

function resolveDisplayName(user: { fullName?: string; name?: string; email?: string | null }) {
  if (user.fullName && user.fullName.trim()) return user.fullName.trim()
  if (user.name && user.name.trim()) return user.name.trim()
  if (user.email) return user.email.split("@")[0]
  return "Driver"
}

function resolveRange(rawRange: string | string[] | undefined): PaymentRange {
  const value = Array.isArray(rawRange) ? rawRange[0] : rawRange
  if (value === "90d" || value === "all") return value
  return "30d"
}

function getStartDate(range: PaymentRange) {
  if (range === "all") return null
  const now = new Date()
  const startDate = new Date(now)
  const days = range === "90d" ? 90 : 30
  startDate.setDate(startDate.getDate() - days)
  return startDate
}

export default async function DriverPaymentsPage({ searchParams }: PaymentsPageProps) {
  const resolvedSearchParams = (await searchParams) || {}
  const range = resolveRange(resolvedSearchParams.range)
  const startDate = getStartDate(range)

  const session = await getSessionFromCookies()
  if (!session?.userId) {
    redirect("/signin")
  }

  await dbConnect()
  const user = await User.findById(session.userId)
    .select("name fullName email role")

  if (!user || user.role !== "driver") {
    redirect("/signin")
  }

  const contract = await getDriverContract(user._id.toString())
  const payments = await getDriverPayments({
    driverUserId: user._id.toString(),
    contractId: contract?.id,
    limit: 120,
    startDate,
  })

  const totalPaidNgn = payments
    .filter((payment) => payment.status === "CONFIRMED")
    .reduce((sum, payment) => sum + payment.appliedAmountNgn, 0)
  const confirmedCount = payments.filter((payment) => payment.status === "CONFIRMED").length
  const failedCount = payments.filter((payment) => payment.status === "FAILED").length

  return (
    <DashboardShell
      role="driver"
      sidebarWidth="compact"
      header={
        <DashboardHeader
          title="Payment History"
          welcomeName={resolveDisplayName({
            fullName: user.fullName,
            name: user.name,
            email: user.email,
          })}
        />
      }
    >
      <main className="space-y-4 p-4 md:p-6">
        <section className="rounded-[10px] border border-border/70 bg-card px-4 py-4 md:px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">Repayment History</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                View Paystack repayment records and confirmation status.
              </p>
            </div>
            <Button asChild className="h-10 w-full bg-[#E57A00] text-white hover:bg-[#D77200] sm:w-auto">
              <Link href="/dashboard/driver/repayment">Make Payment</Link>
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((option) => {
              const href = option.value === "30d" ? "/dashboard/driver/payments" : `/dashboard/driver/payments?range=${option.value}`
              const isActive = option.value === range
              return (
                <Button key={option.value} asChild size="sm" variant={isActive ? "default" : "outline"}>
                  <Link href={href}>{option.label}</Link>
                </Button>
              )
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-[10px] border border-border/70 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="inline-flex items-center text-2xl font-semibold text-foreground">
                <Receipt className="mr-2 h-5 w-5 text-emerald-600" />
                {confirmedCount}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[10px] border border-border/70 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Confirmed Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="inline-flex items-center text-2xl font-semibold text-foreground">
                <Wallet className="mr-2 h-5 w-5 text-[#E57A00]" />
                {formatNaira(totalPaidNgn)}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[10px] border border-border/70 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="inline-flex items-center text-2xl font-semibold text-foreground">
                <Calendar className="mr-2 h-5 w-5 text-red-600" />
                {failedCount}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-[10px] border border-border/70 bg-card p-4 md:p-5">
          <DriverPaymentsTable
            payments={payments}
            emptyLabel="No repayments found for the selected period."
          />
        </section>
      </main>
    </DashboardShell>
  )
}
