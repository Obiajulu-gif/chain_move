"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react" // Import useCallback
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UploadCloud, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { usePlatform } from "@/contexts/platform-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { updateUserKycStatus } from "@/actions/user"

export default function KycVerificationPage() {
  const { user: authUser, loading: authLoading, refetch } = useAuth()
  const { dispatch } = usePlatform()
  const { toast } = useToast()
  const router = useRouter()

  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [addressDocument, setAddressDocument] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idDocument || !addressDocument) {
      toast({
        title: "Missing Documents",
        description: "Please upload both your ID and Proof of Address.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const uploadedDocumentNames = [idDocument.name, addressDocument.name]

      const updateRes = await updateUserKycStatus(authUser.id, "pending", uploadedDocumentNames)

      if (updateRes.success) {
        toast({
          title: "KYC Submitted",
          description: "Your KYC documents have been submitted for review. We will notify you once it's processed.",
        })
        await refetch() // Re-fetch user data after DB update
        router.refresh() // Re-render current route (Server Components)
        // No need to push here, the useEffect below will handle redirection
      } else {
        toast({
          title: "Submission Failed",
          description: updateRes.message || "There was an error submitting your KYC. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("KYC submission error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during KYC submission.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- IMPORTANT CHANGE HERE ---
  // Move the redirection logic into a useEffect hook
  useEffect(() => {
    if (!authLoading && authUser) {
      const kycStatus = (authUser as any)?.kycStatus || "none"
      console.log("Current authUser kycStatus in useEffect:", kycStatus) // For debugging

      if (kycStatus === "pending" || kycStatus === "approved") {
        router.replace("/dashboard/driver/kyc/status")
      }
    }
  }, [authLoading, authUser, router]) // Dependencies: re-run when these values change

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your account information.</p>
        </div>
      </div>
    )
  }

  if (!authUser || authUser.role !== "driver") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need to be logged in as a driver to access this page.</p>
          <Button onClick={() => router.push("/signin")} className="mt-4">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  // If the useEffect has already triggered a redirect, this component will unmount.
  // If kycStatus is pending/approved, we return null here to prevent rendering the form
  // while the redirect is in progress or if the user somehow lands here with an updated status.
  const kycStatus = (authUser as any)?.kycStatus || "none"
  if (kycStatus === "pending" || kycStatus === "approved") {
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Sidebar role="driver" />
        <div className="md:ml-64 lg:ml-72">
          <Header
            userName={authUser.name || "Driver"}
            userStatus="Driver"
            notificationCount={0}
            className="md:pl-6 lg:pl-8"
          />
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">KYC Verification</CardTitle>
                <CardDescription>
                  Please upload the required documents to verify your identity and address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitKyc} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="id-document">Government-Issued ID (e.g., Driver's License, Passport)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="id-document"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, setIdDocument)}
                        className="flex-1"
                      />
                      {idDocument && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Uploaded
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Accepted formats: PDF, JPG, PNG. Max size: 5MB.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address-document">Proof of Address (e.g., Utility Bill, Bank Statement)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="address-document"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, setAddressDocument)}
                        className="flex-1"
                      />
                      {addressDocument && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Uploaded
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Must be dated within the last 3 months.</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Submit for Verification
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
