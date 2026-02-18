"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DashboardRouteLoadingProps {
  title: string
  description?: string
  className?: string
}

export function DashboardRouteLoading({ title, description, className }: DashboardRouteLoadingProps) {
  return (
    <div className={cn("min-h-screen bg-background p-4 sm:p-6", className)}>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="space-y-3 rounded-2xl border bg-card p-5 sm:p-6">
          <p className="text-lg font-semibold">{title}</p>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border bg-card p-4">
              <Skeleton className="mb-3 h-4 w-28" />
              <Skeleton className="mb-2 h-6 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-2xl border bg-card p-4 sm:p-6">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-xl border p-4">
                <Skeleton className="mb-2 h-4 w-52" />
                <Skeleton className="mb-3 h-3 w-40" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
