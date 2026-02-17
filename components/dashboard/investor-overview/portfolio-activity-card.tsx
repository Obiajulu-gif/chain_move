"use client"

import { ChevronRight, Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export interface PortfolioActivityItem {
  id: string
  title: string
  startedLabel: string
  amountLabel: string
  monthlyReturnsLabel: string
  progressLabel: string
  progressPercent: number
}

interface PortfolioActivityCardProps {
  activities: PortfolioActivityItem[]
  isLoading: boolean
  isRefreshing?: boolean
  onRefresh: () => void
  onViewAll: () => void
}

export function PortfolioActivityCard({
  activities,
  isLoading,
  isRefreshing = false,
  onRefresh,
  onViewAll,
}: PortfolioActivityCardProps) {
  return (
    <section className="rounded-[10px] border border-border/70 bg-card p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Portfolio activity</h3>
          <p className="mt-1 text-sm text-muted-foreground">Recent investments and payout progress.</p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label="Refresh portfolio activity"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-[10px] border border-border/70 p-4">
              <Skeleton className="mb-3 h-6 w-44" />
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="mb-3 h-2 w-full" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No portfolio activity yet.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <article key={activity.id} className="rounded-[10px] border border-border/70 px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold leading-none text-foreground">{activity.title}</h4>
                  <p className="mt-1.5 text-sm text-muted-foreground">{activity.startedLabel}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold leading-none text-foreground">{activity.amountLabel}</p>
                  <p className="mt-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">{activity.monthlyReturnsLabel}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Payout Progress</p>
                  <p className="text-sm text-muted-foreground">{activity.progressLabel}</p>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-emerald-600 dark:bg-emerald-500"
                    style={{ width: `${Math.min(Math.max(activity.progressPercent, 0), 100)}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="mt-3 h-9 w-full text-sm"
        onClick={onViewAll}
      >
        {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        View All
        <ChevronRight className="ml-1.5 h-4 w-4" />
      </Button>
    </section>
  )
}
