"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, Bell, CheckCircle2, Info, Trash2 } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type NotificationType = "payment" | "maintenance" | "document" | "info"

interface DriverNotification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: "high" | "medium" | "low"
  read: boolean
  timestamp: string
}

const initialNotifications: DriverNotification[] = [
  {
    id: "n-1",
    title: "Payment due reminder",
    message: "Your monthly installment is due in 3 days.",
    type: "payment",
    priority: "high",
    read: false,
    timestamp: "2026-02-12T09:10:00.000Z",
  },
  {
    id: "n-2",
    title: "Maintenance check needed",
    message: "Brake inspection is overdue. Please schedule service.",
    type: "maintenance",
    priority: "high",
    read: false,
    timestamp: "2026-02-10T07:40:00.000Z",
  },
  {
    id: "n-3",
    title: "Document approved",
    message: "Your latest compliance upload has been verified.",
    type: "document",
    priority: "low",
    read: true,
    timestamp: "2026-02-08T16:20:00.000Z",
  },
]

const announcements = [
  {
    id: "a-1",
    title: "Scheduled platform maintenance",
    message: "Maintenance window on February 20, 2026 from 02:00 to 04:00 UTC.",
    important: true,
    date: "2026-02-12",
  },
  {
    id: "a-2",
    title: "New repayment reminder options",
    message: "You can now configure weekly reminder cadence in settings.",
    important: false,
    date: "2026-02-09",
  },
]

function iconForType(type: NotificationType) {
  if (type === "payment") return <AlertTriangle className="h-4 w-4 text-red-600" />
  if (type === "maintenance") return <AlertTriangle className="h-4 w-4 text-amber-600" />
  if (type === "document") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
  return <Info className="h-4 w-4 text-blue-600" />
}

function badgeForPriority(priority: DriverNotification["priority"]) {
  if (priority === "high") return <Badge className="bg-red-600 text-white">High</Badge>
  if (priority === "medium") return <Badge className="bg-amber-600 text-white">Medium</Badge>
  return <Badge className="bg-emerald-600 text-white">Low</Badge>
}

export default function NotificationsPage() {
  const [items, setItems] = useState(initialNotifications)

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items])
  const highPriorityCount = useMemo(() => items.filter((item) => item.priority === "high").length, [items])

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const removeNotification = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Driver" notificationCount={unreadCount} />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Notifications</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review operational alerts and platform announcements.
                </p>
              </div>
              <Badge className="w-fit bg-[#E57700] text-white">
                <Bell className="mr-1 h-4 w-4" />
                {unreadCount} unread
              </Badge>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unread alerts</CardDescription>
                <CardTitle>{unreadCount}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Need your attention</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>High priority</CardDescription>
                <CardTitle>{highPriorityCount}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Action recommended today</CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total notifications</CardDescription>
                <CardTitle>{items.length}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">Recent account and platform updates</CardContent>
            </Card>
          </section>

          <Tabs defaultValue="alerts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={markAllRead}>
                  Mark all read
                </Button>
              </div>

              {items.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-sm text-muted-foreground">
                    You have no notifications.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card key={item.id} className={!item.read ? "border-l-4 border-l-[#E57700]" : ""}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            {iconForType(item.type)}
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <p className="font-medium">{item.title}</p>
                                {badgeForPriority(item.priority)}
                                {!item.read ? <Badge variant="secondary">New</Badge> : null}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.message}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeNotification(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="announcements" className="space-y-3">
              {announcements.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      {item.important ? <Badge className="bg-red-600 text-white">Important</Badge> : null}
                    </div>
                    <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{item.message}</CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
