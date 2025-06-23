"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { User, Bell, Shield, TrendingUp, AlertTriangle, Save, LogOut, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function InvestorSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus@chainmove.com",
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

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (securityData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      })
      setSecurityData({
        ...securityData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
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
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push("/signin")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsLogoutOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar role="investor" />

      <div className="md:ml-64">
        <Header userName="Marcus" userStatus="Verified Investor" showBackButton />

        <div className="p-3 md:p-6 space-y-4 md:space-y-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Investor Settings</h1>
            <p className="text-gray-400">Manage your investment preferences and account settings</p>
          </div>

          {/* Profile Settings */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="bg-[#1a2332] border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="bg-[#1a2332] border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="bg-[#1a2332] border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="bg-[#1a2332] border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-300">
                  Address
                </Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="bg-[#1a2332] border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-300">
                  Investment Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="bg-[#1a2332] border-gray-600 text-white"
                  rows={3}
                />
              </div>
              <Button onClick={handleProfileSave} disabled={isLoading} className="bg-[#E57700] hover:bg-[#E57700]/90">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Investment Preferences */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Investment Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure your investment strategy and risk preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Risk Tolerance</Label>
                <Select
                  value={investmentPreferences.riskTolerance}
                  onValueChange={(value) =>
                    setInvestmentPreferences({ ...investmentPreferences, riskTolerance: value })
                  }
                >
                  <SelectTrigger className="bg-[#1a2332] border-gray-600 text-white">
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
                <Label className="text-gray-300">
                  Minimum Investment Amount: ${investmentPreferences.minInvestment[0].toLocaleString()}
                </Label>
                <Slider
                  value={investmentPreferences.minInvestment}
                  onValueChange={(value) =>
                    setInvestmentPreferences({ ...investmentPreferences, minInvestment: value })
                  }
                  max={10000}
                  min={100}
                  step={100}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  Maximum Investment Amount: ${investmentPreferences.maxInvestment[0].toLocaleString()}
                </Label>
                <Slider
                  value={investmentPreferences.maxInvestment}
                  onValueChange={(value) =>
                    setInvestmentPreferences({ ...investmentPreferences, maxInvestment: value })
                  }
                  max={100000}
                  min={1000}
                  step={1000}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  Portfolio Diversification: {investmentPreferences.diversificationLevel[0]}%
                </Label>
                <Slider
                  value={investmentPreferences.diversificationLevel}
                  onValueChange={(value) =>
                    setInvestmentPreferences({ ...investmentPreferences, diversificationLevel: value })
                  }
                  max={100}
                  min={10}
                  step={5}
                  className="mt-2"
                />
                <p className="text-sm text-gray-400">
                  Higher values mean more diversified investments across different vehicles
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Auto-Investment</Label>
                  <p className="text-sm text-gray-400">Automatically invest in opportunities matching your criteria</p>
                </div>
                <Switch
                  checked={investmentPreferences.autoInvestEnabled}
                  onCheckedChange={(checked) =>
                    setInvestmentPreferences({ ...investmentPreferences, autoInvestEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose how you want to receive investment updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Investment Updates</Label>
                  <p className="text-sm text-gray-400">Get notified about your investment performance</p>
                </div>
                <Switch
                  checked={notificationSettings.investmentUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, investmentUpdates: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Market Alerts</Label>
                  <p className="text-sm text-gray-400">Receive alerts about market opportunities</p>
                </div>
                <Switch
                  checked={notificationSettings.marketAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, marketAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">DAO Notifications</Label>
                  <p className="text-sm text-gray-400">Get notified about governance proposals and voting</p>
                </div>
                <Switch
                  checked={notificationSettings.daoNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, daoNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Return Reports</Label>
                  <p className="text-sm text-gray-400">Receive monthly return and performance reports</p>
                </div>
                <Switch
                  checked={notificationSettings.returnReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, returnReports: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-[#2a3441] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-400">Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-300">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-300">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="bg-[#1a2332] border-gray-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="bg-[#1a2332] border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={securityData.twoFactorEnabled}
                  onCheckedChange={(checked) => setSecurityData({ ...securityData, twoFactorEnabled: checked })}
                />
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="bg-[#E57700] hover:bg-[#E57700]/90"
              >
                <Shield className="h-4 w-4 mr-2" />
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-900/20 border-red-700">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-gray-400">Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full md:w-auto">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#2a3441] border-gray-700 text-white mx-4 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-red-400">
                      <LogOut className="h-5 w-5 mr-2" />
                      Confirm Sign Out
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Are you sure you want to sign out of your account?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <Button onClick={handleLogout} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700">
                      {isLoading ? "Signing Out..." : "Yes, Sign Out"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsLogoutOpen(false)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
