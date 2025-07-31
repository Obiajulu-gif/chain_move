"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, FileText, CreditCard, Loader2, DollarSign, Globe } from "lucide-react"
import { usePlatform } from "@/contexts/platform-context"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

// Currency conversion function
async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const data = await response.json();
    
    if (data.rates && data.rates[toCurrency]) {
      return data.rates[toCurrency];
    }
    
    throw new Error("Exchange rate API failed");
  } catch (error) {
    console.warn("Failed to fetch live exchange rate, using fallback rate:", error);
    // Fallback rates
    if (fromCurrency === 'USD' && toCurrency === 'NGN') return 1600;
    if (fromCurrency === 'NGN' && toCurrency === 'USD') return 1/1600;
    return 1;
  }
}

export default function LoanTermsPage() {
  const { state, dispatch } = usePlatform()
  const { user: currentUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [loanApplication, setLoanApplication] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMakingPayment, setIsMakingPayment] = useState(false)
  
  // Currency selection state
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [exchangeRate, setExchangeRate] = useState(1)
  const [isLoadingRate, setIsLoadingRate] = useState(false)

  // Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (selectedCurrency === 'USD') {
        setExchangeRate(1);
        return;
      }
      
      setIsLoadingRate(true);
      try {
        const rate = await getExchangeRate('USD', selectedCurrency);
        setExchangeRate(rate);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        toast({
          title: "Exchange Rate Error",
          description: "Using fallback exchange rate. Amounts may not be current.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingRate(false);
      }
    };
    
    fetchExchangeRate();
  }, [selectedCurrency, toast]);

  // Currency formatting function
  const formatCurrency = (amount: number, currency: string = selectedCurrency) => {
    const convertedAmount = currency === 'USD' ? amount : amount * exchangeRate;
    const symbol = currency === 'USD' ? '$' : '₦';
    return `${symbol}${convertedAmount.toLocaleString(undefined, { 
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' ? 2 : 0
    })}`;
  };

  useEffect(() => {
    if (!state.isLoading && currentUser) {
      // Find the most recent loan application for the current user that is either 'Approved' or 'Pending'
      const driverLoan = state.loanApplications.find(
        (loan) => {
          // Handle both string and ObjectId formats for driverId comparison
          const loanDriverId = typeof loan.driverId === 'object' && loan.driverId._id 
            ? loan.driverId._id.toString() 
            : loan.driverId.toString()
          const currentUserId = currentUser.id.toString()
          
          const driverIdMatch = loanDriverId === currentUserId
          const statusMatch = loan.status === "Approved" || loan.status === "Pending"
          const paymentNotMade = !loan.downPaymentMade
          
          return driverIdMatch && statusMatch && paymentNotMade
        }
      )
      
      if (driverLoan) {
        setLoanApplication(driverLoan)
      } else {
        setLoanApplication(null) // No relevant loan found, keep the page blank
      }
      setIsLoading(false)
    }
  }, [state.isLoading, state.loanApplications, currentUser])

  const handleMakeDownPayment = async () => {
    if (!loanApplication) return

    setIsMakingPayment(true)
    
    try {
      const downPaymentAmountUSD = loanApplication.requestedAmount * 0.15;
      
      const response = await fetch('/api/payments/down-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanId: loanApplication._id,
          amount: downPaymentAmountUSD, // Always send USD amount to API
          currency: selectedCurrency, // Send selected currency for reference
        }),
      })

      const data = await response.json()
      console.log('Payment response:', data)
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment initialization failed')
      }
      
      // Extract authorization URL from response
      let authUrl = null;
      if (data.data?.authorization_url) {
        authUrl = data.data.authorization_url;
      } else if (data.authorization_url) {
        authUrl = data.authorization_url;
      } else if (data.data?.data?.authorization_url) {
        authUrl = data.data.data.authorization_url;
      }
      
      if (authUrl) {
        // Show conversion info if NGN was selected
        if (selectedCurrency === 'NGN' && data.conversionInfo) {
          toast({
            title: "Currency Conversion",
            description: `$${data.conversionInfo.originalAmountUSD} converted to ₦${data.conversionInfo.convertedAmountNGN.toLocaleString()} at rate ${data.conversionInfo.exchangeRate}`,
          });
        }
        
        // Redirect to Paystack payment page
        window.location.href = authUrl
      } else {
        throw new Error('Invalid payment response - no authorization URL found')
      }
      
    } catch (error) {
      console.error('Payment initialization error:', error)
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "There was an error processing your down payment. Please try again.",
        variant: "destructive",
      })
      setIsMakingPayment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Loan Terms...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your loan details.</p>
        </div>
      </div>
    )
  }

  if (!loanApplication) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <Sidebar role="driver" />
          <div className="md:ml-64 lg:ml-72">
            <Header
              userName={currentUser?.name || "Driver"}
              userStatus="Driver"
              notificationCount={currentUser?.notifications?.filter((n) => !n.read).length || 0}
              className="md:pl-6 lg:pl-8"
            />
            <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Loan Terms & Conditions
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    No pending loan application found requiring a down payment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    You do not have any loan applications currently awaiting a down payment.
                  </p>
                  <Button onClick={() => router.push("/dashboard/driver")}>Go to Dashboard</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  }

  const downPaymentAmountUSD = loanApplication.requestedAmount * 0.15;

  return (
    <>
      <div className="min-h-screen bg-background">
        <Sidebar role="driver" />
        <div className="md:ml-64 lg:ml-72">
          <Header
            userName={currentUser?.name || "Driver"}
            userStatus="Driver"
            notificationCount={currentUser?.notifications?.filter((n) => !n.read).length || 0}
            className="md:pl-6 lg:pl-8"
          />
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
            <Card className="w-full max-w-3xl shadow-lg mx-auto">
              <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">Loan Terms & Conditions</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Review your loan details before making the down payment.
                    </CardDescription>
                  </div>
                  
                  {/* Currency Selector */}
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger className="w-24 bg-primary-foreground text-primary border-primary-foreground/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="NGN">NGN</SelectItem>
                      </SelectContent>
                    </Select>
                    {isLoadingRate && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>
                
                {selectedCurrency === 'NGN' && (
                  <Badge variant="secondary" className="mt-2 w-fit">
                    Exchange Rate: 1 USD = ₦{exchangeRate.toLocaleString()}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatCurrency(loanApplication.requestedAmount)}
                    </p>
                  </div>
                   <div>
                    <p className="text-sm text-muted-foreground">Payback Amount</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatCurrency(loanApplication.totalAmountToPayBack)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Term</p>
                    <p className="text-xl font-semibold text-foreground">{loanApplication.loanTerm} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Payment</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatCurrency(loanApplication.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Payment</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatCurrency((loanApplication.monthlyPayment)/4.33)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="text-xl font-semibold text-foreground">{loanApplication.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Collateral</p>
                    <p className="text-xl font-semibold text-foreground">{loanApplication.collateral}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="text-xl font-semibold text-foreground">{loanApplication.purpose}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Key Conditions</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                      <span>
                        A down payment of <span className="font-semibold text-foreground">{formatCurrency(downPaymentAmountUSD)}</span> is
                        required to activate the loan.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                      <span>Monthly payments are due on the 1st of each month.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
                      <span>Late payment fees may apply as per the full loan agreement.</span>
                    </li>
                    <li className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-1 shrink-0" />
                      <span>Early repayment penalties may apply.</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="text-sm text-muted-foreground">
                  <p>
                    By proceeding with the down payment, you agree to the full terms and conditions of the loan
                    agreement. A comprehensive contract will be provided upon loan activation.
                  </p>
                  {selectedCurrency === 'NGN' && (
                    <p className="mt-2 text-orange-600 font-medium">
                      Note: Payment will be processed in Nigerian Naira (₦) through Paystack. The USD amount will be converted at the current exchange rate.
                    </p>
                  )}
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
          </div>
        </div>
      </div>
    </>
  )
}
