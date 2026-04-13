"use client"

import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { AccountSettingsForm } from "@/components/dashboard/account-settings-form"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { resolveDashboardUserStatus } from "@/lib/users/user-profile"

export default function DriverSettingsPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading driver settings...</p>
        </div>
      </div>
    )
  }

  if (!authUser || authUser.role !== "driver") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need a driver account to open this page.</CardDescription>
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
      <Sidebar role="driver" />

      <div className="min-w-0 md:ml-64 lg:ml-72">
        <Header userStatus={resolveDashboardUserStatus(authUser)} showBackButton />

        <main className="min-w-0 space-y-6 p-4 md:p-6">
          <section className="rounded-xl border border-border/70 bg-card p-5">
            <h1 className="text-2xl font-semibold text-foreground">Driver settings</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Update your profile and contact information here. Vehicle verification and identity review stay in KYC.
            </p>
          </section>

          <AccountSettingsForm roleLabel="Driver" kycHref="/dashboard/driver/kyc" />
        </main>
      </div>
    </div>
  )
}
