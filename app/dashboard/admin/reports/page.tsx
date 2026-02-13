"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { AdminMetricsChart } from "@/components/charts/admin-metrics-chart"
import {
  BarChart3,
  TrendingUp,
  Users,
  Car,
  DollarSign,
  Download,
  Filter,
  Eye,
  FileText,
  PieChart,
  Activity,
} from "lucide-react"

const reportStats = {
  totalRevenue: 2450000,
  monthlyGrowth: 15.8,
  activeUsers: 12450,
  vehicleUtilization: 87.3,
  averageROI: 14.2,
  platformFees: 245000,
}

const reportCategories = [
  {
    id: "financial",
    name: "Financial Reports",
    description: "Revenue, fees, and financial performance metrics",
    icon: DollarSign,
    reports: [
      { name: "Monthly Revenue Report", lastGenerated: "2025-01-12", size: "2.4 MB" },
      { name: "Platform Fees Analysis", lastGenerated: "2025-01-11", size: "1.8 MB" },
      { name: "Investment Returns Summary", lastGenerated: "2025-01-10", size: "3.2 MB" },
      { name: "Transaction Volume Report", lastGenerated: "2025-01-09", size: "1.5 MB" },
    ],
  },
  {
    id: "user",
    name: "User Analytics",
    description: "User behavior, engagement, and demographics",
    icon: Users,
    reports: [
      { name: "User Acquisition Report", lastGenerated: "2025-01-12", size: "1.9 MB" },
      { name: "Driver Performance Analytics", lastGenerated: "2025-01-11", size: "2.7 MB" },
      { name: "Investor Behavior Analysis", lastGenerated: "2025-01-10", size: "2.1 MB" },
      { name: "KYC Completion Rates", lastGenerated: "2025-01-09", size: "1.3 MB" },
    ],
  },
  {
    id: "vehicle",
    name: "Vehicle Analytics",
    description: "Vehicle performance, utilization, and maintenance",
    icon: Car,
    reports: [
      { name: "Vehicle Utilization Report", lastGenerated: "2025-01-12", size: "3.1 MB" },
      { name: "Maintenance Cost Analysis", lastGenerated: "2025-01-11", size: "2.4 MB" },
      { name: "Vehicle Performance Metrics", lastGenerated: "2025-01-10", size: "2.8 MB" },
      { name: "Fleet Optimization Report", lastGenerated: "2025-01-09", size: "1.7 MB" },
    ],
  },
  {
    id: "governance",
    name: "Governance Reports",
    description: "DAO activities, voting patterns, and proposals",
    icon: Activity,
    reports: [
      { name: "Voting Participation Report", lastGenerated: "2025-01-12", size: "1.6 MB" },
      { name: "Proposal Success Analysis", lastGenerated: "2025-01-11", size: "2.2 MB" },
      { name: "Token Distribution Report", lastGenerated: "2025-01-10", size: "1.9 MB" },
      { name: "Governance Engagement Metrics", lastGenerated: "2025-01-09", size: "1.4 MB" },
    ],
  },
]

export default function AdminReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dateRange, setDateRange] = useState("30days")

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" />

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reports + Analytics</h1>
            <p className="text-gray-400">Comprehensive reporting and analytics dashboard for platform insights</p>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${(reportStats.totalRevenue / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-green-400">+{reportStats.monthlyGrowth}% this month</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
                <Users className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{reportStats.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-green-400">Growing steadily</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Vehicle Utilization</CardTitle>
                <Car className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{reportStats.vehicleUtilization}%</div>
                <p className="text-xs text-green-400">Above target</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Average ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#E57700]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{reportStats.averageROI}%</div>
                <p className="text-xs text-green-400">Investor returns</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-[#2a3441] border-gray-700">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Generated Reports
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Live Analytics
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Custom Reports
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Performance Metrics</CardTitle>
                    <CardDescription className="text-gray-400">Key performance indicators over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminMetricsChart />
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Report Generation</CardTitle>
                    <CardDescription className="text-gray-400">Generate commonly requested reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                            <SelectValue placeholder="Report Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                            <SelectItem value="user">User Analytics</SelectItem>
                            <SelectItem value="vehicle">Vehicle Analytics</SelectItem>
                            <SelectItem value="governance">Governance</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                            <SelectValue placeholder="Date Range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                            <SelectItem value="1year">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Revenue Report
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Users className="h-4 w-4 mr-2" />
                          User Report
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Car className="h-4 w-4 mr-2" />
                          Vehicle Report
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Activity className="h-4 w-4 mr-2" />
                          DAO Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Generated Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Generated Reports</h2>
                  <p className="text-gray-400">Access and download previously generated reports</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Bulk Download
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                {reportCategories.map((category) => (
                  <Card key={category.id} className="bg-[#2a3441] border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <category.icon className="h-5 w-5 mr-2 text-[#E57700]" />
                        {category.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.reports.map((report, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg border border-gray-600"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-[#E57700]" />
                              <div>
                                <p className="font-medium text-white">{report.name}</p>
                                <p className="text-xs text-gray-400">
                                  Generated: {report.lastGenerated} • Size: {report.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                              <Button size="sm" className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Live Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Real-time Platform Metrics</CardTitle>
                    <CardDescription className="text-gray-400">Live data from the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                          <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-blue-400">1,247</p>
                          <p className="text-xs text-gray-400">Active Users Now</p>
                        </div>
                        <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-700">
                          <Car className="h-6 w-6 text-green-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-green-400">342</p>
                          <p className="text-xs text-gray-400">Vehicles in Use</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-700">
                          <DollarSign className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-purple-400">$24.5K</p>
                          <p className="text-xs text-gray-400">Today's Revenue</p>
                        </div>
                        <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-700">
                          <TrendingUp className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                          <p className="text-xl font-bold text-orange-400">15.8%</p>
                          <p className="text-xs text-gray-400">Growth Rate</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#2a3441] border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">System Health</CardTitle>
                    <CardDescription className="text-gray-400">Platform performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">API Response Time</span>
                        <Badge className="bg-green-600 text-white">125ms</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Database Performance</span>
                        <Badge className="bg-green-600 text-white">Optimal</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Server Uptime</span>
                        <Badge className="bg-green-600 text-white">99.9%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Error Rate</span>
                        <Badge className="bg-green-600 text-white">0.01%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Custom Reports Tab */}
            <TabsContent value="custom" className="space-y-6">
              <Card className="bg-[#2a3441] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Custom Report Builder</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create custom reports with specific metrics and filters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Report Name</label>
                        <Input placeholder="Enter report name..." className="bg-[#1a2332] border-gray-600 text-white" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Data Sources</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            User Data
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Vehicle Data
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Financial Data
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            DAO Data
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Date Range</label>
                        <Select>
                          <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Metrics to Include</label>
                        <div className="space-y-2">
                          {[
                            "Revenue & Fees",
                            "User Acquisition",
                            "Vehicle Utilization",
                            "Investment Returns",
                            "DAO Participation",
                            "Platform Performance",
                          ].map((metric) => (
                            <label key={metric} className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded border-gray-600 bg-[#1a2332]" />
                              <span className="text-gray-300 text-sm">{metric}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                        <PieChart className="h-4 w-4 mr-2" />
                        Generate Custom Report
                      </Button>
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
