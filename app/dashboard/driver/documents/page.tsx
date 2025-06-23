"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Camera,
  CreditCard,
  Car,
  Shield,
  Download,
  Eye,
  Trash2,
} from "lucide-react"

interface Document {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  required: boolean
  status: "pending" | "uploaded" | "verified" | "rejected" | "expired"
  file?: File
  uploadDate?: string
  expiryDate?: string
  size?: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "national-id",
      name: "National ID Card",
      description: "Government-issued identification card",
      icon: Shield,
      required: true,
      status: "verified",
      uploadDate: "2024-12-01",
      expiryDate: "2029-12-01",
      size: "2.1 MB",
    },
    {
      id: "drivers-license",
      name: "Driver's License",
      description: "Valid driving license",
      icon: Car,
      required: true,
      status: "verified",
      uploadDate: "2024-12-01",
      expiryDate: "2026-08-15",
      size: "1.8 MB",
    },
    {
      id: "bank-statement",
      name: "Bank Statement",
      description: "Last 3 months bank statement",
      icon: CreditCard,
      required: true,
      status: "uploaded",
      uploadDate: "2024-12-15",
      size: "3.2 MB",
    },
    {
      id: "proof-of-income",
      name: "Proof of Income",
      description: "Salary slip or business registration",
      icon: FileText,
      required: true,
      status: "rejected",
      uploadDate: "2024-12-10",
      size: "1.5 MB",
    },
    {
      id: "utility-bill",
      name: "Utility Bill",
      description: "Recent utility bill for address verification",
      icon: FileText,
      required: false,
      status: "pending",
    },
    {
      id: "passport-photo",
      name: "Passport Photograph",
      description: "Recent passport-sized photograph",
      icon: Camera,
      required: true,
      status: "verified",
      uploadDate: "2024-12-01",
      size: "0.8 MB",
    },
    {
      id: "vehicle-registration",
      name: "Vehicle Registration",
      description: "Vehicle registration certificate",
      icon: Car,
      required: true,
      status: "expired",
      uploadDate: "2024-01-15",
      expiryDate: "2024-12-31",
      size: "1.2 MB",
    },
  ])

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    if (!selectedDocument) return

    setIsLoading(true)
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === selectedDocument.id
            ? {
                ...doc,
                status: "uploaded" as const,
                file,
                uploadDate: new Date().toISOString().split("T")[0],
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              }
            : doc,
        ),
      )

      toast({
        title: "Document Uploaded",
        description: `${selectedDocument.name} has been uploaded successfully.`,
      })

      setIsUploadOpen(false)
      setSelectedDocument(null)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDocument = (documentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, status: "pending" as const, file: undefined, uploadDate: undefined, size: undefined }
          : doc,
      ),
    )

    toast({
      title: "Document Deleted",
      description: "Document has been removed successfully.",
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "uploaded":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "uploaded":
        return <Badge className="bg-blue-600 text-white">Under Review</Badge>
      case "verified":
        return <Badge className="bg-green-600 text-white">Verified</Badge>
      case "rejected":
        return <Badge className="bg-red-600 text-white">Rejected</Badge>
      case "expired":
        return <Badge className="bg-orange-600 text-white">Expired</Badge>
      default:
        return <Badge variant="outline">Not Uploaded</Badge>
    }
  }

  const requiredDocuments = documents.filter((doc) => doc.required)
  const verifiedRequired = requiredDocuments.filter((doc) => doc.status === "verified")
  const completionPercentage = (verifiedRequired.length / requiredDocuments.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64">
        <Header userName="Emmanuel" userStatus="Verified Driver" />

        <div className="p-3 md:p-6 space-y-4 md:space-y-8 max-w-full overflow-x-hidden">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
              <FileText className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-[#E57700]" />
              Document Management
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage your KYC documents and vehicle financing requirements
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Verification Progress</CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete document verification for full platform access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {verifiedRequired.length} of {requiredDocuments.length} required documents verified
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(completionPercentage)}% Complete
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-[#E57700] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {documents.filter((d) => d.status === "verified").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {documents.filter((d) => d.status === "uploaded").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Under Review</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {documents.filter((d) => d.status === "rejected").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {documents.filter((d) => d.status === "pending").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Your Documents</CardTitle>
              <CardDescription className="text-muted-foreground">
                Upload and manage your verification documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((document) => {
                  const Icon = document.icon
                  return (
                    <div
                      key={document.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg space-y-3 md:space-y-0"
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        <Icon className="h-6 w-6 text-[#E57700] mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-foreground">{document.name}</h4>
                            {document.required && (
                              <Badge variant="outline" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{document.description}</p>

                          {document.uploadDate && (
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>Uploaded: {document.uploadDate}</span>
                              {document.size && <span>• Size: {document.size}</span>}
                              {document.expiryDate && (
                                <span
                                  className={`• ${new Date(document.expiryDate) < new Date() ? "text-red-500" : ""}`}
                                >
                                  Expires: {document.expiryDate}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {getStatusIcon(document.status)}
                        {getStatusBadge(document.status)}

                        <div className="flex space-x-2">
                          {/* View Document */}
                          {document.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedDocument(document)
                                setIsViewOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Upload/Replace Document */}
                          <Dialog
                            open={isUploadOpen && selectedDocument?.id === document.id}
                            onOpenChange={(open) => {
                              setIsUploadOpen(open)
                              if (!open) setSelectedDocument(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant={document.status === "pending" ? "default" : "outline"}
                                onClick={() => setSelectedDocument(document)}
                                className={document.status === "pending" ? "bg-[#E57700] hover:bg-[#E57700]/90" : ""}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                {document.status === "pending" ? "Upload" : "Replace"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
                              <DialogHeader>
                                <DialogTitle className="flex items-center">
                                  <Icon className="h-5 w-5 mr-2 text-[#E57700]" />
                                  Upload {document.name}
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  {document.description}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div
                                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-[#E57700] transition-colors cursor-pointer"
                                  onDragOver={handleDragOver}
                                  onDrop={handleDrop}
                                  onClick={() => {
                                    const input = document.createElement("input")
                                    input.type = "file"
                                    input.accept = "image/*,.pdf"
                                    input.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0]
                                      if (file) handleFileUpload(file)
                                    }
                                    input.click()
                                  }}
                                >
                                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                  <p className="text-foreground font-medium mb-2">
                                    {isLoading ? "Uploading..." : "Click to upload or drag and drop"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                                </div>

                                <div className="bg-muted p-3 rounded-lg">
                                  <h5 className="font-medium text-foreground mb-2">Upload Guidelines:</h5>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Ensure document is clear and readable</li>
                                    <li>• All corners should be visible</li>
                                    <li>• No glare or shadows</li>
                                    <li>• File size should not exceed 10MB</li>
                                  </ul>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Delete Document */}
                          {document.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Document View Dialog */}
          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="bg-card border-border text-foreground max-w-2xl mx-4">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {selectedDocument && (
                    <>
                      <selectedDocument.icon className="h-5 w-5 mr-2 text-[#E57700]" />
                      {selectedDocument.name}
                    </>
                  )}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">Document preview and details</DialogDescription>
              </DialogHeader>

              {selectedDocument && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Document preview not available</p>
                    <p className="text-xs text-muted-foreground">Click download to view the full document</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">{getStatusBadge(selectedDocument.status)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Upload Date</p>
                      <p className="font-medium">{selectedDocument.uploadDate || "Not uploaded"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">File Size</p>
                      <p className="font-medium">{selectedDocument.size || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expiry Date</p>
                      <p className="font-medium">{selectedDocument.expiryDate || "No expiry"}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Help Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Need Help?</CardTitle>
              <CardDescription className="text-muted-foreground">
                Common questions about document verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">What documents do I need?</h4>
                  <p className="text-sm text-muted-foreground">
                    You need to upload all required documents including National ID, Driver's License, Bank Statement,
                    Proof of Income, and Passport Photo for complete verification.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">How long does verification take?</h4>
                  <p className="text-sm text-muted-foreground">
                    Document verification typically takes 24-48 hours. You'll receive email notifications about the
                    status of your documents.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">What if my document is rejected?</h4>
                  <p className="text-sm text-muted-foreground">
                    If a document is rejected, you'll receive feedback on why it was rejected. Simply upload a new
                    version that addresses the issues mentioned.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
