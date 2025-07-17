"use client"

import { useState, useEffect, useRef } from "react"
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
  const [randomVehicles, setRandomVehicles] = useState<any[]>([])

  const allVehicles = [
    {
      id: "featured1",
      name: "Tricycle (Keke NAPEP) 2024",
      type: "Tricycle",
      price: 2500,
      image: "/assets/keke-nigeria.png",
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
      name: "Suzuki Every Mini Bus",
      type: "Shuttle Bus",
      price: 28000,
      image: "/assets/mOlcqsJ5-Suzuki-Every-Mini-Bus-Price-In-Nigeria-Korope-For-Business.jpg",
      roi: 17.8,
      location: "Accra, Ghana",
      rating: 4.8,
      demand: "High",
      fundingProgress: 78,
      description: "Versatile mini bus suitable for shuttle services and small group transport.",
      features: ["Compact", "Reliable", "Commercial Use"],
    },
    {
      id: "featured3",
      name: "Daylong Motorcycle 2024",
      type: "Motorcycle",
      price: 1800,
      image: "/assets/daylong-motorcycle-price-in-nigeria.jpg",
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
      name: "Commuter Bus",
      type: "Bus",
      price: 35000,
      image: "/assets/commuter bus.webp",
      roi: 18.5,
      location: "Nairobi, Kenya",
      rating: 4.7,
      demand: "Medium",
      fundingProgress: 65,
      description: "Reliable commuter bus perfect for passenger transport and commercial operations.",
      features: ["High Capacity", "Durable", "Commercial Use", "Inter-city Transport"],
    },
    {
      id: "featured5",
      name: "Another Tricycle",
      type: "Tricycle",
      price: 2600,
      image: "/assets/keke-nigeria.png",
      roi: 23.5,
      location: "Kano, Nigeria",
      rating: 4.8,
      demand: "High",
      fundingProgress: 70,
      description: "A very reliable tricycle for your transportation business.",
      features: ["Fuel Efficient", "Durable", "Urban Transport"],
    },
    {
      id: "featured6",
      name: "Second Shuttle Bus",
      type: "Shuttle Bus",
      price: 30000,
      image: "/assets/mOlcqsJ5-Suzuki-Every-Mini-Bus-Price-In-Nigeria-Korope-For-Business.jpg",
      roi: 18.2,
      location: "Kumasi, Ghana",
      rating: 4.7,
      demand: "High",
      fundingProgress: 60,
      description: "A comfortable shuttle bus for your passengers.",
      features: ["Compact", "Comfortable", "Commercial Use"],
    },
    {
      id: "featured7",
      name: "Speedy Motorcycle",
      type: "Motorcycle",
      price: 1900,
      image: "/assets/daylong-motorcycle-price-in-nigeria.jpg",
      roi: 25.5,
      location: "Ibadan, Nigeria",
      rating: 4.9,
      demand: "High",
      fundingProgress: 95,
      description: "A fast and reliable motorcycle for your delivery needs.",
      features: ["High Speed", "Low Maintenance", "Quick Delivery"],
    },
    {
      id: "featured8",
      name: "Large Commuter Bus",
      type: "Bus",
      price: 40000,
      image: "/assets/commuter bus.webp",
      roi: 19.0,
      location: "Mombasa, Kenya",
      rating: 4.6,
      demand: "Medium",
      fundingProgress: 50,
      description: "A spacious commuter bus for long routes.",
      features: ["Very High Capacity", "Durable", "Long Distance"],
    },
  ]

  useEffect(() => {
    const shuffled = [...allVehicles].sort(() => 0.5 - Math.random())
    setRandomVehicles(shuffled.slice(0, 6))
  }, [])

  const vehicleCategories = [
    {
      id: "tricycle",
      name: "Tricycle (Keke)",
      description: "Urban transport solution",
      image: "/assets/keke-nigeria.png",
      count: 45,
      avgROI: 23.2,
      priceRange: "$2,500 - $3,000",
    },
    {
      id: "motorcycle",
      name: "Motorcycle (Okada)",
      description: "Fast delivery & mobility",
      image: "/assets/daylong-motorcycle-price-in-nigeria.jpg",
      count: 38,
      avgROI: 24.8,
      priceRange: "$1,800 - $2,500",
    },
    {
      id: "shuttle-bus",
      name: "Shuttle Bus (Korope)",
      description: "Passenger transport",
      image: "/assets/mOlcqsJ5-Suzuki-Every-Mini-Bus-Price-In-Nigeria-Korope-For-Business.jpg",
      count: 22,
      avgROI: 18.5,
      priceRange: "$28,000 - $40,000",
    },
    {
      id: "bus",
      name: "Commuter Bus",
      description: "Group & school transport",
      image: "/assets/commuter bus.webp",
      count: 15,
      avgROI: 19.2,
      priceRange: "$35,000 - $50,000",
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

  const filteredVehicles = randomVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation =
      locationFilter === "all" || vehicle.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || vehicle.type.toLowerCase().includes(categoryFilter.toLowerCase())

    return matchesSearch && matchesLocation && matchesCategory
  })

  // Animated Stat Card component with fade-in and count-up
  function StatCard({ value, label, color = "text-foreground" }: { value: number | string; label: string; color?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    const [display, setDisplay] = useState<typeof value>(typeof value === "number" ? 0 : value)

    // Observe when the card enters the viewport
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true)
              observer.disconnect()
            }
          })
        },
        { threshold: 0.3 }
      )
      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    }, [])

    // Animate number counting up once visible (only for numeric values)
    useEffect(() => {
      if (!visible || typeof value !== "number") return
      let current = 0
      const end = value
      const duration = 1000 // ms
      const stepTime = 16
      const steps = duration / stepTime
      const increment = end / steps

      const id = setInterval(() => {
        current += increment
        if (current >= end) {
          setDisplay(end)
          clearInterval(id)
        } else {
          setDisplay(Math.round(current))
        }
      }, stepTime)
      return () => clearInterval(id)
    }, [visible, value])

    return (
      <div
        ref={ref}
        className={`bg-card rounded-2xl p-6 border border-border hover:border-[#E57700]/50 transition-all duration-500 transform ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className={`text-3xl md:text-4xl font-bold ${color} mb-2`}>{display}</div>
        <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">{label}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Header userName="Guest" userStatus="Browse Marketplace" /> */}
      <Navigation />

      <div className="p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            African Vehicle Marketplace
          </h1>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover financing opportunities for African market vehicles. From tricycles 
            (keke) to pickup trucks (carter), find the perfect vehicle investment that matches 
            your goals.
            </p>
          </div>

        {/* Stats Section with animation */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatCard value={148} label="Available Vehicles" />
            <StatCard value="21.2%" label="Average ROI" color="text-[#22C55E]" />
            <StatCard value={5} label="Vehicle Types" />
            <StatCard value={12} label="Countries" />
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">Empowering African transportation through decentralized vehicle financing</p>
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
                  {randomVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="bg-card border-border hover:border-[#E57700] hover:border-2 transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden shadow-lg">
                      <div className="relative">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        {/* Demand & ROI badges */}
                        <div className="absolute top-4 right-4 space-y-1 text-right">
                          <Badge className={`${getDemandColor(vehicle.demand)} text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold`}>{vehicle.demand}</Badge>
                          <Badge className="bg-[#E57700] text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                            {vehicle.roi}% ROI
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-4 left-4 text-white hover:bg-black/20 w-8 h-8 rounded-full p-0"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Title & Type */}
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{vehicle.name}</h3>
                            <div className="flex justify-between items-center mt-1 text-sm text-gray-400">
                              <span>{vehicle.type}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{vehicle.location}</span>
                            </div>
                          </div>

                          {/* Price & Rating */}
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-semibold text-foreground">${vehicle.price.toLocaleString()}</span>
                            <div className="flex items-center text-[#FACC15] text-sm font-medium">
                              <Star className="h-4 w-4 mr-1 fill-current" /> {vehicle.rating}
                            </div>
                          </div>

                          {/* Funding Progress */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-400">{vehicle.fundingProgress}% tokenized</span>
                              <span className="text-xs text-gray-400">{100 - vehicle.fundingProgress}% available</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-[#E57700] h-2 rounded-full"
                                style={{ width: `${vehicle.fundingProgress}%` }}
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-gray-300 line-clamp-2 mt-2">{vehicle.description}</p>

                          {/* Action Button */}
                          <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white rounded-xl py-3 font-semibold mt-4">
                              <DollarSign className="h-4 w-4 mr-2" />
                            Buy Tokens
                            </Button>
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
                      className="bg-card border-border hover:border-[#E57700] hover:border-2 transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                    >
                      <div className="relative">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={300}
                          height={150}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#E57700] text-white text-xs px-3 py-1 rounded-full font-semibold">{category.avgROI}% Avg ROI</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{category.name}</h3>
                            <p className="text-sm text-gray-400">{category.description}</p>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Available:</span>
                            <span className="font-medium text-foreground">{category.count} vehicles</span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Price Range:</span>
                            <span className="font-medium text-white">{category.priceRange}</span>
                          </div>

                          <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white rounded-xl py-3 font-semibold mt-4">
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
                    <Card key={vehicle.id} className="bg-card border-border hover:border-[#E57700] hover:border-2 transition-all duration-300 transform hover:scale-105 rounded-3xl overflow-hidden shadow-lg">
                      <div className="relative">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={`${vehicle.name} - ${vehicle.type} vehicle in ${vehicle.location} with ${vehicle.roi}% ROI`}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                          priority={vehicle.id.includes("featured")}
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#E57700] text-white text-xs px-3 py-1 rounded-full font-semibold">
                            {vehicle.roi}% ROI
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{vehicle.name}</h3>
                            <div className="flex justify-between items-center mt-1 text-sm text-gray-400">
                              <span>{vehicle.type}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{vehicle.location}</span>
                            </div>
                          </div>

                          {/* Price, Location, Stats */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Total Value</span>
                              <span className="text-sm text-foreground font-semibold">${vehicle.price.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Token Price</span>
                              <span className="text-sm text-foreground font-semibold">${Math.round(vehicle.price / 100)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-400">Co-Owners</span>
                              <span className="text-sm text-foreground font-semibold">{Math.floor(Math.random() * 20) + 5}</span>
                            </div>
                          </div>

                          {/* Funding Progress */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-400">{vehicle.fundingProgress}% tokenized</span>
                              <span className="text-xs text-gray-400">{100 - vehicle.fundingProgress}% available</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-[#E57700] h-2 rounded-full"
                                style={{ width: `${vehicle.fundingProgress}%` }}
                              />
                            </div>
                          </div>

                          <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white rounded-xl py-3 font-semibold mt-4">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Invest
                            </Button>
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
