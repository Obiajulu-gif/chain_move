"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2, UploadCloud } from "lucide-react"

import { updateUserKycStatus } from "@/actions/user"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function InvestorKycPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser, loading: authLoading, refetch } = useAuth()

  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [addressDocument, setAddressDocument] = useState<File | null>(null)
  const [bvnNinDocument, setBvnNinDocument] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (authLoading || !authUser || authUser.role !== "investor") return

    const status = authUser.kycStatus || "none"
    if (status === "pending" || status === "approved_stage1" || status === "approved_stage2") {
      router.replace("/dashboard/investor/kyc/status")
    }
  }, [authLoading, authUser, router])

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!authUser) {
      toast({
        title: "Session required",
        description: "Please sign in again before submitting KYC.",
        variant: "destructive",
      })
      return
    }

    if (!idDocument || !addressDocument || !bvnNinDocument) {
      toast({
        title: "Missing documents",
        description: "Upload all required KYC documents before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const files = [idDocument, addressDocument, bvnNinDocument]
      const uploadedRefs: string[] = []

      for (const file of files) {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&scope=kyc`, {
          method: "POST",
          body: file,
        })

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload.message || `Failed to upload ${file.name}.`)
        }

        const payload = await response.json()
        if (typeof payload.documentRef !== "string") {
          throw new Error(`Upload for ${file.name} did not return a valid document reference.`)
        }

        uploadedRefs.push(payload.documentRef)
      }

      const result = await updateUserKycStatus(authUser.id, "pending", uploadedRefs)
      if (!result.success) {
        throw new Error(result.message || "Unable to submit investor KYC.")
      }

      await refetch?.()

      toast({
        title: "KYC submitted",
        description: "Your investor verification documents have been sent for review.",
      })

      router.replace("/dashboard/investor/kyc/status")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Unable to submit investor KYC.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading investor KYC...</p>
        </div>
      </div>
    )
  }

  if (!authUser || authUser.role !== "investor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>You need an investor account to access this KYC flow.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isRejected = authUser.kycStatus === "rejected"

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        role="investor"
        mobileWidth="w-[calc(100vw-1rem)] max-w-[212px]"
        className="md:w-[212px] lg:w-[212px]"
      />

      <div className="min-w-0 md:ml-[212px]">
        <Header userStatus="Verified Investor" showBackButton />

        <main className="min-w-0 space-y-6 p-4 md:p-6">
          <section className="rounded-xl border border-border/70 bg-card p-5">
            <h1 className="text-2xl font-semibold text-foreground">Investor KYC</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit identity and address documents here. This verification flow is separate from account settings.
            </p>
          </section>

          <Card className="mx-auto w-full max-w-3xl border-border/70">
            <CardHeader>
              <CardTitle>Verification documents</CardTitle>
              <CardDescription>
                Upload the required documents for compliance review before investing with full access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isRejected ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
                  <p className="font-medium text-destructive">Previous KYC submission was rejected.</p>
                  <p className="mt-1 text-muted-foreground">
                    {authUser.kycRejectionReason || "Review the requirements and upload clearer documents to resubmit."}
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  {
                    id: "investor-id-document",
                    label: "Government-issued ID",
                    file: idDocument,
                    setter: setIdDocument,
                  },
                  {
                    id: "investor-address-document",
                    label: "Proof of address",
                    file: addressDocument,
                    setter: setAddressDocument,
                  },
                  {
                    id: "investor-bvn-document",
                    label: "BVN / NIN document",
                    file: bvnNinDocument,
                    setter: setBvnNinDocument,
                  },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Input
                        id={field.id}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) => handleFileChange(event, field.setter)}
                        className="flex-1"
                      />
                      {field.file ? (
                        <Badge variant="secondary" className="inline-flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          Ready
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG. Max size: 10MB.</p>
                  </div>
                ))}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 sm:w-auto"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isSubmitting ? "Submitting..." : "Submit investor KYC"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
