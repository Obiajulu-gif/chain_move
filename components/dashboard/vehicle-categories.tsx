"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Car, Truck, Bus, Bike, TrendingUp, DollarSign, Star } from "lucide-react"
import Image from "next/image"

interface VehicleCategory {
  id: string
  name: string
  localName: string
  icon: React.ReactNode
  description: string
  priceRange: string
  roiRange: string
  popularity: number
  totalVehicles: number
  availableVehicles: number
  averageROI: number
  typicalUse: string[]
  marketDemand: "High" | "Medium" | "Low"
  examples: {
    name: string
    price: number
    image: string
    roi: number
  }[]
}

const vehicleCategories: VehicleCategory[] = [
  {
    id: "tricycle",
    name: "Tricycle",
    localName: "Keke NAPEP",
    icon: <Car className="h-6 w-6" />,
    description:
      "Three-wheeled commercial vehicles perfect for urban transportation and quick passenger/cargo transport.",
    priceRange: "$2,500 - $3,000",
    roiRange: "22% - 25%",
    popularity: 97,
    totalVehicles: 45,
    availableVehicles: 12,
    averageROI: 23.2,
    typicalUse: ["Urban Transport", "Short Distance", "Passenger Service", "Light Cargo"],
    marketDemand: "High",
    examples: [
      {
        name: "Keke NAPEP 2024",
        price: 2500,
        image: "/images/tricycle-keke.jpg",
        roi: 22.5,
      },
      {
        name: "Piaggio Ape 2024",
        price: 2800,
        image: "/images/tricycle-keke.jpg",
        roi: 23.0,
      },
    ],
  },
  {
    id: "motorcycle",
    name: "Motorcycle",
    localName: "Okada",
    icon: <Bike className="h-6 w-6" />,
    description: "Two-wheeled vehicles ideal for personal transport, delivery services, and navigating traffic.",
    priceRange: "$1,800 - $2,500",
    roiRange: "24% - 26%",
    popularity: 94,
    totalVehicles: 38,
    availableVehicles: 15,
    averageROI: 24.8,
    typicalUse: ["Delivery Services", "Personal Transport", "Urban Mobility", "Rural Access"],
    marketDemand: "High",
    examples: [
      {
        name: "Bajaj Okada 2024",
        price: 1800,
        image: "/images/okada-motorcycle.jpg",
        roi: 25.0,
      },
      {
        name: "TVS Apache 2024",
        price: 2200,
        image: "/images/okada-motorcycle.jpg",
        roi: 24.5,
      },
    ],
  },
  {
    id: "mini-bus",
    name: "Mini Bus",
    localName: "Danfo/Trotro",
    icon: <Bus className="h-6 w-6" />,
    description: "Medium-capacity buses perfect for passenger transport and commercial operations.",
    priceRange: "$30,000 - $40,000",
    roiRange: "17% - 20%",
    popularity: 85,
    totalVehicles: 22,
    availableVehicles: 8,
    averageROI: 18.5,
    typicalUse: ["Passenger Transport", "Inter-city Travel", "Commercial Routes", "School Transport"],
    marketDemand: "High",
    examples: [
      {
        name: "Toyota Hiace 2023",
        price: 35000,
        image: "/images/mini-bus.jpg",
        roi: 18.5,
      },
    ],
  },
  {
    id: "18-seater-bus",
    name: "18-Seater Bus",
    localName: "Coaster Bus",
    icon: <Bus className="h-6 w-6" />,
    description: "High-capacity buses ideal for group transport, school services, and long-distance travel.",
    priceRange: "$40,000 - $50,000",
    roiRange: "18% - 21%",
    popularity: 78,
    totalVehicles: 15,
    availableVehicles: 5,
    averageROI: 19.2,
    typicalUse: ["School Transport", "Church Services", "Group Travel", "Inter-city Routes"],
    marketDemand: "Medium",
    examples: [
      {
        name: "Coaster 18-Seater 2022",
        price: 45000,
        image: "/images/18-seater-bus.jpg",
        roi: 19.2,
      },
    ],
  },
  {
    id: "pickup-truck",
    name: "Pickup Truck",
    localName: "Carter",
    icon: <Truck className="h-6 w-6" />,
    description: "Heavy-duty trucks perfect for cargo transport, construction, and commercial operations.",
    priceRange: "$24,000 - $30,000",
    roiRange: "16% - 19%",
    popularity: 82,
    totalVehicles: 28,
    availableVehicles: 10,
    averageROI: 17.5,
    typicalUse: ["Cargo Transport", "Construction", "Commercial Delivery", "Heavy Duty Work"],
    marketDemand: "High",
    examples: [
      {
        name: "Toyota Hilux 2023",
        price: 28000,
        image: "/images/toyota-carter.jpg",
        roi: 17.8,
      },
      {
        name: "Mazda BT-50 2023",
        price: 26000,
        image: "/images/mazda-carter.jpg",
        roi: 17.5,
      },
      {
        name: "Mitsubishi L200 2022",
        price: 24000,
        image: "/images/mitsubishi-carter.jpg",
        roi: 17.2,
      },
    ],
  },
]

interface VehicleCategoriesProps {
  onCategorySelect?: (categoryId: string) => void
  selectedCategory?: string
}

export function VehicleCategories({ onCategorySelect, selectedCategory }: VehicleCategoriesProps) {
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High":
        return "bg-green-600"
      case "Medium":
        return "bg-yellow-600"
      case "Low":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Vehicle Categories</h2>
        <p className="text-muted-foreground">
          Explore different vehicle types available for financing in the African market
        </p>
      </div>

      <div className="grid gap-6">
        {vehicleCategories.map((category) => (
          <Card
            key={category.id}
            className={`bg-card border-border transition-all hover:border-[#E57700] cursor-pointer ${
              selectedCategory === category.id ? "border-[#E57700] bg-[#E57700]/5" : ""
            }`}
            onClick={() => onCategorySelect?.(category.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#E57700] rounded-lg text-white">{category.icon}</div>
                  <div>
                    <CardTitle className="text-foreground flex items-center space-x-2">
                      <span>{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.localName}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                </div>
                <Badge className={`${getDemandColor(category.marketDemand)} text-white`}>
                  {category.marketDemand} Demand
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    <span>Price Range</span>
                  </div>
                  <p className="font-semibold text-foreground">{category.priceRange}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>ROI Range</span>
                  </div>
                  <p className="font-semibold text-green-500">{category.roiRange}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                    <Car className="h-3 w-3" />
                    <span>Available</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {category.availableVehicles}/{category.totalVehicles}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                    <Star className="h-3 w-3" />
                    <span>Popularity</span>
                  </div>
                  <p className="font-semibold text-foreground">{category.popularity}%</p>
                </div>
              </div>

              {/* Popularity Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Market Popularity</span>
                  <span className="text-foreground">{category.popularity}%</span>
                </div>
                <Progress value={category.popularity} className="h-2" />
              </div>

              {/* Typical Use Cases */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Typical Use Cases:</p>
                <div className="flex flex-wrap gap-2">
                  {category.typicalUse.map((use, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Example Vehicles */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Available Models:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.examples.map((example, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={example.image || "/placeholder.svg"}
                          alt={example.name}
                          width={60}
                          height={45}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{example.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-bold text-foreground">${example.price.toLocaleString()}</span>
                            <Badge className="bg-green-600 text-white text-xs">{example.roi}% ROI</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  onClick={() => onCategorySelect?.(category.id)}
                >
                  <Car className="h-4 w-4 mr-2" />
                  Explore {category.name} Options
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-muted border-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {vehicleCategories.reduce((sum, cat) => sum + cat.totalVehicles, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {vehicleCategories.reduce((sum, cat) => sum + cat.availableVehicles, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Available Now</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">
                {(vehicleCategories.reduce((sum, cat) => sum + cat.averageROI, 0) / vehicleCategories.length).toFixed(
                  1,
                )}
                %
              </p>
              <p className="text-sm text-muted-foreground">Average ROI</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-sm text-muted-foreground">Vehicle Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
