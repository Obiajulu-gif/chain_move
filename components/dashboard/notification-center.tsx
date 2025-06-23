"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { usePlatform } from "@/contexts/platform-context"
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Car,
  Users,
  Settings,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
} from "lucide-react"

interface NotificationCenterProps {
  userId: string
  userRole: "driver" | "investor" | "admin"
}

export function NotificationCenter({ userId, userRole }: NotificationCenterProps) {
  const { state, dispatch } = usePlatform()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "high" | "medium" | "low">("all")

  // Get user notifications
  const userNotifications = state.notifications.filter(
    (n) => n.userId === userId || (userRole === "admin" && (n.userId === "admin" || n.type === "system_alert")),
  )

  // Filter notifications
  const filteredNotifications = userNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "unread" && !notification.read) ||
      (selectedFilter !== "unread" && notification.priority === selectedFilter)

    return matchesSearch && matchesFilter
  })

  const unreadCount = userNotifications.filter((n) => !n.read).length
  const highPriorityCount = userNotifications.filter((n) => !n.read && n.priority === "high").length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "loan_approved":
      case "fund_released":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "payment_due":
      case "system_alert":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "investment_return":
        return <DollarSign className="h-5 w-5 text-green-500" />
      case "vehicle_added":
        return <Car className="h-5 w-5 text-blue-500" />
      case "application_submitted":
        return <Users className="h-5 w-5 text-purple-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const markAsRead = (notificationId: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: notificationId })
  }

  const markAllAsRead = () => {
    userNotifications
      .filter((n) => !n.read)
      .forEach((notification) => {
        dispatch({ type: "MARK_NOTIFICATION_READ", payload: notification.id })
      })
  }

  const deleteNotification = (notificationId: string) => {
    // In a real app, you'd have a DELETE_NOTIFICATION action
    console.log("Delete notification:", notificationId)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Center
              {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Stay updated with real-time platform notifications
              {highPriorityCount > 0 && (
                <span className="ml-2 text-red-600 font-medium">{highPriorityCount} high priority</span>
              )}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="border-border text-foreground"
            >
              Mark All Read
            </Button>
            <Button size="sm" variant="outline" className="border-border text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
              className={selectedFilter === "all" ? "bg-[#E57700] text-white" : "border-border text-foreground"}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "unread" ? "default" : "outline"}
              onClick={() => setSelectedFilter("unread")}
              className={selectedFilter === "unread" ? "bg-[#E57700] text-white" : "border-border text-foreground"}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              size="sm"
              variant={selectedFilter === "high" ? "default" : "outline"}
              onClick={() => setSelectedFilter("high")}
              className={selectedFilter === "high" ? "bg-[#E57700] text-white" : "border-border text-foreground"}
            >
              <Filter className="h-4 w-4 mr-1" />
              High Priority
            </Button>
          </div>
        </div>

        {/* Notifications Tabs */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="recent" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
              Recent
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
              Financial
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
              System
            </TabsTrigger>
            <TabsTrigger value="archived" className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white">
              Archived
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((notification) => (
                      <Card
                        key={notification.id}
                        className={`transition-all hover:shadow-md cursor-pointer ${
                          !notification.read ? "bg-blue-50 border-blue-200" : "bg-muted border-border"
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4
                                  className={`font-medium ${!notification.read ? "text-blue-900" : "text-foreground"}`}
                                >
                                  {notification.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getPriorityColor(notification.priority)}>
                                    {notification.priority}
                                  </Badge>
                                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                              </div>
                              <p
                                className={`text-sm ${!notification.read ? "text-blue-700" : "text-muted-foreground"}`}
                              >
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                                <div className="flex space-x-1">
                                  {notification.read && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // Mark as unread functionality
                                      }}
                                      className="h-6 w-6 p-0"
                                    >
                                      <MarkAsUnread className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteNotification(notification.id)
                                    }}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No notifications found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms" : "You're all caught up!"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {filteredNotifications
                  .filter((n) =>
                    ["investment_return", "fund_released", "loan_approved", "payment_due"].includes(n.type),
                  )
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`transition-all hover:shadow-md cursor-pointer ${
                        !notification.read ? "bg-green-50 border-green-200" : "bg-muted border-border"
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${!notification.read ? "text-green-900" : "text-foreground"}`}>
                              {notification.title}
                            </h4>
                            <p className={`text-sm ${!notification.read ? "text-green-700" : "text-muted-foreground"}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {filteredNotifications
                  .filter((n) => ["system_alert", "vehicle_added"].includes(n.type))
                  .map((notification) => (
                    <Card
                      key={notification.id}
                      className={`transition-all hover:shadow-md cursor-pointer ${
                        !notification.read ? "bg-yellow-50 border-yellow-200" : "bg-muted border-border"
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${!notification.read ? "text-yellow-900" : "text-foreground"}`}>
                              {notification.title}
                            </h4>
                            <p
                              className={`text-sm ${!notification.read ? "text-yellow-700" : "text-muted-foreground"}`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No archived notifications</h3>
              <p className="text-muted-foreground">Archived notifications will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
