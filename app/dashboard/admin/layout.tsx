"use client"
import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react" // For loading spinner

/**
 * Defines the layout for the admin dashboard.
 * This component wraps all admin pages, providing a consistent structure
 * that includes a sidebar and a header. It ensures that all pages within the
 * admin section share the same navigation and header elements.
 * @param children The content to be rendered within the layout.
 * @returns The admin dashboard layout with the sidebar, header, and content.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth()
  const router = useRouter()

  // Handle loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  // Handle access denied for non-admins
  if (!authUser || authUser.role !== "admin") {
    router.replace("/signin") // Redirect to sign-in page
    return null // Don't render anything until redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="admin" />
      <div className="md:ml-64 lg:ml-72">
        {" "}
        {/* This is the main content wrapper */}
        <Header
          userName={authUser?.name || "Admin"}
          userStatus="Admin"
          notificationCount={0} // You might want to fetch actual notification count for admin
          className="md:pl-6 lg:pl-8"
        />
        {/* Apply padding directly to the main content area */}
        <main className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
