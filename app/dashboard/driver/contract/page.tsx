import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, Calendar, CheckCircle } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/investor-overview/dashboard-header"
import { ContractSummaryCard } from "@/components/dashboard/driver-hire-purchase/contract-summary-card"
import { DriverPaymentsTable } from "@/components/dashboard/driver-hire-purchase/driver-payments-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira } from "@/lib/currency"
import dbConnect from "@/lib/dbConnect"
import { getSessionFromCookies } from "@/lib/auth/session"
import { getDriverContract, getDriverPayments } from "@/lib/services/driver-contracts.service"
import User from "@/models/User"

export const dynamic = "force-dynamic"

interface ScheduleItem {
  week: number
  dueDate: string
  amountNgn: number
  status: "PAID" | "UPCOMING"
}

function resolveDisplayName(user: { fullName?: string; name?: string; email?: string | null }) {
  if (user.fullName && user.fullName.trim()) return user.fullName.trim()
  if (user.name && user.name.trim()) return user.name.trim()
  if (user.email) return user.email.split("@")[0]
  return "Driver"
}

function formatDateLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function buildSchedulePreview(contract: {
  startDate: string
  durationWeeks: number
  weeklyPaymentNgn: number
  totalPayableNgn: number
  totalPaidNgn: number
}, maxRows = 8): ScheduleItem[] {
  const startDate = new Date(contract.startDate)
  if (Number.isNaN(startDate.getTime())) return []

  const rows: ScheduleItem[] = []
  let remainingBalanceNgn = Math.max(contract.totalPayableNgn, 0)
  const paidInstallments = contract.weeklyPaymentNgn > 0 ? Math.floor(contract.totalPaidNgn / contract.weeklyPaymentNgn) : 0

  for (let week = 1; week <= contract.durationWeeks; week += 1) {
    if (remainingBalanceNgn <= 0) break
    const dueDate = new Date(startDate)
    dueDate.setDate(startDate.getDate() + week * 7)

    const installmentAmount = Math.min(contract.weeklyPaymentNgn, remainingBalanceNgn)
    remainingBalanceNgn = Math.max(remainingBalanceNgn - installmentAmount, 0)

    rows.push({
      week,
      dueDate: dueDate.toISOString(),
      amountNgn: installmentAmount,
      status: week <= paidInstallments ? "PAID" : "UPCOMING",
    })
  }

  return rows.slice(0, maxRows)
}

export default async function DriverContractPage() {
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
  if (!contract) {
    redirect("/dashboard/driver")
  }

  const recentPayments = await getDriverPayments({
    driverUserId: user._id.toString(),
    contractId: contract.id,
    limit: 8,
  })
  const schedule = buildSchedulePreview(contract, 10)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" mobileWidth="w-[212px]" className="md:w-[212px] lg:w-[212px]" />

      <div className="md:ml-[212px]">
        <DashboardHeader
          title="My Vehicle / Contract"
          welcomeName={resolveDisplayName({
            fullName: user.fullName,
            name: user.name,
            email: user.email,
          })}
        />

        <main className="space-y-4 p-4 md:p-6">
          <section className="rounded-[10px] border border-border/70 bg-card px-4 py-4 md:px-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">Hire-Purchase Contract</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Review your assigned vehicle plan, repayment terms, and schedule.
                </p>
              </div>

              <Button asChild className="h-10 bg-[#E57A00] text-white hover:bg-[#D77200]">
                <Link href="/dashboard/driver/repayment">
                  Make Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <ContractSummaryCard contract={contract} />

            <Card className="rounded-[10px] border border-border/70 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Contract Terms</CardTitle>
                <CardDescription>Fiat repayment terms linked to your pool assignment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium">{contract.vehicleDisplayName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Principal</span>
                  <span className="font-medium">{formatNaira(contract.principalNgn)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total payable</span>
                  <span className="font-medium">{formatNaira(contract.totalPayableNgn)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Weekly repayment</span>
                  <span className="font-medium">{formatNaira(contract.weeklyPaymentNgn)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{contract.durationWeeks} weeks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next due date</span>
                  <span className="font-medium">{contract.nextDueDate ? formatDateLabel(contract.nextDueDate) : "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Card className="rounded-[10px] border border-border/70 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Repayment Schedule</CardTitle>
                <CardDescription>Upcoming installment windows for your contract.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {schedule.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Schedule is not available yet.</p>
                ) : (
                  schedule.map((row) => (
                    <div key={`${row.week}-${row.dueDate}`} className="rounded-[10px] border border-border/70 px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">Week {row.week}</p>
                        </div>
                        <span className="text-sm font-semibold">{formatNaira(row.amountNgn)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDateLabel(row.dueDate)}</span>
                        {row.status === "PAID" ? (
                          <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                            Paid
                          </span>
                        ) : (
                          <span>Upcoming</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[10px] border border-border/70 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Payments</CardTitle>
                <CardDescription>Latest entries on this contract.</CardDescription>
              </CardHeader>
              <CardContent>
                <DriverPaymentsTable payments={recentPayments.slice(0, 4)} emptyLabel="No repayments yet." />
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
