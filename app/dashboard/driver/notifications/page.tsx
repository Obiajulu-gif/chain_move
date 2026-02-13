"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { NotificationCenter } from "@/components/dashboard/notification-center" // Assuming this component exists

export default function DriverNotificationsPage() {
  const { user: authUser, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!authUser || authUser.role !== "driver")) {
      router.replace("/signin") // Redirect if not logged in or not a driver
    }
  }, [authUser, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your account information.</p>
        </div>
      </div>
    )
  }

  if (!authUser || authUser.role !== "driver") {
    return null // Redirect handled by useEffect
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Sidebar role="driver" />
        <div className="md:ml-64 lg:ml-72">
          <Header
            userName={authUser.name || "Driver"}
            userStatus="Driver"
            notificationCount={authUser.notifications?.filter((n) => !n.read).length || 0}
            className="md:pl-6 lg:pl-8"
          />
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
            {/* Pass notifications to NotificationCenter */}
            <NotificationCenter userId={authUser.id} userRole="driver" notifications={authUser.notifications || []} />
          </div>
        </div>
      </div>
    </>
  )
}
