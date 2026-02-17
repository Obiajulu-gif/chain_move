"use client"

import { Bell, ChevronDown, User } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  title?: string
  welcomeName: string
  walletChipLabel?: string | null
  onWalletChipClick?: () => void
  notificationCount?: number
}

export function DashboardHeader({
  title = "Dashboard",
  welcomeName,
  walletChipLabel,
  onWalletChipClick,
  notificationCount = 0,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="flex h-[60px] items-center justify-between px-4 md:px-6">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-none text-foreground">{title}</h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">Welcome back, {welcomeName}</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted" />

          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[#E53935] px-1 text-[9px] font-semibold text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            ) : null}
          </Button>

          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 rounded-full bg-muted px-2 text-muted-foreground"
            aria-label="Profile menu"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
              <User className="h-3.5 w-3.5" />
            </span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {walletChipLabel ? (
            <button
              type="button"
              onClick={onWalletChipClick}
              className="hidden h-8 items-center rounded-md bg-[#E57A00] px-4 text-xs font-semibold text-white hover:bg-[#D77200] md:inline-flex"
            >
              {walletChipLabel}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
