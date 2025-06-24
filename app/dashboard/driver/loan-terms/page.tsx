"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, FileText, AlertCircle, DollarSign, Clock, AlertTriangle } from "lucide-react"

export default function LoanTermsPage() {
  const loanTerms = {
    vehicleName: "Toyota Corolla 2024",
    loanAmount: 20000,
    interestRate: 8.5,
    loanTerm: 36,
    monthlyPayment: 650,
    totalPayment: 23400,
    totalInterest: 3400,
    processingFee: 200,
    insuranceRequired: true,
    collateralRequired: "Vehicle + Insurance Policy",
  }

  const paymentSchedule = [
    { month: 1, payment: 650, principal: 550, interest: 100, balance: 19450 },
    { month: 2, payment: 650, principal: 555, interest: 95, balance: 18895 },
    { month: 3, payment: 650, principal: 560, interest: 90, balance: 18335 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64">
        <Header userName="Driver" userStatus="Active" />

        <div className="p-3 md:p-6 space-y-4 md:space-y-8 max-w-full overflow-x-hidden">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Loan Terms & Conditions</h1>
                <p className="text-muted-foreground">Review your loan agreement details</p>
              </div>
              <Badge className="bg-green-600 text-white">
                <CheckCircle className="h-4 w-4 mr-1" />
                Approved
              </Badge>
            </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loan Summary */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Loan Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-medium text-foreground">{loanTerms.vehicleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium text-foreground">${loanTerms.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate</span>
                <span className="font-medium text-foreground">{loanTerms.interestRate}% APR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Term</span>
                <span className="font-medium text-foreground">{loanTerms.loanTerm} months</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="text-xl font-bold text-foreground">${loanTerms.monthlyPayment}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Schedule Preview */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Schedule (First 3 Months)</h3>
            <div className="space-y-3">
              {paymentSchedule.map((payment) => (
                <div key={payment.month} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium text-foreground">Month {payment.month}</span>
                    <div className="text-sm text-muted-foreground">
                      Principal: ${payment.principal} | Interest: ${payment.interest}
                    </div>
                  </div>
                  <span className="font-medium text-foreground">${payment.payment}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Download Agreement
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Set Payment Reminders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
