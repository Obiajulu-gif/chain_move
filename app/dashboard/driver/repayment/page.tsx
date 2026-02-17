import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, Wallet } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/investor-overview/dashboard-header"
import { ContractSummaryCard } from "@/components/dashboard/driver-hire-purchase/contract-summary-card"
import { DriverPaymentForm } from "@/components/dashboard/driver-hire-purchase/driver-payment-form"
import { DriverPaymentsTable } from "@/components/dashboard/driver-hire-purchase/driver-payments-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dbConnect from "@/lib/dbConnect"
import { getSessionFromCookies } from "@/lib/auth/session"
import { getDriverContract, getDriverPayments } from "@/lib/services/driver-contracts.service"
import User from "@/models/User"

export const dynamic = "force-dynamic"

function resolveDisplayName(user: { fullName?: string; name?: string; email?: string | null }) {
  if (user.fullName && user.fullName.trim()) return user.fullName.trim()
  if (user.name && user.name.trim()) return user.name.trim()
  if (user.email) return user.email.split("@")[0]
  return "Driver"
}

export default async function DriverRepaymentPage() {
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
    return (
      <div className="min-h-screen bg-background">
        <Sidebar role="driver" mobileWidth="w-[212px]" className="md:w-[212px] lg:w-[212px]" />
        <div className="md:ml-[212px]">
          <DashboardHeader
            title="Make Payment"
            welcomeName={resolveDisplayName({
              fullName: user.fullName,
              name: user.name,
              email: user.email,
            })}
          />
          <main className="p-4 md:p-6">
            <Card className="rounded-[10px] border border-border/70 bg-card">
              <CardHeader>
                <CardTitle>No Active Contract</CardTitle>
                <CardDescription>
                  A repayment contract must be assigned before you can make payments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/dashboard/driver">Back to dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const recentPayments = await getDriverPayments({
    driverUserId: user._id.toString(),
    contractId: contract.id,
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" mobileWidth="w-[212px]" className="md:w-[212px] lg:w-[212px]" />

      <div className="md:ml-[212px]">
        <DashboardHeader
          title="Make Payment"
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
                <h2 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">Repayment Center</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Make weekly fiat NGN repayments for your hire-purchase contract.
                </p>
              </div>
              <Button asChild variant="outline" className="h-10">
                <Link href="/dashboard/driver/payments">
                  Payment History
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr]">
            <ContractSummaryCard contract={contract} />
            <DriverPaymentForm
              contractId={contract.id}
              defaultAmountNgn={contract.nextPaymentAmountNgn || contract.weeklyPaymentNgn}
              maxAmountNgn={contract.remainingBalanceNgn}
              defaultEmail={user.email || ""}
              nextDueDate={contract.nextDueDate}
            />
          </section>

          <section className="rounded-[10px] border border-border/70 bg-card p-4 md:p-5">
            <div className="mb-4 inline-flex items-center text-sm text-muted-foreground">
              <Wallet className="mr-2 h-4 w-4" />
              Recent repayments are listed below after Paystack confirmation.
            </div>
            <DriverPaymentsTable payments={recentPayments} emptyLabel="No repayment transactions yet." />
          </section>
        </main>
      </div>
    </div>
  )
}
