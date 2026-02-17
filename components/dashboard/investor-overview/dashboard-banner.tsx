"use client"

import { ArrowRight, Link2, ShieldAlert } from "lucide-react"

interface DashboardBannerProps {
  variant: "connect-wallet" | "kyc"
  onAction: () => void
}

export function DashboardBanner({ variant, onAction }: DashboardBannerProps) {
  if (variant === "connect-wallet") {
    return (
      <section className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30 md:px-5 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              <Link2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold leading-none text-foreground md:text-xl">Connect Your Crypto Wallet</p>
              <p className="mt-1 text-sm text-muted-foreground">Connect your crypto wallet to enable deposits and withdrawals.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAction}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            Connect Wallet
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30 md:px-5 md:py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-300 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-none text-foreground md:text-xl">Update your KYC Information</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please complete identity verification before 13th March 2026 to enable fiat withdrawals.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAction}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
        >
          Complete Verification
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
