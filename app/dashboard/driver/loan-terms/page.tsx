"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Loader2, FileText, CreditCard } from "lucide-react"
import { usePlatform, useCurrentUser } from "@/contexts/platform-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useSearchParams } from "next/navigation"

export default function LoanTermsPage() {
  const { state, dispatch } = usePlatform()
  const currentUser = useCurrentUser()
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [loanApplication, setLoanApplication] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMakingPayment, setIsMakingPayment] = useState(false)

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
    } else if (!state.isLoading && !currentUser) {
      setIsLoading(false) // If no current user, stop loading and show blank
    }
  }, [state.isLoading, state.loanApplications, currentUser])

  // Handle payment return
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')
    
    if (paymentStatus === 'success' || reference || trxref) {
      toast({
        title: "Payment Processing",
        description: "Your payment is being verified. Please wait a moment...",
      })
      
      // Refresh the page data after a short delay to allow webhook processing
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }, [searchParams, toast])

  const handleMakeDownPayment = async () => {
    console.log('handleMakeDownPayment called');
    console.log('loanApplication:', loanApplication);
    console.log('currentUser:', currentUser);
    console.log('currentUser?.email:', currentUser?.email);
    
    if (!loanApplication || !currentUser?.email) {
      console.log('Early return: missing loanApplication or currentUser.email');
      return;
    }
    
    console.log('Proceeding with payment...');
    setIsMakingPayment(true)
    
    try {
      // Calculate down payment amount (15% of loan amount)
      const downPaymentAmount = loanApplication.requestedAmount * 0.15
      const loanId = loanApplication.id || loanApplication._id
      
      console.log('Sending payment request:', { loanId, amount: downPaymentAmount })
      console.log('Loan application object:', loanApplication)
      
      // Initialize payment with Paystack
      const response = await fetch('/api/payments/down-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanId: loanId,
          amount: downPaymentAmount
        })
      })
      
      const data = await response.json()
      console.log('Payment API response:', data)
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        console.log('Response not ok, throwing error')
        throw new Error(data.message || 'Failed to initialize payment')
      }
      
      console.log('Checking response structure:')
      console.log('data.success:', data.success)
      console.log('data.data:', data.data)
      console.log('data.data?.authorization_url:', data.data?.authorization_url)
      
      // Temporary: Try to extract authorization_url from any possible location
      let authUrl = null;
      if (data.data?.authorization_url) {
        authUrl = data.data.authorization_url;
      } else if (data.authorization_url) {
        authUrl = data.authorization_url;
      } else if (data.data?.data?.authorization_url) {
        authUrl = data.data.data.authorization_url;
      }
      
      console.log('Found authorization URL:', authUrl);
      
      if (authUrl) {
        console.log('Redirecting to:', authUrl)
        // Redirect to Paystack payment page
        window.location.href = authUrl
      } else {
        console.error('No authorization URL found in response:', JSON.stringify(data, null, 2))
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

  const downPaymentAmount = (loanApplication.requestedAmount * 0.15).toLocaleString()

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
                <CardTitle className="text-2xl font-bold">Loan Terms & Conditions</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Review your loan details before making the down payment.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-xl font-semibold text-foreground">
                      ${loanApplication.requestedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Term</p>
                    <p className="text-xl font-semibold text-foreground">{loanApplication.loanTerm} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Payment</p>
                    <p className="text-xl font-semibold text-foreground">
                      ${loanApplication.monthlyPayment.toLocaleString()}
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
                        A down payment of <span className="font-semibold text-foreground">${downPaymentAmount}</span> is
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
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-6 bg-secondary/20 rounded-b-lg">
                <Button
                  onClick={handleMakeDownPayment}
                  disabled={isMakingPayment}
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
                      Make Down Payment
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
