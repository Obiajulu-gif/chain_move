"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Users,
  CheckCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  Car,
  XCircle,
  Download,
} from "lucide-react"
import Image from "next/image"

const driverStats = {
  totalApplications: 456,
  pendingReview: 23,
  approved: 398,
  rejected: 35,
  averageRating: 4.6,
  activeDrivers: 342,
}

const driverApplications = [
  {
    id: 1,
    name: "Emmanuel Okafor",
    email: "emmanuel.o@email.com",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    appliedDate: "2025-01-10",
    status: "Pending Review",
    experience: "3 years",
    vehicleType: "Sedan",
    licenseNumber: "LAG123456789",
    rating: 4.8,
    completedTrips: 1247,
    profileImage: "/placeholder.svg?height=50&width=50",
    documents: {
      license: true,
      insurance: true,
      registration: false,
      background: true,
    },
    riskScore: "Low",
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    name: "Amina Hassan",
    email: "amina.h@email.com",
    phone: "+234 802 345 6789",
    location: "Abuja, Nigeria",
    appliedDate: "2025-01-09",
    status: "Under Review",
    experience: "5 years",
    vehicleType: "SUV",
    licenseNumber: "ABJ987654321",
    rating: 4.9,
    completedTrips: 2156,
    profileImage: "/placeholder.svg?height=50&width=50",
    documents: {
      license: true,
      insurance: true,
      registration: true,
      background: true,
    },
    riskScore: "Low",
    lastActivity: "5 hours ago",
  },
  {
    id: 3,
    name: "Chidi Okwu",
    email: "chidi.o@email.com",
    phone: "+234 803 456 7890",
    location: "Port Harcourt, Nigeria",
    appliedDate: "2025-01-08",
    status: "Approved",
    experience: "2 years",
    vehicleType: "Hatchback",
    licenseNumber: "PH456789123",
    rating: 4.5,
    completedTrips: 892,
    profileImage: "/placeholder.svg?height=50&width=50",
    documents: {
      license: true,
      insurance: true,
      registration: true,
      background: true,
    },
    riskScore: "Low",
    lastActivity: "1 day ago",
  },
  {
    id: 4,
    name: "Fatima Al-Rashid",
    email: "fatima.ar@email.com",
    phone: "+234 804 567 8901",
    location: "Kano, Nigeria",
    appliedDate: "2025-01-07",
    status: "Rejected",
    experience: "1 year",
    vehicleType: "Motorcycle",
    licenseNumber: "KN789123456",
    rating: 3.2,
    completedTrips: 156,
    profileImage: "/placeholder.svg?height=50&width=50",
    documents: {
      license: true,
      insurance: false,
      registration: false,
      background: true,
    },
    riskScore: "High",
    lastActivity: "3 days ago",
  },
]

export default function AdminDriverOnboarding() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  const filteredDrivers = driverApplications.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || driver.status.toLowerCase().includes(statusFilter.toLowerCase())
    const matchesLocation =
      locationFilter === "all" || driver.location.toLowerCase().includes(locationFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesLocation
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

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" />

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Driver Onboarding Review</h1>
            <p className="text-gray-400">Review and approve driver applications and manage onboarding process</p>
          </div>

          {/* Driver Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Applications</CardTitle>
                <Users className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{driverStats.totalApplications}</div>
                <p className="text-xs text-gray-400">All time submissions</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Pending Review</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{driverStats.pendingReview}</div>
                <p className="text-xs text-yellow-400">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Drivers</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{driverStats.activeDrivers}</div>
                <p className="text-xs text-green-400">Currently operational</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{driverStats.averageRating}</div>
                <p className="text-xs text-green-400">Platform average</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-[#2a3441] border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter & Search Driver Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
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
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="under">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Filter by Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="port harcourt">Port Harcourt</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Driver Applications List */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Driver Applications ({filteredDrivers.length})</CardTitle>
              <CardDescription className="text-gray-400">Review and manage driver onboarding requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredDrivers.map((driver) => (
                  <div key={driver.id} className="p-6 bg-[#1a2332] rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={driver.profileImage || "/placeholder.svg"}
                          alt={driver.name}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{driver.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {driver.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {driver.phone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {driver.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                        <p className="text-xs text-gray-400 mt-1">Applied: {driver.appliedDate}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Experience</p>
                        <p className="font-semibold text-white">{driver.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Vehicle Type</p>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1 text-[#E57700]" />
                          <p className="font-semibold text-white">{driver.vehicleType}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Rating</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          <p className="font-semibold text-white">{driver.rating}</p>
                          <span className="text-xs text-gray-400 ml-1">({driver.completedTrips} trips)</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Risk Assessment</p>
                        <Badge className={getRiskColor(driver.riskScore)}>{driver.riskScore} Risk</Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Document Verification</p>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(driver.documents).map(([doc, completed]) => (
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
                          <span>{getDocumentCompletionPercentage(driver.documents)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[#E57700] h-2 rounded-full"
                            style={{ width: `${getDocumentCompletionPercentage(driver.documents)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <Eye className="h-4 w-4 mr-2" />
                        Review Details
                      </Button>
                      {driver.status === "Pending Review" && (
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
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDrivers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setLocationFilter("all")
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
