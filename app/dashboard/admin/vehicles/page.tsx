"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Car,
  CheckCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Fuel,
  Users,
  XCircle,
  Download,
  Settings,
} from "lucide-react"
import Image from "next/image"

const vehicleStats = {
  totalVehicles: 342,
  pendingApproval: 23,
  approved: 298,
  rejected: 21,
  activePool: 275,
  totalValue: 8500000,
}

const vehicleApplications = [
  {
    id: 1,
    name: "Toyota Corolla 2020",
    applicant: "Emmanuel Okafor",
    applicantEmail: "emmanuel.o@email.com",
    requestedAmount: 15000,
    submittedDate: "2025-01-11",
    status: "Pending Approval",
    riskAssessment: "Low",
    image: "/placeholder.svg?height=100&width=150",
    specs: {
      year: 2020,
      type: "Sedan",
      fuelType: "Petrol",
      seats: 5,
      mileage: "45,000 km",
      location: "Lagos, Nigeria",
    },
    documents: {
      registration: true,
      insurance: true,
      inspection: false,
      valuation: true,
    },
    expectedROI: "14-16%",
    loanTerm: "36 months",
    monthlyPayment: 450,
  },
  {
    id: 2,
    name: "Honda Civic 2021",
    applicant: "Amina Hassan",
    applicantEmail: "amina.h@email.com",
    requestedAmount: 18000,
    submittedDate: "2025-01-10",
    status: "Under Review",
    riskAssessment: "Low",
    image: "/placeholder.svg?height=100&width=150",
    specs: {
      year: 2021,
      type: "Sedan",
      fuelType: "Petrol",
      seats: 5,
      mileage: "32,000 km",
      location: "Abuja, Nigeria",
    },
    documents: {
      registration: true,
      insurance: true,
      inspection: true,
      valuation: true,
    },
    expectedROI: "15-17%",
    loanTerm: "42 months",
    monthlyPayment: 520,
  },
  {
    id: 3,
    name: "Ford Transit 2019",
    applicant: "Chidi Okwu",
    applicantEmail: "chidi.o@email.com",
    requestedAmount: 25000,
    submittedDate: "2025-01-09",
    status: "Approved",
    riskAssessment: "Medium",
    image: "/placeholder.svg?height=100&width=150",
    specs: {
      year: 2019,
      type: "Van",
      fuelType: "Diesel",
      seats: 12,
      mileage: "68,000 km",
      location: "Port Harcourt, Nigeria",
    },
    documents: {
      registration: true,
      insurance: true,
      inspection: true,
      valuation: true,
    },
    expectedROI: "16-18%",
    loanTerm: "48 months",
    monthlyPayment: 680,
  },
]

export default function AdminVehicleManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "",
    year: "",
    price: "",
    location: "",
    fuelType: "",
    seats: "",
    description: "",
  })

  const filteredVehicles = vehicleApplications.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.applicant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status.toLowerCase().includes(statusFilter.toLowerCase())
    const matchesType = typeFilter === "all" || vehicle.specs.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-600 text-white"
      case "rejected":
        return "bg-red-600 text-white"
      case "under review":
        return "bg-blue-600 text-white"
      default:
        return "bg-yellow-600 text-white"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDocumentCompletionPercentage = (documents: any) => {
    const total = Object.keys(documents).length
    const completed = Object.values(documents).filter(Boolean).length
    return Math.round((completed / total) * 100)
  }

  const handleAddVehicle = () => {
    // Here you would typically send the data to your backend
    console.log("Adding new vehicle:", newVehicle)
    setIsAddVehicleOpen(false)
    setNewVehicle({
      name: "",
      type: "",
      year: "",
      price: "",
      location: "",
      fuelType: "",
      seats: "",
      description: "",
    })
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" />

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Vehicle Approval + Pool Management</h1>
              <p className="text-gray-400">Manage vehicle approvals, pool configurations, and platform inventory</p>
            </div>
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle to Pool
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2a3441] border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle to Pool</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new vehicle to the platform pool for investment opportunities
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Vehicle Name
                    </Label>
                    <Input
                      id="name"
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white"
                      placeholder="e.g., Toyota Corolla 2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-gray-300">
                      Vehicle Type
                    </Label>
                    <Select
                      value={newVehicle.type}
                      onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                    >
                      <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tricycle">Tricycle (Keke)</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle (Okada)</SelectItem>
                        <SelectItem value="mini bus">Mini Bus</SelectItem>
                        <SelectItem value="18-seater bus">18-Seater Bus</SelectItem>
                        <SelectItem value="pickup truck">Pickup Truck (Carter)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="year" className="text-gray-300">
                      Year
                    </Label>
                    <Input
                      id="year"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white"
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-gray-300">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      value={newVehicle.price}
                      onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white"
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-gray-300">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newVehicle.location}
                      onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white"
                      placeholder="Lagos, Nigeria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuelType" className="text-gray-300">
                      Fuel Type
                    </Label>
                    <Select
                      value={newVehicle.fuelType}
                      onValueChange={(value) => setNewVehicle({ ...newVehicle, fuelType: value })}
                    >
                      <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="seats" className="text-gray-300">
                      Seats
                    </Label>
                    <Input
                      id="seats"
                      value={newVehicle.seats}
                      onChange={(e) => setNewVehicle({ ...newVehicle, seats: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white"
                      placeholder="5"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description" className="text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newVehicle.description}
                      onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white"
                      placeholder="Additional details about the vehicle..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddVehicleOpen(false)}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddVehicle} className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                    Add Vehicle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Vehicle Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{vehicleStats.totalVehicles}</div>
                <p className="text-xs text-gray-400">Platform inventory</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Pending Approval</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{vehicleStats.pendingApproval}</div>
                <p className="text-xs text-yellow-400">Requires review</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Pool</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{vehicleStats.activePool}</div>
                <p className="text-xs text-green-400">Available for investment</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Value</CardTitle>
                <Settings className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${(vehicleStats.totalValue / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-green-400">Pool valuation</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-[#2a3441] border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter & Search Vehicle Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search vehicles or applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#1a2332] border-gray-600 text-white"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="under">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tricycle">Tricycle (Keke)</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle (Okada)</SelectItem>
                    <SelectItem value="mini bus">Mini Bus</SelectItem>
                    <SelectItem value="18-seater bus">18-Seater Bus</SelectItem>
                    <SelectItem value="pickup truck">Pickup Truck (Carter)</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Applications List */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Applications ({filteredVehicles.length})</CardTitle>
              <CardDescription className="text-gray-400">
                Review and manage vehicle approval requests and pool management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-6 bg-[#1a2332] rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={100}
                          height={75}
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{vehicle.name}</h3>
                          <p className="text-gray-400">Applicant: {vehicle.applicant}</p>
                          <p className="text-sm text-gray-400">{vehicle.applicantEmail}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {vehicle.specs.type}
                            </Badge>
                            <Badge className={getRiskColor(vehicle.riskAssessment)}>
                              {vehicle.riskAssessment} Risk
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">${vehicle.requestedAmount.toLocaleString()}</p>
                        <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                        <p className="text-xs text-gray-400 mt-1">Submitted: {vehicle.submittedDate}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{vehicle.specs.year}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Fuel className="h-4 w-4" />
                        <span className="text-sm">{vehicle.specs.fuelType}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{vehicle.specs.seats} seats</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{vehicle.specs.location}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Expected ROI</p>
                        <p className="font-semibold text-white">{vehicle.expectedROI}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Loan Term</p>
                        <p className="font-semibold text-white">{vehicle.loanTerm}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Monthly Payment</p>
                        <p className="font-semibold text-white">${vehicle.monthlyPayment}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Document Verification</p>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(vehicle.documents).map(([doc, completed]) => (
                          <div key={doc} className="flex items-center space-x-2">
                            {completed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span className="text-xs text-gray-300 capitalize">{doc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Completion</span>
                          <span>{getDocumentCompletionPercentage(vehicle.documents)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[#E57700] h-2 rounded-full"
                            style={{ width: `${getDocumentCompletionPercentage(vehicle.documents)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <Eye className="h-4 w-4 mr-2" />
                        Review Details
                      </Button>
                      {vehicle.status === "Pending Approval" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Settings className="h-4 w-4 mr-2" />
                        Pool Settings
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredVehicles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setTypeFilter("all")
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
