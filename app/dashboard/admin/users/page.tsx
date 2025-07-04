"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, Shield, UserIcon, Trash2, Users, RefreshCw, AlertTriangle } from "lucide-react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

// Define a User type for clarity
interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "driver" | "investor"
  createdAt: string
}

async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/users")
  if (!res.ok) {
    throw new Error("Failed to fetch users")
  }
  const data = await res.json()
  return data.users
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
      setLastUpdated(new Date())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not load users"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: "admin" | "driver" | "investor") => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully.",
        })
        fetchUsers() // Refresh users list
      } else {
        const data = await res.json()
        toast({
          title: "Update Failed",
          description: data.message || "Could not update user role.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: "User has been deleted.",
        })
        fetchUsers() // Refresh users list
      } else {
        toast({
          title: "Deletion Failed",
          description: data.message || "Could not delete the user.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during deletion.",
        variant: "destructive",
      })
    }
  }

  const getRoleStats = () => {
    const stats = {
      admin: users.filter((u) => u.role === "admin").length,
      driver: users.filter((u) => u.role === "driver").length,
      investor: users.filter((u) => u.role === "investor").length,
      total: users.length,
    }
    return stats
  }

  const stats = getRoleStats()

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar role="admin" />

        <div className="md:ml-64">
          <Header userName="Admin" userStatus="System Administrator" notificationCount={0} />

          <div className="p-6">
            <Card className="max-w-md mx-auto mt-20">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Error Loading Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchUsers} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="admin" />

      <div className="md:ml-64">
        <Header userName="Admin" userStatus="System Administrator" notificationCount={0} />

        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
                <p className="text-muted-foreground">Manage platform users, roles, and permissions</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    <Users className="w-3 h-3 mr-1" />
                    {stats.total} Total Users
                  </Badge>
                  <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
                    disabled={isLoading}
                    className="ml-2 bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* User Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs opacity-80">All registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.admin}</div>
                <p className="text-xs opacity-80">Platform administrators</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drivers</CardTitle>
                <UserIcon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.driver}</div>
                <p className="text-xs opacity-80">Active drivers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investors</CardTitle>
                <UserIcon className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.investor}</div>
                <p className="text-xs opacity-80">Platform investors</p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="h-5 w-5 mr-2" />
                All Users ({users.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage user roles and permissions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.role === "admin" ? "default" : "secondary"}
                              className={`capitalize ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "driver"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleRoleChange(user._id, "admin")}
                                    disabled={user.role === "admin"}
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Make Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRoleChange(user._id, "driver")}
                                    disabled={user.role === "driver"}
                                  >
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Make Driver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRoleChange(user._id, "investor")}
                                    disabled={user.role === "investor"}
                                  >
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Make Investor
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user account for{" "}
                                    <span className="font-semibold">{user.name}</span> and remove their data from our
                                    servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
