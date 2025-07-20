"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, Search, Settings, CheckCircle, AlertTriangle, Info, Mail, XCircle, Clock, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { markNotificationsAsRead } from "@/actions/notification" // New Server Action

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  link?: string
}

interface NotificationCenterProps {
  userId: string
  userRole: "driver" | "investor" | "admin"
  notifications: Notification[] // Pass notifications as a prop
}

export function NotificationCenter({ userId, userRole, notifications: initialNotifications }: NotificationCenterProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("recent")
  const [filterUnread, setFilterUnread] = useState(false)
  const [filterHighPriority, setFilterHighPriority] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications) // Use internal state for read status

  // Update internal state when initialNotifications prop changes
  React.useEffect(() => {
    setNotifications(initialNotifications)
  }, [initialNotifications])

  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterUnread) {
      filtered = filtered.filter((n) => !n.read)
    }

    // Placeholder for high priority logic (e.g., based on title keywords or a 'priority' field)
    if (filterHighPriority) {
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes("approved") || n.title.toLowerCase().includes("rejected"),
      )
    }

    // Tab-based filtering
    switch (activeTab) {
      case "recent":
        // Already sorted by timestamp by default from DB, or can sort here if needed
        break
      case "financial":
        filtered = filtered.filter(
          (n) =>
            n.title.toLowerCase().includes("payment") ||
            n.title.toLowerCase().includes("loan") ||
            n.title.toLowerCase().includes("funds"),
        )
        break
      case "system":
        filtered = filtered.filter(
          (n) =>
            n.title.toLowerCase().includes("system") ||
            n.title.toLowerCase().includes("update") ||
            n.title.toLowerCase().includes("maintenance"),
        )
        break
      case "archived":
        // Assuming 'archived' means read notifications for now, or a separate 'archived' flag
        filtered = filtered.filter((n) => n.read)
        break
      default:
        break
    }

    // Sort by timestamp descending (most recent first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [notifications, searchTerm, filterUnread, filterHighPriority, activeTab])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const handleMarkAllRead = async () => {
    try {
      const unreadNotificationIds = notifications.filter((n) => !n.read).map((n) => n.id)
      if (unreadNotificationIds.length === 0) {
        toast({ title: "No unread notifications", description: "You are all caught up!" })
        return
      }
      const res = await markNotificationsAsRead(userId, unreadNotificationIds)
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        toast({ title: "Success", description: "All notifications marked as read." })
        router.refresh() // Revalidate the page to ensure consistency
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to mark notifications as read.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking all read:", error)
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" })
    }
  }

  const getNotificationIcon = (notification: Notification) => {
    if (notification.title.toLowerCase().includes("approved") || notification.title.toLowerCase().includes("success")) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (notification.title.toLowerCase().includes("rejected") || notification.title.toLowerCase().includes("failed")) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
    if (
      notification.title.toLowerCase().includes("pending") ||
      notification.title.toLowerCase().includes("review") ||
      notification.title.toLowerCase().includes("scheduled")
    ) {
      return <Clock className="h-5 w-5 text-yellow-500" />
    }
    if (notification.title.toLowerCase().includes("error") || notification.title.toLowerCase().includes("issue")) {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />
    }
    if (notification.title.toLowerCase().includes("email") || notification.title.toLowerCase().includes("message")) {
      return <Mail className="h-5 w-5 text-blue-500" />
    }
    return <Info className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-foreground" />
          <CardTitle className="text-2xl font-bold">Notification Center</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Notification settings</span>
          </Button>
        </div>
      </CardHeader>
      <CardDescription className="px-6 pb-4">Stay updated with real-time platform notifications</CardDescription>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterUnread ? "default" : "outline"}
              onClick={() => setFilterUnread(!filterUnread)}
              className={filterUnread ? "bg-[#E57700] hover:bg-[#E57700]/90 text-white" : ""}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filterHighPriority ? "default" : "outline"}
              onClick={() => setFilterHighPriority(!filterHighPriority)}
              className={filterHighPriority ? "bg-[#E57700] hover:bg-[#E57700]/90 text-white" : ""}
            >
              <Filter className="h-4 w-4 mr-1" /> High Priority
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recent" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-5 lg:grid-cols-6">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            {/* Add more categories as needed */}
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.link || "#"} // Fallback to # if no link
                className={`flex items-start p-4 rounded-lg transition-colors ${
                  notification.read
                    ? "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    : "bg-card border border-border hover:bg-accent/50"
                }`}
              >
                <div className="flex-shrink-0 mr-3 mt-1">{getNotificationIcon(notification)}</div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground/80"}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <Badge variant="default" className="ml-auto bg-[#E57700] text-white">
                    New
                  </Badge>
                )}
              </Link>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No notifications found</p>
              <p>You're all caught up!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
