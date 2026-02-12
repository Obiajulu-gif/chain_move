"use client"

import { useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Wallet } from "lucide-react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"

export const ConnectButtonWidget = () => {
  const { address } = useAccount()
  const { user } = useAuth()
  const pathname = usePathname()
  const { toast } = useToast()

  const isDriverRoute = pathname?.startsWith("/dashboard/driver")
  const driverLabel = useMemo(() => getUserDisplayName(user, "Driver"), [user])

  useEffect(() => {
    const registerWallet = async () => {
      if (!address) return

      try {
        const signupRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: address, walletaddress: address, role: "driver" }),
        })
        const signupData = await signupRes.json()

        if (!signupData.success) {
          return
        }

        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletaddress: address }),
        })
        const loginData = await loginRes.json()

        if (loginData.token || loginData.success) {
          toast({
            title: "Wallet connected",
            description: `Welcome back, ${loginData.user?.name || "Driver"}.`,
          })
          return
        }
      } catch {}
    }

    registerWallet()
  }, [address, toast])

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {!connected ? (
              <Button
                onClick={openConnectModal}
                type="button"
                className="mx-auto flex w-full max-w-md items-center justify-center bg-[#E57700] py-3 text-white hover:bg-[#E57700]/90"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            ) : chain.unsupported ? (
              <Button
                onClick={openChainModal}
                type="button"
                className="mx-auto flex w-full max-w-md items-center justify-center bg-[#E57700] py-3 text-white hover:bg-[#E57700]/90"
              >
                Wrong network
              </Button>
            ) : (
              <button
                onClick={openAccountModal}
                className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded bg-[#E57700] px-4 py-2 text-white"
              >
                {isDriverRoute ? driverLabel : account.displayName}
                {!isDriverRoute && account.displayBalance ? ` (${account.displayBalance})` : ""}
              </button>
            )}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
