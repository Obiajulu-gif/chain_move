"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertTriangle, FileText, Camera, CreditCard, Shield, User, Upload } from "lucide-react"

const verificationSteps = [
  {
    id: "identity",
    title: "Identity Verification",
    description: "Upload government-issued ID",
    status: "completed",
    icon: User,
  },
  {
    id: "address",
    title: "Address Verification",
    description: "Proof of residence document",
    status: "completed",
    icon: FileText,
  },
  {
    id: "financial",
    title: "Financial Verification",
    description: "Bank statements or income proof",
    status: "in-progress",
    icon: CreditCard,
  },
  {
    id: "biometric",
    title: "Biometric Verification",
    description: "Facial recognition scan",
    status: "pending",
    icon: Camera,
  },
]

const pendingApplications = [
  {
    id: 1,
    applicantName: "John Doe",
    applicationType: "Driver",
    submittedDate: "2025-01-10",
    currentStep: "Financial Verification",
    riskScore: 85,
    completionRate: 75,
    documents: ["ID Card", "Utility Bill", "Bank Statement"],
    status: "under-review",
  },
  {
    id: 2,
    applicantName: "Sarah Johnson",
    applicationType: "Investor",
    submittedDate: "2025-01-09",
    currentStep: "Biometric Verification",
    riskScore: 92,
    completionRate: 90,
    documents: ["Passport", "Tax Return", "Proof of Funds"],
    status: "pending-approval",
  },
]

export function KycVerificationFlow() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-[#2a3441] border-gray-700">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="verification"
            className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
          >
            Verification Steps
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
          >
            Pending Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Completed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-green-400">+3 from yesterday</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">28</div>
                <p className="text-xs text-yellow-400">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">94%</div>
                <p className="text-xs text-green-400">+2% this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Verification Process</CardTitle>
              <CardDescription className="text-gray-400">Complete all steps to activate your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {verificationSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex items-center space-x-4">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${
                          step.status === "completed"
                            ? "bg-green-600"
                            : step.status === "in-progress"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                        }
                      `}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : step.status === "in-progress" ? (
                          <Clock className="h-5 w-5 text-white" />
                        ) : (
                          <Icon className="h-5 w-5 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-white">{step.title}</h4>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>

                      <Badge
                        className={
                          step.status === "completed"
                            ? "bg-green-600 text-white"
                            : step.status === "in-progress"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-600 text-white"
                        }
                      >
                        {step.status === "completed"
                          ? "Completed"
                          : step.status === "in-progress"
                            ? "In Progress"
                            : "Pending"}
                      </Badge>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6">
                <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Continue Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="space-y-4">
            {pendingApplications.map((application) => (
              <Card key={application.id} className="bg-[#2a3441] border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{application.applicantName}</h3>
                      <p className="text-sm text-gray-400">{application.applicationType} Application</p>
                      <p className="text-xs text-gray-500">Submitted: {application.submittedDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          application.status === "pending-approval"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-600 text-white"
                        }
                      >
                        {application.status === "pending-approval" ? "Ready for Approval" : "Under Review"}
                      </Badge>
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-white">Risk Score: {application.riskScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Completion Progress</span>
                        <span className="text-white">{application.completionRate}%</span>
                      </div>
                      <Progress value={application.completionRate} className="h-2 bg-gray-600" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Current Step: {application.currentStep}</p>
                      <div className="flex flex-wrap gap-2">
                        {application.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Review Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
