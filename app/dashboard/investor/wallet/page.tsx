"use client"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardRouteLoading } from "@/components/dashboard/dashboard-route-loading"
import { useAuth } from "@/hooks/use-auth"

const InvestorWalletPanel = dynamic(
  () => import("@/components/dashboard/investor-wallet-panel").then((module) => module.InvestorWalletPanel),
)

export default function InvestorWalletPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()

  if (authLoading) {
    return <DashboardRouteLoading title="Loading wallet" description="Preparing wallet balances and transactions." />
  }

  if (!authUser || authUser.role !== "investor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need an investor account to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="investor" />
      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Investor" />
        <main className="p-4 sm:p-6 lg:p-8">
          <InvestorWalletPanel />
        </main>
      </div>
    </div>
  )
}
