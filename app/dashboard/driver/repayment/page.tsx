"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import {
  DollarSign,
  Calendar as CalendarIcon,
  CreditCard,
  Clock,
} from "lucide-react";

const DriverRepaymentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" className="md:w-64 lg:w-72" />

      <div className="md:ml-64 lg:ml-72">
        <Header 
          userName="Driver" 
          userStatus="Active"
          className="md:pl-6 lg:pl-8"
        />

        <div className="p-3 md:p-6 space-y-4 md:space-y-8 max-w-full overflow-x-hidden">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Repayment Center
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Manage your loan payments and view transaction history
                </p>
              </div>
              <Badge 
                className="bg-yellow-600 text-white px-3 py-1 flex items-center gap-1"
                variant="outline"
              >
                <Clock className="h-4 w-4" />
                Due Soon
              </Badge>
            </div>
          </div>

          <Card className="bg-card border-border/50 hover:bg-card/70 transition-colors duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-foreground" />
                Repayment Details
              </CardTitle>
              <CardDescription>
                Review and manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg transition-colors duration-200 hover:bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        Total Amount Due
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-foreground">
                        $1,500.00
                      </p>
                    </div>

                    <div className="p-4 border border-border/50 rounded-lg transition-colors duration-200 hover:border-border">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-foreground" />
                        Next Payment Due
                      </p>
                      <p className="text-lg sm:text-xl font-medium text-foreground">
                        March 15, 2024
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600 text-white dark:bg-yellow-400 dark:text-black">
                          <Clock className="h-3 w-3 mr-1 text-white dark:text-black" />
                          Due in 15 days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border border-border/50 rounded-lg transition-colors duration-200 hover:border-border">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-foreground" />
                        Last Payment
                      </p>
                      <p className="text-lg sm:text-xl font-medium text-foreground">
                        $500.00
                      </p>
                      <p className="text-sm text-muted-foreground">
                        on February 15, 2024
                      </p>
                    </div>

                    <div className="p-4 border border-border/50 rounded-lg transition-colors duration-200 hover:border-border">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-foreground" />
                        Payment Method
                      </p>
                      <p className="text-foreground">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/25
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    className="bg-[#E57700] hover:bg-[#E57700]/90 text-white w-full sm:w-auto"
                    variant="default"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Make a Payment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto hover:bg-muted/50 transition-colors duration-200"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Payment History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverRepaymentPage;
