"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Loader2, User, UploadCloud, CheckCircle } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"



// Helper component for each step
const Step = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function KycPage() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    bvn: "",
    driversLicenseNumber: "",
  })
  const [files, setFiles] = useState({
    identityDocument: null,
    driversLicense: null,
    proofOfAddress: null,
  })
  const [uploadedFileUrls, setUploadedFileUrls] = useState({
    identityDocumentUrl: "",
    driversLicenseUrl: "",
    proofOfAddressUrl: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files: inputFiles } = e.target
    if (inputFiles && inputFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [id]: inputFiles[0] }))
    }
  }

  const uploadFile = async (file: File) => {
    if (!file) return null;
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      if (!response.ok) throw new Error('File upload failed.');
      const newBlob = await response.json();
      return newBlob.url;
    } catch (error) {
      toast({ title: "Upload Error", description: (error as Error).message, variant: "destructive" });
      return null;
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 2) { // Upload files before moving to review step
      setIsSubmitting(true);
      const identityUrl = await uploadFile(files.identityDocument!);
      const licenseUrl = await uploadFile(files.driversLicense!);
      const addressUrl = await uploadFile(files.proofOfAddress!);

      if (identityUrl && licenseUrl && addressUrl) {
        setUploadedFileUrls({
          identityDocumentUrl: identityUrl,
          driversLicenseUrl: licenseUrl,
          proofOfAddressUrl: addressUrl,
        });
        setCurrentStep(3);
      } else {
        toast({ title: "Upload Incomplete", description: "Please ensure all documents are uploaded.", variant: "destructive" });
      }
      setIsSubmitting(false);
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/kyc/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                driverId: user?.id,
                ...formData,
                documents: uploadedFileUrls,
            }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        toast({ title: "KYC Submitted", description: "Your information is under review." });
        setCurrentStep(4); // Move to success step
    } catch (error) {
        toast({ title: "Submission Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
    <Sidebar role="driver" className="md:w-64 lg:w-72" mobileWidth="w-64" />

      <Card>
        <CardHeader>
          <CardTitle>Driver KYC Verification</CardTitle>
          <CardDescription>
            Please provide the following information to verify your identity.
          </CardDescription>
          {currentStep <= 3 && <Progress value={(currentStep / 3) * 100} className="mt-4" />}
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <Step title="Step 1: Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={formData.fullName} onChange={handleInputChange} /></div>
                <div><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} /></div>
                <div><Label htmlFor="address">Residential Address</Label><Input id="address" value={formData.address} onChange={handleInputChange} /></div>
                <div><Label htmlFor="dateOfBirth">Date of Birth</Label><Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} /></div>
                <div><Label htmlFor="bvn">Bank Verification Number (BVN)</Label><Input id="bvn" value={formData.bvn} onChange={handleInputChange} /></div>
                <div><Label htmlFor="driversLicenseNumber">Driver's License Number</Label><Input id="driversLicenseNumber" value={formData.driversLicenseNumber} onChange={handleInputChange} /></div>
              </div>
            </Step>
          )}

          {currentStep === 2 && (
            <Step title="Step 2: Document Upload">
              <div><Label htmlFor="identityDocument">National ID (NIN, Passport, etc.)</Label><Input id="identityDocument" type="file" onChange={handleFileChange} /></div>
              <div><Label htmlFor="driversLicense">Driver's License (Front)</Label><Input id="driversLicense" type="file" onChange={handleFileChange} /></div>
              <div><Label htmlFor="proofOfAddress">Proof of Address (Utility Bill)</Label><Input id="proofOfAddress" type="file" onChange={handleFileChange} /></div>
            </Step>
          )}

          {currentStep === 3 && (
            <Step title="Step 3: Review and Confirm">
                <p>Please review your information carefully before submitting.</p>
                <div className="space-y-2 p-4 border rounded-md bg-muted">
                    <p><strong>Full Name:</strong> {formData.fullName}</p>
                    <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
                    <p><strong>Address:</strong> {formData.address}</p>
                    <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                    <p><strong>BVN:</strong> {formData.bvn}</p>
                    <p><strong>License No:</strong> {formData.driversLicenseNumber}</p>
                    <p><strong>Documents:</strong> {Object.values(files).every(f => f) ? "All documents selected" : "Missing documents"}</p>
                </div>
            </Step>
          )}

          {currentStep === 4 && (
            <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Submission Successful!</h3>
                <p className="text-muted-foreground mt-2">Your KYC information has been submitted for review. You will be notified once the process is complete.</p>
                <Button onClick={() => router.push('/dashboard/driver')} className="mt-6">Back to Dashboard</Button>
            </div>
          )}

          {currentStep <= 3 && (
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1}>
                Back
              </Button>
              {currentStep < 3 ? (
                <Button onClick={handleNextStep} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit for Review
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
