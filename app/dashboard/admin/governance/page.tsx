"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Vote,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  MessageSquare,
  Shield,
  Flag,
  Download,
} from "lucide-react"

const governanceStats = {
  totalProposals: 47,
  activeProposals: 5,
  passedProposals: 32,
  rejectedProposals: 10,
  totalVoters: 12450,
  participationRate: 78.5,
  averageVotingPower: 245,
}

const proposals = [
  {
    id: 1,
    title: "EV Incentive Program Implementation",
    description:
      "Proposal to introduce additional incentives for electric vehicle adoption on the platform, including reduced fees and priority matching.",
    proposer: "ChainMove Foundation",
    proposerAddress: "0x1234...5678",
    status: "Active",
    category: "Platform Enhancement",
    votingPeriod: "7 days remaining",
    totalVotes: 2450,
    yesVotes: 2083,
    noVotes: 367,
    quorumRequired: 2000,
    createdDate: "2025-01-10",
    endDate: "2025-01-17",
    votingPower: 15000000,
    participationRate: 82.3,
    flagged: false,
    moderationStatus: "Approved",
  },
  {
    id: 2,
    title: "Credit Score Requirement Update",
    description:
      "Proposal to adjust minimum credit score requirements for driver applications from 650 to 600 to increase platform accessibility.",
    proposer: "Community Member",
    proposerAddress: "0xabcd...efgh",
    status: "Active",
    category: "Policy Change",
    votingPeriod: "3 days remaining",
    totalVotes: 1890,
    yesVotes: 1172,
    noVotes: 718,
    quorumRequired: 2000,
    createdDate: "2025-01-08",
    endDate: "2025-01-15",
    votingPower: 12500000,
    participationRate: 67.8,
    flagged: true,
    moderationStatus: "Under Review",
  },
  {
    id: 3,
    title: "Platform Fee Reduction for New Drivers",
    description:
      "Proposal to reduce platform fees by 50% for new drivers during their first 6 months to encourage onboarding.",
    proposer: "Driver Association",
    proposerAddress: "0x9876...5432",
    status: "Passed",
    category: "Fee Structure",
    votingPeriod: "Completed",
    totalVotes: 3200,
    yesVotes: 2720,
    noVotes: 480,
    quorumRequired: 2000,
    createdDate: "2025-01-05",
    endDate: "2025-01-12",
    votingPower: 18000000,
    participationRate: 89.2,
    flagged: false,
    moderationStatus: "Approved",
  },
  {
    id: 4,
    title: "Governance Token Staking Rewards",
    description:
      "Proposal to introduce staking rewards for governance token holders who participate in voting activities.",
    proposer: "Token Holder Collective",
    proposerAddress: "0xfedc...ba98",
    status: "Rejected",
    category: "Tokenomics",
    votingPeriod: "Completed",
    totalVotes: 2100,
    yesVotes: 840,
    noVotes: 1260,
    quorumRequired: 2000,
    createdDate: "2025-01-01",
    endDate: "2025-01-08",
    votingPower: 14000000,
    participationRate: 71.5,
    flagged: false,
    moderationStatus: "Approved",
  },
]

export default function AdminGovernanceModeration() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [moderationFilter, setModerationFilter] = useState("all")

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.proposer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || proposal.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesCategory =
      categoryFilter === "all" || proposal.category.toLowerCase().includes(categoryFilter.toLowerCase())
    const matchesModeration =
      moderationFilter === "all" || proposal.moderationStatus.toLowerCase().includes(moderationFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesCategory && matchesModeration
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "bg-green-600 text-white"
      case "rejected":
        return "bg-red-600 text-white"
      case "active":
        return "bg-blue-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getModerationColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "under review":
        return "bg-yellow-100 text-yellow-800"
      case "flagged":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVotingResult = (yesVotes: number, totalVotes: number) => {
    return totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" />

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Governance Moderation</h1>
            <p className="text-gray-400">
              Monitor and moderate DAO governance activities, proposals, and voting processes
            </p>
          </div>

          {/* Governance Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Proposals</CardTitle>
                <Vote className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{governanceStats.totalProposals}</div>
                <p className="text-xs text-gray-400">All time submissions</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Proposals</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{governanceStats.activeProposals}</div>
                <p className="text-xs text-blue-400">Currently voting</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Voters</CardTitle>
                <Users className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{governanceStats.totalVoters.toLocaleString()}</div>
                <p className="text-xs text-green-400">Eligible participants</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Participation Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{governanceStats.participationRate}%</div>
                <p className="text-xs text-green-400">Average engagement</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-[#2a3441] border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter & Search Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search proposals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#1a2332] border-gray-600 text-white"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="platform">Platform Enhancement</SelectItem>
                    <SelectItem value="policy">Policy Change</SelectItem>
                    <SelectItem value="fee">Fee Structure</SelectItem>
                    <SelectItem value="tokenomics">Tokenomics</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={moderationFilter} onValueChange={setModerationFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Moderation Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="under">Under Review</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Proposals List */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Governance Proposals ({filteredProposals.length})</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor and moderate DAO proposals and voting activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredProposals.map((proposal) => (
                  <div key={proposal.id} className="p-6 bg-[#1a2332] rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{proposal.title}</h3>
                          {proposal.flagged && <Flag className="h-4 w-4 text-red-400" />}
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {proposal.category}
                          </Badge>
                          <Badge className={getModerationColor(proposal.moderationStatus)}>
                            {proposal.moderationStatus}
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3 leading-relaxed">{proposal.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Proposed by: {proposal.proposer}</span>
                          <span>•</span>
                          <span>{proposal.proposerAddress}</span>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                        <p className="text-xs text-gray-400 mt-1">Created: {proposal.createdDate}</p>
                        <p className="text-xs text-gray-400">
                          {proposal.status === "Active" ? proposal.votingPeriod : `Ended: ${proposal.endDate}`}
                        </p>
                      </div>
                    </div>

                    {proposal.status === "Active" && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Voting Progress</span>
                          <span className="text-sm text-white">
                            {proposal.totalVotes.toLocaleString()} / {proposal.quorumRequired.toLocaleString()} votes
                          </span>
                        </div>
                        <Progress value={(proposal.totalVotes / proposal.quorumRequired) * 100} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>
                            Yes: {proposal.yesVotes.toLocaleString()} (
                            {getVotingResult(proposal.yesVotes, proposal.totalVotes)}%)
                          </span>
                          <span>
                            No: {proposal.noVotes.toLocaleString()} (
                            {100 - getVotingResult(proposal.yesVotes, proposal.totalVotes)}%)
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Participation Rate</p>
                        <p className="font-semibold text-white">{proposal.participationRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Voting Power</p>
                        <p className="font-semibold text-white">
                          {(proposal.votingPower / 1000000).toFixed(1)}M tokens
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Quorum Status</p>
                        <p
                          className={`font-semibold ${proposal.totalVotes >= proposal.quorumRequired ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {proposal.totalVotes >= proposal.quorumRequired ? "Met" : "Pending"}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Discussion
                      </Button>
                      {proposal.moderationStatus === "Under Review" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                          >
                            <Flag className="h-4 w-4 mr-2" />
                            Flag
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Shield className="h-4 w-4 mr-2" />
                        Moderate
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProposals.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No proposals found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setCategoryFilter("all")
                      setModerationFilter("all")
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
