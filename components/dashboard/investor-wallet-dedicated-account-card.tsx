"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle, Building2, CheckCircle2, Copy, Landmark, Loader2, Phone, Wallet } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNaira } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"

interface DedicatedFundingAccount {
  accountNumber: string
  accountName: string
  bankName: string
  providerSlug?: string | null
  status: "PENDING" | "ACTIVE" | "FAILED" | "INACTIVE"
}

interface InvestorWalletDedicatedAccountCardProps {
  internalBalanceNgn: number
  profileFullName?: string
  profilePhoneNumber?: string
  onProfileUpdated?: () => Promise<void> | void
}

function resolveStatusBadgeVariant(status?: string | null) {
  if (status === "ACTIVE") return "green" as const
  if (status === "PENDING") return "yellow" as const
  if (status === "FAILED") return "destructive" as const
  return "secondary" as const
}

function normalizePhoneInput(value: string) {
  return value.trim().replace(/[\s()-]/g, "")
}

function isPlausiblePhoneNumber(value: string) {
  return /^\+?\d{7,15}$/.test(value)
}

export function InvestorWalletDedicatedAccountCard({
  internalBalanceNgn,
  profileFullName,
  profilePhoneNumber,
  onProfileUpdated,
}: InvestorWalletDedicatedAccountCardProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isCopying, setIsCopying] = useState(false)
  const [isSavingPhone, setIsSavingPhone] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [account, setAccount] = useState<DedicatedFundingAccount | null>(null)
  const [phoneNumber, setPhoneNumber] = useState(profilePhoneNumber || "")
  const [phoneFormError, setPhoneFormError] = useState<string | null>(null)

  useEffect(() => {
    setPhoneNumber(profilePhoneNumber || "")
  }, [profilePhoneNumber])

  const loadAccount = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)
    setErrorCode(null)

    try {
      const response = await fetch("/api/investor/virtual-account", { cache: "no-store" })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const nextError = payload && typeof payload === "object" ? payload : {}
        const nextMessage =
          "message" in nextError && typeof nextError.message === "string"
            ? nextError.message
            : "Unable to load dedicated funding account."
        const nextCode =
          "code" in nextError && typeof nextError.code === "string"
            ? nextError.code
            : null

        setErrorCode(nextCode)
        throw new Error(nextMessage)
      }

      const accountData = payload?.data
      if (!accountData?.accountNumber || !accountData?.accountName || !accountData?.bankName) {
        throw new Error("Dedicated funding account is not ready yet. Please try again shortly.")
      }

      setAccount({
        accountNumber: accountData.accountNumber,
        accountName: accountData.accountName,
        bankName: accountData.bankName,
        providerSlug: accountData.providerSlug,
        status: accountData.status,
      })
      setErrorCode(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load dedicated funding account.")
      setAccount(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAccount()
  }, [loadAccount])

  const handleSavePhoneNumber = async () => {
    const normalizedPhoneNumber = normalizePhoneInput(phoneNumber)

    if (!profileFullName?.trim()) {
      setPhoneFormError("Your profile is missing a full name. Update it in Settings before requesting a funding account.")
      return
    }

    if (!normalizedPhoneNumber) {
      setPhoneFormError("Enter your contact phone number before continuing.")
      return
    }

    if (!isPlausiblePhoneNumber(normalizedPhoneNumber)) {
      setPhoneFormError("Enter a valid phone number in local or international format.")
      return
    }

    setIsSavingPhone(true)
    setPhoneFormError(null)

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profileFullName.trim(),
          phoneNumber: normalizedPhoneNumber,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
            ? payload.message
            : "Unable to save your phone number.",
        )
      }

      setPhoneNumber(normalizedPhoneNumber)
      toast({
        title: "Phone number saved",
        description: "Retrying dedicated funding account setup now.",
      })

      await onProfileUpdated?.()
      await loadAccount()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save your phone number."
      setPhoneFormError(message)
    } finally {
      setIsSavingPhone(false)
    }
  }

  const handleCopy = async () => {
    if (!account?.accountNumber) return

    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(account.accountNumber)
      toast({
        title: "Account number copied",
        description: `${account.accountNumber} is ready to paste into your banking app.`,
      })
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy the dedicated account number from this session.",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <CardHeader className="border-b border-border/60 bg-amber-50/80 dark:bg-amber-950/25">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4 p-4 md:p-5">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-border/70 bg-card">
      <CardHeader className="border-b border-border/60 bg-amber-50/80 dark:bg-amber-950/25">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-xl text-foreground">Dedicated Funding Account</CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              Transfer to this account and your internal NGN wallet will be credited automatically after Paystack webhook confirmation.
            </CardDescription>
          </div>
          <Badge variant={resolveStatusBadgeVariant(account?.status || (errorMessage ? "FAILED" : "PENDING"))}>
            {account?.status || (errorMessage ? "Unavailable" : "Provisioning")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 md:p-5">
        {account ? (
          <>
            <div className="grid gap-4 rounded-lg border border-border/60 bg-background p-4 md:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  {account.bankName}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Account Number</p>
                  <p className="mt-2 break-all font-mono text-[1.65rem] font-semibold tracking-[0.12em] text-foreground sm:text-3xl sm:tracking-[0.16em]">
                    {account.accountNumber}
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{account.accountName}</span>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-dashed border-border/70 bg-muted/30 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current Internal Balance</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{formatNaira(internalBalanceNgn)}</p>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={handleCopy} disabled={isCopying}>
                  <Copy className="mr-2 h-4 w-4" />
                  {isCopying ? "Copying..." : "Copy Account Number"}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => void loadAccount()}>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Refresh account details
                </Button>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <div className="rounded-md border border-border/60 bg-background p-3">
                <div className="inline-flex items-center gap-2 font-medium text-foreground">
                  <Wallet className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Bank transfer first
                </div>
                <p className="mt-2">This is the primary fiat funding method for your internal NGN wallet.</p>
              </div>
              <div className="rounded-md border border-border/60 bg-background p-3">
                <div className="inline-flex items-center gap-2 font-medium text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Auto-crediting
                </div>
                <p className="mt-2">Dedicated-account deposits are routed through the webhook and posted as wallet funding.</p>
              </div>
              <div className="rounded-md border border-border/60 bg-background p-3">
                <div className="inline-flex items-center gap-2 font-medium text-foreground">
                  <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Provider
                </div>
                <p className="mt-2">{account.providerSlug ? account.providerSlug : "Paystack dedicated virtual account"}</p>
              </div>
            </div>
          </>
        ) : errorCode === "MISSING_PHONE_NUMBER" ? (
          <div className="rounded-lg border border-border/60 bg-background p-4">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-foreground">Add a phone number to finish setup</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your investor profile needs a contact phone number before Paystack can assign a dedicated funding
                  account.
                </p>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="investor-dva-phone">Contact phone number</Label>
                  <Input
                    id="investor-dva-phone"
                    inputMode="tel"
                    placeholder="+2348012345678"
                    value={phoneNumber}
                    onChange={(event) => {
                      setPhoneNumber(event.target.value)
                      if (phoneFormError) {
                        setPhoneFormError(null)
                      }
                    }}
                    disabled={isSavingPhone}
                  />
                </div>

                {phoneFormError ? <p className="mt-3 text-sm text-destructive">{phoneFormError}</p> : null}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={handleSavePhoneNumber}
                    disabled={isSavingPhone}
                    className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400"
                  >
                    {isSavingPhone ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSavingPhone ? "Saving phone number..." : "Save phone number and retry"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => void loadAccount()} disabled={isSavingPhone}>
                    Refresh account status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Dedicated funding account unavailable</AlertTitle>
            <AlertDescription>
              {errorMessage ||
                "We could not assign a dedicated funding account yet. You can still use the checkout fallback below."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
