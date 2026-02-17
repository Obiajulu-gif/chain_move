"use client"

import { PlusCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

interface WalletsCardProps {
  fiatBalanceLabel: string
  cryptoBalanceLabel: string
  walletAddressLabel: string
  isRefreshing?: boolean
  isDepositingCrypto?: boolean
  onRefresh: () => void
  onFundWallet: () => void
  onDepositCrypto: () => void
  onWithdrawToBank: () => void
  disableDepositCrypto?: boolean
}

export function WalletsCard({
  fiatBalanceLabel,
  cryptoBalanceLabel,
  walletAddressLabel,
  isRefreshing = false,
  isDepositingCrypto = false,
  onRefresh,
  onFundWallet,
  onDepositCrypto,
  onWithdrawToBank,
  disableDepositCrypto = false,
}: WalletsCardProps) {
  return (
    <section className="rounded-[10px] border border-border/70 bg-card p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Wallets</h3>
          <p className="mt-1 text-sm text-muted-foreground">View your balance across currencies</p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          aria-label="Refresh wallets"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="space-y-3">
        <article className="rounded-[10px] border border-border/70 px-4 py-4 text-center">
          <p className="text-[15px] text-muted-foreground">Fiat Wallet</p>
          <p className="mt-1.5 text-xl font-semibold leading-none text-foreground">{fiatBalanceLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">Available for reinvestment or bank withdrawal.</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              className="h-9 bg-[#E57A00] text-white hover:bg-[#D77200]"
              onClick={onFundWallet}
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Fund Wallet
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={onWithdrawToBank}
            >
              Withdraw to Bank
            </Button>
          </div>
        </article>

        <article className="rounded-[10px] border border-border/70 px-4 py-4 text-center">
          <p className="text-[15px] text-muted-foreground">Crypto Wallet</p>
          <p className="mt-1.5 text-xl font-semibold leading-none text-foreground">{cryptoBalanceLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">Connected wallet <span className="font-semibold text-emerald-600 dark:text-emerald-400">{walletAddressLabel}</span></p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              className="h-9 bg-[#E57A00] text-white hover:bg-[#D77200]"
              onClick={onDepositCrypto}
              disabled={disableDepositCrypto || isDepositingCrypto}
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              Deposit Crypto
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9"
              onClick={onWithdrawToBank}
            >
              Withdraw to Bank
            </Button>
          </div>
        </article>
      </div>
    </section>
  )
}
