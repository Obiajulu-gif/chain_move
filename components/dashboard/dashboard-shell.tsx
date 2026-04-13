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
    <div className="min-h-dvh overflow-x-clip bg-background">
      <Sidebar
        role={role}
        mobileWidth={isCompact ? "w-[calc(100vw-1rem)] max-w-[232px]" : "w-[calc(100vw-1rem)] max-w-[18rem]"}
        className={isCompact ? "md:w-[212px] lg:w-[212px]" : undefined}
      />
      <div className={cn("min-w-0", isCompact ? "md:ml-[212px]" : "md:ml-64 lg:ml-72", className)}>
        {header}
        {children}
      </div>
    </div>
  )
}
