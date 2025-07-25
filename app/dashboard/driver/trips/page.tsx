"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { EarningsChart } from "@/components/charts/earnings-chart"
import { Route, DollarSign, Clock, MapPin, Star, TrendingUp, Calendar, Filter } from "lucide-react"

const tripStats = {
  totalTrips: 342,
  totalEarnings: 12450,
  monthlyTrips: 67,
  monthlyEarnings: 2100,
  averageEarning: 36.4,
  averageRating: 4.8,
  totalDistance: 2847,
  totalHours: 156,
}

const recentTrips = [
  {
    id: "T-001",
    date: "2025-01-12",
    time: "14:30",
    from: "Victoria Island",
    to: "Ikeja",
    distance: "18.5 km",
    duration: "45 min",
    earnings: 2500,
    rating: 5,
    status: "Completed",
  },
  {
    id: "T-002",
    date: "2025-01-12",
    time: "11:15",
    from: "Lekki",
    to: "Marina",
    distance: "22.3 km",
    duration: "52 min",
    earnings: 3200,
    rating: 4,
    status: "Completed",
  },
  {
    id: "T-003",
    date: "2025-01-11",
    time: "16:45",
    from: "Surulere",
    to: "Yaba",
    distance: "12.1 km",
    duration: "28 min",
    earnings: 1800,
    rating: 5,
    status: "Completed",
  },
  {
    id: "T-004",
    date: "2025-01-11",
    time: "09:20",
    from: "Ajah",
    to: "VI",
    distance: "25.7 km",
    duration: "68 min",
    earnings: 4100,
    rating: 4,
    status: "Completed",
  },
  {
    id: "T-005",
    date: "2025-01-10",
    time: "19:30",
    from: "Gbagada",
    to: "Ikoyi",
    distance: "16.8 km",
    duration: "41 min",
    earnings: 2700,
    rating: 5,
    status: "Completed",
  },
]

const weeklyEarnings = [
  { day: "Mon", trips: 8, earnings: 3200 },
  { day: "Tue", trips: 12, earnings: 4800 },
  { day: "Wed", trips: 10, earnings: 3900 },
  { day: "Thu", trips: 9, earnings: 3600 },
  { day: "Fri", trips: 15, earnings: 6200 },
  { day: "Sat", trips: 18, earnings: 7500 },
  { day: "Sun", trips: 14, earnings: 5800 },
]

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" className="md:w-64 lg:w-72" />

      <div className="md:ml-64 lg:ml-72">
        <Header 
          userName="Emmanuel" 
          userStatus="Not Registered"
          className="md:pl-6 lg:pl-8"
        />

        <div className="p-3 md:p-6">
          <div className="mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Trip & Earnings Tracker
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Monitor your trips, earnings, and performance metrics
                </p>
              </div>
              <Badge 
                className="bg-[#E57700] text-white px-3 py-1 flex items-center gap-1"
                variant="outline"
              >
                <TrendingUp className="h-4 w-4" />
                +5.2% Growth
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="bg-card border-border/50 hover:bg-card/70 transition-colors duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-[#E57700]" />
                  <Badge variant="outline" className="text-[#E57700]">
                    +₦{tripStats.monthlyEarnings}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₦{tripStats.totalEarnings.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:bg-card/70 transition-colors duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Trips
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Route className="h-4 w-4 text-[#E57700]" />
                  <Badge variant="outline" className="text-[#E57700]">
                    +{tripStats.monthlyTrips}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {tripStats.totalTrips}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:bg-card/70 transition-colors duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-[#E57700]" />
                  <Badge variant="outline" className="text-[#E57700]">
                    4.8★
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {tripStats.averageRating}★
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 hover:bg-card/70 transition-colors duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg per Trip
                </CardTitle>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-[#E57700]" />
                  <Badge variant="outline" className="text-[#E57700]">
                    +5.2%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₦{tripStats.averageEarning}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-card border-border/50">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Overview
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="trips"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Trip History
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Analytics
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Earnings Overview</CardTitle>
                    <CardDescription className="text-gray-400">
                      Your monthly earnings and trip performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EarningsChart />
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Weekly Performance</CardTitle>
                    <CardDescription className="text-gray-400">This week's trips and earnings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weeklyEarnings.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#E57700] rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{day.day.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{day.day}</p>
                              <p className="text-sm text-gray-400">{day.trips} trips</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">₦{day.earnings.toLocaleString()}</p>
                            <p className="text-sm text-gray-400">₦{Math.round(day.earnings / day.trips)}/trip</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="bg-[#2a3441] border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-[#E57700] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">{tripStats.totalHours}</div>
                    <p className="text-sm text-gray-400">Total Hours</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-[#E57700] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">{tripStats.totalDistance}</div>
                    <p className="text-sm text-gray-400">Total KM</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-[#E57700] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">28</div>
                    <p className="text-sm text-gray-400">Active Days</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-[#E57700] mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">98.5%</div>
                    <p className="text-sm text-gray-400">Completion Rate</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trip History Tab */}
            <TabsContent value="trips" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Trip History</h2>
                  <p className="text-gray-400">Your recent completed trips</p>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {recentTrips.map((trip) => (
                  <Card key={trip.id} className="bg-[#2a3441] border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-[#E57700] rounded-full flex items-center justify-center">
                            <Route className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{trip.id}</h3>
                            <p className="text-sm text-gray-400">
                              {trip.date} at {trip.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">₦{trip.earnings.toLocaleString()}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-white">{trip.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">From</p>
                          <p className="font-medium text-white">{trip.from}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">To</p>
                          <p className="font-medium text-white">{trip.to}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Distance</p>
                          <p className="font-medium text-white">{trip.distance}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="font-medium text-white">{trip.duration}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <Badge className="bg-green-600 text-white">{trip.status}</Badge>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Load More Trips
                </Button>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Earnings Breakdown</CardTitle>
                    <CardDescription className="text-gray-400">Monthly earnings analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-[#1a2332] rounded-lg">
                        <span className="text-gray-400">Base Fare</span>
                        <span className="font-semibold text-white">₦8,450</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#1a2332] rounded-lg">
                        <span className="text-gray-400">Distance Bonus</span>
                        <span className="font-semibold text-white">₦2,100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#1a2332] rounded-lg">
                        <span className="text-gray-400">Peak Hour Bonus</span>
                        <span className="font-semibold text-white">₦1,200</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-[#1a2332] rounded-lg">
                        <span className="text-gray-400">Tips</span>
                        <span className="font-semibold text-white">₦250</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-900/20 rounded-lg border border-green-700">
                        <span className="font-medium text-white">Total Earnings</span>
                        <span className="text-lg font-bold text-green-400">
                          ₦{tripStats.monthlyEarnings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Performance Metrics</CardTitle>
                    <CardDescription className="text-gray-400">Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
