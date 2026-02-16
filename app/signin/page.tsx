"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIdentityToken, usePrivy } from "@privy-io/react-auth"
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function SignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, ready, authenticated } = usePrivy()
  const { identityToken } = useIdentityToken()

  const [isLaunchingPrivy, setIsLaunchingPrivy] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState("")
  const syncInFlightRef = useRef(false)

  const syncUser = useCallback(async () => {
    if (syncInFlightRef.current) return
    syncInFlightRef.current = true
    setIsSyncing(true)
    setError("")

    try {
      const privyToken = identityToken
      if (!privyToken) {
        throw new Error("Privy token is not ready yet. Please try again.")
      }

      const response = await fetch("/api/auth/privy/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${privyToken}`,
        },
        body: JSON.stringify({}),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Unable to sign in.")
      }

      toast({
        title: "Signed in",
        description: `Welcome back, ${result.user?.name || "User"}.`,
      })

      const role = result.user?.role || "investor"
      router.replace(`/dashboard/${role}`)
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : "Unable to sign in.")
    } finally {
      setIsSyncing(false)
      setIsLaunchingPrivy(false)
      syncInFlightRef.current = false
    }
  }, [identityToken, router, toast])

  const handlePrivySignIn = () => {
    setError("")
    setIsLaunchingPrivy(true)
    try {
      login({
        loginMethods: ["email", "sms"],
      })
    } catch {
      setIsLaunchingPrivy(false)
      setError("Unable to open Privy authentication. Please try again.")
    }
  }

  useEffect(() => {
    if (!ready || !authenticated || !identityToken) return
    void syncUser()
  }, [authenticated, identityToken, ready, syncUser])

  return (
    <AuthLayout
      title="Sign in to ChainMove"
      description="Continue securely with Privy to access your dashboard."
      sideTitle="Wallet-first authentication"
      sideDescription="Sign in once with Privy and continue with your embedded wallet and account session."
      sidePoints={[
        "No wallet extension required",
        "Embedded wallet auto-provisioning",
        "Unified account access across dashboard flows",
      ]}
      footer={
        <p className="text-sm text-[#666666]">
          New to ChainMove?{" "}
          <Link
            href="/auth"
            className="font-medium text-[#F2780E] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2780E]"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-[#666666]">
          Continue with your verified email or phone through Privy. Your wallet and session will be restored
          automatically.
        </p>

        {error ? (
          <div
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <Button
          type="button"
          onClick={handlePrivySignIn}
          disabled={isLaunchingPrivy || isSyncing}
          className="h-12 w-full rounded-xl bg-[#F2780E] text-white hover:bg-[#DF6D0A] focus-visible:ring-[#F2780E]"
        >
          {isLaunchingPrivy || isSyncing ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {isSyncing ? "Signing you in..." : "Opening Privy..."}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              Continue with Privy
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </AuthLayout>
  )
}
