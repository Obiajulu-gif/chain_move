"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { DollarSign, Calendar as CalendarIcon, CreditCard, Clock } from "lucide-react"

const DriverRepaymentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64">
        <Header userName="Driver" userStatus="Active" />

        <div className="p-3 md:p-6 space-y-4 md:space-y-8 max-w-full overflow-x-hidden">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Repayment Center</h1>
            <p className="text-muted-foreground">Manage your loan payments and view transaction history</p>
          </div>

          <Card className="bg-card border-border text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Repayment Details
              </CardTitle>
              <CardDescription>Review and manage your payment information</CardDescription>
            </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Amount Due</p>
                    <p className="text-2xl font-bold text-foreground">$1,500.00</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Next Payment Due
                    </p>
                    <p className="text-lg font-medium text-foreground">March 15, 2024</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Due in 15 days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Last Payment
                    </p>
                    <p className="text-lg font-medium text-foreground">$500.00</p>
                    <p className="text-sm text-muted-foreground">on February 15, 2024</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </p>
                    <p className="text-foreground">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white flex-1">
                  Make a Payment
                </Button>
                <Button variant="outline" className="flex-1">
                  View Payment History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverRepaymentPage
