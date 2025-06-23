"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Calendar, TrendingUp, FileText, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface LoanTermsProps {
  loanData: {
    vehicleName: string
    loanAmount: number
    interestRate: number
    termMonths: number
    monthlyPayment: number
    totalPayable: number
    amountPaid: number
    remainingBalance: number
    nextPaymentDate: string
    contractAddress: string
    status: "Active" | "Completed" | "Overdue"
    autoPayEnabled: boolean
    paymentHistory: {
      month: string
      amount: number
      status: "Paid" | "Pending" | "Late"
      date: string
    }[]
  }
}

export function LoanTermsSummary({ loanData }: LoanTermsProps) {
  const progressPercentage = (loanData.amountPaid / loanData.totalPayable) * 100
  const remainingMonths = Math.ceil(loanData.remainingBalance / loanData.monthlyPayment)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600"
      case "Completed":
        return "bg-blue-600"
      case "Overdue":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-400"
      case "Pending":
        return "text-yellow-400"
      case "Late":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Loan Overview */}
      <Card className="bg-[#2a3441] border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Loan Terms Summary
              </CardTitle>
              <CardDescription className="text-gray-400">
                Smart contract details for {loanData.vehicleName}
              </CardDescription>
            </div>
            <Badge className={`${getStatusColor(loanData.status)} text-white`}>{loanData.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-[#1a2332] rounded-lg">
              <DollarSign className="h-8 w-8 text-[#E57700] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">${loanData.loanAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Loan Amount</p>
            </div>

            <div className="text-center p-4 bg-[#1a2332] rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{loanData.interestRate}%</p>
              <p className="text-sm text-gray-400">Interest Rate</p>
            </div>

            <div className="text-center p-4 bg-[#1a2332] rounded-lg">
              <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{loanData.termMonths}</p>
              <p className="text-sm text-gray-400">Term (Months)</p>
            </div>

            <div className="text-center p-4 bg-[#1a2332] rounded-lg">
              <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">${loanData.monthlyPayment}</p>
              <p className="text-sm text-gray-400">Monthly Payment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Progress */}
      <Card className="bg-[#2a3441] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Payment Progress</CardTitle>
          <CardDescription className="text-gray-400">Track your loan repayment journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Loan Progress</span>
                <span className="text-sm text-white">{progressPercentage.toFixed(1)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-gray-600" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-700">
                <p className="text-lg font-bold text-green-400">${loanData.amountPaid.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Amount Paid</p>
              </div>

              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                <p className="text-lg font-bold text-blue-400">${loanData.remainingBalance.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Remaining Balance</p>
              </div>

              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-700">
                <p className="text-lg font-bold text-purple-400">{remainingMonths}</p>
                <p className="text-sm text-gray-400">Months Remaining</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a2332] rounded-lg">
              <div>
                <p className="font-medium text-white">Next Payment Due</p>
                <p className="text-sm text-gray-400">{loanData.nextPaymentDate}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">${loanData.monthlyPayment}</p>
                <div className="flex items-center space-x-2">
                  {loanData.autoPayEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    {loanData.autoPayEnabled ? "Auto-pay enabled" : "Manual payment"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Contract Details */}
      <Card className="bg-[#2a3441] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Smart Contract Details
          </CardTitle>
          <CardDescription className="text-gray-400">Blockchain-secured loan agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[#1a2332] rounded-lg">
              <span className="text-gray-400">Contract Address</span>
              <span className="text-white font-mono text-sm">{loanData.contractAddress}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#1a2332] rounded-lg">
              <span className="text-gray-400">Total Payable</span>
              <span className="text-white font-semibold">${loanData.totalPayable.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#1a2332] rounded-lg">
              <span className="text-gray-400">Auto-Payment</span>
              <Badge className={loanData.autoPayEnabled ? "bg-green-600" : "bg-yellow-600"}>
                {loanData.autoPayEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>

          <div className="mt-6 flex space-x-2">
            <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
              <FileText className="h-4 w-4 mr-2" />
              View Contract
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <DollarSign className="h-4 w-4 mr-2" />
              Make Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Payment History */}
      <Card className="bg-[#2a3441] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Payment History</CardTitle>
          <CardDescription className="text-gray-400">Last 6 months of payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loanData.paymentHistory.slice(0, 6).map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                <div>
                  <p className="font-medium text-white">{payment.month}</p>
                  <p className="text-sm text-gray-400">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${payment.amount}</p>
                  <p className={`text-sm ${getPaymentStatusColor(payment.status)}`}>{payment.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              View Full History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
