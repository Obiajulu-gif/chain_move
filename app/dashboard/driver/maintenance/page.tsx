"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  Car,
  Settings,
  FileText,
  DollarSign,
  MapPin,
  User,
} from "lucide-react"

const maintenanceHistory = [
  {
    id: "1",
    type: "Oil Change",
    date: "2024-12-15",
    status: "completed",
    cost: "$45",
    mileage: "44,500 km",
    notes: "Regular oil change with synthetic oil",
    technician: "Mike Johnson",
    location: "ChainMove Service Center - Lagos",
  },
  {
    id: "2",
    type: "Tire Rotation",
    date: "2024-11-20",
    status: "completed",
    cost: "$25",
    mileage: "43,800 km",
    notes: "Rotated all four tires, checked tire pressure",
    technician: "Sarah Williams",
    location: "ChainMove Service Center - Lagos",
  },
  {
    id: "3",
    type: "Brake Inspection",
    date: "2024-10-10",
    status: "completed",
    cost: "$35",
    mileage: "42,900 km",
    notes: "Brake pads and rotors in good condition",
    technician: "David Brown",
    location: "ChainMove Service Center - Lagos",
  },
  {
    id: "4",
    type: "Full Service",
    date: "2025-01-20",
    status: "scheduled",
    cost: "$120",
    mileage: "45,200 km",
    notes: "Comprehensive vehicle inspection and service",
    technician: "TBD",
    location: "ChainMove Service Center - Lagos",
  },
]

const upcomingMaintenance = [
  {
    id: "1",
    type: "Oil Change",
    dueDate: "2025-03-15",
    dueMileage: "47,500 km",
    priority: "medium",
    estimatedCost: "$45",
    description: "Regular oil and filter change",
  },
  {
    id: "2",
    type: "Tire Rotation",
    dueDate: "2025-02-20",
    dueMileage: "46,800 km",
    priority: "low",
    estimatedCost: "$25",
    description: "Rotate tires and check alignment",
  },
  {
    id: "3",
    type: "Annual Inspection",
    dueDate: "2025-04-10",
    dueMileage: "48,000 km",
    priority: "high",
    estimatedCost: "$85",
    description: "Mandatory annual vehicle inspection",
  },
]

export default function MaintenancePage() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [serviceNotes, setServiceNotes] = useState("")
  const [supportType, setSupportType] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const { toast } = useToast()

  const handleScheduleService = () => {
    if (!selectedService || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please select a service type and date.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Service Scheduled",
      description: `Your ${selectedService} has been scheduled for ${selectedDate}.`,
    })

    setIsScheduleOpen(false)
    setSelectedService("")
    setSelectedDate("")
    setServiceNotes("")
  }

  const handleRequestSupport = () => {
    if (!supportType || !supportMessage) {
      toast({
        title: "Missing Information",
        description: "Please select a support type and provide a message.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Support Request Submitted",
      description: "Our support team will contact you within 24 hours.",
    })

    setIsSupportOpen(false)
    setSupportType("")
    setSupportMessage("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 text-white">Completed</Badge>
      case "scheduled":
        return <Badge className="bg-blue-600 text-white">Scheduled</Badge>
      case "overdue":
        return <Badge className="bg-red-600 text-white">Overdue</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-600 text-white">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-600 text-white">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-green-600 text-white">Low Priority</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64">
        <Header userName="Emmanuel" userStatus="Verified Driver" />

        <div className="p-3 md:p-6 space-y-4 md:space-y-8 max-w-full overflow-x-hidden">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
              <Wrench className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-[#E57700]" />
              Vehicle Maintenance
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage your vehicle maintenance schedule and service history
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schedule Service Dialog */}
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-[#E57700] p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Schedule Service</h3>
                        <p className="text-sm text-muted-foreground">Book your next maintenance appointment</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-[#E57700]" />
                    Schedule Service
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Book your vehicle maintenance appointment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Service Type</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full p-2 bg-background border border-border rounded text-foreground"
                    >
                      <option value="">Select service type</option>
                      <option value="Oil Change">Oil Change</option>
                      <option value="Tire Rotation">Tire Rotation</option>
                      <option value="Brake Service">Brake Service</option>
                      <option value="Full Inspection">Full Inspection</option>
                      <option value="Engine Tune-up">Engine Tune-up</option>
                      <option value="Battery Check">Battery Check</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Preferred Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2 bg-background border border-border rounded text-foreground"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Additional Notes</label>
                    <textarea
                      value={serviceNotes}
                      onChange={(e) => setServiceNotes(e.target.value)}
                      className="w-full p-2 bg-background border border-border rounded text-foreground"
                      rows={3}
                      placeholder="Any specific concerns or requests..."
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <Button onClick={handleScheduleService} className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90">
                    Schedule Service
                  </Button>
                  <Button variant="outline" onClick={() => setIsScheduleOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Request Support Dialog */}
            <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
              <DialogTrigger asChild>
                <Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Request Support</h3>
                        <p className="text-sm text-muted-foreground">Get help with maintenance issues</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Request Support
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Get assistance with your vehicle maintenance needs
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Support Type</label>
                    <select
                      value={supportType}
                      onChange={(e) => setSupportType(e.target.value)}
                      className="w-full p-2 bg-background border border-border rounded text-foreground"
                    >
                      <option value="">Select support type</option>
                      <option value="Emergency Breakdown">Emergency Breakdown</option>
                      <option value="Maintenance Question">Maintenance Question</option>
                      <option value="Service Appointment">Service Appointment</option>
                      <option value="Warranty Claim">Warranty Claim</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Message</label>
                    <textarea
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full p-2 bg-background border border-border rounded text-foreground"
                      rows={4}
                      placeholder="Describe your issue or question..."
                    />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Emergency?</strong> Call our 24/7 hotline: +234 800 HELP (4357)
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <Button onClick={handleRequestSupport} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Submit Request
                  </Button>
                  <Button variant="outline" onClick={() => setIsSupportOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Upcoming Maintenance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Upcoming Maintenance
              </CardTitle>
              <CardDescription className="text-muted-foreground">Scheduled and due maintenance items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMaintenance.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg space-y-3 md:space-y-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-foreground">{item.type}</h4>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                      <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {item.dueDate}
                        </div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1" />
                          {item.dueMileage}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Est. {item.estimatedCost}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#E57700] hover:bg-[#E57700]/90 w-full md:w-auto"
                      onClick={() => setIsScheduleOpen(true)}
                    >
                      Schedule Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance History */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Maintenance History
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Complete record of all maintenance activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceHistory.map((record) => (
                  <div key={record.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(record.status)}
                        <div>
                          <h4 className="font-medium text-foreground">{record.type}</h4>
                          <p className="text-sm text-muted-foreground">{record.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(record.status)}
                        <Badge variant="outline">{record.cost}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Car className="h-4 w-4 mr-2" />
                        <span>{record.mileage}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        <span>{record.technician}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">{record.location}</span>
                      </div>
                    </div>

                    {record.notes && (
                      <div className="bg-muted p-3 rounded text-sm">
                        <p className="text-muted-foreground">
                          <strong>Notes:</strong> {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Tips */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Maintenance Tips
              </CardTitle>
              <CardDescription className="text-muted-foreground">Keep your vehicle in top condition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Regular Checks</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      Check oil level monthly
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      Monitor tire pressure weekly
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      Inspect lights and signals
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      Clean windshield and mirrors
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Warning Signs</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                      Unusual noises or vibrations
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                      Dashboard warning lights
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                      Changes in fuel efficiency
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                      Difficulty starting the engine
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
