"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser, useInvestorData, usePlatform } from "@/contexts/platform-context"
import { useAuth } from "@/hooks/use-auth"
import type { Investment as PlatformInvestment, Vehicle, LoanApplication, User } from "@/contexts/platform-context"
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  BarChart3,
  Activity,
} from "lucide-react"
import Image from "next/image"

import { useCurrency } from "@/hooks/use-currency"
import { CurrencySwitcher } from "@/components/ui/currency-switcher"

interface EnhancedInvestment extends PlatformInvestment {
  vehicleName: string
  vehicleImage: string
  currentValue: number
  repaymentStatus: "On Track" | "Ahead" | "Behind" | "Completed"
  driverName: string
  driverRating: number
  location: string
  riskLevel: "Low" | "Medium" | "High"
  loanTerm: number
  lastPaymentDate: string
  notes: string
  nextPayment: string
}

// Helper function to calculate current value based on investment and returns
const calculateCurrentValue = (investment: PlatformInvestment): number => {
  return investment.amount + (investment.totalReturns || 0)
}

// Helper function to determine repayment status
const getRepaymentStatus = (investment: PlatformInvestment): "On Track" | "Ahead" | "Behind" | "Completed" => {
  if (investment.status === "Completed") return "Completed"
  
  const expectedPayments = Math.floor(
    (new Date().getTime() - new Date(investment.startDate).getTime()) / 
    (30 * 24 * 60 * 60 * 1000) // Approximate months
  )
  
  if (investment.paymentsReceived > expectedPayments) return "Ahead"
  if (investment.paymentsReceived < expectedPayments) return "Behind"
  return "On Track"
}

// Helper function to calculate next payment date
const getNextPaymentDate = (investment: PlatformInvestment): string => {
  if (investment.status === "Completed") return "Completed"
  return investment.nextPaymentDate
}

export default function MyInvestmentsPage() {
  const { state, dispatch } = usePlatform()
  const { user: authUser } = useAuth()
  const currentInvestorId = authUser?.id || ""
  const investorData = useInvestorData(currentInvestorId)
  
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvestment, setSelectedInvestment] = useState<EnhancedInvestment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editNotes, setEditNotes] = useState("")
  const { toast } = useToast()

  // Function to fetch investments
  const fetchInvestments = async () => {
    try {
      const response = await fetch(`/api/investments?investorId=${currentInvestorId}`)
      if (response.ok) {
        const investmentsData = await response.json()
        dispatch({
          type: "SET_INVESTMENTS",
          payload: investmentsData.investments || [],
        })
      }
    } catch (error) {
      console.error("Error fetching investments:", error)
    }
  }

  // Fetch investments when component mounts or user changes
  useEffect(() => {
    if (currentInvestorId) {
      fetchInvestments()
    }
  }, [currentInvestorId])

  // Transform platform investments into enhanced investments with additional UI data
  const investments = useMemo(() => {
    if (!investorData.investments) return []
    
    return investorData.investments.map((investment): EnhancedInvestment => {
      // Get vehicle data directly from populated investment or fallback to platform state
      const vehicle = investment.vehicleId && typeof investment.vehicleId === 'object' 
        ? investment.vehicleId // Populated vehicle object
        : state.vehicles.find(v => v._id === investment.vehicleId || v.id === investment.vehicleId)
      
      // Find related loan application to get driver info
      const loanApplication = state.loanApplications.find(loan => loan.id === investment.loanId)
      const driver = state.users.find(u => (u.id === loanApplication?.driverId || u._id === loanApplication?.driverId) && u.role === "driver")
      
      return {
        ...investment,
        vehicleName: vehicle?.name || "Unknown Vehicle",
        vehicleImage: vehicle?.image || "/placeholder.svg?height=150&width=200",
        currentValue: calculateCurrentValue(investment),
        repaymentStatus: getRepaymentStatus(investment),
        driverName: driver?.name || "Unknown Driver",
        driverRating: 4.5, // Default rating - could be enhanced with actual driver ratings
        location: "Location TBD", // Could be enhanced with actual location data
        riskLevel: loanApplication?.riskAssessment || "Medium",
        loanTerm: Math.ceil((new Date(investment.endDate).getTime() - new Date(investment.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000)),
        lastPaymentDate: investment.nextPaymentDate, // Using next payment as placeholder
        notes: loanApplication?.adminNotes || "No notes available",
        nextPayment: getNextPaymentDate(investment)
      }
    })
  }, [investorData.investments, state.loanApplications, state.vehicles, state.users])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600"
      case "Completed":
        return "bg-blue-600"
      case "Overdue":
        return "bg-red-600"
      case "Pending":
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  const getRepaymentStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "text-green-400"
      case "Ahead":
        return "text-blue-400"
      case "Behind":
        return "text-red-400"
      case "Completed":
        return "text-gray-400"
      default:
        return "text-gray-400"
    }
  }

  const getRepaymentIcon = (status: string) => {
    switch (status) {
      case "On Track":
        return <CheckCircle className="h-4 w-4" />
      case "Ahead":
        return <TrendingUp className="h-4 w-4" />
      case "Behind":
        return <AlertCircle className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      investment.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab = activeTab === "all" || investment.status.toLowerCase() === activeTab.toLowerCase()
    const matchesStatus = statusFilter === "all" || investment.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesTab && matchesStatus
  })

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalReturns = totalCurrentValue - totalInvested
  const averageROI = investments.length > 0 ? investments.reduce((sum, inv) => sum + inv.expectedROI, 0) / investments.length : 0
  const monthlyIncome = investments
    .filter((inv) => inv.status === "Active")
    .reduce((sum, inv) => sum + inv.monthlyReturn, 0)

  const handleViewDetails = (investment: EnhancedInvestment) => {
    setSelectedInvestment(investment)
    setIsDetailsOpen(true)
  }

  const handleEditNotes = (investment: EnhancedInvestment) => {
    setSelectedInvestment(investment)
    setEditNotes(investment.notes)
    setIsEditOpen(true)
  }

  const handleSaveNotes = () => {
    if (selectedInvestment) {
      // Note: In a real app, this would update the database
      // For now, we'll just show a success message
      setIsEditOpen(false)
      toast({
        title: "Notes Updated",
        description: "Investment notes have been saved successfully",
      })
    }
  }

  const handleRemoveInvestment = (investmentId: string) => {
    // Note: In a real app, this would remove from the database
    // For now, we'll just show a success message
    toast({
      title: "Investment Removed",
      description: "Investment has been removed from your portfolio",
    })
  }

  const exportInvestments = () => {
    const csvContent = [
      ["Vehicle", "Investment Amount", "Current Value", "ROI", "Status", "Monthly Return", "Driver", "Location"],
      ...filteredInvestments.map((inv) => [
        inv.vehicleName,
        inv.amount,
        inv.currentValue,
        `${inv.expectedROI}%`,
        inv.status,
        inv.monthlyReturn,
        inv.driverName,
        inv.location,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "my-investments.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Investment data has been exported to CSV",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        role="investor" 
        className="md:w-64 lg:w-72"
        mobileWidth="w-64"
      />

      <div className="md:ml-64 lg:ml-72">
        <Header 
          userName={authUser?.name || "Investor"} 
          userStatus="Verified Investor"
          className="md:pl-6 lg:pl-8"
        />

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Hero Section */}
          <div className="mb-6 sm:mb-8">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 items-center">
              <div className="relative">
                <Image
                  src="/images/dashboard-hero.png"
                  alt="My investments hero"
                  width={600}
                  height={400}
                  className="rounded-lg sm:rounded-2xl object-cover w-full h-[200px] sm:h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg sm:rounded-2xl" />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">My Investment Portfolio</h1>
                  <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                    Track your active and completed investments. Monitor repayment status and manage your portfolio
                    performance with advanced analytics and reporting tools.
                  </p>
                </div>
                <div className="flex flex-wrap justify-start gap-2 sm:gap-3">
                  <div className="w-2 h-2 bg-[#E57700] rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">${totalInvested.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across {investments.length} investments</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">${totalCurrentValue.toLocaleString()}</div>
                <p className="text-xs text-green-400">
                  +${totalReturns.toLocaleString()} ({((totalReturns / totalInvested) * 100).toFixed(1)}%)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                <Calendar className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">${monthlyIncome}</div>
                <p className="text-xs text-muted-foreground">From active investments</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{averageROI.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Portfolio average</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter & Manage Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search investments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted border-border text-foreground"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-muted border-border text-foreground">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={exportInvestments}
                  className="border-border text-foreground hover:bg-muted"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>

                <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Investment Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted border-border">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                All ({investments.length})
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                Active ({investments.filter((inv) => inv.status === "Active").length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                Completed ({investments.filter((inv) => inv.status === "Completed").length})
              </TabsTrigger>
              <TabsTrigger
                value="overdue"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                Issues ({investments.filter((inv) => inv.status === "Overdue").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              <div className="grid gap-6">
                {filteredInvestments.map((investment) => (
                  <Card key={investment.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={investment.vehicleImage || "/placeholder.svg"}
                            alt={investment.vehicleName}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{investment.vehicleName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`${getStatusColor(investment.status)} text-white`}>
                                {investment.status}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{investment.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(investment)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditNotes(investment)}
                            className="border-border text-foreground hover:bg-muted"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveInvestment(investment.id)}
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-5 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Invested</p>
                          <p className="text-lg font-semibold text-foreground">
                            ${investment.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Value</p>
                          <p className="text-lg font-semibold text-foreground">
                            ${investment.currentValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">ROI</p>
                          <p className="text-lg font-semibold text-green-400">+{investment.expectedROI}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Return</p>
                          <p className="text-lg font-semibold text-foreground">
                            {investment.status === "Active" ? `$${investment.monthlyReturn}` : "Completed"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Returns</p>
                          <p className="text-lg font-semibold text-green-400">
                            +${(investment.totalReturns || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Driver Info */}
                      {/* <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#E57700] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{investment.driverName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{investment.driverName}</p>
                            <p className="text-xs text-muted-foreground">Driver</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-foreground">{investment.driverRating}</span>
                        </div>
                      </div> */}

                      {/* Repayment Progress */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Repayment Status</span>
                            <div
                              className={`flex items-center space-x-1 ${getRepaymentStatusColor(investment.repaymentStatus)}`}
                            >
                              {getRepaymentIcon(investment.repaymentStatus)}
                              <span className="text-sm font-medium">{investment.repaymentStatus}</span>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {investment.paymentsReceived}/{investment.totalPayments} payments
                          </span>
                        </div>

                        <Progress
                          value={(investment.paymentsReceived / investment.totalPayments) * 100}
                          className="h-2 bg-gray-600"
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Started: {new Date(investment.startDate).toLocaleDateString()}</span>
                          <span>
                            {investment.status === "Completed"
                              ? "Completed"
                              : `Next payment: ${new Date(investment.nextPayment).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {investment.notes && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                          <p className="text-sm text-foreground">{investment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* No Investments */}
          {filteredInvestments.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No investments found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "all" ? "You haven't made any investments yet" : `No ${activeTab} investments found`}
                </p>
                <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Discover Vehicles
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Investment Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#E57700]" />
              Investment Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Comprehensive overview of your investment
            </DialogDescription>
          </DialogHeader>
          {selectedInvestment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-semibold text-foreground">{selectedInvestment.vehicleName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Driver</p>
                  <p className="font-semibold text-foreground">{selectedInvestment.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investment Amount</p>
                  <p className="font-semibold text-foreground">
                    ${selectedInvestment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="font-semibold text-green-500">${selectedInvestment.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Return</p>
                  <p className="font-semibold text-foreground">${selectedInvestment.monthlyReturn}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                  <p className="font-semibold text-green-500">${(selectedInvestment.totalReturns || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Payment</p>
                  <p className="font-semibold text-foreground">
                    {new Date(selectedInvestment.lastPaymentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <Badge
                    className={`${selectedInvestment.riskLevel === "Low" ? "bg-green-600" : selectedInvestment.riskLevel === "Medium" ? "bg-yellow-600" : "bg-red-600"} text-white`}
                  >
                    {selectedInvestment.riskLevel}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Payment Progress</h4>
                <Progress
                  value={(selectedInvestment.paymentsReceived / selectedInvestment.totalPayments) * 100}
                  className="h-3 mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  {selectedInvestment.paymentsReceived} of {selectedInvestment.totalPayments} payments received
                </p>
              </div>

              {selectedInvestment.notes && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Notes</h4>
                  <p className="text-sm text-foreground">{selectedInvestment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Notes Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2 text-[#E57700]" />
              Edit Investment Notes
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add or update notes for this investment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full mt-1 p-3 bg-muted border border-border rounded-md text-foreground resize-none"
                rows={4}
                placeholder="Add your notes about this investment..."
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 border-border">
                Cancel
              </Button>
              <Button onClick={handleSaveNotes} className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
