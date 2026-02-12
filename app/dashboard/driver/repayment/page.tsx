"use client"

import { CalendarClock, CreditCard, FileText, Wallet } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const repaymentSummary = {
  dueAmount: 1500,
  dueDate: "2026-02-28",
  lastPayment: 500,
  lastPaymentDate: "2026-01-28",
  paymentMethod: "Wallet transfer",
}

const paymentHistory = [
  { id: "p-01", date: "2026-01-28", amount: 500, status: "Paid" },
  { id: "p-02", date: "2025-12-28", amount: 500, status: "Paid" },
  { id: "p-03", date: "2025-11-28", amount: 500, status: "Paid" },
  { id: "p-04", date: "2025-10-28", amount: 500, status: "Paid" },
]

export default function DriverRepaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Driver" />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Repayment center</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage upcoming installments and review your payment activity.
                </p>
              </div>
              <Badge className="w-fit bg-amber-600 text-white">Due soon</Badge>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Amount due</CardDescription>
                <CardTitle>${repaymentSummary.dueAmount.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Current billing cycle</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Due date</CardDescription>
                <CardTitle>{new Date(repaymentSummary.dueDate).toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Auto-reminders enabled</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last payment</CardDescription>
                <CardTitle>${repaymentSummary.lastPayment}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {new Date(repaymentSummary.lastPaymentDate).toLocaleDateString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Payment method</CardDescription>
                <CardTitle className="text-base">{repaymentSummary.paymentMethod}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Default collection source</CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Pay outstanding balance</CardTitle>
                <CardDescription>Submit payment using your preferred method.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">Current due amount</p>
                  <p className="mt-1 text-3xl font-semibold">${repaymentSummary.dueAmount.toLocaleString()}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Due by {new Date(repaymentSummary.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90">
                    <Wallet className="mr-2 h-4 w-4" />
                    Make payment
                  </Button>
                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Change method
                  </Button>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  <CalendarClock className="mr-2 inline h-3.5 w-3.5" />
                  Late payments may affect account standing and next funding round.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment history</CardTitle>
                <CardDescription>Latest completed repayments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentHistory.map((item) => (
                  <div key={item.id} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
                      <Badge className="bg-emerald-600 text-white">{item.status}</Badge>
                    </div>
                    <p className="mt-1 text-lg font-semibold">${item.amount}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Reference: {item.id}</p>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Download statement
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
