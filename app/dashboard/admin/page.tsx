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
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { usePlatform, useAdminData } from "@/contexts/platform-context"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  DollarSign,
  Activity,
  FileText,
  Wallet,
  Eye,
  Settings,
  Car,
  TrendingUp,
  AlertTriangle,
  Plus,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Globe,
} from "lucide-react"
import Image from "next/image"

export default function AdminDashboard() {
  const { state, dispatch } = usePlatform()
  const adminData = useAdminData()
  const [currentAdminId] = useState("admin1")
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null)
  const [loanStatusUpdate, setLoanStatusUpdate] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "",
    year: "",
    price: "",
    roi: "",
    features: "",
  })
  const { toast } = useToast()

  // Set current user on mount
  useEffect(() => {
    dispatch({
      type: "SET_CURRENT_USER",
      payload: {
        id: currentAdminId,
        role: "admin",
        name: "Admin",
      },
    })
  }, [dispatch, currentAdminId])

  const handleAddVehicle = () => {
    const vehicle = {
      id: `vehicle_${Date.now()}`,
      name: newVehicle.name,
      type: newVehicle.type,
      year: Number.parseInt(newVehicle.year),
      image: "/placeholder.svg?height=200&width=300",
      price: Number.parseInt(newVehicle.price),
      status: "Available" as const,
      specifications: {
        engine: "2.0L 4-Cylinder",
        fuelType: "Petrol",
        mileage: "0 km",
        transmission: "Automatic",
        color: "White",
        vin: `VIN${Date.now()}`,
      },
      addedDate: new Date().toISOString(),
      roi: Number.parseFloat(newVehicle.roi),
      popularity: 0,
      features: newVehicle.features.split(",").map((f) => f.trim()),
    }

    dispatch({ type: "ADD_VEHICLE", payload: vehicle })

    toast({
      title: "Vehicle Added",
      description: `${vehicle.name} has been added to the platform`,
    })

    setNewVehicle({ name: "", type: "", year: "", price: "", roi: "", features: "" })
    setIsAddVehicleOpen(false)
  }

  const handleUpdateLoanStatus = () => {
    if (!selectedLoan || !loanStatusUpdate) return

    dispatch({
      type: "UPDATE_LOAN_STATUS",
      payload: {
        loanId: selectedLoan,
        status: loanStatusUpdate as any,
        adminNotes,
      },
    })

    toast({
      title: "Loan Status Updated",
      description: `Loan status has been updated to ${loanStatusUpdate}`,
    })

    setSelectedLoan(null)
    setLoanStatusUpdate("")
    setAdminNotes("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Approved":
        return "bg-green-600"
      case "Under Review":
        return "bg-blue-600"
      case "Pending":
        return "bg-yellow-600"
      case "Rejected":
      case "Overdue":
        return "bg-red-600"
      default:
        return "bg-gray-600"
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

  const unreadNotifications = state.notifications.filter(
    (n) => !n.read && (n.userId === "admin" || n.type === "system_alert"),
  ).length

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" notificationCount={unreadNotifications} />

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
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date(state.lastUpdated).toLocaleString()}
                  </span>
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
                <div className="text-2xl font-bold">{adminData.totalUsers}</div>
                <p className="text-xs opacity-80">
                  {adminData.totalDrivers} drivers, {adminData.totalInvestors} investors
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
                  ${(adminData.totalFundsInvested + adminData.totalFundsAvailable).toLocaleString()}
                </div>
                <p className="text-xs opacity-80">${adminData.totalFundsInvested.toLocaleString()} invested</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <FileText className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.activeLoans}</div>
                <p className="text-xs opacity-80">{adminData.pendingLoans} pending review</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <TrendingUp className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${adminData.platformRevenue.toLocaleString()}</div>
                <p className="text-xs opacity-80">{adminData.successRate}% success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Alerts */}
          {unreadNotifications > 0 && (
            <Card className="bg-red-50 border-red-200 mb-6">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  System Alerts ({unreadNotifications})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.notifications
                    .filter((n) => !n.read && (n.userId === "admin" || n.type === "system_alert"))
                    .slice(0, 3)
                    .map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">{notification.title}</p>
                          <p className="text-sm text-red-700">{notification.message}</p>
                          <p className="text-xs text-red-600">{new Date(notification.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          <Button
                            size="sm"
                            onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", payload: notification.id })}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Mark Read
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comprehensive Management Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 bg-muted">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="drivers" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Drivers
              </TabsTrigger>
              <TabsTrigger
                value="investors"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                Investors
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="loans" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
                Loans
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

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
                        <span className="text-muted-foreground">Total Transactions</span>
                        <span className="font-bold text-foreground">{state.transactions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-bold text-green-500">{adminData.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Processing Time</span>
                        <span className="font-bold text-foreground">{adminData.averageProcessingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">System Uptime</span>
                        <span className="font-bold text-green-500">{adminData.systemUptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average ROI</span>
                        <span className="font-bold text-foreground">{adminData.averageROI.toFixed(1)}%</span>
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
                          <span className="text-sm text-foreground">{adminData.vehicleUtilization.available}</span>
                        </div>
                        <Progress
                          value={(adminData.vehicleUtilization.available / adminData.totalVehicles) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Financed</span>
                          <span className="text-sm text-foreground">{adminData.vehicleUtilization.financed}</span>
                        </div>
                        <Progress
                          value={(adminData.vehicleUtilization.financed / adminData.totalVehicles) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Reserved</span>
                          <span className="text-sm text-foreground">{adminData.vehicleUtilization.reserved}</span>
                        </div>
                        <Progress
                          value={(adminData.vehicleUtilization.reserved / adminData.totalVehicles) * 100}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Maintenance</span>
                          <span className="text-sm text-foreground">{adminData.vehicleUtilization.maintenance}</span>
                        </div>
                        <Progress
                          value={(adminData.vehicleUtilization.maintenance / adminData.totalVehicles) * 100}
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
                    {adminData.recentActivity.length > 0 ? (
                      adminData.recentActivity.map((activity) => (
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

            {/* Drivers Tab */}
            <TabsContent value="drivers" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Driver Management ({state.drivers.length})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Monitor driver activity, performance, and loan applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.drivers.map((driver) => {
                      const driverLoans = state.loanApplications.filter((l) => l.driverId === driver.id)
                      const driverTransactions = state.transactions.filter((t) => t.userId === driver.id)
                      const totalBorrowed = driverLoans.reduce((sum, loan) => sum + loan.totalFunded, 0)

                      return (
                        <Card key={driver.id} className="bg-muted border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-[#E57700] rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">{driver.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">{driver.name}</h4>
                                  <p className="text-sm text-muted-foreground">{driver.email}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Rating: {driver.rating}/5 • {driver.trips} trips
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Joined: {new Date(driver.joinedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-foreground">${totalBorrowed.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Borrowed</p>
                                <p className="text-sm text-green-500">
                                  ${driver.totalEarnings.toLocaleString()} earned
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {driver.activeLoans} active • {driver.completedLoans} completed
                                </p>
                                <div className="flex space-x-2 mt-2">
                                  <Button size="sm" variant="outline" className="border-border text-foreground">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-border text-foreground">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Experience</p>
                                <p className="font-medium text-foreground">{driver.experience} years</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Location</p>
                                <p className="font-medium text-foreground">{driver.location}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Transactions</p>
                                <p className="font-medium text-foreground">{driverTransactions.length}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Loans</p>
                                <p className="font-medium text-foreground">{driverLoans.length}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investors Tab */}
            <TabsContent value="investors" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Investor Management ({state.investors.length})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Monitor investor activity, portfolio performance, and fund flows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.investors.map((investor) => {
                      const investorInvestments = state.investments.filter((inv) => inv.investorId === investor.id)
                      const investorTransactions = state.transactions.filter((t) => t.userId === investor.id)
                      const monthlyIncome = investorInvestments
                        .filter((inv) => inv.status === "Active")
                        .reduce((sum, inv) => sum + inv.monthlyReturn, 0)

                      return (
                        <Card key={investor.id} className="bg-muted border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-[#E57700] rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">{investor.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">{investor.name}</h4>
                                  <p className="text-sm text-muted-foreground">{investor.email}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge className={getStatusColor(investor.status)}>{investor.status}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Risk: {investor.riskTolerance}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Joined: {new Date(investor.joinedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-foreground">
                                  ${investor.availableBalance.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">Available</p>
                                <p className="text-sm text-green-500">+${investor.totalReturns.toFixed(2)} returns</p>
                                <p className="text-xs text-muted-foreground">
                                  ${monthlyIncome.toFixed(2)}/month income
                                </p>
                                <div className="flex space-x-2 mt-2">
                                  <Button size="sm" variant="outline" className="border-border text-foreground">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-border text-foreground">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Total Invested</p>
                                <p className="font-medium text-foreground">
                                  ${investor.totalInvested.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Active Investments</p>
                                <p className="font-medium text-foreground">{investor.activeInvestments}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Completed</p>
                                <p className="font-medium text-foreground">{investor.completedInvestments}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">ROI</p>
                                <p className="font-medium text-green-500">
                                  {investor.totalInvested > 0
                                    ? ((investor.totalReturns / investor.totalInvested) * 100).toFixed(1)
                                    : 0}
                                  %
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
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
                    Vehicle Management ({state.vehicles.length})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Monitor vehicle inventory, status, and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.vehicles.map((vehicle) => {
                      const vehicleLoan = state.loanApplications.find((l) => l.vehicleId === vehicle.id)
                      const driver = vehicle.driverId ? state.drivers.find((d) => d.id === vehicle.driverId) : null

                      return (
                        <Card key={vehicle.id} className="bg-muted border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <Image
                                  src={vehicle.image || "/placeholder.svg"}
                                  alt={vehicle.name}
                                  width={80}
                                  height={60}
                                  className="rounded-lg object-cover"
                                />
                                <div>
                                  <h4 className="font-semibold text-foreground">{vehicle.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {vehicle.year} • {vehicle.type}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge className={getStatusColor(vehicle.status)}>{vehicle.status}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      ROI: {vehicle.roi}% • Popularity: {vehicle.popularity}%
                                    </span>
                                  </div>
                                  {driver && (
                                    <p className="text-xs text-muted-foreground mt-1">Driver: {driver.name}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    Added: {new Date(vehicle.addedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-foreground">${vehicle.price.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Vehicle Price</p>
                                {vehicleLoan && (
                                  <div className="mt-2">
                                    <Progress value={vehicleLoan.fundingProgress} className="h-2 w-24" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {vehicleLoan.fundingProgress.toFixed(0)}% funded
                                    </p>
                                  </div>
                                )}
                                <div className="flex space-x-2 mt-2">
                                  <Button size="sm" variant="outline" className="border-border text-foreground">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-border text-foreground">
                                    <Settings className="h-4 w-4" />
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
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loans Tab */}
            <TabsContent value="loans" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Loan Management ({state.loanApplications.length})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Review, approve, and monitor all loan applications and their funding status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.loanApplications.map((loan) => {
                      const driver = state.drivers.find((d) => d.id === loan.driverId)
                      const vehicle = state.vehicles.find((v) => v.id === loan.vehicleId)

                      return (
                        <Card key={loan.id} className="bg-muted border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <Image
                                  src={vehicle?.image || "/placeholder.svg"}
                                  alt={vehicle?.name || "Vehicle"}
                                  width={60}
                                  height={45}
                                  className="rounded-lg object-cover"
                                />
                                <div>
                                  <h4 className="font-semibold text-foreground">{vehicle?.name}</h4>
                                  <p className="text-sm text-muted-foreground">Driver: {driver?.name}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
                                    <Badge
                                      className={`bg-${loan.riskAssessment === "Low" ? "green" : loan.riskAssessment === "Medium" ? "yellow" : "red"}-100 text-${loan.riskAssessment === "Low" ? "green" : loan.riskAssessment === "Medium" ? "yellow" : "red"}-800`}
                                    >
                                      {loan.riskAssessment} Risk
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Submitted: {new Date(loan.submittedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-foreground">${loan.requestedAmount.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">{loan.loanTerm} months</p>
                                <p className="text-sm text-muted-foreground">${loan.monthlyPayment}/month</p>
                              </div>
                            </div>

                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Funding Progress</span>
                                <span className="text-sm text-foreground">{loan.fundingProgress.toFixed(1)}%</span>
                              </div>
                              <Progress value={loan.fundingProgress} className="h-2" />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>${loan.totalFunded.toLocaleString()} funded</span>
                                <span>${loan.remainingAmount.toLocaleString()} remaining</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Interest Rate</p>
                                <p className="font-medium text-foreground">{loan.interestRate}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Credit Score</p>
                                <p className="font-medium text-foreground">{loan.creditScore}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Investors</p>
                                <p className="font-medium text-foreground">{loan.investorApprovals.length}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Purpose</p>
                                <p className="font-medium text-foreground">{loan.purpose}</p>
                              </div>
                            </div>

                            {loan.adminNotes && (
                              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-900">
                                  <strong>Admin Notes:</strong> {loan.adminNotes}
                                </p>
                              </div>
                            )}

                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                                    onClick={() => setSelectedLoan(loan.id)}
                                  >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Update Status
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-border text-foreground">
                                  <DialogHeader>
                                    <DialogTitle>Update Loan Status</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                      Change the status of this loan application
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>New Status</Label>
                                      <Select value={loanStatusUpdate} onValueChange={setLoanStatusUpdate}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Pending">Pending</SelectItem>
                                          <SelectItem value="Under Review">Under Review</SelectItem>
                                          <SelectItem value="Approved">Approved</SelectItem>
                                          <SelectItem value="Rejected">Rejected</SelectItem>
                                          <SelectItem value="Active">Active</SelectItem>
                                          <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Admin Notes</Label>
                                      <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add notes about this status change..."
                                        rows={3}
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setSelectedLoan(null)
                                          setLoanStatusUpdate("")
                                          setAdminNotes("")
                                        }}
                                        className="flex-1"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleUpdateLoanStatus}
                                        className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                                        disabled={!loanStatusUpdate}
                                      >
                                        Update Status
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" variant="outline" className="border-border text-foreground">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Transaction History ({state.transactions.length})
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Monitor all financial transactions across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.transactions.slice(0, 10).map((transaction) => {
                      const user =
                        transaction.userType === "driver"
                          ? state.drivers.find((d) => d.id === transaction.userId)
                          : state.investors.find((i) => i.id === transaction.userId)

                      return (
                        <Card key={transaction.id} className="bg-muted border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-[#E57700] rounded-full flex items-center justify-center">
                                  {transaction.type === "investment" && (
                                    <ArrowDownLeft className="h-5 w-5 text-white" />
                                  )}
                                  {transaction.type === "loan_disbursement" && (
                                    <ArrowUpRight className="h-5 w-5 text-white" />
                                  )}
                                  {transaction.type === "repayment" && <ArrowDownLeft className="h-5 w-5 text-white" />}
                                  {transaction.type === "deposit" && <ArrowDownLeft className="h-5 w-5 text-white" />}
                                  {transaction.type === "withdrawal" && <ArrowUpRight className="h-5 w-5 text-white" />}
                                  {transaction.type === "return" && <TrendingUp className="h-5 w-5 text-white" />}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground capitalize">
                                    {transaction.type.replace("_", " ")}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {user?.name} • {new Date(transaction.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-bold text-lg ${
                                    transaction.type === "investment" ||
                                    transaction.type === "deposit" ||
                                    transaction.type === "return"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {transaction.type === "investment" ||
                                  transaction.type === "deposit" ||
                                  transaction.type === "return"
                                    ? "+"
                                    : "-"}
                                  ${transaction.amount.toLocaleString()}
                                </p>
                                <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                                <p className="text-xs text-muted-foreground capitalize">{transaction.userType}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
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
                        <span className="text-muted-foreground">Loan Approval Rate</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Investment Fulfillment</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                          </div>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Payment Success Rate</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }}></div>
                          </div>
                          <span className="text-sm font-medium">96%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">User Retention</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                          <span className="text-sm font-medium">78%</span>
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
                        <span className="font-bold text-green-500">{adminData.systemUptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-bold text-foreground">1.2s avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Error Rate</span>
                        <span className="font-bold text-green-500">0.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Sessions</span>
                        <span className="font-bold text-foreground">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Sync Status</span>
                        <Badge className="bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Synchronized
                        </Badge>
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
                      <p className="text-2xl font-bold text-foreground">
                        ${adminData.totalFundsInvested.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Invested</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        ${adminData.totalFundsAvailable.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Available Funds</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">${adminData.totalReturns.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Returns</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#E57700]">${adminData.platformRevenue.toLocaleString()}</p>
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
