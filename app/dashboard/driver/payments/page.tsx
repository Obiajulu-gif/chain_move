"use client"

import { useMemo, useEffect, useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, CreditCard, Clock, FileText } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { usePlatform } from "@/contexts/platform-context"

export default function DriverPaymentsPage() {
  const { user } = useAuth()
  const { state } = usePlatform()

  const driverId = user?.id || ""

  const [dbPayments, setDbPayments] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!driverId) return
      try {
        setLoading(true)
        const res = await fetch(`/api/transactions?userId=${driverId}&userType=driver&includeTypes=repayment,deposit,down_payment`)
        const data = await res.json()
        if (res.ok && data.transactions) {
          setDbPayments(data.transactions)
        } else {
          setDbPayments([])
        }
      } catch (e) {
        setDbPayments([])
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [driverId])

  const payments = useMemo(() => {
    if (dbPayments.length > 0) return dbPayments
    const txns = state.transactions
      .filter((t) => t.userId === driverId && t.userType === "driver")
      .filter((t) => ["repayment", "deposit", "down_payment"].includes(t.type))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return txns
  }, [dbPayments, state.transactions, driverId])

  const totalPaid = useMemo(() => payments.reduce((sum, t) => sum + (t.amount || 0), 0), [payments])
  const lastPayment = payments[0]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" className="md:w-64 lg:w-72" />

      <div className="md:ml-64 lg:ml-72">
        <Header userName={user?.name || "Driver"} userStatus="Active" />

        <div className="p-3 md:p-6 space-y-4 md:space-y-8 max-w-full overflow-x-hidden">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Payments</h1>
                <p className="text-sm sm:text-base text-muted-foreground">View deposits, down payments, and repayments</p>
              </div>
              <Badge className="bg-green-600 text-white px-3 py-1 flex items-center gap-1" variant="outline">
                <CreditCard className="h-4 w-4" />
                {payments.length} payments
              </Badge>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <DollarSign className="h-5 w-5" />
                  Total Paid
                </CardTitle>
                <CardDescription className="text-muted-foreground">Cumulative payments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">${totalPaid.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5" />
                  Last Payment
                </CardTitle>
                <CardDescription className="text-muted-foreground">Most recent payment</CardDescription>
              </CardHeader>
              <CardContent>
                {lastPayment ? (
                  <div>
                    <p className="text-lg font-medium text-foreground">${lastPayment.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(lastPayment.timestamp).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No payments yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5" />
                  Records
                </CardTitle>
                <CardDescription className="text-muted-foreground">Documented payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-foreground">{payments.length} entries</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment History Table */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Payment History</CardTitle>
              <CardDescription className="text-muted-foreground">
                Detailed list of your payment activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading payments...</p>
                </div>
              ) : payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Related</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => {
                      const status = String(p.status || "").toLowerCase()
                      return (
                        <TableRow key={p._id || p.id}>
                          <TableCell className="text-foreground">
                            {new Date(p.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                p.type === "repayment"
                                  ? "bg-green-600 text-white"
                                  : p.type === "deposit"
                                  ? "bg-blue-600 text-white"
                                  : p.type === "down_payment"
                                  ? "bg-amber-600 text-white"
                                  : "bg-muted text-foreground"
                              }
                              variant="outline"
                            >
                              {p.type === "down_payment" ? "Down Payment" : p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground">{p.description || "Repayment"}</TableCell>
                          <TableCell className="text-foreground">${(p.amount || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                status === "completed"
                                  ? "bg-green-600 text-white"
                                  : status === "pending"
                                  ? "bg-yellow-600 text-white"
                                  : "bg-red-600 text-white"
                              }
                            >
                              {status === "completed" ? "Completed" : status === "pending" ? "Pending" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{p.relatedId || "-"}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                  <TableCaption>Showing {payments.length} payment records.</TableCaption>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No payments found yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}