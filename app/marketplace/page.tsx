"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/dashboard/header"
import { Search, MapPin, Star, DollarSign, Eye, Heart } from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/landing/navigation"


export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("featured")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const featuredVehicles = [
    {
      id: "featured1",
      name: "Tricycle (Keke NAPEP) 2024",
      type: "Tricycle",
      price: 2500,
      image: "/images/tricycle-keke.jpg",
      roi: 22.5,
      location: "Lagos, Nigeria",
      rating: 4.9,
      demand: "High",
      fundingProgress: 85,
      description: "High-demand commercial tricycle perfect for urban transportation and quick returns.",
      features: ["Fuel Efficient", "High Demand", "Quick ROI", "Urban Transport"],
    },
    {
      id: "featured2",
      name: "Toyota Hilux Carter 2023",
      type: "Pickup Truck",
      price: 28000,
      image: "/images/toyota-carter.jpg",
      roi: 17.8,
      location: "Accra, Ghana",
      rating: 4.8,
      demand: "High",
      fundingProgress: 78,
      description: "Heavy-duty pickup truck for construction and cargo transport with excellent reliability.",
      features: ["Heavy Duty", "Cargo Transport", "Construction", "Reliable"],
    },
    {
      id: "featured3",
      name: "Bajaj Okada 2024",
      type: "Motorcycle",
      price: 1800,
      image: "/images/okada-motorcycle.jpg",
      roi: 25.0,
      location: "Abuja, Nigeria",
      rating: 4.9,
      demand: "High",
      fundingProgress: 92,
      description: "Fast and efficient motorcycle for delivery services with highest ROI potential.",
      features: ["High Mobility", "Low Maintenance", "Fast Returns", "Rural Access"],
    },
    {
      id: "featured4",
      name: "Toyota Hiace Mini Bus 2023",
      type: "Mini Bus",
      price: 35000,
      image: "/images/mini-bus.jpg",
      roi: 18.5,
      location: "Nairobi, Kenya",
      rating: 4.7,
      demand: "Medium",
      fundingProgress: 65,
      description: "Reliable mini bus perfect for passenger transport and commercial operations.",
      features: ["High Capacity", "Durable", "Commercial Use", "Inter-city Transport"],
    },
    {
      id: "featured5",
      name: "Coaster 18-Seater Bus 2022",
      type: "18-Seater Bus",
      price: 45000,
      image: "/images/18-seater-bus.jpg",
      roi: 19.2,
      location: "Cape Town, South Africa",
      rating: 4.6,
      demand: "Medium",
      fundingProgress: 45,
      description: "High-capacity bus ideal for school transport and group travel services.",
      features: ["High Passenger Capacity", "Long Distance", "Comfortable", "School/Church Transport"],
    },
    {
      id: "featured6",
      name: "Mazda BT-50 Carter 2023",
      type: "Pickup Truck",
      price: 26000,
      image: "/images/mazda-carter.jpg",
      roi: 17.5,
      location: "Kumasi, Ghana",
      rating: 4.7,
      demand: "Medium",
      fundingProgress: 55,
      description: "Fuel-efficient pickup truck with excellent cargo capacity for commercial operations.",
      features: ["Fuel Efficient", "Cargo Capacity", "Durable", "Commercial Use"],
    },
  ]

  const vehicleCategories = [
    {
      id: "tricycle",
      name: "Tricycle (Keke)",
      description: "Urban transport solution",
      image: "/images/tricycle-keke.jpg",
      count: 45,
      avgROI: 23.2,
      priceRange: "$2,500 - $3,000",
    },
    {
      id: "motorcycle",
      name: "Motorcycle (Okada)",
      description: "Fast delivery & mobility",
      image: "/images/okada-motorcycle.jpg",
      count: 38,
      avgROI: 24.8,
      priceRange: "$1,800 - $2,500",
    },
    {
      id: "minibus",
      name: "Mini Bus",
      description: "Passenger transport",
      image: "/images/mini-bus.jpg",
      count: 22,
      avgROI: 18.5,
      priceRange: "$30,000 - $40,000",
    },
    {
      id: "bus",
      name: "18-Seater Bus",
      description: "Group & school transport",
      image: "/images/18-seater-bus.jpg",
      count: 15,
      avgROI: 19.2,
      priceRange: "$40,000 - $50,000",
    },
    {
      id: "pickup",
      name: "Pickup Truck (Carter)",
      description: "Cargo & construction",
      image: "/images/toyota-carter.jpg",
      count: 28,
      avgROI: 17.6,
      priceRange: "$24,000 - $30,000",
    },
  ]

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

  const filteredVehicles = featuredVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation =
      locationFilter === "all" || vehicle.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || vehicle.type.toLowerCase().includes(categoryFilter.toLowerCase())

    return matchesSearch && matchesLocation && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* <Header userName="Guest" userStatus="Browse Marketplace" /> */}
      <Navigation />

      <div className="p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">African Vehicle Marketplace</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover financing opportunities for African market vehicles. From tricycles (keke) to pickup trucks
              (carter), find the perfect vehicle investment that matches your goals.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">148</div>
                <div className="text-sm text-muted-foreground">Available Vehicles</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-500">21.2%</div>
                <div className="text-sm text-muted-foreground">Average ROI</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">5</div>
                <div className="text-sm text-muted-foreground">Vehicle Types</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted border-border">
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
            >
              Featured Vehicles
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
            >
              Vehicle Categories
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
            >
              Browse All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Star className="h-5 w-5 mr-2 text-[#E57700]" />
                  Featured Investment Opportunities
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  High-demand vehicles with excellent ROI potential and proven track records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="bg-muted border-border hover:border-[#E57700] transition-colors">
                      <div className="relative">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3 flex flex-col space-y-1">
                          <Badge className={`${getDemandColor(vehicle.demand)} text-white text-xs`}>
                            {vehicle.demand}
                          </Badge>
                          <Badge className="bg-[#E57700] text-white text-xs">{vehicle.roi}% ROI</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-3 left-3 text-white hover:bg-black/20"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-foreground">
                              ${vehicle.price.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-foreground">{vehicle.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{vehicle.location}</span>
                          </div>

                          {/* Funding Progress */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-muted-foreground">Funding Progress</span>
                              <span className="text-sm text-foreground">{vehicle.fundingProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-[#E57700] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${vehicle.fundingProgress}%` }}
                              />
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>

                          <div className="flex flex-wrap gap-1">
                            {vehicle.features.slice(0, 2).map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex space-x-2">
                            <Button className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Invest Now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border text-foreground hover:bg-muted"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Vehicle Categories</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Explore different types of vehicles available for investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicleCategories.map((category) => (
                    <Card
                      key={category.id}
                      className="bg-muted border-border hover:border-[#E57700] transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={300}
                          height={150}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-[#E57700] text-white">{category.avgROI}% Avg ROI</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Available:</span>
                            <span className="font-medium text-foreground">{category.count} vehicles</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price Range:</span>
                            <span className="font-medium text-foreground">{category.priceRange}</span>
                          </div>

                          <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                            Browse {category.name}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Browse All Vehicles
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Search and filter vehicles to find your perfect investment opportunity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border"
                    />
                  </div>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="nigeria">Nigeria</SelectItem>
                      <SelectItem value="ghana">Ghana</SelectItem>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="south africa">South Africa</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="tricycle">Tricycle (Keke)</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle (Okada)</SelectItem>
                      <SelectItem value="mini bus">Mini Bus</SelectItem>
                      <SelectItem value="18-seater">18-Seater Bus</SelectItem>
                      <SelectItem value="pickup">Pickup Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="bg-muted border-border hover:border-[#E57700] transition-colors">
                      <div className="relative">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3 flex space-x-2">
                          <Badge className={`${getDemandColor(vehicle.demand)} text-white text-xs`}>
                            {vehicle.demand}
                          </Badge>
                          <Badge className="bg-[#E57700] text-white text-xs">{vehicle.roi}% ROI</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-foreground">${vehicle.price.toLocaleString()}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-foreground">{vehicle.rating}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{vehicle.location}</span>
                          </div>

                          <div className="flex space-x-2">
                            <Button className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Invest
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border text-foreground hover:bg-muted"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredVehicles.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No vehicles found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or browse all categories
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setLocationFilter("all")
                        setCategoryFilter("all")
                      }}
                      className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
