"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle, FileText, Eye, RefreshCw, AlertTriangle, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input" // Import Input for date picker

// Reusing the updateUserKycStatus Server Action
import { updateUserKycStatus } from "@/actions/user"

// Update the KycRequest interface to include new fields
interface KycRequest {
  _id: string
  name: string
  email: string
  kycStatus: "none" | "pending" | "approved_stage1" | "pending_stage2" | "approved_stage2" | "rejected"
  kycDocuments: string[]
  createdAt: string
  updatedAt: string
  kycRejectionReason?: string | null
  physicalMeetingDate?: string | null
  physicalMeetingStatus?: "none" | "scheduled" | "approved" | "rescheduled" | "completed" | "rejected_stage2" // Updated enum
}

export default function AdminKycManagementPage() {
  const { user: authUser, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [kycRequests, setKycRequests] = useState<KycRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for confirmation dialog (approve/reject stage 1, complete/reject stage 2)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<KycRequest | null>(null)
  const [actionType, setActionType] = useState<
    | "approve_stage1"
    | "reject_stage1"
    | "approve_meeting_date" // New action
    | "reschedule_meeting" // New action
    | "complete_stage2"
    | "reject_stage2"
    | null
  >(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rejectionReasonInput, setRejectionReasonInput] = useState("")

  // State for document viewer dialog
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState<string | null>(null)

  // State for reschedule meeting dialog
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [rescheduleDateInput, setRescheduleDateInput] = useState("")
  const [rescheduleReasonInput, setRescheduleReasonInput] = useState("")

  const fetchKycRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/kyc-requests")
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to fetch KYC requests")
      }
      const data: KycRequest[] = await res.json()
      setKycRequests(data)
    } catch (err: any) {
      console.error("Error fetching KYC requests:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      if (!authUser || authUser.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You must be an admin to view this page.",
          variant: "destructive",
        })
        router.replace("/signin") // Redirect non-admins
      } else {
        fetchKycRequests()
      }
    }
  }, [authLoading, authUser, router, toast, fetchKycRequests])

  const handleAction = (
    request: KycRequest,
    type:
      | "approve_stage1"
      | "reject_stage1"
      | "approve_meeting_date"
      | "reschedule_meeting"
      | "complete_stage2"
      | "reject_stage2",
  ) => {
    setSelectedRequest(request)
    setActionType(type)
    setRejectionReasonInput("") // Reset rejection reason input
    setRescheduleDateInput("") // Reset reschedule date input
    setRescheduleReasonInput("") // Reset reschedule reason input

    if (type === "reschedule_meeting") {
      setIsRescheduleDialogOpen(true)
    } else {
      setIsConfirmDialogOpen(true)
    }
  }

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return

    // If rejecting, ensure a reason is provided
    if ((actionType === "reject_stage1" || actionType === "reject_stage2") && !rejectionReasonInput.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting the KYC.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      let newKycStatus: KycRequest["kycStatus"] = selectedRequest.kycStatus
      let newPhysicalMeetingStatus: KycRequest["physicalMeetingStatus"] = selectedRequest.physicalMeetingStatus
      const newPhysicalMeetingDate: Date | null = selectedRequest.physicalMeetingDate
        ? new Date(selectedRequest.physicalMeetingDate)
        : null
      let rejectionReason: string | null = null

      switch (actionType) {
        case "approve_stage1":
          newKycStatus = "approved_stage1"
          break
        case "reject_stage1":
          newKycStatus = "rejected"
          rejectionReason = rejectionReasonInput.trim()
          break
        case "approve_meeting_date": // New action
          newPhysicalMeetingStatus = "approved"
          // kycStatus will be updated to pending_stage2 in actions/user.ts based on this transition
          break
        case "reschedule_meeting": // This action is handled by a separate dialog, but included for completeness
          // This case should ideally not be reached via this dialog
          break
        case "complete_stage2":
          newKycStatus = "approved_stage2"
          newPhysicalMeetingStatus = "completed"
          break
        case "reject_stage2":
          newKycStatus = "rejected" // Or keep approved_stage1 and set physicalMeetingStatus to rejected_stage2
          newPhysicalMeetingStatus = "rejected_stage2"
          rejectionReason = rejectionReasonInput.trim()
          break
        default:
          break
      }

      const res = await updateUserKycStatus(
        selectedRequest._id,
        newKycStatus,
        selectedRequest.kycDocuments,
        rejectionReason,
        newPhysicalMeetingDate, // Pass existing or updated date
        newPhysicalMeetingStatus, // Pass updated physical meeting status
      )

      if (res.success) {
        toast({
          title: "Success",
          description: `KYC for ${selectedRequest.name} has been ${actionType.replace(/_/g, " ")}.`,
        })
        fetchKycRequests() // Re-fetch to update the list
      } else {
        toast({
          title: "Action Failed",
          description: res.message || `Failed to ${actionType.replace(/_/g, " ")} KYC.`,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error(`Error during ${actionType.replace(/_/g, " ")} KYC:`, err)
      toast({
        title: "Error",
        description: `An unexpected error occurred during ${actionType.replace(/_/g, " ")} action.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsConfirmDialogOpen(false)
      setSelectedRequest(null)
      setActionType(null)
      setRejectionReasonInput("") // Clear input after action
    }
  }

  const handleRescheduleSubmit = async () => {
    if (!selectedRequest || !rescheduleDateInput || !rescheduleReasonInput.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a new date and provide a reason for rescheduling.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await updateUserKycStatus(
        selectedRequest._id,
        selectedRequest.kycStatus, // Keep current KYC status
        selectedRequest.kycDocuments,
        null, // No rejection reason for reschedule
        new Date(rescheduleDateInput), // New rescheduled date
        "rescheduled", // Set physical meeting status to rescheduled
      )

      if (res.success) {
        toast({
          title: "Success",
          description: `Physical meeting for ${selectedRequest.name} has been rescheduled to ${new Date(rescheduleDateInput).toLocaleDateString()}.`,
        })
        fetchKycRequests() // Re-fetch to update the list
      } else {
        toast({
          title: "Reschedule Failed",
          description: res.message || "Failed to reschedule the meeting.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error during reschedule:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred during reschedule action.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsRescheduleDialogOpen(false)
      setSelectedRequest(null)
      setActionType(null)
      setRescheduleDateInput("")
      setRescheduleReasonInput("")
    }
  }

  const openDocumentViewer = (url: string) => {
    setCurrentDocumentUrl(url)
    setIsDocumentViewerOpen(true)
  }

  const getStatusBadgeVariant = (status: KycRequest["kycStatus"]) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "approved_stage1":
        return "purple"
      case "pending_stage2":
        return "blue"
      case "approved_stage2":
        return "green"
      case "rejected":
        return "red"
      default:
        return "secondary"
    }
  }

  const getPhysicalMeetingStatusBadgeVariant = (status: KycRequest["physicalMeetingStatus"]) => {
    switch (status) {
      case "scheduled":
        return "yellow"
      case "approved":
        return "green"
      case "rescheduled":
        return "blue"
      case "completed":
        return "green"
      case "rejected_stage2":
        return "red"
      default:
        return "secondary"
    }
  }

  if (authLoading || (authUser && authUser.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">KYC Management</CardTitle>
          <Button onClick={fetchKycRequests} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={loading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">Review and manage driver KYC verification requests.</CardDescription>
          {error && (
            <div
              className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <AlertTriangle className="flex-shrink-0 inline w-4 h-4 me-3" />
              <span className="sr-only">Error</span>
              <div>{error}</div>
            </div>
          )}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : kycRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p>No KYC requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Meeting Status</TableHead>
                    <TableHead>Meeting Date</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(request.kycStatus)}>
                          {request.kycStatus.charAt(0).toUpperCase() + request.kycStatus.slice(1).replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.physicalMeetingStatus && request.physicalMeetingStatus !== "none" ? (
                          <Badge
                            variant={getPhysicalMeetingStatusBadgeVariant(request.physicalMeetingStatus)}
                            className="capitalize"
                          >
                            {request.physicalMeetingStatus.replace(/_/g, " ")}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.physicalMeetingDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(request.physicalMeetingDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.kycDocuments && request.kycDocuments.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {request.kycDocuments.map((doc, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => openDocumentViewer(doc)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                Doc {index + 1}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.kycRejectionReason ? (
                          <span className="text-sm text-red-600">{request.kycRejectionReason}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {request.kycStatus === "pending" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAction(request, "approve_stage1")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve Stage 1
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction(request, "reject_stage1")}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject Stage 1
                            </Button>
                          </div>
                        )}
                        {/* Updated condition to include pending_stage2 for scheduled meetings */}
                        {(request.kycStatus === "approved_stage1" || request.kycStatus === "pending_stage2") &&
                          request.physicalMeetingStatus === "scheduled" && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAction(request, "approve_meeting_date")}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve Meeting
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(request, "reschedule_meeting")}
                              >
                                <Calendar className="h-4 w-4 mr-1" /> Reschedule
                              </Button>
                            </div>
                          )}
                        {request.kycStatus === "pending_stage2" && request.physicalMeetingStatus === "approved" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAction(request, "complete_stage2")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Complete Stage 2
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction(request, "reject_stage2")}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject Stage 2
                            </Button>
                          </div>
                        )}
                        {/* Display "No action needed" for other statuses */}
                        {!(
                          request.kycStatus === "pending" ||
                          ((request.kycStatus === "approved_stage1" || request.kycStatus === "pending_stage2") &&
                            request.physicalMeetingStatus === "scheduled") ||
                          (request.kycStatus === "pending_stage2" && request.physicalMeetingStatus === "approved")
                        ) && <span className="text-muted-foreground text-sm">No action needed</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog (for approve/reject stage 1, approve/complete/reject stage 2) */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm KYC {actionType?.replace(/_/g, " ")}</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType?.replace(/_/g, " ")} KYC for{" "}
              <span className="font-semibold">{selectedRequest?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {(actionType === "reject_stage1" || actionType === "reject_stage2") && (
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Provide a detailed reason for rejection..."
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isSubmitting}
              className={
                actionType?.includes("approve") || actionType?.includes("complete")
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `${actionType?.replace(/_/g, " ")}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Meeting Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Physical Meeting</DialogTitle>
            <DialogDescription>
              Select a new date and provide a reason for rescheduling the physical meeting for{" "}
              <span className="font-semibold">{selectedRequest?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Preferred Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDateInput}
                onChange={(e) => setRescheduleDateInput(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-reason">Reason for Rescheduling</Label>
              <Textarea
                id="reschedule-reason"
                placeholder="Explain why the meeting is being rescheduled..."
                value={rescheduleReasonInput}
                onChange={(e) => setRescheduleReasonInput(e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRescheduleSubmit}
              disabled={isSubmitting || !rescheduleDateInput || !rescheduleReasonInput.trim()}
              className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Reschedule Meeting
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={isDocumentViewerOpen} onOpenChange={setIsDocumentViewerOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
            <DialogDescription>
              Viewing: {currentDocumentUrl ? currentDocumentUrl.split("/").pop() : "N/A"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {currentDocumentUrl ? (
              currentDocumentUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <img
                  src={currentDocumentUrl || "/placeholder.svg"}
                  alt="KYC Document"
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              ) : currentDocumentUrl.match(/\.pdf$/i) ? (
                <iframe src={currentDocumentUrl} className="w-full h-full border-0" />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Unsupported document type or invalid URL.</p>
                  <a
                    href={currentDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Download to view
                  </a>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No document selected.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentViewerOpen(false)}>
              Close
            </Button>
            {currentDocumentUrl && (
              <Button asChild>
                <a href={currentDocumentUrl} target="_blank" rel="noopener noreferrer">
                  Open in New Tab
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
