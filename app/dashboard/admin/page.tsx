"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  })
  const { toast } = useToast()

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

  useEffect(() => {
    fetchDashboardStats()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleAddVehicle = () => {
    // This would typically make an API call to add the vehicle
    toast({
      title: "Vehicle Added",
      description: `${newVehicle.name} has been added to the platform`,
    })

    setNewVehicle({ name: "", type: "", year: "", price: "", roi: "", features: "" })
    setIsAddVehicleOpen(false)

    // Refresh stats after adding vehicle
    fetchDashboardStats()
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
                  <Button variant="outline" size="sm" onClick={fetchDashboardStats} disabled={loading} className="ml-2">
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border text-foreground">
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle to Platform</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Add a new vehicle to the platform for drivers and investors
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Vehicle Name</Label>
                        <Input
                          value={newVehicle.name}
                          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                          placeholder="e.g., Toyota Corolla 2024"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={newVehicle.type}
                          onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Hatchback">Hatchback</SelectItem>
                            <SelectItem value="Commercial Van">Commercial Van</SelectItem>
                            <SelectItem value="Truck">Truck</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <Label>Price ($)</Label>
                        <Input
                          type="number"
                          value={newVehicle.price}
                          onChange={(e) => setNewVehicle({ ...newVehicle, price: e.target.value })}
                          placeholder="25000"
                        />
                      </div>
                      <div>
                        <Label>Expected ROI (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={newVehicle.roi}
                          onChange={(e) => setNewVehicle({ ...newVehicle, roi: e.target.value })}
                          placeholder="16.5"
                        />
                      </div>
                      <div>
                        <Label>Features (comma-separated)</Label>
                        <Input
                          value={newVehicle.features}
                          onChange={(e) => setNewVehicle({ ...newVehicle, features: e.target.value })}
                          placeholder="Fuel Efficient, Reliable"
                        />
                      </div>
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
                </DialogContent>
              </Dialog>
            </div>
          </div>

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
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Vehicle Fleet Overview ({stats.totalVehicles})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Current status and distribution of vehicles in the fleet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
