"use client"

import type { ReactNode } from "react"

import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
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
    <div className="min-h-screen bg-background">
      <Sidebar role="admin" />
      <div className="flex h-screen flex-col md:ml-64 lg:ml-72">
        <AdminTopbar userName={userName} />
        <AdminContent>{children}</AdminContent>
      </div>
    </div>
  )
}

