"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, TrendingUp, Shield, AlertTriangle, CheckCircle, Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Vehicle {
  _id: string
  name: string
  price: number
  roi?: number
  investmentTerm?: number
  isTermSet: boolean
  totalFundedAmount: number
  fundingStatus: string
  type: string
  year: number
  image?: string
}

interface InvestmentModalEnhancedProps {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
  availableBalance: number
  onInvestmentComplete: (amount: number, term: number) => void
}

const TERM_OPTIONS = [
  { months: 12, years: 1, roi: 32.5 },
  { months: 24, years: 2, roi: 57.5 },
  { months: 36, years: 3, roi: 82.5 },
  { months: 48, years: 4, roi: 107.5 },
]

export function InvestmentModalEnhanced({
  isOpen,
  onClose,
  vehicle,
  availableBalance,
  onInvestmentComplete,
}: InvestmentModalEnhancedProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number[]>([1000])
  const [selectedTerm, setSelectedTerm] = useState<string>("12")
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1)
  const { toast } = useToast()

  if (!vehicle) return null

  const maxInvestment = Math.min(
    availableBalance,
    vehicle.price - vehicle.totalFundedAmount
  )
  const minInvestment = 100

  const selectedTermOption = TERM_OPTIONS.find(t => t.months.toString() === selectedTerm)
  const currentROI = vehicle.isTermSet ? vehicle.roi : selectedTermOption?.roi
  const currentTerm = vehicle.isTermSet ? vehicle.investmentTerm : selectedTermOption?.months

  const projectedTotalReturn = investmentAmount[0] * (1 + (currentROI || 0) / 100)
  const projectedProfit = projectedTotalReturn - investmentAmount[0]
  const projectedMonthlyReturn = projectedProfit / (currentTerm || 12)

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
      const termToUse = vehicle.isTermSet ? vehicle.investmentTerm : parseInt(selectedTerm)
      await onInvestmentComplete(investmentAmount[0], termToUse || 12)
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
    setSelectedTerm("12")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-3xl mx-4">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center text-foreground">
                <DollarSign className="h-5 w-5 mr-2 text-[#E57700]" />
                Invest in {vehicle.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {vehicle.isTermSet 
                  ? `This vehicle has a fixed ${vehicle.investmentTerm}-month term with ${vehicle.roi}% ROI set by the first investor.`
                  : "As the first investor, you'll set the investment term and ROI for this vehicle."}
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
                    <p className="text-sm text-muted-foreground">Funding Goal</p>
                    <p className="font-semibold text-foreground">${vehicle.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Term Selection (only for first investor) */}
              {!vehicle.isTermSet && (
                <div className="space-y-4">
                  <Label className="text-foreground font-semibold flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Choose Investment Term
                  </Label>
                  <RadioGroup value={selectedTerm} onValueChange={setSelectedTerm}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {TERM_OPTIONS.map((option) => (
                        <Card key={option.months} className={`cursor-pointer transition-all ${
                          selectedTerm === option.months.toString() 
                            ? 'ring-2 ring-[#E57700] bg-[#E57700]/5' 
                            : 'hover:bg-muted/50'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value={option.months.toString()} id={`term-${option.months}`} />
                              <div className="flex-1">
                                <Label htmlFor={`term-${option.months}`} className="cursor-pointer">
                                  <div className="font-semibold">{option.years} Year{option.years > 1 ? 's' : ''}</div>
                                  <div className="text-sm text-muted-foreground">{option.months} months</div>
                                </Label>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">{option.roi}%</div>
                                <div className="text-xs text-muted-foreground">Total ROI</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Investment Amount */}
              <div className="space-y-4">
                <Label className="text-foreground font-semibold">Investment Amount</Label>
                <div className="space-y-2">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-foreground">
                      ${investmentAmount[0].toLocaleString()}
                    </span>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={investmentAmount}
                      onValueChange={setInvestmentAmount}
                      max={maxInvestment}
                      min={minInvestment}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Min: ${minInvestment}</span>
                    <span>Max: ${maxInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Investment Projections */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Investment Projections
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Investment Term</p>
                    <p className="text-lg font-bold text-foreground">{currentTerm} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected ROI</p>
                    <p className="text-lg font-bold text-green-500">{currentROI}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                    <p className="text-lg font-bold text-green-500">${projectedTotalReturn.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-lg font-bold text-green-500">${projectedMonthlyReturn.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Warning for first investor */}
              {!vehicle.isTermSet && (
                <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200">First Investor Notice</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Your term selection will be locked for all future investors in this vehicle.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  disabled={investmentAmount[0] > availableBalance}
                >
                  Review Investment
                  <ArrowRight className="h-4 w-4 ml-2" />
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
                    <span className="text-muted-foreground">Investment Term:</span>
                    <span className="font-medium text-foreground">{currentTerm} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected ROI:</span>
                    <span className="font-medium text-green-500">{currentROI}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Monthly Income:</span>
                    <span className="font-medium text-green-500">${projectedMonthlyReturn.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Expected Return:</span>
                    <span className="font-bold text-green-500">${projectedTotalReturn.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleInvest}
                  disabled={isProcessing}
                  className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                >
                  {isProcessing ? "Processing..." : "Confirm Investment"}
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
                Investment Successful!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                You have successfully invested ${investmentAmount[0].toLocaleString()} in {vehicle.name}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">What's Next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You'll receive monthly returns starting next month</li>
                <li>• Track your investment progress in the Investments tab</li>
                <li>• Receive notifications about payment updates</li>
                {!vehicle.isTermSet && (
                  <li>• Your term selection is now locked for this vehicle</li>
                )}
              </ul>
            </div>

            <Button onClick={handleClose} className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
              Continue Investing
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}