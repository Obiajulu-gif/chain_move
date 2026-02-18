"use client"

import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Header } from "@/components/dashboard/header"
import { cn } from "@/lib/utils"

interface AdminShellProps {
  userName: string
  children: ReactNode
}

interface AdminTopbarProps {
  userName: string
  notificationCount?: number
  className?: string
}

interface AdminContentProps {
  children: ReactNode
  className?: string
}

export function AdminTopbar({ userName, notificationCount = 0, className }: AdminTopbarProps) {
  return (
    <Header
      userName={userName}
      userStatus="System Administrator"
      notificationCount={notificationCount}
      className={className}
    />
  )
}

export function AdminContent({ children, className }: AdminContentProps) {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className={cn("mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 md:p-6", className)}>{children}</div>
    </main>
  )
}

export function AdminShell({ userName, children }: AdminShellProps) {
  return (
    <DashboardShell role="admin" header={<AdminTopbar userName={userName} />} className="flex min-h-dvh flex-col">
      <AdminContent>{children}</AdminContent>
    </DashboardShell>
  )
}
