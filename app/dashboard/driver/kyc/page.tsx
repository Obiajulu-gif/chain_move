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
import { Loader2, UploadCloud, CheckCircle, CalendarIcon } from "lucide-react" // Added CalendarIcon
import { useAuth } from "@/hooks/use-auth"
import { usePlatform } from "@/contexts/platform-context"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { updateUserKycStatus } from "@/actions/user"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog" // Import Dialog components

export default function KycVerificationPage() {
  const { user: authUser, loading: authLoading, refetch } = useAuth()
  const { dispatch } = usePlatform()
  const { toast } = useToast()
  const router = useRouter()

  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [addressDocument, setAddressDocument] = useState<File | null>(null)
  const [bvnNinDocument, setBvnNinDocument] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New state for second stage KYC modal
  const [isSecondStageModalOpen, setIsSecondStageModalOpen] = useState(false)
  const [physicalMeetingDate, setPhysicalMeetingDate] = useState<string>("")
  const [isSchedulingMeeting, setIsSchedulingMeeting] = useState(false)

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
    if (!idDocument || !addressDocument || !bvnNinDocument) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents: ID, Proof of Address, and BVN/NIN.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const uploadedUrls: string[] = []

      // Upload ID Document
      const idUploadRes = await fetch(`/api/upload?filename=${idDocument.name}`, {
        method: "POST",
        body: idDocument,
      })
      if (!idUploadRes.ok) {
        throw new Error("Failed to upload ID document")
      }
      const idBlob = await idUploadRes.json()
      uploadedUrls.push(idBlob.url)

      // Upload Address Document
      const addressUploadRes = await fetch(`/api/upload?filename=${addressDocument.name}`, {
        method: "POST",
        body: addressDocument,
      })
      if (!addressUploadRes.ok) {
        throw new Error("Failed to upload address document")
      }
      const addressBlob = await addressUploadRes.json()
      uploadedUrls.push(addressBlob.url)

      // Upload BVN/NIN Document
      const bvnNinUploadRes = await fetch(`/api/upload?filename=${bvnNinDocument.name}`, {
        method: "POST",
        body: bvnNinDocument,
      })
      if (!bvnNinUploadRes.ok) {
        throw new Error("Failed to upload BVN/NIN document")
      }
      const bvnNinBlob = await bvnNinUploadRes.json()
      uploadedUrls.push(bvnNinBlob.url)

      // Update user KYC status to pending (first stage)
      const updateRes = await updateUserKycStatus(authUser.id, "pending", uploadedUrls)

      if (updateRes.success) {
        toast({
          title: "KYC Submitted",
          description:
            "Your first stage KYC documents have been submitted for review. We will notify you once it's processed.",
        })
        await refetch() // Re-fetch user data after DB update
        router.refresh() // Re-render current route (Server Components)
      } else {
        toast({
          title: "Submission Failed",
          description: updateRes.message || "There was an error submitting your KYC. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("KYC submission error:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during KYC submission.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!physicalMeetingDate) {
      toast({
        title: "Missing Date",
        description: "Please select a date for the physical meeting.",
        variant: "destructive",
      })
      return
    }

    setIsSchedulingMeeting(true)
    try {
      // Call the server action to update physical meeting details
      const updateRes = await updateUserKycStatus(
        authUser.id,
        "pending_stage2", // Set main KYC status to pending_stage2
        authUser.kycDocuments, // Pass existing documents
        null, // No rejection reason
        new Date(physicalMeetingDate), // Pass the selected date
        "scheduled", // Set physical meeting status to scheduled
      )

      if (updateRes.success) {
        toast({
          title: "Meeting Scheduled",
          description: `Your physical meeting has been scheduled for ${new Date(physicalMeetingDate).toLocaleDateString()}.`,
        })
        await refetch() // Re-fetch user data
        router.refresh() // Re-render current route
        setIsSecondStageModalOpen(false)
      } else {
        toast({
          title: "Scheduling Failed",
          description: updateRes.message || "There was an error scheduling the meeting. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Meeting scheduling error:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during meeting scheduling.",
        variant: "destructive",
      })
    } finally {
      setIsSchedulingMeeting(false)
    }
  }

  // Redirection logic
  useEffect(() => {
    if (!authLoading && authUser) {
      const kycStatus = (authUser as any)?.kycStatus || "none"
      const physicalMeetingStatus = (authUser as any)?.physicalMeetingStatus || "none"

      console.log("Current authUser kycStatus in useEffect:", kycStatus) // For debugging

      // Redirect if first stage is pending or second stage is pending/approved/rejected
      if (
        kycStatus === "pending" ||
        kycStatus === "pending_stage2" ||
        kycStatus === "approved_stage2" ||
        physicalMeetingStatus === "rejected_stage2" // If stage 2 was rejected, show status page
      ) {
        router.replace("/dashboard/driver/kyc/status")
      }
    }
  }, [authLoading, authUser, router])

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
  // If kycStatus is pending/approved_stage2/pending_stage2, we return null here to prevent rendering the form
  const kycStatus = (authUser as any)?.kycStatus || "none"
  const physicalMeetingStatus = (authUser as any)?.physicalMeetingStatus || "none"

  if (
    kycStatus === "pending" ||
    kycStatus === "pending_stage2" ||
    kycStatus === "approved_stage2" ||
    physicalMeetingStatus === "rejected_stage2"
  ) {
    return null
  }

  // Render first stage form if kycStatus is 'none' or 'rejected'
  const renderFirstStageForm = kycStatus === "none" || kycStatus === "rejected"

  // Render second stage prompt if kycStatus is 'approved_stage1'
  const renderSecondStagePrompt = kycStatus === "approved_stage1"

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
                  {renderFirstStageForm
                    ? "Please upload the required documents to verify your identity and address."
                    : "Complete the next step of your verification process."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderFirstStageForm && (
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

                    {/* BVN/NIN Document Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="bvn-nin-document">BVN/NIN Document</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="bvn-nin-document"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, setBvnNinDocument)}
                          className="flex-1"
                        />
                        {bvnNinDocument && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Uploaded
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Accepted formats: PDF, JPG, PNG. Max size: 5MB.</p>
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
                )}

                {renderSecondStagePrompt && (
                  <div className="text-center py-6 space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">
                      Thank you for completing the first stage of KYC!
                    </h3>
                    <p className="text-muted-foreground">
                      To finalize your verification, please schedule a physical meeting for house inspection.
                    </p>
                    <Button
                      onClick={() => setIsSecondStageModalOpen(true)}
                      className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                    >
                      Proceed with Second KYC
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Second Stage KYC Modal (Physical Meeting Scheduling) */}
      <Dialog open={isSecondStageModalOpen} onOpenChange={setIsSecondStageModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Physical Meeting</DialogTitle>
            <DialogDescription>
              Please choose a convenient date for the physical meeting and house inspection.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleMeeting} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">Preferred Date</Label>
              <Input
                id="meeting-date"
                type="date"
                value={physicalMeetingDate}
                onChange={(e) => setPhysicalMeetingDate(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSecondStageModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSchedulingMeeting}
                className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
              >
                {isSchedulingMeeting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
