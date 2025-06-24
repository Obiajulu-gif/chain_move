"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { AlertTriangle, Clock, Plus, MessageSquare, Phone, Mail, FileText } from "lucide-react"

const supportTickets = [
  {
    id: "ST-001",
    title: "Oil change overdue",
    category: "Maintenance",
    status: "Open",
    priority: "Medium",
    createdDate: "2025-01-10",
    lastUpdate: "2025-01-12",
    description: "Need to schedule oil change service",
  },
  {
    id: "ST-002",
    title: "Payment delay request",
    category: "Payment",
    status: "In Progress",
    priority: "High",
    createdDate: "2025-01-08",
    lastUpdate: "2025-01-11",
    description: "Requesting 5-day extension for January payment",
  },
  {
    id: "ST-003",
    title: "Insurance document upload",
    category: "Documentation",
    status: "Resolved",
    priority: "Low",
    createdDate: "2025-01-05",
    lastUpdate: "2025-01-09",
    description: "Help with uploading new insurance certificate",
  },
]

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-600"
      case "In Progress":
        return "bg-blue-600"
      case "Resolved":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-600"
      case "Medium":
        return "bg-yellow-600"
      case "Low":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

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
                  Support Request
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Get help with maintenance, payments, or technical issues
                </p>
              </div>
              <Badge 
                className="bg-blue-600 text-white px-3 py-1 flex items-center gap-1"
                variant="outline"
              >
                <MessageSquare className="h-4 w-4" />
                24/7 Support
              </Badge>
            </div>
          </div>

          {/* Quick Support Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="bg-card/50 hover:bg-card/70 transition-colors duration-200 border-border/50">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-blue-600/10 p-3 rounded-full mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Maintenance Issue</h3>
                <p className="text-sm text-muted-foreground">Report vehicle problems</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-colors duration-200 border-border/50">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-yellow-600/10 p-3 rounded-full mx-auto mb-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Payment Delay</h3>
                <p className="text-sm text-muted-foreground">Request extension</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-colors duration-200 border-border/50">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-green-600/10 p-3 rounded-full mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Document Help</h3>
                <p className="text-sm text-muted-foreground">Upload assistance</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 hover:bg-card/70 transition-colors duration-200 border-border/50">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-purple-600/10 p-3 rounded-full mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">General Support</h3>
                <p className="text-sm text-muted-foreground">Other questions</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Create New Ticket */}
            <Card className="bg-card border-border/50 hover:bg-card/70 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Support Ticket
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Submit a new support request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Issue Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Brief description of your issue"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="documentation">Documentation</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your issue..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                    variant="default"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Support</CardTitle>
                <CardDescription className="text-gray-400">Alternative ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-[#1a2332] rounded-lg">
                    <Phone className="h-6 w-6 text-[#E57700]" />
                    <div>
                      <h4 className="font-medium text-white">Emergency Hotline</h4>
                      <p className="text-sm text-gray-400">+234 800 CHAINMOVE</p>
                      <p className="text-xs text-gray-500">24/7 for urgent issues</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-[#1a2332] rounded-lg">
                    <Mail className="h-6 w-6 text-[#E57700]" />
                    <div>
                      <h4 className="font-medium text-white">Email Support</h4>
                      <p className="text-sm text-gray-400">support@chainmove.com</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-[#1a2332] rounded-lg">
                    <MessageSquare className="h-6 w-6 text-[#E57700]" />
                    <div>
                      <h4 className="font-medium text-white">Live Chat</h4>
                      <p className="text-sm text-gray-400">Available 9 AM - 6 PM WAT</p>
                      <p className="text-xs text-gray-500">Monday to Friday</p>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Tickets History */}
          <Card className="bg-[#2a3441] border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Your Support Tickets</CardTitle>
              <CardDescription className="text-gray-400">Track your submitted support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-[#1a2332] rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-white">{ticket.title}</h4>
                          <Badge className="text-xs">{ticket.id}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Created: {ticket.createdDate}</span>
                          <span>Updated: {ticket.lastUpdate}</span>
                          <span>Category: {ticket.category}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={`${getStatusColor(ticket.status)} text-white`}>{ticket.status}</Badge>
                        <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>{ticket.priority}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
