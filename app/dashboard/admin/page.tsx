"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  DollarSign,
  Activity,
  FileText,
  Wallet,
  Car,
  TrendingUp,
  AlertTriangle,
  Plus,
  BarChart3,
  PieChart,
  Target,
  Globe,
  RefreshCw,
} from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"

interface DashboardStats {
  totalUsers: number
  totalDrivers: number
  totalInvestors: number
  activeLoans: number
  pendingLoans: number
  totalFundsInvested: number
  totalFundsAvailable: number
  platformRevenue: number
  successRate: number
  systemUptime: string
  averageROI: number
  vehicleUtilization: {
    available: number
    financed: number
    reserved: number
    maintenance: number
  }
  totalVehicles: number
  recentActivity: Array<{
    id: number
    title: string
    message: string
    timestamp: string
    priority: string
  }>
}

interface Vehicle {
  _id: string
  name: string
  type: string
  year: number
  price: number
  image?: string
  status: "Available" | "Financed" | "Reserved" | "Maintenance"
  roi: number
  features: string[]
  specifications: {
    engine: string
    fuelType: string
    mileage: string
    transmission: string
    color: string
    vin: string
  }
  addedDate: string
  popularity: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "",
    year: "",
    price: "",
    roi: "",
    features: "",
    image: "",
    engine: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "",
    vin: "",
  })
  const { toast } = useToast()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehiclesLoading, setVehiclesLoading] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/admin/dashboard-stats")

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics")
      }

      const data = await response.json()
      setStats(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicles = async () => {
    try {
      setVehiclesLoading(true)
      const response = await fetch("/api/vehicles")

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }

      const data = await response.json()
      if (data.success) {
        setVehicles(data.data)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive",
      })
    } finally {
      setVehiclesLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
    fetchVehicles()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardStats()
      fetchVehicles()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAddVehicle = async () => {
    try {
      const vehicleData = {
        name: newVehicle.name,
        type: newVehicle.type,
        year: Number.parseInt(newVehicle.year),
        price: Number.parseInt(newVehicle.price),
        roi: Number.parseFloat(newVehicle.roi),
        features: newVehicle.features.split(",").map((f) => f.trim()),
        image: newVehicle.image || "/placeholder.svg?height=200&width=300",
        status: "Available",
        specifications: {
          engine: newVehicle.engine || "2.0L 4-Cylinder",
          fuelType: newVehicle.fuelType,
          mileage: "0 km",
          transmission: newVehicle.transmission,
          color: newVehicle.color || "White",
          vin: newVehicle.vin || `VIN${Date.now()}`,
        },
        addedDate: new Date().toISOString(),
        popularity: 0,
      }

      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Vehicle Added",
          description: `${vehicleData.name} has been added to the platform`,
        })

        // Reset form
        setNewVehicle({
          name: "",
          type: "",
          year: "",
          price: "",
          roi: "",
          features: "",
          image: "",
          engine: "",
          fuelType: "Petrol",
          transmission: "Automatic",
          color: "",
          vin: "",
        })
        setImagePreview(null)
        setIsAddVehicleOpen(false)

        // Refresh data
        fetchVehicles()
        fetchDashboardStats()
      } else {
        throw new Error(data.message || "Failed to add vehicle")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add vehicle",
        variant: "destructive",
      })
    }
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setNewVehicle({
      name: vehicle.name,
      type: vehicle.type,
      year: vehicle.year.toString(),
      price: vehicle.price.toString(),
      roi: vehicle.roi.toString(),
      features: vehicle.features.join(", "),
      image: vehicle.image || "",
      engine: vehicle.specifications.engine,
      fuelType: vehicle.specifications.fuelType,
      transmission: vehicle.specifications.transmission,
      color: vehicle.specifications.color,
      vin: vehicle.specifications.vin,
    })
    setIsEditVehicleOpen(true)
  }

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle) return

    try {
      const vehicleData = {
        name: newVehicle.name,
        type: newVehicle.type,
        year: Number.parseInt(newVehicle.year),
        price: Number.parseInt(newVehicle.price),
        roi: Number.parseFloat(newVehicle.roi),
        features: newVehicle.features.split(",").map((f) => f.trim()),
        image: newVehicle.image,
        specifications: {
          engine: newVehicle.engine,
          fuelType: newVehicle.fuelType,
          mileage: selectedVehicle.specifications.mileage,
          transmission: newVehicle.transmission,
          color: newVehicle.color,
          vin: newVehicle.vin,
        },
      }

      const response = await fetch(`/api/vehicles/${selectedVehicle._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Vehicle Updated",
          description: `${vehicleData.name} has been updated successfully`,
        })

        setIsEditVehicleOpen(false)
        setSelectedVehicle(null)
        fetchVehicles()
      } else {
        throw new Error(data.message || "Failed to update vehicle")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update vehicle",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVehicle = async (vehicleId: string, vehicleName: string) => {
    if (!confirm(`Are you sure you want to delete ${vehicleName}?`)) return

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Vehicle Deleted",
          description: `${vehicleName} has been deleted successfully`,
        })
        fetchVehicles()
      } else {
        throw new Error(data.message || "Failed to delete vehicle")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete vehicle",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setImageUploading(true)

        // Create a preview for immediate display
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to Vercel Blob
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const blob = await response.json()

        // Update the vehicle image with the blob URL
        setNewVehicle({ ...newVehicle, image: blob.url })

        toast({
          title: "Image Uploaded",
          description: "Vehicle image has been uploaded successfully",
        })
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
        console.error("Upload error:", error)
      } finally {
        setImageUploading(false)
      }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar role="admin" />

        <div className="md:ml-64">
          <Header userName="Admin" userStatus="System Administrator" notificationCount={0} />

          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar role="admin" />

        <div className="md:ml-64">
          <Header userName="Admin" userStatus="System Administrator" notificationCount={0} />

          <div className="p-6">
            <Card className="max-w-md mx-auto mt-20">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Error Loading Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchDashboardStats} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" notificationCount={stats.recentActivity.length} />

        <div className="p-6">
          {/* Platform Overview Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Platform Administration</h1>
                <p className="text-muted-foreground">
                  Comprehensive monitoring and management of the ChainMove platform
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    System Online
                  </Badge>
                  <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchDashboardStats}
                    disabled={loading}
                    className="ml-2 bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setIsAddVehicleOpen(true)}
                className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>

          {/* Add Vehicle Dialog */}
          {isAddVehicleOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Add New Vehicle to Platform</h2>
                      <p className="text-sm text-gray-600">
                        Add a new vehicle to the platform for drivers and investors
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddVehicleOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vehicle Image</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          {imagePreview ? (
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Vehicle preview"
                              width={128}
                              height={96}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="text-gray-400 text-2xl">📷</div>
                              <p className="text-xs text-gray-500">Upload Image</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="vehicle-image"
                            disabled={imageUploading}
                          />
                          <label htmlFor="vehicle-image" className="cursor-pointer">
                            <Button type="button" variant="outline" asChild disabled={imageUploading}>
                              <span>{imageUploading ? "Uploading..." : "Upload Image"}</span>
                            </Button>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG up to 5MB {imageUploading && "- Uploading..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Vehicle Name *</label>
                        <input
                          type="text"
                          value={newVehicle.name}
                          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                          placeholder="e.g., Toyota Corolla 2024"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type *</label>
                        <select
                          value={newVehicle.type}
                          onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        >
                          <option value="">Select type</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Hatchback">Hatchback</option>
                          <option value="Commercial Van">Commercial Van</option>
                          <option value="Truck">Truck</option>
                          <option value="Tricycle(Keke)">Tricycle(Keke)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Year *</label>
                        <input
                          type="number"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                          placeholder="2024"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price ($) *</label>
                        <input
                          type="number"
                          value={newVehicle.price}
                          onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                          placeholder="25000"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Expected ROI (%) *</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newVehicle.roi}
                          onChange={(e) => setNewVehicle({ ...newVehicle, roi: e.target.value })}
                          placeholder="16.5"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <input
                          type="text"
                          value={newVehicle.color}
                          onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                          placeholder="White"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Vehicle Specifications</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Engine</label>
                          <input
                            type="text"
                            value={newVehicle.engine}
                            onChange={(e) => setNewVehicle({ ...newVehicle, engine: e.target.value })}
                            placeholder="2.0L 4-Cylinder"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Fuel Type</label>
                          <select
                            value={newVehicle.fuelType}
                            onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          >
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Transmission</label>
                          <select
                            value={newVehicle.transmission}
                            onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          >
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">VIN</label>
                          <input
                            type="text"
                            value={newVehicle.vin}
                            onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                            placeholder="Auto-generated if empty"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <label className="text-sm font-medium">Features (comma-separated)</label>
                      <textarea
                        value={newVehicle.features}
                        onChange={(e) => setNewVehicle({ ...newVehicle, features: e.target.value })}
                        placeholder="Fuel Efficient, Reliable, GPS Navigation, Air Conditioning"
                        rows={3}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddVehicle}
                        className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                        disabled={!newVehicle.name || !newVehicle.type || !newVehicle.year || !newVehicle.price}
                      >
                        Add Vehicle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Vehicle Dialog */}
          {isEditVehicleOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Edit Vehicle</h2>
                      <p className="text-sm text-gray-600">Update vehicle information</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditVehicleOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Same form content as Add Vehicle but with Update button */}
                  <div className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vehicle Image</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          {newVehicle.image ? (
                            <Image
                              src={newVehicle.image || "/placeholder.svg"}
                              alt="Vehicle preview"
                              width={128}
                              height={96}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="text-gray-400 text-2xl">📷</div>
                              <p className="text-xs text-gray-500">Upload Image</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="edit-vehicle-image"
                            disabled={imageUploading}
                          />
                          <label htmlFor="edit-vehicle-image" className="cursor-pointer">
                            <Button type="button" variant="outline" asChild disabled={imageUploading}>
                              <span>{imageUploading ? "Uploading..." : "Change Image"}</span>
                            </Button>
                          </label>
                          {imageUploading && <p className="text-xs text-blue-600 mt-1">Uploading image...</p>}
                        </div>
                      </div>
                    </div>

                    {/* Same form fields as Add Vehicle */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Vehicle Name *</label>
                        <input
                          type="text"
                          value={newVehicle.name}
                          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                          placeholder="e.g., Toyota Corolla 2024"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type *</label>
                        <select
                          value={newVehicle.type}
                          onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        >
                          <option value="">Select type</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Hatchback">Hatchback</option>
                          <option value="Commercial Van">Commercial Van</option>
                          <option value="Truck">Truck</option>
                          <option value="Tricycle(Keke)">Tricycle(Keke)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Year *</label>
                        <input
                          type="number"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                          placeholder="2024"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price ($) *</label>
                        <input
                          type="number"
                          value={newVehicle.price}
                          onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                          placeholder="25000"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Expected ROI (%) *</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newVehicle.roi}
                          onChange={(e) => setNewVehicle({ ...newVehicle, roi: e.target.value })}
                          placeholder="16.5"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <input
                          type="text"
                          value={newVehicle.color}
                          onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                          placeholder="White"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Vehicle Specifications</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Engine</label>
                          <input
                            type="text"
                            value={newVehicle.engine}
                            onChange={(e) => setNewVehicle({ ...newVehicle, engine: e.target.value })}
                            placeholder="2.0L 4-Cylinder"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Fuel Type</label>
                          <select
                            value={newVehicle.fuelType}
                            onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          >
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Transmission</label>
                          <select
                            value={newVehicle.transmission}
                            onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          >
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">VIN</label>
                          <input
                            type="text"
                            value={newVehicle.vin}
                            onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                            placeholder="Vehicle VIN"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Features (comma-separated)</label>
                      <textarea
                        value={newVehicle.features}
                        onChange={(e) => setNewVehicle({ ...newVehicle, features: e.target.value })}
                        placeholder="Fuel Efficient, Reliable, GPS Navigation, Air Conditioning"
                        rows={3}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E57700]"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsEditVehicleOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpdateVehicle}
                        className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                        disabled={!newVehicle.name || !newVehicle.type || !newVehicle.year || !newVehicle.price}
                      >
                        Update Vehicle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs opacity-80">
                  {stats.totalDrivers} drivers, {stats.totalInvestors} investors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(stats.totalFundsInvested + stats.totalFundsAvailable).toLocaleString()}
                </div>
                <p className="text-xs opacity-80">${stats.totalFundsInvested.toLocaleString()} invested</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <FileText className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeLoans}</div>
                <p className="text-xs opacity-80">{stats.pendingLoans} pending review</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <TrendingUp className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.platformRevenue.toLocaleString()}</div>
                <p className="text-xs opacity-80">{stats.successRate}% success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Rest of the tabs content remains the same */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Users
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Vehicles
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* All the TabsContent sections remain exactly the same as in the previous version */}
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Platform Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-bold text-green-500">{stats.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">System Uptime</span>
                        <span className="font-bold text-green-500">{stats.systemUptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average ROI</span>
                        <span className="font-bold text-foreground">{stats.averageROI.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Funds</span>
                        <span className="font-bold text-foreground">${stats.totalFundsAvailable.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      Vehicle Utilization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Available</span>
                          <span className="text-sm text-foreground">{stats.vehicleUtilization.available}</span>
                        </div>
                        <Progress
                          value={(stats.vehicleUtilization.available / stats.totalVehicles) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Financed</span>
                          <span className="text-sm text-foreground">{stats.vehicleUtilization.financed}</span>
                        </div>
                        <Progress
                          value={(stats.vehicleUtilization.financed / stats.totalVehicles) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Reserved</span>
                          <span className="text-sm text-foreground">{stats.vehicleUtilization.reserved}</span>
                        </div>
                        <Progress
                          value={(stats.vehicleUtilization.reserved / stats.totalVehicles) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Maintenance</span>
                          <span className="text-sm text-foreground">{stats.vehicleUtilization.maintenance}</span>
                        </div>
                        <Progress
                          value={(stats.vehicleUtilization.maintenance / stats.totalVehicles) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Real-time Platform Activity
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Live monitoring of platform events and user actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                          <div className="w-2 h-2 bg-[#E57700] rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Badge className={getPriorityColor(activity.priority)}>{activity.priority}</Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground mb-2">{stats.totalUsers}</div>
                    <p className="text-sm text-muted-foreground">Registered platform users</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Car className="h-5 w-5 mr-2" />
                      Drivers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500 mb-2">{stats.totalDrivers}</div>
                    <p className="text-sm text-muted-foreground">Active drivers on platform</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Wallet className="h-5 w-5 mr-2" />
                      Investors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500 mb-2">{stats.totalInvestors}</div>
                    <p className="text-sm text-muted-foreground">Active investors on platform</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">User Distribution</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Breakdown of user types on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Drivers</span>
                        <span className="text-sm text-foreground">
                          {stats.totalDrivers} ({((stats.totalDrivers / stats.totalUsers) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={(stats.totalDrivers / stats.totalUsers) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Investors</span>
                        <span className="text-sm text-foreground">
                          {stats.totalInvestors} ({((stats.totalInvestors / stats.totalUsers) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={(stats.totalInvestors / stats.totalUsers) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Vehicles Tab */}

            <TabsContent value="vehicles" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.vehicleUtilization.available}</div>
                  <p className="text-sm text-green-700">Available</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.vehicleUtilization.financed}</div>
                  <p className="text-sm text-blue-700">Financed</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.vehicleUtilization.reserved}</div>
                  <p className="text-sm text-yellow-700">Reserved</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.vehicleUtilization.maintenance}</div>
                  <p className="text-sm text-red-700">Maintenance</p>
                </div>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center justify-between">
                    <span className="flex items-center">
                      <Car className="h-5 w-5 mr-2" />
                      Vehicle Management ({vehicles.length})
                    </span>
                    <Button onClick={fetchVehicles} variant="outline" size="sm" disabled={vehiclesLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${vehiclesLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage all vehicles in your fleet - add, edit, or remove vehicles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {vehiclesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <Skeleton className="h-16 w-24 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : vehicles.length === 0 ? (
                    <div className="text-center py-12">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No vehicles found</p>
                      <Button
                        onClick={() => setIsAddVehicleOpen(true)}
                        className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Vehicle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vehicles.map((vehicle) => (
                        <Card key={vehicle._id} className="bg-muted border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <Image
                                  src={vehicle.image || "/placeholder.svg?height=80&width=120"}
                                  alt={vehicle.name}
                                  width={120}
                                  height={80}
                                  className="rounded-lg object-cover"
                                />
                                <div>
                                  <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {vehicle.year} • {vehicle.type}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge
                                      className={`${
                                        vehicle.status === "Available"
                                          ? "bg-green-100 text-green-800"
                                          : vehicle.status === "Financed"
                                            ? "bg-blue-100 text-blue-800"
                                            : vehicle.status === "Reserved"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {vehicle.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">ROI: {vehicle.roi}%</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Added: {new Date(vehicle.addedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-foreground text-lg">${vehicle.price.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Vehicle Price</p>
                                <div className="flex space-x-2 mt-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-border text-foreground bg-transparent"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-border text-foreground bg-transparent"
                                    onClick={() => handleEditVehicle(vehicle)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                                    onClick={() => handleDeleteVehicle(vehicle._id, vehicle.name)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="flex flex-wrap gap-1">
                                {vehicle.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Engine</p>
                                <p className="font-medium text-foreground">{vehicle.specifications.engine}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Fuel</p>
                                <p className="font-medium text-foreground">{vehicle.specifications.fuelType}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Transmission</p>
                                <p className="font-medium text-foreground">{vehicle.specifications.transmission}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Color</p>
                                <p className="font-medium text-foreground">{vehicle.specifications.color}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Key Performance Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Success Rate</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${stats.successRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.successRate}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Average ROI</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(stats.averageROI / 20) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.averageROI.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Vehicle Utilization</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{
                                width: `${((stats.vehicleUtilization.financed + stats.vehicleUtilization.reserved) / stats.totalVehicles) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {(
                              ((stats.vehicleUtilization.financed + stats.vehicleUtilization.reserved) /
                                stats.totalVehicles) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      Platform Health Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">System Uptime</span>
                        <span className="font-bold text-green-500">{stats.systemUptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Loans</span>
                        <span className="font-bold text-foreground">{stats.activeLoans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending Loans</span>
                        <span className="font-bold text-yellow-500">{stats.pendingLoans}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Vehicles</span>
                        <span className="font-bold text-foreground">{stats.totalVehicles}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Overview */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">${stats.totalFundsInvested.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Invested</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        ${stats.totalFundsAvailable.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Available Funds</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">
                        ${((stats.totalFundsInvested * stats.averageROI) / 100).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Projected Returns</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#E57700]">${stats.platformRevenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Platform Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
