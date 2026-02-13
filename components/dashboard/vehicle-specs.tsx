"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Fuel, Calendar, MapPin, Wrench, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react"
import Image from "next/image"

interface VehicleSpecsProps {
  vehicle: {
    id: string
    name: string
    model: string
    year: number
    type: string
    image: string
    status: "Active" | "Maintenance" | "Offline"
    specs: {
      engine: string
      fuelType: string
      mileage: string
      transmission: string
      color: string
      vin: string
    }
    maintenance: {
      lastService: string
      nextService: string
      oilChange: number
      tireRotation: number
      inspection: number
    }
    location: {
      current: string
      lastUpdated: string
    }
    documents: {
      registration: boolean
      insurance: boolean
      inspection: boolean
    }
  }
}

export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600"
      case "Maintenance":
        return "bg-yellow-600"
      case "Offline":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getMaintenanceStatus = (daysUntil: number) => {
    if (daysUntil < 0) return { color: "text-red-400", icon: AlertTriangle, text: "Overdue" }
    if (daysUntil <= 7) return { color: "text-yellow-400", icon: Clock, text: "Due Soon" }
    return { color: "text-green-400", icon: CheckCircle, text: "On Track" }
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Header */}
      <Card className="bg-[#2a3441] border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={vehicle.image || "/placeholder.svg"}
                alt={vehicle.name}
                width={120}
                height={80}
                className="rounded-lg object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">{vehicle.name}</h2>
                <p className="text-gray-400">
                  {vehicle.year} {vehicle.model}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={`${getStatusColor(vehicle.status)} text-white`}>{vehicle.status}</Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {vehicle.type}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{vehicle.location.current}</span>
              </div>
              <p className="text-xs text-gray-500">Updated: {vehicle.location.lastUpdated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details Tabs */}
      <Tabs defaultValue="specs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-[#2a3441] border-gray-700">
          <TabsTrigger
            value="specs"
            className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
          >
            Maintenance
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="support"
            className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
          >
            Support
          </TabsTrigger>
        </TabsList>

        {/* Specifications Tab */}
        <TabsContent value="specs">
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Engine</span>
                    <span className="text-white font-medium">{vehicle.specs.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fuel Type</span>
                    <span className="text-white font-medium">{vehicle.specs.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mileage</span>
                    <span className="text-white font-medium">{vehicle.specs.mileage}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transmission</span>
                    <span className="text-white font-medium">{vehicle.specs.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Color</span>
                    <span className="text-white font-medium">{vehicle.specs.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">VIN</span>
                    <span className="text-white font-medium font-mono text-sm">{vehicle.specs.vin}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <div className="grid gap-4">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Maintenance Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Fuel className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">Oil Change</p>
                        <p className="text-sm text-gray-400">Every 5,000 miles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const status = getMaintenanceStatus(vehicle.maintenance.oilChange)
                        const StatusIcon = status.icon
                        return (
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-sm ${status.color}`}>
                              {vehicle.maintenance.oilChange > 0
                                ? `${vehicle.maintenance.oilChange} days`
                                : status.text}
                            </span>
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Car className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Tire Rotation</p>
                        <p className="text-sm text-gray-400">Every 6,000 miles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const status = getMaintenanceStatus(vehicle.maintenance.tireRotation)
                        const StatusIcon = status.icon
                        return (
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-sm ${status.color}`}>
                              {vehicle.maintenance.tireRotation > 0
                                ? `${vehicle.maintenance.tireRotation} days`
                                : status.text}
                            </span>
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">Annual Inspection</p>
                        <p className="text-sm text-gray-400">Required yearly</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const status = getMaintenanceStatus(vehicle.maintenance.inspection)
                        const StatusIcon = status.icon
                        return (
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            <span className={`text-sm ${status.color}`}>
                              {vehicle.maintenance.inspection > 0
                                ? `${vehicle.maintenance.inspection} days`
                                : status.text}
                            </span>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Service
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Wrench className="h-4 w-4 mr-2" />
                    Request Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Vehicle Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">Vehicle Registration</p>
                      <p className="text-sm text-gray-400">Required for operation</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vehicle.documents.registration ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                    <span className={`text-sm ${vehicle.documents.registration ? "text-green-400" : "text-red-400"}`}>
                      {vehicle.documents.registration ? "Valid" : "Missing"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-medium text-white">Insurance Certificate</p>
                      <p className="text-sm text-gray-400">Comprehensive coverage</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vehicle.documents.insurance ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                    <span className={`text-sm ${vehicle.documents.insurance ? "text-green-400" : "text-red-400"}`}>
                      {vehicle.documents.insurance ? "Valid" : "Missing"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-white">Safety Inspection</p>
                      <p className="text-sm text-gray-400">Annual requirement</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vehicle.documents.inspection ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                    <span className={`text-sm ${vehicle.documents.inspection ? "text-green-400" : "text-red-400"}`}>
                      {vehicle.documents.inspection ? "Valid" : "Missing"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support">
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Support & Assistance</CardTitle>
              <CardDescription className="text-gray-400">
                Get help with maintenance, delays, or technical issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex-col">
                  <Wrench className="h-6 w-6 mb-2" />
                  <span>Maintenance Request</span>
                  <span className="text-xs opacity-80">Schedule or report issues</span>
                </Button>

                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white h-20 flex-col">
                  <Clock className="h-6 w-6 mb-2" />
                  <span>Payment Delay</span>
                  <span className="text-xs opacity-80">Request extension</span>
                </Button>

                <Button className="bg-green-600 hover:bg-green-700 text-white h-20 flex-col">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  <span>Emergency Support</span>
                  <span className="text-xs opacity-80">24/7 assistance</span>
                </Button>

                <Button className="bg-purple-600 hover:bg-purple-700 text-white h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Document Help</span>
                  <span className="text-xs opacity-80">Upload assistance</span>
                </Button>
              </div>

              <div className="mt-6 p-4 bg-[#1a2332] rounded-lg">
                <h4 className="font-medium text-white mb-2">Recent Support Tickets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Oil change scheduled</span>
                    <Badge className="bg-green-600 text-white">Resolved</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Insurance renewal reminder</span>
                    <Badge className="bg-blue-600 text-white">In Progress</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
