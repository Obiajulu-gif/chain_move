"use client"

import { useState } from "react"
import { QuickInformation, type QuickInfoData } from "./quick-information"
import { AboutMe, type AboutMeData } from "./about-me"
import { DocumentUpload } from "./document-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, User, UserCheck, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VerificationFlowProps {
  onComplete: (data: VerificationData) => void
}

export interface VerificationData {
  quickInfo: QuickInfoData
  aboutMe: AboutMeData
  documentsUploaded: boolean
}

type Step = "quick-info" | "about-me" | "documents" | "complete"

export function VerificationFlow({ onComplete }: VerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>("quick-info")
  const [verificationData, setVerificationData] = useState<Partial<VerificationData>>({})
  const { toast } = useToast()

  const steps = [
    { id: "quick-info", title: "Quick Information", icon: User },
    { id: "about-me", title: "About Me", icon: UserCheck },
    { id: "documents", title: "Documents", icon: FileText },
  ]

  const handleQuickInfoNext = (data: QuickInfoData) => {
    setVerificationData((prev) => ({ ...prev, quickInfo: data }))
    setCurrentStep("about-me")
  }

  const handleAboutMeNext = (data: AboutMeData) => {
    setVerificationData((prev) => ({ ...prev, aboutMe: data }))
    setCurrentStep("documents")
  }

  const handleAboutMeBack = () => {
    setCurrentStep("quick-info")
  }

  const handleDocumentsNext = () => {
    const completeData: VerificationData = {
      quickInfo: verificationData.quickInfo!,
      aboutMe: verificationData.aboutMe!,
      documentsUploaded: true,
    }

    toast({
      title: "Verification Complete!",
      description: "Your verification has been submitted for review. You'll receive an update within 24-48 hours.",
    })

    onComplete(completeData)
    setCurrentStep("complete")
  }

  const handleDocumentsBack = () => {
    setCurrentStep("about-me")
  }

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId)
    const currentIndex = steps.findIndex((s) => s.id === currentStep)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "pending"
  }

  if (currentStep === "complete") {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Verification Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for completing your verification. Our team will review your documents and get back to you within
            24-48 hours.
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              You can track your verification status in your dashboard. We'll also send you email updates.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Verification Progress</CardTitle>
          <CardDescription className="text-muted-foreground">Complete all steps to verify your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const status = getStepStatus(step.id)

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                        ${
                          status === "completed"
                            ? "bg-green-500 border-green-500 text-white"
                            : status === "current"
                              ? "bg-[#E57700] border-[#E57700] text-white"
                              : "bg-background border-border text-muted-foreground"
                        }
                      `}
                    >
                      {status === "completed" ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 text-center">{step.title}</span>
                    <Badge
                      variant={status === "completed" ? "default" : status === "current" ? "default" : "outline"}
                      className={`mt-1 text-xs ${
                        status === "completed" ? "bg-green-500" : status === "current" ? "bg-[#E57700]" : ""
                      }`}
                    >
                      {status === "completed" ? "Done" : status === "current" ? "Active" : "Pending"}
                    </Badge>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`
                        flex-1 h-0.5 mx-4 transition-colors
                        ${status === "completed" ? "bg-green-500" : "bg-border"}
                      `}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      {currentStep === "quick-info" && (
        <QuickInformation onNext={handleQuickInfoNext} initialData={verificationData.quickInfo} />
      )}

      {currentStep === "about-me" && (
        <AboutMe onNext={handleAboutMeNext} onBack={handleAboutMeBack} initialData={verificationData.aboutMe} />
      )}

      {currentStep === "documents" && <DocumentUpload onNext={handleDocumentsNext} onBack={handleDocumentsBack} />}
    </div>
  )
}
