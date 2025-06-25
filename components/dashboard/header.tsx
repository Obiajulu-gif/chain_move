"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, User } from "lucide-react"
import { WalletConnect } from "@/components/wallet/wallet-connect"
import { cn } from "@/lib/utils";
interface HeaderProps {
  userName: string
  userStatus: string
}

export function Header({ userName, userStatus }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border/20 px-4 md:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between h-12">
        {/* Left side - Dashboard title (hidden on mobile) */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            <p className="text-xs text-muted-foreground truncate">Welcome back, {userName}</p>
          </div>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Status badge - hidden on mobile */}
          <div className="hidden sm:block">
            <Badge
              variant={
                userStatus === "Verified" || userStatus === "Verified Investor" || userStatus === "System Administrator"
                  ? "default"
                  : "secondary"
              }
              className={cn(
                "text-xs font-medium transition-colors",
                userStatus === "Verified" || userStatus === "Verified Investor" || userStatus === "System Administrator"
                  ? "bg-green-600/90 hover:bg-green-600 text-white"
                  : "bg-yellow-600/90 hover:bg-yellow-600 text-white"
              )}
            >
              {userStatus}
            </Badge>
          </div>

          {/* Desktop wallet connect */}
          <div className="hidden md:flex">
            <WalletConnect />
          </div>

          {/* Theme toggle - always visible */}
          <ThemeToggle className="hidden sm:flex" />

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 rounded-full hover:bg-muted/50"
            aria-label="Notifications"
          >
            <Bell className="h-[1.2rem] w-[1.2rem] transition-all" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-background"></span>
          </Button>

          {/* User avatar and name */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{userName}</p>
            </div>
          </div>

          {/* Mobile wallet connect */}
          <div className="md:hidden">
            <WalletConnect variant="outline" size="sm" />
          </div>
        </div>
      </div>
    </header>
  )
}
