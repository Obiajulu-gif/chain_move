"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { usePlatform } from "@/contexts/platform-context"
import { Send, MessageCircle, Users, Phone, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "driver" | "investor" | "admin"
  recipientId: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "system" | "file"
}

interface ChatProps {
  currentUserId: string
  currentUserRole: "driver" | "investor" | "admin"
}

export function RealTimeChat({ currentUserId, currentUserRole }: ChatProps) {
  const { state } = usePlatform()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Simulate real-time messaging
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate incoming messages
      if (Math.random() > 0.95) {
        const sampleMessages = [
          "Thanks for the quick approval on my loan application!",
          "When can I expect the funds to be released?",
          "The monthly returns look great this month.",
          "I have a question about the vehicle specifications.",
          "Can we schedule a call to discuss the investment terms?",
        ]

        const randomMessage: Message = {
          id: `msg_${Date.now()}`,
          senderId: "user_sample",
          senderName: "Sample User",
          senderRole: currentUserRole === "driver" ? "investor" : "driver",
          recipientId: currentUserId,
          content: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
          timestamp: new Date().toISOString(),
          read: false,
          type: "text",
        }

        setMessages((prev) => [...prev, randomMessage])
      }

      // Simulate online users
      const allUsers = [...state.drivers, ...state.investors].map((u) => u.id)
      const randomOnline = allUsers.filter(() => Math.random() > 0.3)
      setOnlineUsers(randomOnline)
    }, 10000)

    return () => clearInterval(interval)
  }, [currentUserId, currentUserRole, state.drivers, state.investors])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      senderName: getCurrentUserName(),
      senderRole: currentUserRole,
      recipientId: selectedChat,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: "text",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    toast({
      title: "Message Sent",
      description: "Your message has been delivered",
    })
  }

  const getCurrentUserName = () => {
    if (currentUserRole === "driver") {
      return state.drivers.find((d) => d.id === currentUserId)?.name || "Driver"
    } else if (currentUserRole === "investor") {
      return state.investors.find((i) => i.id === currentUserId)?.name || "Investor"
    }
    return "Admin"
  }

  const getChatPartners = () => {
    if (currentUserRole === "admin") {
      return [...state.drivers, ...state.investors]
    } else if (currentUserRole === "driver") {
      return state.investors
    } else {
      return state.drivers
    }
  }

  const getUnreadCount = (userId: string) => {
    return messages.filter((m) => m.senderId === userId && m.recipientId === currentUserId && !m.read).length
  }

  return (
    <Card className="bg-card border-border h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Real-time Chat
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Communicate with platform users in real-time
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex p-0">
        {/* Chat List */}
        <div className="w-1/3 border-r border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{onlineUsers.length} online</span>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-2 space-y-2">
              {getChatPartners().map((user) => {
                const unreadCount = getUnreadCount(user.id)
                const isOnline = onlineUsers.includes(user.id)

                return (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === user.id ? "bg-[#E57700] text-white" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedChat(user.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-foreground">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium truncate ${selectedChat === user.id ? "text-white" : "text-foreground"}`}
                        >
                          {user.name}
                        </p>
                        <p
                          className={`text-xs truncate ${selectedChat === user.id ? "text-white/80" : "text-muted-foreground"}`}
                        >
                          {currentUserRole === "admin"
                            ? state.drivers.find((d) => d.id === user.id)
                              ? "Driver"
                              : "Investor"
                            : currentUserRole === "driver"
                              ? "Investor"
                              : "Driver"}
                        </p>
                      </div>
                      {unreadCount > 0 && <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted text-foreground">
                        {getChatPartners()
                          .find((u) => u.id === selectedChat)
                          ?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {getChatPartners().find((u) => u.id === selectedChat)?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {onlineUsers.includes(selectedChat) ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-border">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-border">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages
                    .filter(
                      (m) =>
                        (m.senderId === currentUserId && m.recipientId === selectedChat) ||
                        (m.senderId === selectedChat && m.recipientId === currentUserId),
                    )
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === currentUserId ? "bg-[#E57700] text-white" : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === currentUserId ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
