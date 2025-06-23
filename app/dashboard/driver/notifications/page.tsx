"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Settings,
  Trash2,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react"

const notifications = [
  {
    id: 1,
    title: "Payment Due Reminder",
    message: "Your monthly loan payment of ₦498 is due on January 15, 2025",
    type: "payment",
    priority: "high",
    read: false,
    timestamp: "2025-01-12 09:30",
    action: "Make Payment",
  },
  {
    id: 2,
    title: "Maintenance Alert",
    message: "Oil change is due in 45 days. Schedule your service appointment now.",
    type: "maintenance",
    priority: "medium",
    read: false,
    timestamp: "2025-01-11 14:20",
    action: "Schedule Service",
  },
  {
    id: 3,
    title: "Document Expiry Warning",
    message: "Your vehicle inspection certificate will expire in 30 days",
    type: "document",
    priority: "medium",
    read: true,
    timestamp: "2025-01-10 11:15",
    action: "Renew Document",
  },
  {
    id: 4,
    title: "Performance Milestone",
    message: "Congratulations! You've achieved a 4.8-star rating this month",
    type: "achievement",
    priority: "low",
    read: true,
    timestamp: "2025-01-09 16:45",
    action: null,
  },
  {
    id: 5,
    title: "New Feature Available",
    message: "Try our new trip planning feature to optimize your routes",
    type: "feature",
    priority: "low",
    read: false,
    timestamp: "2025-01-08 10:00",
    action: "Learn More",
  },
]

const announcements = [
  {
    id: 1,
    title: "Platform Maintenance Scheduled",
    content:
      "ChainMove will undergo scheduled maintenance on January 20, 2025, from 2:00 AM to 4:00 AM WAT. Services may be temporarily unavailable during this time.",
    type: "maintenance",
    date: "2025-01-12",
    important: true,
  },
  {
    id: 2,
    title: "New Payment Options Available",
    content:
      "We've added support for mobile money payments including MTN Mobile Money and Airtel Money. Update your payment preferences in settings.",
    type: "feature",
    date: "2025-01-10",
    important: false,
  },
  {
    id: 3,
    title: "Holiday Bonus Program",
    content:
      "Earn extra rewards during the holiday season! Complete 20 trips between December 20 - January 5 to receive a ₦5,000 bonus.",
    type: "promotion",
    date: "2025-01-05",
    important: false,
  },
  {
    id: 4,
    title: "Safety Guidelines Update",
    content:
      "New safety protocols have been implemented. Please review the updated guidelines in your driver handbook.",
    type: "safety",
    date: "2025-01-03",
    important: true,
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      case "maintenance":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "document":
        return <Info className="h-5 w-5 text-blue-400" />
      case "achievement":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-yellow-600"
      case "low":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return "🔧"
      case "feature":
        return "✨"
      case "promotion":
        return "🎉"
      case "safety":
        return "🛡️"
      default:
        return "📢"
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="driver" />

      <div className="md:ml-64">
        <Header userName="Emmanuel" userStatus="Not Registered" />

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Notifications & Announcements</h1>
            <p className="text-gray-400">Stay updated with important messages and platform announcements</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[#2a3441] border-gray-700">
              <CardContent className="p-4 text-center">
                <Bell className="h-6 w-6 text-[#E57700] mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{unreadCount}</div>
                <p className="text-sm text-gray-400">Unread</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">2</div>
                <p className="text-sm text-gray-400">High Priority</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">1</div>
                <p className="text-sm text-gray-400">Achievements</p>
              </CardContent>
            </Card>

            <Card className="bg-[#2a3441] border-gray-700">
              <CardContent className="p-4 text-center">
                <Info className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">4</div>
                <p className="text-sm text-gray-400">Announcements</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-[#2a3441] border-gray-700">
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Notifications ({unreadCount})
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="data-[state=active]:bg-[#E57700] data-[state=active]:text-white text-gray-300"
              >
                Announcements
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Your Notifications</h2>
                  <p className="text-gray-400">Important updates and reminders</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <MarkAsRead className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`bg-[#2a3441] border-gray-700 ${!notification.read ? "border-l-4 border-l-[#E57700]" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`font-semibold ${!notification.read ? "text-white" : "text-gray-300"}`}>
                                {notification.title}
                              </h3>
                              {!notification.read && <div className="w-2 h-2 bg-[#E57700] rounded-full" />}
                              <Badge className={`${getPriorityColor(notification.priority)} text-white text-xs`}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-400 mb-3">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {notification.action && (
                            <Button size="sm" className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                              {notification.action}
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent value="announcements" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Platform Announcements</h2>
                  <p className="text-gray-400">Latest updates and news from ChainMove</p>
                </div>
              </div>

              <div className="space-y-6">
                {announcements.map((announcement) => (
                  <Card
                    key={announcement.id}
                    className={`bg-[#2a3441] border-gray-700 ${announcement.important ? "border-l-4 border-l-yellow-500" : ""}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getAnnouncementIcon(announcement.type)}</span>
                          <div>
                            <CardTitle className="text-white flex items-center space-x-2">
                              <span>{announcement.title}</span>
                              {announcement.important && <Badge className="bg-yellow-600 text-white">Important</Badge>}
                            </CardTitle>
                            <CardDescription className="text-gray-400">{announcement.date}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{announcement.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
