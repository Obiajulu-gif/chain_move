import type { ReactNode } from "react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

type DashboardRole = "driver" | "investor" | "admin"

interface DashboardShellProps {
  role: DashboardRole
  children: ReactNode
  header?: ReactNode
  className?: string
  sidebarWidth?: "default" | "compact"
}

export function DashboardShell({
  role,
  children,
  header,
  className,
  sidebarWidth = "default",
}: DashboardShellProps) {
  const isCompact = sidebarWidth === "compact"

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar
        role={role}
        mobileWidth={isCompact ? "w-[232px]" : "w-72"}
        className={isCompact ? "md:w-[212px] lg:w-[212px]" : undefined}
      />
      <div className={cn(isCompact ? "md:ml-[212px]" : "md:ml-64 lg:ml-72", className)}>
        {header}
        {children}
      </div>
    </div>
  )
}

