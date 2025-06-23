"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Smartphone,
  Building,
  Globe,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
} from "lucide-react"

interface WithdrawalSystemProps {
  availableFunds: number
  totalEarnings: number
  pendingWithdrawals: number
}

interface Transaction {
  id: string
  type: "withdrawal" | "earning"
  amount: number
  method: string
  status: "completed" | "pending" | "failed"
  date: string
  description: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "earning",
    amount: 450,
    method: "Investor Funding",
    status: "completed",
    date: "2025-01-20",
    description: "Weekly earnings from vehicle usage",
  },
  {
    id: "2",
    type: "withdrawal",
    amount: 200,
    method: "Bank Transfer",
    status: "completed",
    date: "2025-01-18",
    description: "Withdrawal to Chase Bank",
  },
  {
    id: "3",
    type: "earning",
    amount: 380,
    method: "Investor Funding",
    status: "completed",
    date: "2025-01-15",
    description: "Weekly earnings from vehicle usage",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: 500,
    method: "Mobile Money",
    status: "pending",
    date: "2025-01-21",
    description: "Withdrawal to MTN Mobile Money",
  },
]

const paymentMethods = [
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building,
    fee: "1.5%",
    processingTime: "1-3 business days",
    minAmount: 50,
  },
  {
    id: "mobile",
    name: "Mobile Money",
    icon: Smartphone,
    fee: "2.0%",
    processingTime: "Instant",
    minAmount: 10,
  },
  {
    id: "crypto",
    name: "Crypto Wallet",
    icon: Globe,
    fee: "0.5%",
    processingTime: "5-15 minutes",
    minAmount: 25,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: CreditCard,
    fee: "2.5%",
    processingTime: "Instant",
    minAmount: 20,
  },
]

export function WithdrawalSystem({ availableFunds, totalEarnings, pendingWithdrawals }: WithdrawalSystemProps) {
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [accountDetails, setAccountDetails] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedMethod)
  const withdrawalFee =
    selectedPaymentMethod && withdrawalAmount
      ? (Number.parseFloat(withdrawalAmount) * Number.parseFloat(selectedPaymentMethod.fee.replace("%", ""))) / 100
      : 0
  const netAmount = withdrawalAmount ? Number.parseFloat(withdrawalAmount) - withdrawalFee : 0

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || !selectedMethod || !accountDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(withdrawalAmount) > availableFunds) {
      toast({
        title: "Insufficient Funds",
        description: "Withdrawal amount exceeds available balance.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate withdrawal processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of $${withdrawalAmount} has been initiated and will be processed within ${selectedPaymentMethod?.processingTime}.`,
      })

      // Reset form
      setWithdrawalAmount("")
      setSelectedMethod("")
      setAccountDetails("")
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600 text-white"
      case "pending":
        return "bg-yellow-600 text-white"
      case "failed":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Available Funds</p>
                <p className="text-2xl font-bold text-green-800">${availableFunds.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Earnings</p>
                <p className="text-2xl font-bold text-blue-800">${totalEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Pending Withdrawals</p>
                <p className="text-2xl font-bold text-yellow-800">${pendingWithdrawals.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="withdraw" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="withdraw" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
            Withdraw Funds
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdraw" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <ArrowDownLeft className="h-5 w-5 mr-2" />
                Withdraw Earnings
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Transfer your earnings to your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground">Withdrawal Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className="pl-10 bg-background border-border text-foreground"
                        max={availableFunds}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Available: ${availableFunds.toLocaleString()}</p>
                  </div>

                  <div>
                    <Label className="text-foreground">Payment Method</Label>
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center space-x-2">
                              <method.icon className="h-4 w-4" />
                              <span>{method.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPaymentMethod && (
                    <Card className="bg-muted border-border">
                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Processing Fee</span>
                            <span className="text-foreground">{selectedPaymentMethod.fee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Processing Time</span>
                            <span className="text-foreground">{selectedPaymentMethod.processingTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Minimum Amount</span>
                            <span className="text-foreground">${selectedPaymentMethod.minAmount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <Label className="text-foreground">Account Details</Label>
                    <Input
                      placeholder={
                        selectedMethod === "bank"
                          ? "Account number or IBAN"
                          : selectedMethod === "mobile"
                            ? "Mobile number"
                            : selectedMethod === "crypto"
                              ? "Wallet address"
                              : selectedMethod === "paypal"
                                ? "PayPal email"
                                : "Account details"
                      }
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="bg-muted border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-lg">Withdrawal Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Withdrawal Amount</span>
                        <span className="text-foreground">${withdrawalAmount || "0.00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="text-foreground">-${withdrawalFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">Net Amount</span>
                          <span className="text-[#E57700]">${netAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleWithdrawal}
                    disabled={isProcessing || !withdrawalAmount || !selectedMethod || !accountDetails}
                    className="w-full bg-[#E57700] hover:bg-[#E57700]/90"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ArrowDownLeft className="h-4 w-4" />
                        <span>Withdraw Funds</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Transaction History
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                View all your earnings and withdrawal transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "earning" ? "bg-green-100" : "bg-blue-100"
                        }`}
                      >
                        {transaction.type === "earning" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{transaction.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {transaction.method} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "earning" ? "text-green-600" : "text-blue-600"
                        }`}
                      >
                        {transaction.type === "earning" ? "+" : "-"}${transaction.amount}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
