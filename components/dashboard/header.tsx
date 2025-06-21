"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, User } from "lucide-react"
import { WalletConnect } from "@/components/wallet/wallet-connect"

interface HeaderProps {
  userName: string
  userStatus: string
}

export function Header({ userName, userStatus }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome back, {userName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge
            variant={
              userStatus === "Verified" || userStatus === "Verified Investor" || userStatus === "System Administrator"
                ? "default"
                : "secondary"
            }
            className={
              userStatus === "Verified" || userStatus === "Verified Investor" || userStatus === "System Administrator"
                ? "bg-green-600 text-white"
                : "bg-yellow-600 text-white"
            }
          >
            {userStatus}
          </Badge>

          <WalletConnect className="hidden md:flex" />

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#E57700] rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">{userName}</p>
            </div>
          </div>

          {/* Mobile wallet connect */}
          <div className="md:hidden">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
}
