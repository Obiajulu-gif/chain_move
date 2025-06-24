"use client"

import { useState } from "react"
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

interface Investment {
  id: string
  vehicleName: string
  vehicleImage: string
  investmentAmount: number
  currentValue: number
  roi: number
  status: "Active" | "Completed" | "Overdue" | "Pending"
  monthlyReturn: number
  totalReturns: number
  repaymentStatus: "On Track" | "Ahead" | "Behind" | "Completed"
  driverName: string
  driverRating: number
  location: string
  startDate: string
  endDate: string
  nextPayment: string
  paymentsReceived: number
  totalPayments: number
  riskLevel: "Low" | "Medium" | "High"
  loanTerm: number
  lastPaymentDate: string
  notes: string
}

const mockInvestments: Investment[] = [
  {
    id: "1",
    vehicleName: "Toyota Corolla 2020",
    vehicleImage: "/placeholder.svg?height=150&width=200",
    investmentAmount: 8000,
    currentValue: 9280,
    roi: 16.0,
    status: "Active",
    monthlyReturn: 128,
    totalReturns: 1280,
    repaymentStatus: "On Track",
    driverName: "Samuel Adebayo",
    driverRating: 4.8,
    location: "Lagos, Nigeria",
    startDate: "2024-01-15",
    endDate: "2027-01-15",
    nextPayment: "2024-12-15",
    paymentsReceived: 10,
    totalPayments: 36,
    riskLevel: "Low",
    loanTerm: 36,
    lastPaymentDate: "2024-11-15",
    notes: "Excellent payment history, driver very reliable",
  },
  {
    id: "2",
    vehicleName: "Honda Civic 2021",
    vehicleImage: "/placeholder.svg?height=150&width=200",
    investmentAmount: 12000,
    currentValue: 13800,
    roi: 15.0,
    status: "Active",
    monthlyReturn: 180,
    totalReturns: 1800,
    repaymentStatus: "Ahead",
    driverName: "Kwame Asante",
    driverRating: 4.9,
    location: "Accra, Ghana",
    startDate: "2024-03-01",
    endDate: "2027-09-01",
    nextPayment: "2024-12-01",
    paymentsReceived: 8,
    totalPayments: 42,
    riskLevel: "Low",
    loanTerm: 42,
    lastPaymentDate: "2024-11-01",
    notes: "Driver making extra payments, ahead of schedule",
  },
  {
    id: "3",
    vehicleName: "Ford Transit 2019",
    vehicleImage: "/placeholder.svg?height=150&width=200",
    investmentAmount: 15000,
    currentValue: 17550,
    roi: 17.0,
    status: "Active",
    monthlyReturn: 255,
    totalReturns: 2550,
    repaymentStatus: "Behind",
    driverName: "Grace Wanjiku",
    driverRating: 4.7,
    location: "Nairobi, Kenya",
    startDate: "2024-02-10",
    endDate: "2028-02-10",
    nextPayment: "2024-11-10",
    paymentsReceived: 9,
    totalPayments: 48,
    riskLevel: "Medium",
    loanTerm: 48,
    lastPaymentDate: "2024-10-10",
    notes: "Payment delayed by 5 days last month, monitoring closely",
  },
  {
    id: "4",
    vehicleName: "Tesla Model 3 2022",
    vehicleImage: "/placeholder.svg?height=150&width=200",
    investmentAmount: 20000,
    currentValue: 24500,
    roi: 22.5,
    status: "Completed",
    monthlyReturn: 0,
    totalReturns: 4500,
    repaymentStatus: "Completed",
    driverName: "Thabo Mthembu",
    driverRating: 4.9,
    location: "Cape Town, South Africa",
    startDate: "2022-06-01",
    endDate: "2024-06-01",
    nextPayment: "Completed",
    paymentsReceived: 24,
    totalPayments: 24,
    riskLevel: "Low",
    loanTerm: 24,
    lastPaymentDate: "2024-06-01",
    notes: "Successfully completed, excellent returns achieved",
  },
]

export default function MyInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editNotes, setEditNotes] = useState("")
  const { toast } = useToast()

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

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalReturns = totalCurrentValue - totalInvested
  const averageROI = investments.reduce((sum, inv) => sum + inv.roi, 0) / investments.length
  const monthlyIncome = investments
    .filter((inv) => inv.status === "Active")
    .reduce((sum, inv) => sum + inv.monthlyReturn, 0)

  const handleViewDetails = (investment: Investment) => {
    setSelectedInvestment(investment)
    setIsDetailsOpen(true)
  }

  const handleEditNotes = (investment: Investment) => {
    setSelectedInvestment(investment)
    setEditNotes(investment.notes)
    setIsEditOpen(true)
  }

  const handleSaveNotes = () => {
    if (selectedInvestment) {
      const updatedInvestments = investments.map((inv) =>
        inv.id === selectedInvestment.id ? { ...inv, notes: editNotes } : inv,
      )
      setInvestments(updatedInvestments)
      setIsEditOpen(false)
      toast({
        title: "Notes Updated",
        description: "Investment notes have been saved successfully",
      })
    }
  }

  const handleRemoveInvestment = (investmentId: string) => {
    const updatedInvestments = investments.filter((inv) => inv.id !== investmentId)
    setInvestments(updatedInvestments)
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
        inv.investmentAmount,
        inv.currentValue,
        `${inv.roi}%`,
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
          userName="Marcus" 
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
                            ${investment.investmentAmount.toLocaleString()}
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
                          <p className="text-lg font-semibold text-green-400">+{investment.roi}%</p>
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
                            +${investment.totalReturns.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
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
                      </div>

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
                    ${selectedInvestment.investmentAmount.toLocaleString()}
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
                  <p className="font-semibold text-green-500">${selectedInvestment.totalReturns.toLocaleString()}</p>
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
