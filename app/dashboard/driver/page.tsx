"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  Car,
  CheckCircle2,
  CreditCard,
  FileText,
  Wallet,
} from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DashboardRouteLoading } from "@/components/dashboard/dashboard-route-loading"
import { usePlatform, useDriverData } from "@/contexts/platform-context"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

type DriverPayment = {
  id: string
  status: string
  amount: number
  dueDate: string
  loanId: string
}

export default function DriverDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { state, dispatch } = usePlatform()
  const { user: authUser, loading: authLoading } = useAuth()

  const fallbackDriverId = state.currentUser?.id || "driver1"
  const driverId = authUser?.id || fallbackDriverId
  const driverName = getUserDisplayName(authUser, "Driver")

  const driverData = useDriverData(driverId)
  const repayments = useMemo(() => {
    return (driverData.repayments || []) as DriverPayment[]
  }, [driverData.repayments])

  const activeLoan = useMemo(() => {
    return driverData.loans.find((loan) => loan.status === "Active" || loan.status === "Approved")
  }, [driverData.loans])

  const pendingLoans = useMemo(() => {
    return driverData.loans.filter((loan) => loan.status === "Pending" || loan.status === "Under Review")
  }, [driverData.loans])

  const unreadNotifications = useMemo(() => {
    return driverData.notifications.filter((notification) => !notification.read).length
  }, [driverData.notifications])

  const nextPayment = useMemo(() => {
    return repayments.find((payment) => payment.status.toLowerCase() === "pending") || null
  }, [repayments])

  const overduePayments = useMemo(() => {
    return repayments.filter((payment) => payment.status.toLowerCase() === "overdue").length
  }, [repayments])

  if (authLoading || state.isLoading) {
    return <DashboardRouteLoading title="Loading driver dashboard" description="Preparing loans, repayments, and alerts." />
  }

  if (authUser && authUser.role !== "driver") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need a driver account to access this dashboard.</CardDescription>
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

  if (!driverData.driver && !activeLoan && pendingLoans.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Driver profile not found</CardTitle>
            <CardDescription>
              We could not find linked driver records yet. Your account may still be syncing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={() => router.push("/dashboard/driver/settings")}>Open settings</Button>
            <Button variant="outline" onClick={() => router.refresh()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Driver" notificationCount={unreadNotifications} />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  Driver workspace
                </Badge>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {driverName}</h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Track funding, repayment obligations, and operational alerts in one unified dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => router.push("/dashboard/driver/loan-terms")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Loan terms
                </Button>
                <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90" onClick={() => router.push("/dashboard/driver/repayment")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make payment
                </Button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Loan status</CardDescription>
                <CardTitle>{activeLoan ? activeLoan.status : pendingLoans.length ? "Under review" : "No loan"}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {activeLoan
                  ? `Approved amount: $${activeLoan.requestedAmount.toLocaleString()}`
                  : pendingLoans.length
                    ? `${pendingLoans.length} application(s) pending`
                    : "Start a loan application to begin"}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Funds received</CardDescription>
                <CardTitle>${(activeLoan?.totalFunded || 0).toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Capital disbursed to your account</CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Next payment</CardDescription>
                <CardTitle>{nextPayment ? `$${nextPayment.amount.toLocaleString()}` : "N/A"}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {nextPayment ? `Due ${new Date(nextPayment.dueDate).toLocaleDateString()}` : "No pending repayment"}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unread alerts</CardDescription>
                <CardTitle>{unreadNotifications}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {overduePayments > 0 ? `${overduePayments} overdue payment warning(s)` : "No critical issues"}
              </CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Funding and repayment overview</CardTitle>
                <CardDescription>Monitor progress and upcoming obligations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {activeLoan ? (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border p-4">
                        <p className="text-xs text-muted-foreground">Requested amount</p>
                        <p className="mt-1 text-lg font-semibold">${activeLoan.requestedAmount.toLocaleString()}</p>
                      </div>
                      <div className="rounded-xl border p-4">
                        <p className="text-xs text-muted-foreground">Monthly payment</p>
                        <p className="mt-1 text-lg font-semibold">${activeLoan.monthlyPayment.toLocaleString()}</p>
                      </div>
                      <div className="rounded-xl border p-4">
                        <p className="text-xs text-muted-foreground">Loan term</p>
                        <p className="mt-1 text-lg font-semibold">{activeLoan.loanTerm} months</p>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-xl border p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Funding progress</span>
                        <span className="font-medium">{activeLoan.fundingProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={activeLoan.fundingProgress} className="h-2.5" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>${activeLoan.totalFunded.toLocaleString()} funded</span>
                        <span>${activeLoan.remainingAmount.toLocaleString()} remaining</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90" onClick={() => router.push("/dashboard/driver/repayment")}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay now
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/dashboard/driver/documents")}>
                        <FileText className="mr-2 h-4 w-4" />
                        View documents
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <Car className="mx-auto h-9 w-9 text-muted-foreground" />
                    <h3 className="mt-3 font-semibold">No active loan</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {pendingLoans.length > 0
                        ? "Your application is currently under review."
                        : "Apply for vehicle financing to start operating."}
                    </p>
                    <Button className="mt-4 bg-[#E57700] text-white hover:bg-[#E57700]/90" onClick={() => router.push("/dashboard/driver/loan-terms")}>
                      Review loan options
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming repayments</CardTitle>
                <CardDescription>Recent and pending payment schedule entries.</CardDescription>
              </CardHeader>
              <CardContent>
                {repayments.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <CalendarClock className="mx-auto h-9 w-9 text-muted-foreground" />
                    <h3 className="mt-3 font-semibold">No repayment records</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Repayment entries will appear here once available.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {repayments.slice(0, 6).map((payment) => {
                      const normalizedStatus = payment.status.toLowerCase()
                      const isPaid = normalizedStatus === "paid"
                      const isOverdue = normalizedStatus === "overdue"

                      return (
                        <div key={payment.id} className="rounded-xl border p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">Loan #{payment.loanId.slice(0, 8)}</p>
                            </div>
                            <Badge
                              className={
                                isPaid
                                  ? "bg-emerald-600 text-white"
                                  : isOverdue
                                    ? "bg-red-600 text-white"
                                    : "bg-amber-600 text-white"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                            {!isPaid ? (
                              <Button size="sm" variant="outline" onClick={() => router.push("/dashboard/driver/repayment")}>
                                Pay
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Cleared
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Notification center</CardTitle>
                <CardDescription>Unread operational and financial updates.</CardDescription>
              </CardHeader>
              <CardContent>
                {driverData.notifications.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center">
                    <Bell className="mx-auto h-9 w-9 text-muted-foreground" />
                    <h3 className="mt-3 font-semibold">No notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">System alerts will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {driverData.notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="rounded-xl border p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", payload: notification.id })}
                            >
                              Mark read
                            </Button>
                          ) : (
                            <Badge variant="secondary">Read</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action queue</CardTitle>
                <CardDescription>Items that may need immediate attention.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border p-4">
                  <p className="text-sm font-medium">Pending applications</p>
                  <p className="mt-1 text-2xl font-semibold">{pendingLoans.length}</p>
                  <p className="text-xs text-muted-foreground">Loans currently under review</p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-sm font-medium">Overdue repayments</p>
                  <p className="mt-1 text-2xl font-semibold">{overduePayments}</p>
                  <p className="text-xs text-muted-foreground">Immediate follow-up recommended</p>
                </div>

                <Button
                  className="w-full bg-[#E57700] text-white hover:bg-[#E57700]/90"
                  onClick={() => {
                    toast({
                      title: "Notifications opened",
                      description: "Redirecting you to the alerts center.",
                    })
                    router.push("/dashboard/driver/notifications")
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Review alerts
                </Button>

                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/driver/maintenance")}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Maintenance schedule
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  )
}
