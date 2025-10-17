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

  // Fetch latest notifications from API for the given user
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`)
        if (!res.ok) return
        const data = await res.json()
        const items = (data.notifications || []).map((n: any) => ({
          id: n._id || n.id,
          title: n.title,
          message: n.message,
          read: !!n.read,
          timestamp: typeof n.timestamp === "string" ? n.timestamp : new Date(n.timestamp).toISOString(),
          link: n.actionUrl || undefined,
        }))
        // Prefer server notifications; fall back to existing if empty
        if (items.length > 0) {
          setNotifications(items)
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err)
      }
    }
    if (userId) fetchNotifications()
  }, [userId])

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
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle className="text-foreground">Notifications</CardTitle>
              {unreadCount > 0 && <Badge>{unreadCount} unread</Badge>}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.refresh()}>
                Refresh
              </Button>
            </div>
          </div>
          <CardDescription className="text-muted-foreground">
            Stay updated with your loan, payments, and system events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant={filterUnread ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterUnread((v) => !v)}
              className="flex items-center space-x-1"
            >
              <Filter className="h-4 w-4" /> <span>Unread</span>
            </Button>
            <Button
              variant={filterHighPriority ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterHighPriority((v) => !v)}
              className="flex items-center space-x-1"
            >
              <Filter className="h-4 w-4" /> <span>High Priority</span>
            </Button>
          </div>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">No notifications found.</div>
            ) : (
              filteredNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-background">
                  {getNotificationIcon(notification)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && <Badge variant="secondary">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    {notification.link && (
                      <Link href={notification.link} className="text-xs text-primary hover:underline mt-2 inline-block">
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
