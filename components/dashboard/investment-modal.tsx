"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, TrendingUp, Shield, AlertTriangle, CheckCircle } from "lucide-react"

interface Vehicle {
  id: string
  name: string
  loanAmount: number
  roi: number
  term: number
  monthlyReturn: number
  fundingProgress: number
  riskLevel: string
  driverName: string
  location: string
}

interface InvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
  availableBalance: number
  onInvestmentComplete: (amount: number) => void
}

export function InvestmentModal({
  isOpen,
  onClose,
  vehicle,
  availableBalance,
  onInvestmentComplete,
}: InvestmentModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number[]>([1000])
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)
  const { toast } = useToast()

  if (!vehicle) return null

  const maxInvestment = Math.min(
    availableBalance,
    vehicle.loanAmount - (vehicle.loanAmount * vehicle.fundingProgress) / 100,
  )
  const minInvestment = 100

  const projectedMonthlyReturn = (investmentAmount[0] / vehicle.loanAmount) * vehicle.monthlyReturn
  const projectedTotalReturn = projectedMonthlyReturn * vehicle.term
  const projectedROI = ((projectedTotalReturn / investmentAmount[0]) * 100).toFixed(1)

  const handleInvest = async () => {
    if (investmentAmount[0] > availableBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this investment",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onInvestmentComplete(investmentAmount[0])
      setStep(3)

      toast({
        title: "Investment Successful",
        description: `Successfully invested $${investmentAmount[0].toLocaleString()} in ${vehicle.name}`,
      })
    } catch (error) {
      toast({
        title: "Investment Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setInvestmentAmount([1000])
    onClose()
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-600"
      case "medium":
        return "bg-yellow-600"
      case "high":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-2xl mx-4">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-foreground">
                <DollarSign className="h-5 w-5 mr-2 text-[#E57700]" />
                Invest in {vehicle.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Review investment details and choose your investment amount
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Vehicle Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-semibold text-foreground">{vehicle.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="font-semibold text-foreground">{vehicle.driverName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{vehicle.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <Badge className={`${getRiskColor(vehicle.riskLevel)} text-white`}>{vehicle.riskLevel}</Badge>
                  </div>
                </div>
              </div>

              {/* Investment Amount */}
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground">Investment Amount: ${investmentAmount[0].toLocaleString()}</Label>
                  <div className="mt-2">
                    <Slider
                      value={investmentAmount}
                      onValueChange={setInvestmentAmount}
                      max={maxInvestment}
                      min={minInvestment}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Min: ${minInvestment}</span>
                    <span>Max: ${maxInvestment.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Available Balance</Label>
                    <p className="text-lg font-bold text-foreground">${availableBalance.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Remaining After Investment</Label>
                    <p className="text-lg font-bold text-foreground">
                      ${(availableBalance - investmentAmount[0]).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Projections */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Investment Projections
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Return</p>
                    <p className="text-lg font-bold text-green-500">${projectedMonthlyReturn.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className="text-lg font-bold text-green-500">${projectedTotalReturn.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Projected ROI</p>
                    <p className="text-lg font-bold text-green-500">{projectedROI}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Term</p>
                    <p className="text-lg font-bold text-foreground">{vehicle.term} months</p>
                  </div>
                </div>
              </div>

              {/* Risk Warning */}
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Investment Risk Notice</p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    All investments carry risk. Past performance does not guarantee future results. Please invest
                    responsibly.
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleClose} className="flex-1 border-border">
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  disabled={investmentAmount[0] > availableBalance}
                >
                  Review Investment
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-foreground">
                <Shield className="h-5 w-5 mr-2 text-[#E57700]" />
                Confirm Investment
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Please review and confirm your investment details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Investment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium text-foreground">{vehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investment Amount:</span>
                    <span className="font-bold text-foreground">${investmentAmount[0].toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Monthly Return:</span>
                    <span className="font-medium text-green-500">${projectedMonthlyReturn.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loan Term:</span>
                    <span className="font-medium text-foreground">{vehicle.term} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projected Total Return:</span>
                    <span className="font-bold text-green-500">${projectedTotalReturn.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">Blockchain Secured</p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Your investment is secured by smart contracts on the blockchain
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border">
                  Back
                </Button>
                <Button
                  onClick={handleInvest}
                  className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </div>
                  ) : (
                    "Confirm Investment"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-foreground">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Investment Successful
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Your investment has been processed successfully
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-center">
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Investment Confirmed</h3>
                <p className="text-muted-foreground">
                  You have successfully invested ${investmentAmount[0].toLocaleString()} in {vehicle.name}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">What's Next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive monthly returns starting next month</li>
                  <li>• Track your investment progress in the Investments tab</li>
                  <li>• Receive notifications about payment updates</li>
                </ul>
              </div>

              <Button onClick={handleClose} className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                Continue Investing
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
