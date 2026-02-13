"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VehicleCategories } from "@/components/dashboard/vehicle-categories"
import { DiscoverVehicles } from "@/components/dashboard/discover-vehicles"
import { Header } from "@/components/dashboard/header"
import { Search, Filter, MapPin, Star, DollarSign, Eye, Heart } from "lucide-react"
import Image from "next/image"

export default function VehicleMarketplacePage() {
  const [activeTab, setActiveTab] = useState("categories")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setActiveTab("vehicles")
  }

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
      description: "High-demand commercial tricycle perfect for urban transportation",
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
      description: "Heavy-duty pickup truck for construction and cargo transport",
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
      description: "Fast and efficient motorcycle for delivery services",
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

  return (
    <div className="min-h-screen bg-background">
      <Header userName="Guest" userStatus="Browse Vehicles" />

      <div className="p-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Vehicle Marketplace</h1>
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

        {/* Featured Vehicles */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Star className="h-5 w-5 mr-2 text-[#E57700]" />
              Featured Vehicles
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              High-demand vehicles with excellent ROI potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
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
                      <Badge className={`${getDemandColor(vehicle.demand)} text-white`}>{vehicle.demand}</Badge>
                      <Badge className="bg-[#E57700] text-white">{vehicle.roi}% ROI</Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="absolute top-3 left-3 text-white hover:bg-black/20">
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
                        <span className="text-2xl font-bold text-foreground">${vehicle.price.toLocaleString()}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-foreground">{vehicle.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{vehicle.location}</span>
                      </div>

                      <p className="text-sm text-muted-foreground">{vehicle.description}</p>

                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Invest Now
                        </Button>
                        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted border-border">
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
            >
              Vehicle Categories
            </TabsTrigger>
            <TabsTrigger
              value="vehicles"
              className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
            >
              Browse Vehicles
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
            >
              Advanced Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <VehicleCategories onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
          </TabsContent>

          <TabsContent value="vehicles">
            <DiscoverVehicles />
          </TabsContent>

          <TabsContent value="search">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Advanced Vehicle Search
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Find vehicles that match your specific investment criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                      <SelectItem value="south-africa">South Africa</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-5k">Under $5,000</SelectItem>
                      <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                      <SelectItem value="15k-30k">$15,000 - $30,000</SelectItem>
                      <SelectItem value="over-30k">Over $30,000</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>

                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Advanced Search Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're building advanced search capabilities to help you find the perfect vehicle investment
                  </p>
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                    Browse All Vehicles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
