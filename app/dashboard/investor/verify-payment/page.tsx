"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const reference = searchParams.get("reference")
    const target = reference ? `/dashboard/investor?reference=${reference}` : "/dashboard/investor"

    const timer = window.setTimeout(() => {
      router.replace(target)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verifying payment</CardTitle>
          <CardDescription>Please wait while we confirm your transaction status.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting to your investor dashboard...
        </CardContent>
      </Card>
    </div>
  )
}
