"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  History,
  Shield,
  Zap,
} from "lucide-react"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "investment" | "return"
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  description: string
  method?: string
}

interface FundsManagementProps {
  currentBalance: number
  onBalanceUpdate: (newBalance: number) => void
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 5000,
    status: "completed",
    date: "2024-12-20",
    description: "Bank transfer deposit",
    method: "Bank Transfer",
  },
  {
    id: "2",
    type: "investment",
    amount: 2000,
    status: "completed",
    date: "2024-12-19",
    description: "Investment in Toyota Corolla 2020",
  },
  {
    id: "3",
    type: "return",
    amount: 150,
    status: "completed",
    date: "2024-12-18",
    description: "Monthly return from Honda Civic",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: 1000,
    status: "pending",
    date: "2024-12-17",
    description: "Withdrawal to bank account",
    method: "Bank Transfer",
  },
]

export function FundsManagement({ currentBalance, onBalanceUpdate }: FundsManagementProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [depositMethod, setDepositMethod] = useState("")
  const [withdrawMethod, setWithdrawMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const { toast } = useToast()

  const handleDeposit = async () => {
    if (!depositAmount || !depositMethod) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select payment method",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseFloat(depositAmount)
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "deposit",
        amount,
        status: "completed",
        date: new Date().toISOString().split("T")[0],
        description: `${depositMethod} deposit`,
        method: depositMethod,
      }

      setTransactions([newTransaction, ...transactions])
      onBalanceUpdate(currentBalance + amount)
      setDepositAmount("")
      setDepositMethod("")
      setIsDepositOpen(false)

      toast({
        title: "Deposit Successful",
        description: `$${amount.toLocaleString()} has been added to your account`,
      })
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawMethod) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select withdrawal method",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(withdrawAmount)
    if (amount > currentBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "withdrawal",
        amount,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        description: `Withdrawal to ${withdrawMethod}`,
        method: withdrawMethod,
      }

      setTransactions([newTransaction, ...transactions])
      onBalanceUpdate(currentBalance - amount)
      setWithdrawAmount("")
      setWithdrawMethod("")
      setIsWithdrawOpen(false)

      toast({
        title: "Withdrawal Initiated",
        description: `$${amount.toLocaleString()} withdrawal is being processed`,
      })
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "investment":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "return":
        return <DollarSign className="h-4 w-4 text-green-500" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = transactions
    .filter((t) => t.type === "withdrawal" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalInvestments = transactions.filter((t) => t.type === "investment").reduce((sum, t) => sum + t.amount, 0)

  const totalReturns = transactions.filter((t) => t.type === "return").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-[#E57700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${currentBalance.toLocaleString()}</div>
            <p className="text-xs text-green-500">Ready to invest</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#E57700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalInvestments.toLocaleString()}</div>
            <p className="text-xs text-blue-500">Active investments</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Returns</CardTitle>
            <DollarSign className="h-4 w-4 text-[#E57700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalReturns.toLocaleString()}</div>
            <p className="text-xs text-green-500">Earned returns</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-[#E57700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(totalReturns - totalInvestments + currentBalance).toLocaleString()}
            </div>
            <p className="text-xs text-green-500">
              +{(((totalReturns - totalInvestments) / totalInvestments) * 100 || 0).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Deposit Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ArrowDownLeft className="h-5 w-5 mr-2 text-[#E57700]" />
                Deposit Funds
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add funds to your ChainMove investment account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deposit-amount" className="text-foreground">
                  Amount (USD)
                </Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="deposit-method" className="text-foreground">
                  Payment Method
                </Label>
                <Select value={depositMethod} onValueChange={setDepositMethod}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="debit-card">Debit Card</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Shield className="h-4 w-4 text-[#E57700]" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Secure Transaction</p>
                  <p className="text-muted-foreground">Your payment is protected by bank-level security</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDepositOpen(false)}
                  className="flex-1 border-border"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeposit}
                  className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </div>
                  ) : (
                    "Deposit"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted flex-1">
              <Minus className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ArrowUpRight className="h-5 w-5 mr-2 text-[#E57700]" />
                Withdraw Funds
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Withdraw funds from your investment account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available Balance</span>
                  <span className="font-bold text-foreground">${currentBalance.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="withdraw-amount" className="text-foreground">
                  Amount (USD)
                </Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-muted border-border text-foreground"
                  max={currentBalance}
                />
              </div>
              <div>
                <Label htmlFor="withdraw-method" className="text-foreground">
                  Withdrawal Method
                </Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Zap className="h-4 w-4 text-[#E57700]" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Processing Time</p>
                  <p className="text-muted-foreground">Bank transfers: 1-3 business days</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsWithdrawOpen(false)}
                  className="flex-1 border-border"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </div>
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction History */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <History className="h-5 w-5 mr-2" />
            Transaction History
          </CardTitle>
          <CardDescription className="text-muted-foreground">Recent account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-foreground capitalize">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-bold ${
                        transaction.type === "deposit" || transaction.type === "return"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "deposit" || transaction.type === "return" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </span>
                    {getStatusIcon(transaction.status)}
                  </div>
                  {transaction.method && <p className="text-xs text-muted-foreground">{transaction.method}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" className="border-border text-foreground hover:bg-muted">
              View All Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
