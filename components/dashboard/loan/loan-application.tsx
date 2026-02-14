"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Car,
  FileText,
  CheckCircle,
  Upload,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Info,
  Shield,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"

interface LoanApplicationProps {
  onApplicationSubmit: (data: any) => void
}

interface Vehicle {
  id: string
  name: string
  price: number
  image: string
  year: number
  type: string
  features: string[]
  roi: number
  popularity: number
}

const availableVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Tricycle (Keke NAPEP) 2024",
    price: 2500,
    image: "/images/tricycle-keke.jpg",
    year: 2024,
    type: "Tricycle",
    features: ["Fuel Efficient", "High Demand", "Quick ROI"],
    roi: 22.5,
    popularity: 98,
  },
  {
    id: "2",
    name: "Bajaj Okada (Motorcycle) 2024",
    price: 1800,
    image: "/images/okada-motorcycle.jpg",
    year: 2024,
    type: "Motorcycle",
    features: ["High Mobility", "Low Maintenance", "Fast Returns"],
    roi: 25.0,
    popularity: 95,
  },
  {
    id: "3",
    name: "Toyota Hiace Mini Bus 2023",
    price: 35000,
    image: "/images/mini-bus.jpg",
    year: 2023,
    type: "Mini Bus",
    features: ["High Capacity", "Durable", "Commercial Use"],
    roi: 18.5,
    popularity: 88,
  },
  {
    id: "4",
    name: "Coaster 18-Seater Bus 2022",
    price: 45000,
    image: "/images/18-seater-bus.jpg",
    year: 2022,
    type: "18-Seater Bus",
    features: ["High Passenger Capacity", "Long Distance", "Comfortable"],
    roi: 19.2,
    popularity: 82,
  },
  {
    id: "5",
    name: "Toyota Hilux Carter 2023",
    price: 28000,
    image: "/images/toyota-carter.jpg",
    year: 2023,
    type: "Pickup Truck",
    features: ["Heavy Duty", "Cargo Transport", "Reliable"],
    roi: 17.8,
    popularity: 90,
  },
  {
    id: "6",
    name: "Mazda BT-50 Carter 2023",
    price: 26000,
    image: "/images/mazda-carter.jpg",
    year: 2023,
    type: "Pickup Truck",
    features: ["Fuel Efficient", "Cargo Capacity", "Durable"],
    roi: 17.5,
    popularity: 85,
  },
  {
    id: "7",
    name: "Mitsubishi L200 Carter 2022",
    price: 24000,
    image: "/images/mitsubishi-carter.jpg",
    year: 2022,
    type: "Pickup Truck",
    features: ["Affordable", "Reliable", "Good Resale"],
    roi: 17.2,
    popularity: 80,
  },
  {
    id: "8",
    name: "TVS Apache Okada 2024",
    price: 2200,
    image: "/images/okada-motorcycle.jpg",
    year: 2024,
    type: "Motorcycle",
    features: ["Sport Design", "Fuel Efficient", "Fast"],
    roi: 24.5,
    popularity: 92,
  },
]

export function LoanApplication({ onApplicationSubmit }: LoanApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [loanAmount, setLoanAmount] = useState([20000])
  const [loanTerm, setLoanTerm] = useState([36])
  const [downPayment, setDownPayment] = useState([5000])
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({})
  const [formData, setFormData] = useState({
    employmentStatus: "",
    monthlyIncome: "",
    creditScore: "",
    loanPurpose: "",
    additionalInfo: "",
  })
  const { toast } = useToast()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const calculateMonthlyPayment = () => {
    const principal = loanAmount[0] - downPayment[0]
    const monthlyRate = 0.08 / 12 // 8% annual rate
    const numPayments = loanTerm[0]

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)

    return monthlyPayment
  }

  const handleDocumentUpload = (docType: string, file: File) => {
    setDocuments((prev) => ({ ...prev, [docType]: file }))
    toast({
      title: "Document Uploaded",
      description: `${docType} has been uploaded successfully.`,
    })
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const applicationData = {
      vehicle: selectedVehicle,
      loanAmount: loanAmount[0],
      loanTerm: loanTerm[0],
      downPayment: downPayment[0],
      monthlyPayment: calculateMonthlyPayment(),
      documents,
      formData,
      submittedAt: new Date().toISOString(),
    }

    onApplicationSubmit(applicationData)
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedVehicle !== null
      case 2:
        return loanAmount[0] > 0 && loanTerm[0] > 0
      case 3:
        return Object.keys(documents).length >= 2
      case 4:
        return formData.employmentStatus && formData.monthlyIncome
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Vehicle Loan Application</h2>
          <Badge className="bg-[#E57700] text-white">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className={currentStep >= 1 ? "text-[#E57700] font-medium" : ""}>Select Vehicle</span>
          <span className={currentStep >= 2 ? "text-[#E57700] font-medium" : ""}>Configure Loan</span>
          <span className={currentStep >= 3 ? "text-[#E57700] font-medium" : ""}>Upload Documents</span>
          <span className={currentStep >= 4 ? "text-[#E57700] font-medium" : ""}>Review & Submit</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <Car className="h-12 w-12 text-[#E57700] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Choose Your Vehicle</h3>
              <p className="text-muted-foreground">Select the vehicle you'd like to finance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableVehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className={`cursor-pointer transition-all hover:border-[#E57700] ${
                    selectedVehicle?.id === vehicle.id ? "border-[#E57700] bg-[#E57700]/5" : "bg-card border-border"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Image
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        width={300}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                          <Badge className="bg-green-600 text-white">{vehicle.roi}% ROI</Badge>
                        </div>
                        <p className="text-2xl font-bold text-foreground">${vehicle.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.year} • {vehicle.type}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vehicle.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-muted-foreground">Popularity</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-[#E57700] h-2 rounded-full"
                                style={{ width: `${vehicle.popularity}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">{vehicle.popularity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && selectedVehicle && (
          <div className="space-y-6">
            <div className="text-center">
              <Calculator className="h-12 w-12 text-[#E57700] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Configure Your Loan</h3>
              <p className="text-muted-foreground">Adjust loan terms to fit your budget</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Selected Vehicle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={selectedVehicle.image || "/placeholder.svg"}
                        alt={selectedVehicle.name}
                        width={80}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">{selectedVehicle.name}</h4>
                        <p className="text-2xl font-bold text-foreground">${selectedVehicle.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground">Loan Amount: ${loanAmount[0].toLocaleString()}</Label>
                    <Slider
                      value={loanAmount}
                      onValueChange={setLoanAmount}
                      max={selectedVehicle.price}
                      min={5000}
                      step={1000}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>$5,000</span>
                      <span>${selectedVehicle.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground">Loan Term: {loanTerm[0]} months</Label>
                    <Slider value={loanTerm} onValueChange={setLoanTerm} max={72} min={12} step={6} className="mt-2" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>12 months</span>
                      <span>72 months</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground">Down Payment: ${downPayment[0].toLocaleString()}</Label>
                    <Slider
                      value={downPayment}
                      onValueChange={setDownPayment}
                      max={selectedVehicle.price * 0.5}
                      min={0}
                      step={500}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>$0</span>
                      <span>${(selectedVehicle.price * 0.5).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-muted border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Loan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Price</p>
                      <p className="text-lg font-bold text-foreground">${selectedVehicle.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Down Payment</p>
                      <p className="text-lg font-bold text-foreground">${downPayment[0].toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="text-lg font-bold text-foreground">
                        ${(loanAmount[0] - downPayment[0]).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Term</p>
                      <p className="text-lg font-bold text-foreground">{loanTerm[0]} months</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Monthly Payment</p>
                      <p className="text-3xl font-bold text-[#E57700]">${calculateMonthlyPayment().toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span className="text-foreground">8.0% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="text-foreground">
                        ${(calculateMonthlyPayment() * loanTerm[0] - (loanAmount[0] - downPayment[0])).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total Amount</span>
                      <span className="text-foreground">
                        ${(calculateMonthlyPayment() * loanTerm[0] + downPayment[0]).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-[#E57700] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Upload Required Documents</h3>
              <p className="text-muted-foreground">Please provide the following documents for verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "id", label: "Government ID", required: true },
                { key: "license", label: "Driver's License", required: true },
                { key: "income", label: "Proof of Income", required: true },
                { key: "address", label: "Proof of Address", required: false },
                { key: "bank", label: "Bank Statement", required: false },
                { key: "insurance", label: "Insurance Documents", required: false },
              ].map((doc) => (
                <Card key={doc.key} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{doc.label}</h4>
                        <p className="text-sm text-muted-foreground">{doc.required ? "Required" : "Optional"}</p>
                      </div>
                      {documents[doc.key] && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>

                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {documents[doc.key] ? documents[doc.key]!.name : "Click to upload or drag and drop"}
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleDocumentUpload(doc.label, file)
                        }}
                        className="hidden"
                        id={`upload-${doc.key}`}
                      />
                      <label
                        htmlFor={`upload-${doc.key}`}
                        className="cursor-pointer text-[#E57700] hover:underline text-sm"
                      >
                        Choose File
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Document Requirements</h4>
                    <ul className="text-sm text-blue-800 mt-1 space-y-1">
                      <li>• All documents must be clear and legible</li>
                      <li>• Accepted formats: PDF, JPG, PNG (max 5MB each)</li>
                      <li>• Documents should be recent (within 3 months)</li>
                      <li>• Personal information must match across all documents</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-[#E57700] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Review & Submit Application</h3>
              <p className="text-muted-foreground">Please review your application details before submitting</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground">Employment Status</Label>
                        <Select
                          value={formData.employmentStatus}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, employmentStatus: value }))}
                        >
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="self-employed">Self-Employed</SelectItem>
                            <SelectItem value="business-owner">Business Owner</SelectItem>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-foreground">Monthly Income</Label>
                        <Input
                          type="number"
                          placeholder="Enter monthly income"
                          value={formData.monthlyIncome}
                          onChange={(e) => setFormData((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-foreground">Loan Purpose</Label>
                      <Select
                        value={formData.loanPurpose}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, loanPurpose: value }))}
                      >
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ride-hailing">Ride-Hailing Business</SelectItem>
                          <SelectItem value="delivery">Delivery Services</SelectItem>
                          <SelectItem value="personal">Personal Transportation</SelectItem>
                          <SelectItem value="commercial">Commercial Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-foreground">Additional Information</Label>
                      <Textarea
                        placeholder="Any additional information you'd like to provide..."
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                        className="bg-background border-border"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {selectedVehicle && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Application Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={selectedVehicle.image || "/placeholder.svg"}
                          alt={selectedVehicle.name}
                          width={60}
                          height={45}
                          className="rounded object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{selectedVehicle.name}</h4>
                          <p className="text-sm text-muted-foreground">${selectedVehicle.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Loan Amount</p>
                          <p className="font-semibold text-foreground">
                            ${(loanAmount[0] - downPayment[0]).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Down Payment</p>
                          <p className="font-semibold text-foreground">${downPayment[0].toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Loan Term</p>
                          <p className="font-semibold text-foreground">{loanTerm[0]} months</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly Payment</p>
                          <p className="font-semibold text-[#E57700]">${calculateMonthlyPayment().toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-sm text-muted-foreground mb-2">Uploaded Documents</p>
                        <div className="space-y-1">
                          {Object.entries(documents).map(([key, file]) => (
                            <div key={key} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-foreground">{file?.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Secure Application</h4>
                        <p className="text-sm text-green-800 mt-1">
                          Your application is secured with blockchain technology and will be processed within 24-48
                          hours.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            disabled={!canProceedToNext()}
            className="bg-[#E57700] hover:bg-[#E57700]/90 flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceedToNext()}
            className="bg-[#E57700] hover:bg-[#E57700]/90 flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Submit Application</span>
          </Button>
        )}
      </div>
    </div>
  )
}
