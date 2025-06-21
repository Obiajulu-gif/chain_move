"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, MapPin, Star, DollarSign, Car, Fuel, Calendar, Eye, Heart } from "lucide-react"
import Image from "next/image"

interface Vehicle {
  id: string
  name: string
  type: string
  year: number
  image: string
  loanAmount: number
  roi: number
  term: number
  monthlyReturn: number
  fundingProgress: number
  location: string
  driverRating: number
  riskLevel: "Low" | "Medium" | "High"
  fuelType: string
  mileage: string
  description: string
  driverName: string
  driverExperience: number
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Tricycle (Keke NAPEP) 2024",
    type: "Tricycle",
    year: 2024,
    image: "/images/tricycle-keke.jpg",
    loanAmount: 2500,
    roi: 22.5,
    term: 24,
    monthlyReturn: 125,
    fundingProgress: 85,
    location: "Lagos, Nigeria",
    driverRating: 4.9,
    riskLevel: "Low",
    fuelType: "Petrol",
    mileage: "New",
    description: "High-demand commercial tricycle perfect for urban transportation and quick returns.",
    driverName: "Emeka Okafor",
    driverExperience: 4,
  },
  {
    id: "2",
    name: "Bajaj Okada (Motorcycle) 2024",
    type: "Motorcycle",
    year: 2024,
    image: "/images/okada-motorcycle.jpg",
    loanAmount: 1800,
    roi: 25.0,
    term: 18,
    monthlyReturn: 95,
    fundingProgress: 92,
    location: "Abuja, Nigeria",
    driverRating: 4.8,
    riskLevel: "Low",
    fuelType: "Petrol",
    mileage: "New",
    description: "Fast and efficient motorcycle for urban mobility and delivery services.",
    driverName: "Ibrahim Musa",
    driverExperience: 6,
  },
  {
    id: "3",
    name: "Toyota Hiace Mini Bus 2023",
    type: "Mini Bus",
    year: 2023,
    image: "/images/mini-bus.jpg",
    loanAmount: 35000,
    roi: 18.5,
    term: 48,
    monthlyReturn: 680,
    fundingProgress: 65,
    location: "Accra, Ghana",
    driverRating: 4.7,
    riskLevel: "Medium",
    fuelType: "Petrol",
    mileage: "15,000 km",
    description: "Reliable mini bus perfect for passenger transport and commercial operations.",
    driverName: "Kwame Asante",
    driverExperience: 8,
  },
  {
    id: "4",
    name: "Coaster 18-Seater Bus 2022",
    type: "18-Seater Bus",
    year: 2022,
    image: "/images/18-seater-bus.jpg",
    loanAmount: 45000,
    roi: 19.2,
    term: 60,
    monthlyReturn: 920,
    fundingProgress: 45,
    location: "Nairobi, Kenya",
    driverRating: 4.6,
    riskLevel: "Medium",
    fuelType: "Diesel",
    mileage: "25,000 km",
    description: "High-capacity bus ideal for school transport, church services, and inter-city travel.",
    driverName: "Grace Wanjiku",
    driverExperience: 10,
  },
  {
    id: "5",
    name: "Toyota Hilux Carter 2023",
    type: "Pickup Truck",
    year: 2023,
    image: "/images/toyota-carter.jpg",
    loanAmount: 28000,
    roi: 17.8,
    term: 42,
    monthlyReturn: 520,
    fundingProgress: 78,
    location: "Lagos, Nigeria",
    driverRating: 4.8,
    riskLevel: "Low",
    fuelType: "Diesel",
    mileage: "18,000 km",
    description: "Heavy-duty pickup truck perfect for construction, cargo transport, and commercial use.",
    driverName: "Adebayo Samuel",
    driverExperience: 7,
  },
  {
    id: "6",
    name: "Mazda BT-50 Carter 2023",
    type: "Pickup Truck",
    year: 2023,
    image: "/images/mazda-carter.jpg",
    loanAmount: 26000,
    roi: 17.5,
    term: 40,
    monthlyReturn: 485,
    fundingProgress: 55,
    location: "Kumasi, Ghana",
    driverRating: 4.7,
    riskLevel: "Low",
    fuelType: "Diesel",
    mileage: "12,000 km",
    description: "Fuel-efficient pickup truck with excellent cargo capacity for commercial operations.",
    driverName: "Kofi Mensah",
    driverExperience: 5,
  },
  {
    id: "7",
    name: "Mitsubishi L200 Carter 2022",
    type: "Pickup Truck",
    year: 2022,
    image: "/images/mitsubishi-carter.jpg",
    loanAmount: 24000,
    roi: 17.2,
    term: 38,
    monthlyReturn: 445,
    fundingProgress: 70,
    location: "Mombasa, Kenya",
    driverRating: 4.5,
    riskLevel: "Medium",
    fuelType: "Diesel",
    mileage: "22,000 km",
    description: "Affordable and reliable pickup truck with good resale value and versatile use.",
    driverName: "John Kamau",
    driverExperience: 6,
  },
  {
    id: "8",
    name: "TVS Apache Okada 2024",
    type: "Motorcycle",
    year: 2024,
    image: "/images/okada-motorcycle.jpg",
    loanAmount: 2200,
    roi: 24.5,
    term: 20,
    monthlyReturn: 115,
    fundingProgress: 88,
    location: "Port Harcourt, Nigeria",
    driverRating: 4.9,
    riskLevel: "Low",
    fuelType: "Petrol",
    mileage: "New",
    description: "Sport-designed motorcycle with excellent fuel efficiency for urban mobility.",
    driverName: "Chidi Okwu",
    driverExperience: 3,
  },
]

export function DiscoverVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [roiRange, setRoiRange] = useState([10, 20])
  const [showFilters, setShowFilters] = useState(false)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-600"
      case "Medium":
        return "bg-yellow-600"
      case "High":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || vehicle.type.toLowerCase() === selectedType.toLowerCase()
    const matchesRegion = selectedRegion === "all" || vehicle.location.includes(selectedRegion)
    const matchesROI = vehicle.roi >= roiRange[0] && vehicle.roi <= roiRange[1]

    return matchesSearch && matchesType && matchesRegion && matchesROI
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-[#2a3441] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Discover Investment Opportunities</CardTitle>
          <CardDescription className="text-gray-400">Find vehicles to fund and earn returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicles or drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a2332] border-gray-600 text-white"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <span className="text-sm text-gray-400">{filteredVehicles.length} vehicles found</span>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-4 gap-4 p-4 bg-[#1a2332] rounded-lg">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Vehicle Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-[#2a3441] border-gray-600">
                      <SelectValue />
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
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Region</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="bg-[#2a3441] border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                      <SelectItem value="Accra">Accra</SelectItem>
                      <SelectItem value="Nairobi">Nairobi</SelectItem>
                      <SelectItem value="Cape Town">Cape Town</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-2 block">
                    ROI Range: {roiRange[0]}% - {roiRange[1]}%
                  </label>
                  <Slider value={roiRange} onValueChange={setRoiRange} max={25} min={5} step={0.5} className="mt-2" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-[#2a3441] border-gray-700 hover:border-[#E57700] transition-colors">
            <div className="relative">
              <Image
                src={vehicle.image || "/placeholder.svg"}
                alt={vehicle.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-3 right-3 flex space-x-2">
                <Badge className={`${getRiskColor(vehicle.riskLevel)} text-white`}>{vehicle.riskLevel} Risk</Badge>
                <Badge className="bg-[#E57700] text-white">{vehicle.roi}% ROI</Badge>
              </div>
              <Button size="sm" variant="ghost" className="absolute top-3 left-3 text-white hover:bg-black/20">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-white">{vehicle.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {vehicle.year} • {vehicle.type}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">${vehicle.loanAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{vehicle.term} months</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Driver Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#E57700] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{vehicle.driverName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{vehicle.driverName}</p>
                      <p className="text-xs text-gray-400">{vehicle.driverExperience} years exp.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-white">{vehicle.driverRating}</span>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Fuel className="h-4 w-4" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{vehicle.mileage}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>${vehicle.monthlyReturn}/mo</span>
                  </div>
                </div>

                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Funding Progress</span>
                    <span className="text-sm text-white">{vehicle.fundingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-[#E57700] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${vehicle.fundingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 line-clamp-2">{vehicle.description}</p>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Fund Vehicle
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredVehicles.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            Load More Vehicles
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredVehicles.length === 0 && (
        <Card className="bg-[#2a3441] border-gray-700">
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No vehicles found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedType("all")
                setSelectedRegion("all")
                setRoiRange([10, 20])
              }}
              className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
