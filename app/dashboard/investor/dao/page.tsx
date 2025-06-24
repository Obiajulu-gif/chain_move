"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useToast } from "@/hooks/use-toast"
import {
  Vote,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coins,
  Target,
  Share,
  DollarSign,
  Shield,
  Plus,
  Eye,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Star,
} from "lucide-react"
import Image from "next/image"

interface Proposal {
  id: string
  title: string
  description: string
  category: "governance" | "treasury" | "protocol" | "expansion" | "co-ownership"
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  totalVotes: number
  quorum: number
  timeLeft: string
  status: "active" | "passed" | "rejected" | "pending"
  userVoted: boolean
  userVote?: "for" | "against" | "abstain"
  proposer: string
  createdDate: string
}

interface CoOwnershipVehicle {
  id: string
  name: string
  image: string
  totalValue: number
  availableShares: number
  totalShares: number
  sharePrice: number
  monthlyReturn: number
  roi: number
  location: string
  driverName: string
  driverRating: number
  riskLevel: "Low" | "Medium" | "High"
  coOwners: number
  description: string
  status: "Available" | "Fully Owned" | "Active"
}

interface UserCoOwnership {
  vehicleId: string
  vehicleName: string
  sharesOwned: number
  shareValue: number
  monthlyEarnings: number
  totalEarnings: number
  purchaseDate: string
}

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Co-ownership program for Tesla Model S",
    description: "Proposal to enable fractional ownership of premium Tesla Model S for ride-hailing services",
    category: "co-ownership",
    votesFor: 2850,
    votesAgainst: 420,
    votesAbstain: 230,
    totalVotes: 3500,
    quorum: 2000,
    timeLeft: "3 days",
    status: "active",
    userVoted: false,
    proposer: "ElectricFleet.eth",
    createdDate: "2024-12-10",
  },
  {
    id: "2",
    title: "Increase EV financing incentives",
    description:
      "Proposal to provide 2% additional ROI for electric vehicle investments to promote sustainable transportation",
    category: "governance",
    votesFor: 1850,
    votesAgainst: 420,
    votesAbstain: 230,
    totalVotes: 2500,
    quorum: 2000,
    timeLeft: "5 days",
    status: "active",
    userVoted: false,
    proposer: "GreenMobility.eth",
    createdDate: "2024-12-08",
  },
  {
    id: "3",
    title: "Expand co-ownership to commercial vehicles",
    description: "Enable fractional ownership for delivery vans and trucks to diversify investment opportunities",
    category: "co-ownership",
    votesFor: 2100,
    votesAgainst: 680,
    votesAbstain: 320,
    totalVotes: 3100,
    quorum: 2500,
    timeLeft: "1 week",
    status: "active",
    userVoted: true,
    userVote: "for",
    proposer: "CommercialDAO.eth",
    createdDate: "2024-12-05",
  },
]

const mockCoOwnershipVehicles: CoOwnershipVehicle[] = [
  {
    id: "1",
    name: "Tesla Model S 2023",
    image: "/placeholder.svg?height=200&width=300",
    totalValue: 80000,
    availableShares: 25,
    totalShares: 100,
    sharePrice: 800,
    monthlyReturn: 120,
    roi: 18.0,
    location: "San Francisco, CA",
    driverName: "Alex Johnson",
    driverRating: 4.9,
    riskLevel: "Low",
    coOwners: 75,
    description: "Premium electric sedan perfect for luxury ride services and corporate transportation",
    status: "Available",
  },
  {
    id: "2",
    name: "BMW X5 2022",
    image: "/placeholder.svg?height=200&width=300",
    totalValue: 65000,
    availableShares: 40,
    totalShares: 100,
    sharePrice: 650,
    monthlyReturn: 95,
    roi: 17.5,
    location: "New York, NY",
    driverName: "Maria Rodriguez",
    driverRating: 4.8,
    riskLevel: "Low",
    coOwners: 60,
    description: "Luxury SUV ideal for family transportation and premium ride-hailing services",
    status: "Available",
  },
  {
    id: "3",
    name: "Ford Transit 2023",
    image: "/placeholder.svg?height=200&width=300",
    totalValue: 45000,
    availableShares: 0,
    totalShares: 100,
    sharePrice: 450,
    monthlyReturn: 85,
    roi: 22.7,
    location: "Chicago, IL",
    driverName: "David Kim",
    driverRating: 4.7,
    riskLevel: "Medium",
    coOwners: 100,
    description: "Commercial van perfect for delivery services and cargo transportation",
    status: "Fully Owned",
  },
]

const mockUserCoOwnerships: UserCoOwnership[] = [
  {
    vehicleId: "3",
    vehicleName: "Ford Transit 2023",
    sharesOwned: 15,
    shareValue: 6750,
    monthlyEarnings: 127.5,
    totalEarnings: 765,
    purchaseDate: "2024-06-15",
  },
  {
    vehicleId: "1",
    vehicleName: "Tesla Model S 2023",
    sharesOwned: 10,
    shareValue: 8000,
    monthlyEarnings: 120,
    totalEarnings: 480,
    purchaseDate: "2024-08-20",
  },
]

export default function DAOZonePage() {
  const [proposals] = useState<Proposal[]>(mockProposals)
  const [coOwnershipVehicles] = useState<CoOwnershipVehicle[]>(mockCoOwnershipVehicles)
  const [userCoOwnerships] = useState<UserCoOwnership[]>(mockUserCoOwnerships)
  const [activeTab, setActiveTab] = useState("co-ownership")
  const [selectedVehicle, setSelectedVehicle] = useState<CoOwnershipVehicle | null>(null)
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false)
  const [shareAmount, setShareAmount] = useState([1])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const userTokens = 2450
  const userVotingPower = (userTokens / 76500) * 100
  const totalCoOwnershipValue = userCoOwnerships.reduce((sum, co) => sum + co.shareValue, 0)
  const totalMonthlyEarnings = userCoOwnerships.reduce((sum, co) => sum + co.monthlyEarnings, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-600"
      case "passed":
        return "bg-green-600"
      case "rejected":
        return "bg-red-600"
      case "pending":
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />
      case "passed":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "governance":
        return "bg-purple-600"
      case "treasury":
        return "bg-green-600"
      case "protocol":
        return "bg-blue-600"
      case "expansion":
        return "bg-orange-600"
      case "co-ownership":
        return "bg-pink-600"
      default:
        return "bg-gray-600"
    }
  }

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

  const handleBuyShares = async () => {
    if (!selectedVehicle) return

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Shares Purchased Successfully",
        description: `You now own ${shareAmount[0]} shares of ${selectedVehicle.name}`,
      })

      setIsInvestModalOpen(false)
      setShareAmount([1])
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const openInvestModal = (vehicle: CoOwnershipVehicle) => {
    setSelectedVehicle(vehicle)
    setIsInvestModalOpen(true)
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
                  alt="DAO Zone hero"
                  width={600}
                  height={400}
                  className="rounded-lg sm:rounded-2xl object-cover w-full h-[200px] sm:h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg sm:rounded-2xl" />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">DAO Zone</h1>
                  <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                    Participate in ChainMove's decentralized governance. Vote on proposals, manage co-ownership
                    investments, and shape the future of the platform.
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

          {/* Voting Power */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Voting Power</CardTitle>
                <Vote className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">24.5%</div>
                <p className="text-xs text-muted-foreground">Based on total supply</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Proposals</CardTitle>
                <Target className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">3</div>
                <p className="text-xs text-muted-foreground">Voting period</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Quorum</CardTitle>
                <Clock className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">12h</div>
                <p className="text-xs text-muted-foreground">Until next voting period</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-all duration-200 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Votes</CardTitle>
                <CheckCircle className="h-4 w-4 text-foreground" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">125</div>
                <p className="text-xs text-muted-foreground">Tokens ready to vote</p>
              </CardContent>
            </Card>
          </div>

          {/* DAO Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted border-border">
              <TabsTrigger
                value="co-ownership"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                Co-Ownership
              </TabsTrigger>
              <TabsTrigger
                value="my-shares"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                My Shares
              </TabsTrigger>
              <TabsTrigger
                value="proposals"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                Proposals
              </TabsTrigger>
              <TabsTrigger
                value="governance"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-foreground"
              >
                Governance
              </TabsTrigger>
            </TabsList>

            {/* Co-Ownership Tab */}
            <TabsContent value="co-ownership" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Vehicle Co-Ownership Opportunities</h2>
                  <p className="text-muted-foreground">Own fractions of vehicles and earn monthly returns</p>
                </div>
                <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Propose Vehicle
                </Button>
              </div>

              <div className="grid gap-6">
                {coOwnershipVehicles.map((vehicle) => {
                  const ownershipPercentage =
                    ((vehicle.totalShares - vehicle.availableShares) / vehicle.totalShares) * 100

                  return (
                    <Card key={vehicle.id} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Image
                              src={vehicle.image || "/placeholder.svg"}
                              alt={vehicle.name}
                              width={120}
                              height={90}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{vehicle.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={`${getRiskColor(vehicle.riskLevel)} text-white`}>
                                  {vehicle.riskLevel} Risk
                                </Badge>
                                <Badge className="bg-[#E57700] text-white">{vehicle.roi}% ROI</Badge>
                              </div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{vehicle.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3" />
                                  <span>{vehicle.coOwners} co-owners</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">${vehicle.totalValue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Value</p>
                            <Badge className={vehicle.status === "Available" ? "bg-green-600" : "bg-gray-600"}>
                              {vehicle.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Share Price</p>
                            <p className="text-lg font-semibold text-foreground">${vehicle.sharePrice}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Available Shares</p>
                            <p className="text-lg font-semibold text-foreground">
                              {vehicle.availableShares}/{vehicle.totalShares}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Return/Share</p>
                            <p className="text-lg font-semibold text-green-500">
                              ${(vehicle.monthlyReturn / vehicle.totalShares).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Driver Rating</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-lg font-semibold text-foreground">{vehicle.driverRating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Driver Info */}
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#E57700] rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{vehicle.driverName.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{vehicle.driverName}</p>
                              <p className="text-xs text-muted-foreground">Assigned Driver</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-foreground">{vehicle.driverRating}</span>
                          </div>
                        </div>

                        {/* Ownership Progress */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Ownership Progress</span>
                            <span className="text-foreground">{Math.round(ownershipPercentage)}% Owned</span>
                          </div>
                          <Progress value={ownershipPercentage} className="h-2" />
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{vehicle.description}</p>

                        <div className="flex space-x-2">
                          <Button
                            className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                            onClick={() => openInvestModal(vehicle)}
                            disabled={vehicle.availableShares === 0}
                          >
                            <Share className="h-4 w-4 mr-2" />
                            {vehicle.availableShares === 0 ? "Fully Owned" : "Buy Shares"}
                          </Button>
                          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* My Shares Tab */}
            <TabsContent value="my-shares" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">My Co-Ownership Portfolio</h2>
                <p className="text-muted-foreground">Track your shared vehicle investments and earnings</p>
              </div>

              <div className="grid gap-6">
                {userCoOwnerships.map((coOwnership) => (
                  <Card key={coOwnership.vehicleId} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{coOwnership.vehicleName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Purchased on {new Date(coOwnership.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Shares Owned</p>
                          <p className="text-lg font-semibold text-foreground">{coOwnership.sharesOwned}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Value</p>
                          <p className="text-lg font-semibold text-foreground">
                            ${coOwnership.shareValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                          <p className="text-lg font-semibold text-green-500">
                            ${coOwnership.monthlyEarnings.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Earnings</p>
                          <p className="text-lg font-semibold text-green-500">
                            ${coOwnership.totalEarnings.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                          <Plus className="h-4 w-4 mr-2" />
                          Buy More Shares
                        </Button>
                        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                          <Share className="h-4 w-4 mr-2" />
                          Sell Shares
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {userCoOwnerships.length === 0 && (
                <Card className="bg-card border-border">
                  <CardContent className="text-center py-12">
                    <Share className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Co-Ownership Yet</h3>
                    <p className="text-muted-foreground mb-4">Start co-owning vehicles to earn passive income</p>
                    <Button
                      className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                      onClick={() => setActiveTab("co-ownership")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Explore Opportunities
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Proposals Tab */}
            <TabsContent value="proposals" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Active Proposals</h2>
                  <p className="text-muted-foreground">Vote on community proposals to shape ChainMove's future</p>
                </div>
                <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Proposal
                </Button>
              </div>

              <div className="grid gap-6">
                {proposals.map((proposal) => {
                  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
                  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0
                  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0
                  const abstainPercentage = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0
                  const quorumMet = totalVotes >= proposal.quorum

                  return (
                    <Card key={proposal.id} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={`${getCategoryColor(proposal.category)} text-white`}>
                                {proposal.category}
                              </Badge>
                              <Badge
                                className={`${getStatusColor(proposal.status)} text-white flex items-center space-x-1`}
                              >
                                {getStatusIcon(proposal.status)}
                                <span>{proposal.status}</span>
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{proposal.title}</h3>
                            <p className="text-muted-foreground text-sm mb-3">{proposal.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>By {proposal.proposer}</span>
                              <span>Created {new Date(proposal.createdDate).toLocaleDateString()}</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{proposal.timeLeft} left</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Voting Results */}
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Voting Progress</span>
                            <span className="text-foreground">
                              {totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} votes
                              {quorumMet && <span className="text-green-500 ml-2">✓ Quorum Met</span>}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-400">For ({forPercentage.toFixed(1)}%)</span>
                              <span className="text-sm text-foreground">{proposal.votesFor.toLocaleString()}</span>
                            </div>
                            <Progress value={forPercentage} className="h-2 bg-gray-600" />

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-400">Against ({againstPercentage.toFixed(1)}%)</span>
                              <span className="text-sm text-foreground">{proposal.votesAgainst.toLocaleString()}</span>
                            </div>
                            <Progress value={againstPercentage} className="h-2 bg-gray-600" />

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Abstain ({abstainPercentage.toFixed(1)}%)</span>
                              <span className="text-sm text-foreground">{proposal.votesAbstain.toLocaleString()}</span>
                            </div>
                            <Progress value={abstainPercentage} className="h-2 bg-gray-600" />
                          </div>
                        </div>

                        {/* Voting Actions */}
                        <div className="flex space-x-2">
                          {proposal.userVoted ? (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>You voted {proposal.userVote}</span>
                            </div>
                          ) : (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <Vote className="h-4 w-4 mr-2" />
                                Vote For
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Vote Against
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border text-foreground hover:bg-muted"
                              >
                                Abstain
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted ml-auto"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Governance Tab */}
            <TabsContent value="governance" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Governance Overview</h2>
                <p className="text-muted-foreground">Manage your tokens and participate in ChainMove governance</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Coins className="h-5 w-5 mr-2" />
                      Token Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CHMV Balance</span>
                      <span className="text-lg font-bold text-foreground">{userTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Voting Power</span>
                      <span className="text-lg font-bold text-foreground">{userVotingPower.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Staked Tokens</span>
                      <span className="text-lg font-bold text-foreground">1,200</span>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Stake Tokens
                      </Button>
                      <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                        <Settings className="h-4 w-4 mr-2" />
                        Delegate Voting
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <PieChart className="h-5 w-5 mr-2" />
                      Governance Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Proposals Voted</span>
                      <span className="text-lg font-bold text-foreground">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Proposals Created</span>
                      <span className="text-lg font-bold text-foreground">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Participation Rate</span>
                      <span className="text-lg font-bold text-green-500">85%</span>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                        <Calendar className="h-4 w-4 mr-2" />
                        Voting History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Co-Ownership Investment Modal */}
      <Dialog open={isInvestModalOpen} onOpenChange={setIsInvestModalOpen}>
        <DialogContent className="bg-card border-border text-foreground max-w-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Share className="h-5 w-5 mr-2 text-[#E57700]" />
              Buy Shares - {selectedVehicle?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Purchase fractional ownership shares in this vehicle
            </DialogDescription>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Share Price</p>
                    <p className="text-lg font-bold text-foreground">${selectedVehicle.sharePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Shares</p>
                    <p className="text-lg font-bold text-foreground">{selectedVehicle.availableShares}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Return/Share</p>
                    <p className="text-lg font-bold text-green-500">
                      ${(selectedVehicle.monthlyReturn / selectedVehicle.totalShares).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-lg font-bold text-green-500">{selectedVehicle.roi}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Number of Shares: {shareAmount[0]}</label>
                  <Slider
                    value={shareAmount}
                    onValueChange={setShareAmount}
                    max={Math.min(selectedVehicle.availableShares, 50)}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>Min: 1 share</span>
                    <span>Max: {Math.min(selectedVehicle.availableShares, 50)} shares</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investment</p>
                    <p className="text-xl font-bold text-foreground">
                      ${(shareAmount[0] * selectedVehicle.sharePrice).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Monthly Return</p>
                    <p className="text-xl font-bold text-green-500">
                      ${((shareAmount[0] * selectedVehicle.monthlyReturn) / selectedVehicle.totalShares).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">Blockchain Secured</p>
                  <p className="text-blue-700 dark:text-blue-300">
                    Your ownership is secured by smart contracts and recorded on the blockchain
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsInvestModalOpen(false)}
                  className="flex-1 border-border"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBuyShares}
                  className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </div>
                  ) : (
                    "Buy Shares"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
