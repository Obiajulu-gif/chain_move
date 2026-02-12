"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Download, Eye, FileText, Shield, Trash2, Upload } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

type DocumentStatus = "pending" | "uploaded" | "verified" | "rejected" | "expired"

interface DriverDocument {
  id: string
  name: string
  required: boolean
  status: DocumentStatus
  uploadDate?: string
  expiryDate?: string
  size?: string
}

const initialDocuments: DriverDocument[] = [
  { id: "national-id", name: "National ID Card", required: true, status: "verified", uploadDate: "2026-01-03", size: "2.1 MB" },
  { id: "drivers-license", name: "Driver's License", required: true, status: "verified", uploadDate: "2026-01-03", expiryDate: "2027-08-15", size: "1.8 MB" },
  { id: "bank-statement", name: "Bank Statement", required: true, status: "uploaded", uploadDate: "2026-02-02", size: "3.2 MB" },
  { id: "proof-of-income", name: "Proof of Income", required: true, status: "rejected", uploadDate: "2026-01-29", size: "1.5 MB" },
  { id: "vehicle-registration", name: "Vehicle Registration", required: true, status: "expired", uploadDate: "2025-01-14", expiryDate: "2026-01-01", size: "1.2 MB" },
  { id: "utility-bill", name: "Utility Bill", required: false, status: "pending" },
]

function statusBadge(status: DocumentStatus) {
  if (status === "verified") return <Badge className="bg-emerald-600 text-white">Verified</Badge>
  if (status === "uploaded") return <Badge className="bg-blue-600 text-white">Under review</Badge>
  if (status === "rejected") return <Badge className="bg-red-600 text-white">Rejected</Badge>
  if (status === "expired") return <Badge className="bg-amber-600 text-white">Expired</Badge>
  return <Badge variant="outline">Pending</Badge>
}

export default function DocumentsPage() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState(initialDocuments)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === selectedDocId) || null,
    [documents, selectedDocId],
  )

  const requiredDocs = useMemo(() => documents.filter((document) => document.required), [documents])
  const verifiedRequiredCount = useMemo(
    () => requiredDocs.filter((document) => document.status === "verified").length,
    [requiredDocs],
  )
  const completion = requiredDocs.length ? Math.round((verifiedRequiredCount / requiredDocs.length) * 100) : 0

  const triggerUpload = (documentId: string) => {
    setSelectedDocId(documentId)
    setIsUploadOpen(true)
  }

  const handleUpload = (file: File) => {
    if (!selectedDocument) return

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDocument.id
          ? {
              ...doc,
              status: "uploaded",
              uploadDate: new Date().toISOString().slice(0, 10),
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            }
          : doc,
      ),
    )

    toast({
      title: "Document uploaded",
      description: `${selectedDocument.name} was uploaded successfully.`,
    })
    setIsUploadOpen(false)
    setSelectedDocId(null)
  }

  const handleDelete = (documentId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, status: "pending", uploadDate: undefined, expiryDate: undefined, size: undefined }
          : doc,
      ),
    )
    toast({
      title: "Document removed",
      description: "The document has been reset to pending.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Driver" />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Document management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload, track, and manage compliance documents required for your driver account.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Verification progress</CardDescription>
                <CardTitle>{completion}%</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {verifiedRequiredCount} of {requiredDocs.length} required docs verified
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Requires action</CardDescription>
                <CardTitle>{documents.filter((doc) => doc.status === "rejected" || doc.status === "expired").length}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Rejected or expired documents</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Under review</CardDescription>
                <CardTitle>{documents.filter((doc) => doc.status === "uploaded").length}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Awaiting verification checks</CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Upload fresh files for pending, rejected, or expired items.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((document) => (
                  <div key={document.id} className="rounded-xl border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{document.name}</p>
                          {document.required ? <Badge variant="outline">Required</Badge> : null}
                          {statusBadge(document.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {document.uploadDate ? `Uploaded ${document.uploadDate}` : "Not uploaded yet"}
                          {document.size ? ` • ${document.size}` : ""}
                        </p>
                        {document.expiryDate ? (
                          <p className="text-xs text-muted-foreground">Expires {document.expiryDate}</p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#E57700] text-white hover:bg-[#E57700]/90"
                          onClick={() => triggerUpload(document.id)}
                        >
                          <Upload className="mr-2 h-3.5 w-3.5" />
                          Upload
                        </Button>
                        {document.status !== "pending" ? (
                          <Button size="sm" variant="outline" onClick={() => handleDelete(document.id)}>
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Reset
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  <Shield className="mr-2 inline h-3.5 w-3.5" />
                  Keep required files valid to avoid payout or financing delays.
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload document</DialogTitle>
            <DialogDescription>
              {selectedDocument ? `Upload a new file for ${selectedDocument.name}.` : "Select a file to continue."}
            </DialogDescription>
          </DialogHeader>

          <div
            className="rounded-xl border border-dashed p-6 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const files = Array.from(event.dataTransfer.files)
              if (files[0]) handleUpload(files[0])
            }}
          >
            <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag and drop a file here, or pick one manually.</p>
            <label className="mt-3 inline-block">
              <input
                type="file"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) handleUpload(file)
                }}
              />
              <span className="inline-flex cursor-pointer items-center rounded-md bg-[#E57700] px-3 py-2 text-sm text-white hover:bg-[#E57700]/90">
                Choose file
              </span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
