"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, Bell, Eye, EyeOff, LogOut, Save, Shield, TrendingUp, User } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function InvestorSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user: authUser } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+1 555 123 4567",
    address: "456 Wall Street, New York, NY 10005",
    bio: "Experienced investor focused on emerging markets and blockchain technology.",
  })

  const [investmentPreferences, setInvestmentPreferences] = useState({
    riskTolerance: "medium",
    minInvestment: [1000],
    maxInvestment: [50000],
    preferredRegions: ["all"],
    autoInvestEnabled: false,
    diversificationLevel: [70],
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    investmentUpdates: true,
    marketAlerts: true,
    daoNotifications: true,
    returnReports: true,
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
  })

  useEffect(() => {
    if (!authUser) return

    const fullName = getUserDisplayName(authUser, "Investor").trim()
    const [firstName, ...otherNames] = fullName.split(" ").filter(Boolean)
    const lastName = otherNames.join(" ")

    setProfileData((previous) => ({
      ...previous,
      firstName: firstName || previous.firstName || "Investor",
      lastName: lastName || previous.lastName,
      email: authUser.email || previous.email,
    }))
  }, [authUser])

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch {
      toast({
        title: "Update failed",
        description: "Unable to update profile right now. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
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

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
      setSecurityData((previous) => ({
        ...previous,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch {
      toast({
        title: "Update failed",
        description: "Unable to update password right now.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
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
      setIsLoading(false)
      setIsLogoutOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role="investor" mobileWidth="w-[212px]" className="md:w-[212px] lg:w-[212px]" />

      <div className="md:ml-[212px]">
        <Header userStatus="Verified Investor" showBackButton />

        <main className="space-y-6 p-4 md:p-6">
          <section className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-foreground">Investor Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account details, investment preferences, notifications, and security.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and contact details.</CardDescription>
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
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(event) => setProfileData((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
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
                  <Label htmlFor="bio">Investment bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={(event) => setProfileData((prev) => ({ ...prev, bio: event.target.value }))}
                  />
                </div>

                <Button
                  onClick={handleProfileSave}
                  disabled={isLoading}
                  className="bg-[#E57700] text-white hover:bg-[#E57700]/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investment Preferences
                  </CardTitle>
                  <CardDescription>Configure your investment strategy and risk profile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Risk tolerance</Label>
                    <Select
                      value={investmentPreferences.riskTolerance}
                      onValueChange={(value) => setInvestmentPreferences((prev) => ({ ...prev, riskTolerance: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Conservative (Low Risk)</SelectItem>
                        <SelectItem value="medium">Moderate (Medium Risk)</SelectItem>
                        <SelectItem value="high">Aggressive (High Risk)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Investment: ${investmentPreferences.minInvestment[0].toLocaleString()}</Label>
                    <Slider
                      value={investmentPreferences.minInvestment}
                      onValueChange={(value) => setInvestmentPreferences((prev) => ({ ...prev, minInvestment: value }))}
                      max={10000}
                      min={100}
                      step={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Investment: ${investmentPreferences.maxInvestment[0].toLocaleString()}</Label>
                    <Slider
                      value={investmentPreferences.maxInvestment}
                      onValueChange={(value) => setInvestmentPreferences((prev) => ({ ...prev, maxInvestment: value }))}
                      max={100000}
                      min={1000}
                      step={1000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Diversification: {investmentPreferences.diversificationLevel[0]}%</Label>
                    <Slider
                      value={investmentPreferences.diversificationLevel}
                      onValueChange={(value) =>
                        setInvestmentPreferences((prev) => ({ ...prev, diversificationLevel: value }))
                      }
                      max={100}
                      min={10}
                      step={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher values spread investments across more vehicles and pools.
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border/70 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Auto-investment</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically invest in opportunities that match your criteria.
                      </p>
                    </div>
                    <Switch
                      checked={investmentPreferences.autoInvestEnabled}
                      onCheckedChange={(checked) =>
                        setInvestmentPreferences((prev) => ({ ...prev, autoInvestEnabled: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you receive account and market updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email notifications",
                      description: "Receive updates via email",
                    },
                    {
                      key: "pushNotifications",
                      label: "Push notifications",
                      description: "Receive alerts on your device",
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS notifications",
                      description: "Get critical alerts by SMS",
                    },
                    {
                      key: "investmentUpdates",
                      label: "Investment updates",
                      description: "Performance and payout updates",
                    },
                    {
                      key: "marketAlerts",
                      label: "Market alerts",
                      description: "New opportunities and market events",
                    },
                    {
                      key: "daoNotifications",
                      label: "DAO notifications",
                      description: "Governance proposals and voting reminders",
                    },
                    {
                      key: "returnReports",
                      label: "Return reports",
                      description: "Monthly return and summary reports",
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl border border-border/70 p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
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

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage password and security controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(event) =>
                          setSecurityData((prev) => ({ ...prev, currentPassword: event.target.value }))
                        }
                        className="pr-10"
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
                        className="pr-10"
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
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(event) => setSecurityData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border/70 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra verification step at sign-in.</p>
                    </div>
                    <Switch
                      checked={securityData.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurityData((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                  </div>

                  <Button variant="outline" onClick={handlePasswordChange} disabled={isLoading}>
                    <Shield className="mr-2 h-4 w-4" />
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible account actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <LogOut className="h-5 w-5" />
                      Confirm Sign Out
                    </DialogTitle>
                    <DialogDescription>Are you sure you want to sign out of your account?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLogoutOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} disabled={isLoading}>
                      {isLoading ? "Signing Out..." : "Yes, Sign Out"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

