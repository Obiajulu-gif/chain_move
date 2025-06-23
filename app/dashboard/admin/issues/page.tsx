"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  MessageSquare,
  User,
  Phone,
  Mail,
  FileText,
  Download,
} from "lucide-react"

const issueStats = {
  totalIssues: 156,
  openIssues: 23,
  inProgress: 45,
  resolved: 88,
  averageResolutionTime: "2.4 days",
  satisfactionRate: 92.5,
}

const issues = [
  {
    id: 1,
    title: "Payment Processing Delay",
    description:
      "Driver reporting technical issues with payment processing system. Unable to receive daily earnings for the past 3 days.",
    priority: "High",
    status: "Open",
    type: "Payment",
    reportedBy: "Emmanuel Okafor",
    reporterEmail: "emmanuel.o@email.com",
    reporterPhone: "+234 801 234 5678",
    assignee: "Support Team A",
    createdDate: "2025-01-12",
    lastUpdate: "2025-01-12",
    vehicleId: "TOY-COR-2020-001",
    category: "Technical",
    urgency: "Critical",
    estimatedResolution: "24 hours",
  },
  {
    id: 2,
    title: "Vehicle Maintenance Dispute",
    description:
      "Disagreement between driver and investor regarding maintenance cost responsibility. Driver claims investor should cover major repairs.",
    priority: "Medium",
    status: "In Progress",
    type: "Dispute",
    reportedBy: "Amina Hassan",
    reporterEmail: "amina.h@email.com",
    reporterPhone: "+234 802 345 6789",
    assignee: "Support Team B",
    createdDate: "2025-01-11",
    lastUpdate: "2025-01-12",
    vehicleId: "HON-CIV-2021-002",
    category: "Financial",
    urgency: "Medium",
    estimatedResolution: "3-5 days",
  },
  {
    id: 3,
    title: "KYC Document Verification Issue",
    description:
      "User unable to upload required documents due to file size limitations. System keeps rejecting valid documents.",
    priority: "Medium",
    status: "Open",
    type: "KYC",
    reportedBy: "Chidi Okwu",
    reporterEmail: "chidi.o@email.com",
    reporterPhone: "+234 803 456 7890",
    assignee: "Support Team C",
    createdDate: "2025-01-10",
    lastUpdate: "2025-01-11",
    vehicleId: null,
    category: "Technical",
    urgency: "Low",
    estimatedResolution: "1-2 days",
  },
  {
    id: 4,
    title: "Investment Return Calculation Error",
    description:
      "Investor reporting discrepancies in monthly return calculations. Claims actual returns are lower than projected.",
    priority: "High",
    status: "Resolved",
    type: "Investment",
    reportedBy: "Marcus Chen",
    reporterEmail: "marcus.c@email.com",
    reporterPhone: "+234 804 567 8901",
    assignee: "Finance Team",
    createdDate: "2025-01-08",
    lastUpdate: "2025-01-10",
    vehicleId: "FOR-TRA-2019-003",
    category: "Financial",
    urgency: "High",
    estimatedResolution: "Completed",
  },
]

export default function AdminIssueResolution() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || issue.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesType = typeFilter === "all" || issue.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-green-600 text-white"
      case "in progress":
        return "bg-blue-600 text-white"
      case "open":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-600 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      case "low":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" />

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Issue & Dispute Resolution</h1>
            <p className="text-gray-400">Manage and resolve platform issues, disputes, and user support requests</p>
          </div>

          {/* Issue Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Issues</CardTitle>
                <FileText className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{issueStats.totalIssues}</div>
                <p className="text-xs text-gray-400">All time reports</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Open Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{issueStats.openIssues}</div>
                <p className="text-xs text-red-400">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{issueStats.inProgress}</div>
                <p className="text-xs text-blue-400">Being resolved</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Satisfaction Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{issueStats.satisfactionRate}%</div>
                <p className="text-xs text-green-400">User satisfaction</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-[#2a3441] border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter & Search Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search issues..."
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Filter by Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="dispute">Dispute</SelectItem>
                    <SelectItem value="kyc">KYC</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Issues & Disputes ({filteredIssues.length})</CardTitle>
              <CardDescription className="text-gray-400">
                Manage and resolve platform issues and user disputes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="p-6 bg-[#1a2332] rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{issue.title}</h3>
                          <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          <Badge className={getUrgencyColor(issue.urgency)}>{issue.urgency}</Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {issue.type}
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3 leading-relaxed">{issue.description}</p>
                      </div>

                      <div className="text-right ml-4">
                        <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        <p className="text-xs text-gray-400 mt-1">Created: {issue.createdDate}</p>
                        <p className="text-xs text-gray-400">Updated: {issue.lastUpdate}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Reported By</p>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-[#E57700]" />
                          <div>
                            <p className="font-semibold text-white text-sm">{issue.reportedBy}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span>{issue.reporterEmail}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <Phone className="h-3 w-3" />
                              <span>{issue.reporterPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 mb-1">Assignment</p>
                        <p className="font-semibold text-white">{issue.assignee}</p>
                        <p className="text-xs text-gray-400">Category: {issue.category}</p>
                        {issue.vehicleId && <p className="text-xs text-gray-400">Vehicle: {issue.vehicleId}</p>}
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 mb-1">Resolution</p>
                        <p className="font-semibold text-white">{issue.estimatedResolution}</p>
                        <p className="text-xs text-gray-400">Estimated timeline</p>
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
                        Add Comment
                      </Button>
                      {issue.status !== "Resolved" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Resolved
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <User className="h-4 w-4 mr-2" />
                        Reassign
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredIssues.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No issues found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setPriorityFilter("all")
                      setTypeFilter("all")
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
