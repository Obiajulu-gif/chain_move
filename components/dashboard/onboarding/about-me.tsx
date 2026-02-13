"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UserCheck, Calendar, CreditCard, Users, Flag, Shield, ArrowLeft, ArrowRight } from "lucide-react"

interface AboutMeProps {
  onNext: (data: AboutMeData) => void
  onBack: () => void
  initialData?: Partial<AboutMeData>
}

export interface AboutMeData {
  dateOfBirth: string
  nin: string
  bvn: string
  gender: string
  nationality: string
  maritalStatus: string
  occupation: string
  monthlyIncome: string
}

export function AboutMe({ onNext, onBack, initialData }: AboutMeProps) {
  const [formData, setFormData] = useState<AboutMeData>({
    dateOfBirth: initialData?.dateOfBirth || "",
    nin: initialData?.nin || "",
    bvn: initialData?.bvn || "",
    gender: initialData?.gender || "",
    nationality: initialData?.nationality || "",
    maritalStatus: initialData?.maritalStatus || "",
    occupation: initialData?.occupation || "",
    monthlyIncome: initialData?.monthlyIncome || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const requiredFields = ["dateOfBirth", "nin", "bvn", "gender", "nationality", "maritalStatus"]
    const missingFields = requiredFields.filter((field) => !formData[field as keyof AboutMeData])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // NIN validation (11 digits)
    if (formData.nin.length !== 11 || !/^\d+$/.test(formData.nin)) {
      toast({
        title: "Invalid NIN",
        description: "NIN must be exactly 11 digits.",
        variant: "destructive",
      })
      return
    }

    // BVN validation (11 digits)
    if (formData.bvn.length !== 11 || !/^\d+$/.test(formData.bvn)) {
      toast({
        title: "Invalid BVN",
        description: "BVN must be exactly 11 digits.",
        variant: "destructive",
      })
      return
    }

    // Age validation (must be 18+)
    const birthDate = new Date(formData.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    if (age < 18) {
      toast({
        title: "Age Requirement",
        description: "You must be at least 18 years old to register.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast({
        title: "Information Saved",
        description: "Your personal information has been saved successfully.",
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
          <UserCheck className="h-5 w-5 mr-2 text-[#E57700]" />
          About Me
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Please provide your personal details for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-foreground">
                Date of Birth *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="pl-10 bg-background border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-foreground">
                Gender *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select gender" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nin" className="text-foreground">
                NIN (National Identification Number) *
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nin"
                  type="text"
                  placeholder="12345678901"
                  value={formData.nin}
                  onChange={(e) => setFormData({ ...formData, nin: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                  className="pl-10 bg-background border-border text-foreground"
                  maxLength={11}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">11-digit National Identification Number</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bvn" className="text-foreground">
                BVN (Bank Verification Number) *
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bvn"
                  type="text"
                  placeholder="12345678901"
                  value={formData.bvn}
                  onChange={(e) => setFormData({ ...formData, bvn: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                  className="pl-10 bg-background border-border text-foreground"
                  maxLength={11}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">11-digit Bank Verification Number</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-foreground">
                Nationality *
              </Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) => setFormData({ ...formData, nationality: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <div className="flex items-center">
                    <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select nationality" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nigerian">Nigerian</SelectItem>
                  <SelectItem value="ghanaian">Ghanaian</SelectItem>
                  <SelectItem value="kenyan">Kenyan</SelectItem>
                  <SelectItem value="south-african">South African</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus" className="text-foreground">
                Marital Status *
              </Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-foreground">
                Occupation
              </Label>
              <Input
                id="occupation"
                type="text"
                placeholder="e.g., Software Engineer, Teacher"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome" className="text-foreground">
                Monthly Income Range
              </Label>
              <Select
                value={formData.monthlyIncome}
                onValueChange={(value) => setFormData({ ...formData, monthlyIncome: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below-50k">Below ₦50,000</SelectItem>
                  <SelectItem value="50k-100k">₦50,000 - ₦100,000</SelectItem>
                  <SelectItem value="100k-200k">₦100,000 - ₦200,000</SelectItem>
                  <SelectItem value="200k-500k">₦200,000 - ₦500,000</SelectItem>
                  <SelectItem value="500k-1m">₦500,000 - ₦1,000,000</SelectItem>
                  <SelectItem value="above-1m">Above ₦1,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
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
