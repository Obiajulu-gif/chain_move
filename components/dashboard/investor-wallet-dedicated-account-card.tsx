"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Building2, CheckCircle2, Copy, Landmark, Loader2, Phone, Wallet } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNaira } from "@/lib/currency"
import { validatePhoneNumberInput } from "@/lib/validation/phone"
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
  userId?: string | null
  currentPhoneNumber?: string | null
  onPhoneSaved?: () => Promise<void> | void
}

function resolveStatusBadgeVariant(status?: string | null) {
  if (status === "ACTIVE") return "green" as const
  if (status === "PENDING") return "yellow" as const
  if (status === "FAILED") return "destructive" as const
  return "secondary" as const
}

export function InvestorWalletDedicatedAccountCard({
  internalBalanceNgn,
  userId,
  currentPhoneNumber,
  onPhoneSaved,
}: InvestorWalletDedicatedAccountCardProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isCopying, setIsCopying] = useState(false)
  const [isSavingPhone, setIsSavingPhone] = useState(false)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [phoneNumberInput, setPhoneNumberInput] = useState(currentPhoneNumber || "")
  const [account, setAccount] = useState<DedicatedFundingAccount | null>(null)

  const loadAccount = async () => {
    setIsLoading(true)
    setErrorCode(null)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/investor/virtual-account")
      const payload = await response.json()
      if (!response.ok) {
        setErrorCode(typeof payload?.code === "string" ? payload.code : null)
        throw new Error(payload.message || "Unable to load dedicated funding account.")
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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load dedicated funding account.")
      setAccount(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadAccount()
  }, [])

  useEffect(() => {
    setPhoneNumberInput(currentPhoneNumber || "")
  }, [currentPhoneNumber])

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

  const handlePhoneSave = async () => {
    const phoneValidation = validatePhoneNumberInput(phoneNumberInput, { required: true })
    if (phoneValidation.error || !phoneValidation.value) {
      setErrorMessage(phoneValidation.error || "Phone number is required.")
      setErrorCode("MISSING_PHONE_NUMBER")
      return
    }

    if (!userId) {
      setErrorMessage("We could not determine which investor profile to update. Refresh the page and try again.")
      setErrorCode("MISSING_PHONE_NUMBER")
      return
    }

    setIsSavingPhone(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneValidation.value,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || "Unable to save your phone number.")
      }

      toast({
        title: "Phone number saved",
        description: "We updated your profile and are retrying dedicated account provisioning now.",
      })

      if (onPhoneSaved) {
        await onPhoneSaved()
      }

      await loadAccount()
    } catch (error) {
      setErrorCode("MISSING_PHONE_NUMBER")
      setErrorMessage(error instanceof Error ? error.message : "Unable to save your phone number.")
    } finally {
      setIsSavingPhone(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <CardHeader className="border-b border-border/60 bg-[#FFF7EC]">
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
      <CardHeader className="border-b border-border/60 bg-[#FFF7EC]">
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
                  <Building2 className="h-4 w-4 text-[#E57A00]" />
                  {account.bankName}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Account Number</p>
                  <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.16em] text-foreground">
                    {account.accountNumber}
                  </p>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-[#E57A00]" />
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
                  <Wallet className="h-4 w-4 text-[#E57A00]" />
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
                  <Building2 className="h-4 w-4 text-[#E57A00]" />
                  Provider
                </div>
                <p className="mt-2">{account.providerSlug ? account.providerSlug : "Paystack dedicated virtual account"}</p>
              </div>
            </div>
          </>
        ) : errorCode === "MISSING_PHONE_NUMBER" ? (
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertTitle>Add a phone number to finish setup</AlertTitle>
            <AlertDescription className="space-y-4">
              <p>
                Your investor profile needs a contact phone number before Paystack can assign a dedicated funding
                account.
              </p>
              <div className="space-y-2">
                <Label htmlFor="wallet-phone-number">Contact phone number</Label>
                <Input
                  id="wallet-phone-number"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  value={phoneNumberInput}
                  onChange={(event) => {
                    setPhoneNumberInput(event.target.value)
                    if (errorMessage) {
                      setErrorMessage(null)
                    }
                  }}
                />
              </div>
              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" onClick={() => void handlePhoneSave()} disabled={isSavingPhone}>
                  {isSavingPhone ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving phone number...
                    </>
                  ) : (
                    "Save phone number and retry"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => void loadAccount()} disabled={isSavingPhone}>
                  Refresh account status
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Dedicated funding account unavailable</AlertTitle>
            <AlertDescription>
              <div className="space-y-3">
                <p>
                  {errorMessage ||
                    "We could not assign a dedicated funding account yet. You can still use the checkout fallback below."}
                </p>
                <Button type="button" variant="outline" onClick={() => void loadAccount()}>
                  Refresh account details
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
