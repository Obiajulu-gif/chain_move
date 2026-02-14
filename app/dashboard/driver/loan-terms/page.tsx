"use client"

import { CalendarClock, CheckCircle2, Download, FileText, ShieldCheck } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const loanTerms = {
  vehicleName: "Toyota Corolla 2024",
  loanAmount: 20000,
  interestRate: 8.5,
  loanTermMonths: 36,
  monthlyPayment: 650,
  totalPayment: 23400,
  processingFee: 200,
  collateral: "Vehicle + comprehensive insurance policy",
}

const paymentSchedule = [
  { month: 1, payment: 650, principal: 550, interest: 100, balance: 19450 },
  { month: 2, payment: 650, principal: 555, interest: 95, balance: 18895 },
  { month: 3, payment: 650, principal: 560, interest: 90, balance: 18335 },
  { month: 4, payment: 650, principal: 565, interest: 85, balance: 17770 },
]

export default function LoanTermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Driver" />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Loan terms and agreement</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review repayment structure, obligations, and collateral requirements.
                </p>
              </div>
              <Badge className="w-fit bg-emerald-600 text-white">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Approved
              </Badge>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Loan amount</CardDescription>
                <CardTitle>${loanTerms.loanAmount.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">For {loanTerms.vehicleName}</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>APR</CardDescription>
                <CardTitle>{loanTerms.interestRate}%</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Fixed annual rate</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Loan term</CardDescription>
                <CardTitle>{loanTerms.loanTermMonths} months</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Installment schedule</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly payment</CardDescription>
                <CardTitle>${loanTerms.monthlyPayment}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Due every month</CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Agreement summary
                </CardTitle>
                <CardDescription>Core terms from your active financing agreement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{loanTerms.vehicleName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total payable</p>
                      <p className="font-medium">${loanTerms.totalPayment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing fee</p>
                      <p className="font-medium">${loanTerms.processingFee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Collateral</p>
                      <p className="font-medium">{loanTerms.collateral}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                  <ShieldCheck className="mr-2 inline h-4 w-4" />
                  Maintain active insurance and on-time payments to keep your account in good standing.
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90">
                    <Download className="mr-2 h-4 w-4" />
                    Download agreement
                  </Button>
                  <Button variant="outline">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    Set reminders
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-6 bg-secondary/20 rounded-b-lg">
                <div className="text-sm text-muted-foreground">
                  {selectedCurrency === 'NGN' && (
                    <p>Payment: {formatCurrency(downPaymentAmountUSD)} (≈ ${downPaymentAmountUSD.toLocaleString()})</p>
                  )}
                </div>
                <Button
                  onClick={handleMakeDownPayment}
                  disabled={isMakingPayment || isLoadingRate}
                  className="bg-[#E57700] hover:bg-[#E57700]/90 text-white text-lg px-8 py-3"
                >
                  {isMakingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay {formatCurrency(downPaymentAmountUSD)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment schedule preview</CardTitle>
                <CardDescription>First installments and projected balance reduction.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentSchedule.map((item) => (
                  <div key={item.month} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Month {item.month}</p>
                      <p className="font-semibold">${item.payment}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Principal ${item.principal} • Interest ${item.interest}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Remaining balance: ${item.balance.toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  )
}
