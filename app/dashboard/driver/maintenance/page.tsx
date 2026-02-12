"use client"

import { useMemo, useState } from "react"
import { CalendarClock, CheckCircle2, Clock3, FileText, Phone, Wrench } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type MaintenanceStatus = "scheduled" | "completed" | "overdue"

interface MaintenanceRecord {
  id: string
  title: string
  status: MaintenanceStatus
  date: string
  mileage: string
  cost: string
  notes: string
}

const upcomingItems: MaintenanceRecord[] = [
  {
    id: "up-1",
    title: "Oil and filter change",
    status: "scheduled",
    date: "2026-02-22",
    mileage: "47,500 km",
    cost: "$45",
    notes: "Routine service window",
  },
  {
    id: "up-2",
    title: "Brake inspection",
    status: "overdue",
    date: "2026-02-07",
    mileage: "47,100 km",
    cost: "$35",
    notes: "Past due by 5 days",
  },
]

const historyItems: MaintenanceRecord[] = [
  {
    id: "his-1",
    title: "Tire rotation",
    status: "completed",
    date: "2026-01-18",
    mileage: "46,300 km",
    cost: "$25",
    notes: "All tires rotated and balanced",
  },
  {
    id: "his-2",
    title: "Engine diagnostics",
    status: "completed",
    date: "2025-12-20",
    mileage: "45,800 km",
    cost: "$55",
    notes: "No critical faults detected",
  },
]

function statusBadge(status: MaintenanceStatus) {
  if (status === "completed") return <Badge className="bg-emerald-600 text-white">Completed</Badge>
  if (status === "scheduled") return <Badge className="bg-blue-600 text-white">Scheduled</Badge>
  return <Badge className="bg-red-600 text-white">Overdue</Badge>
}

export default function MaintenancePage() {
  const { toast } = useToast()
  const [serviceType, setServiceType] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [serviceNote, setServiceNote] = useState("")
  const [issueType, setIssueType] = useState("")
  const [issueMessage, setIssueMessage] = useState("")
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isIssueOpen, setIsIssueOpen] = useState(false)

  const overdueCount = useMemo(() => {
    return upcomingItems.filter((item) => item.status === "overdue").length
  }, [])

  const handleSchedule = () => {
    if (!serviceType || !preferredDate) {
      toast({
        title: "Missing details",
        description: "Choose a service type and preferred date.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Maintenance scheduled",
      description: `${serviceType} booked for ${preferredDate}.`,
    })
    setServiceType("")
    setPreferredDate("")
    setServiceNote("")
    setIsScheduleOpen(false)
  }

  const handleIssue = () => {
    if (!issueType || !issueMessage.trim()) {
      toast({
        title: "Missing details",
        description: "Select an issue type and add details.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Issue reported",
      description: "Maintenance team has received your request.",
    })
    setIssueType("")
    setIssueMessage("")
    setIsIssueOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Driver" />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Vehicle maintenance</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track service deadlines, review history, and report issues quickly.
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Schedule service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule service</DialogTitle>
                      <DialogDescription>Book a service slot for your vehicle.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType">Service type</Label>
                        <Input
                          id="serviceType"
                          placeholder="e.g. Brake inspection"
                          value={serviceType}
                          onChange={(event) => setServiceType(event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred date</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={preferredDate}
                          onChange={(event) => setPreferredDate(event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceNote">Notes</Label>
                        <Textarea
                          id="serviceNote"
                          rows={3}
                          placeholder="Any extra context for the service team."
                          value={serviceNote}
                          onChange={(event) => setServiceNote(event.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90" onClick={handleSchedule}>
                        Confirm booking
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isIssueOpen} onOpenChange={setIsIssueOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Report issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report maintenance issue</DialogTitle>
                      <DialogDescription>Describe the issue so we can prioritize it correctly.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="issueType">Issue type</Label>
                        <Input
                          id="issueType"
                          placeholder="e.g. Engine warning light"
                          value={issueType}
                          onChange={(event) => setIssueType(event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueMessage">Details</Label>
                        <Textarea
                          id="issueMessage"
                          rows={4}
                          placeholder="Tell us when it started and any symptoms."
                          value={issueMessage}
                          onChange={(event) => setIssueMessage(event.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsIssueOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleIssue}>Submit issue</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Upcoming services</CardDescription>
                <CardTitle>{upcomingItems.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Scheduled and due maintenance tasks</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Overdue tasks</CardDescription>
                <CardTitle>{overdueCount}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Requires immediate attention</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed this quarter</CardDescription>
                <CardTitle>{historyItems.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Recently resolved maintenance records</CardContent>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Upcoming maintenance
                </CardTitle>
                <CardDescription>Next tasks and deadlines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingItems.map((item) => (
                  <div key={item.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due {new Date(item.date).toLocaleDateString()} • {item.mileage}
                        </p>
                      </div>
                      {statusBadge(item.status)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p>
                    <p className="mt-2 text-sm font-medium">Estimated cost: {item.cost}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Service history
                </CardTitle>
                <CardDescription>Previously completed maintenance work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {historyItems.map((item) => (
                  <div key={item.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString()} • {item.mileage}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-medium">Completed</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p>
                    <p className="mt-2 text-sm font-medium">{item.cost}</p>
                  </div>
                ))}
                <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  <Clock3 className="mr-2 inline h-3.5 w-3.5" />
                  Keep this history updated for faster loan and insurance reviews.
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
