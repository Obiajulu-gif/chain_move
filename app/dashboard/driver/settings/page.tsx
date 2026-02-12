"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Eye, EyeOff, LogOut, Save, Shield, User } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function DriverSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser } = useAuth()

  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    repaymentReminders: true,
    maintenanceAlerts: true,
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  useEffect(() => {
    if (!authUser) return

    const fullName = getUserDisplayName(authUser, "Driver").trim()
    const [firstName, ...rest] = fullName.split(" ").filter(Boolean)
    const lastName = rest.join(" ")

    setProfileData((prev) => ({
      ...prev,
      firstName: firstName || prev.firstName || "Driver",
      lastName: lastName || prev.lastName,
      email: authUser.email || prev.email,
      phone: prev.phone || "+1 000 000 0000",
      address: prev.address || "No address set",
      bio: prev.bio || "Active ChainMove driver.",
    }))
  }, [authUser])

  const handleProfileSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast({
        title: "Settings saved",
        description: "Your profile preferences were updated.",
      })
    } catch {
      toast({
        title: "Save failed",
        description: "Unable to update settings right now.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }
    if (securityData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast({
        title: "Password updated",
        description: "Security credentials were updated successfully.",
      })
      setSecurityData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
    } catch {
      toast({
        title: "Update failed",
        description: "Unable to update password right now.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Logged out",
        description: "You have been signed out successfully.",
      })
      router.push("/signin")
    } catch {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      setIsLogoutOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="driver" />

      <div className="md:ml-64 lg:ml-72">
        <Header userStatus="Verified Driver" showBackButton />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Driver settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage profile data, notifications, and account security in one place.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
                <CardDescription>Personal and contact details used for driver operations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(event) => setProfileData((prev) => ({ ...prev, firstName: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(event) => setProfileData((prev) => ({ ...prev, lastName: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(event) => setProfileData((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(event) => setProfileData((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(event) => setProfileData((prev) => ({ ...prev, address: event.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={(event) => setProfileData((prev) => ({ ...prev, bio: event.target.value }))}
                  />
                </div>

                <Button className="bg-[#E57700] text-white hover:bg-[#E57700]/90" onClick={handleProfileSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save profile"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>How you receive updates and reminders.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "emailNotifications", label: "Email notifications", description: "General account updates" },
                    { key: "pushNotifications", label: "Push notifications", description: "Real-time mobile alerts" },
                    { key: "smsNotifications", label: "SMS notifications", description: "Critical alerts via SMS" },
                    { key: "repaymentReminders", label: "Repayment reminders", description: "Upcoming due-date reminders" },
                    { key: "maintenanceAlerts", label: "Maintenance alerts", description: "Service and inspection prompts" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl border p-3">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({ ...prev, [item.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>Update password and strengthen account access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(event) => setSecurityData((prev) => ({ ...prev, currentPassword: event.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={(event) => setSecurityData((prev) => ({ ...prev, newPassword: event.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(event) => setSecurityData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <p className="text-sm font-medium">Two-factor authentication</p>
                      <p className="text-xs text-muted-foreground">Add a second verification step at sign-in.</p>
                    </div>
                    <Switch
                      checked={securityData.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurityData((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                  </div>
                  <Button variant="outline" onClick={handlePasswordSave} disabled={isSaving}>
                    Update password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session</CardTitle>
                  <CardDescription>End current session from this device.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Log out of account?</DialogTitle>
                        <DialogDescription>
                          You will need to sign in again to access your driver dashboard.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsLogoutOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout} disabled={isSaving}>
                          {isSaving ? "Logging out..." : "Log out"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
