"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { User, Phone, Mail, DollarSign, ArrowRight } from "lucide-react"

interface QuickInformationProps {
  onNext: (data: QuickInfoData) => void
  initialData?: Partial<QuickInfoData>
}

export interface QuickInfoData {
  fullName: string
  phoneNumber: string
  emailAddress: string
  incomeSource: string
}

export function QuickInformation({ onNext, initialData }: QuickInformationProps) {
  const [formData, setFormData] = useState<QuickInfoData>({
    fullName: initialData?.fullName || "",
    phoneNumber: initialData?.phoneNumber || "",
    emailAddress: initialData?.emailAddress || "",
    incomeSource: initialData?.incomeSource || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.emailAddress || !formData.incomeSource) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.emailAddress)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Phone validation
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast({
        title: "Information Saved",
        description: "Your quick information has been saved successfully.",
      })
      onNext(formData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <User className="h-5 w-5 mr-2 text-[#E57700]" />
          Quick Information
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Let's start with some basic information about you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="pl-10 bg-background border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-foreground">
              Phone Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+234 801 234 5678"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="pl-10 bg-background border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailAddress" className="text-foreground">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="emailAddress"
                type="email"
                placeholder="your.email@example.com"
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                className="pl-10 bg-background border-border text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incomeSource" className="text-foreground">
              Primary Source of Income *
            </Label>
            <Select
              value={formData.incomeSource}
              onValueChange={(value) => setFormData({ ...formData, incomeSource: value })}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Select your primary income source" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary Earner</SelectItem>
                <SelectItem value="business">Business Owner</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
                <SelectItem value="freelance">Freelancer</SelectItem>
                <SelectItem value="investment">Investment Income</SelectItem>
                <SelectItem value="pension">Pension/Retirement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading} className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
              {isLoading ? "Saving..." : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
