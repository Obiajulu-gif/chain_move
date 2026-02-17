"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Calendar, Plus, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatNaira } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"

interface DriverPaymentFormProps {
  contractId: string
  defaultAmountNgn: number
  maxAmountNgn: number
  defaultEmail?: string | null
  nextDueDate?: string | null
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

function formatDateLabel(value?: string | null) {
  if (!value) return "Not scheduled"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not scheduled"
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function DriverPaymentForm({
  contractId,
  defaultAmountNgn,
  maxAmountNgn,
  defaultEmail,
  nextDueDate,
}: DriverPaymentFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const processedReferenceRef = useRef<string | null>(null)

  const [amountNgn, setAmountNgn] = useState(String(defaultAmountNgn || ""))
  const [email, setEmail] = useState(defaultEmail || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref")
    if (!reference || processedReferenceRef.current === reference) return

    processedReferenceRef.current = reference
    setIsVerifying(true)

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.message || "Unable to verify payment.")
        }

        if (payload.type === "driver_repayment" || payload.type === "repayment") {
          toast({
            title: "Payment confirmed",
            description: `Repayment of ${formatNaira(payload.appliedAmountNgn || payload.amountNgn || 0)} has been posted.`,
          })
          router.refresh()
        }
      } catch (error) {
        toast({
          title: "Verification failed",
          description: error instanceof Error ? error.message : "Unable to verify repayment.",
          variant: "destructive",
        })
      } finally {
        setIsVerifying(false)
        const params = new URLSearchParams(searchParams.toString())
        params.delete("reference")
        params.delete("trxref")
        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname)
      }
    }

    void verifyPayment()
  }, [pathname, router, searchParams, toast])

  const handleInitializePayment = async () => {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedAmount = toNumber(amountNgn)

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Enter a valid repayment amount in NGN.",
        variant: "destructive",
      })
      return
    }

    if (normalizedAmount > maxAmountNgn) {
      toast({
        title: "Amount too high",
        description: `Amount cannot exceed the remaining balance of ${formatNaira(maxAmountNgn)}.`,
        variant: "destructive",
      })
      return
    }

    if (!normalizedEmail) {
      toast({
        title: "Email required",
        description: "Please provide an email address for Paystack checkout.",
        variant: "destructive",
      })
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      toast({
        title: "Invalid email",
        description: "Enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/driver/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          amountNgn: normalizedAmount,
          email: normalizedEmail,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || "Unable to initialize Paystack payment.")
      }

      const redirectUrl = payload?.data?.authorization_url
      if (!redirectUrl) {
        throw new Error("Missing Paystack authorization URL.")
      }

      window.location.href = redirectUrl
    } catch (error) {
      toast({
        title: "Funding failed",
        description: error instanceof Error ? error.message : "Unable to start repayment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-[10px] border border-border/70 bg-card p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Make a Payment</h3>
          <p className="mt-1 text-sm text-muted-foreground">Payments are in NGN only.</p>
        </div>
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3.5 w-3.5" />
          Next due: {formatDateLabel(nextDueDate)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="driver-repayment-email">Email</Label>
          <Input
            id="driver-repayment-email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="driver-repayment-amount">Repayment amount (NGN)</Label>
          <Input
            id="driver-repayment-amount"
            type="number"
            inputMode="decimal"
            placeholder="50000"
            value={amountNgn}
            onChange={(event) => setAmountNgn(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Max payable now: {formatNaira(maxAmountNgn)}
          </p>
        </div>
      </div>

      <Button
        type="button"
        className="mt-4 h-10 w-full bg-[#E57A00] text-white hover:bg-[#D77200]"
        onClick={handleInitializePayment}
        disabled={isSubmitting || isVerifying}
      >
        {isSubmitting ? (
          <>
            <Wallet className="mr-2 h-4 w-4 animate-pulse" />
            Redirecting...
          </>
        ) : isVerifying ? (
          <>
            <Plus className="mr-2 h-4 w-4 animate-pulse" />
            Verifying payment...
          </>
        ) : (
          <>
            Continue to Paystack
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </section>
  )
}
