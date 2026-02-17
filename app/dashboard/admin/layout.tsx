"use client"

import type React from "react"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { AdminShell } from "@/components/dashboard/admin/admin-shell"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!authUser || authUser.role !== "admin")) {
      router.replace("/signin")
    }
  }, [authLoading, authUser, router])

  if (authLoading || !authUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  if (authUser.role !== "admin") {
    return null
  }

  return <AdminShell userName={authUser.name || "Admin"}>{children}</AdminShell>
}

