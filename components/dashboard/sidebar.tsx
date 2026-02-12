"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "../../lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChainMoveLogo } from "@/components/chain-move-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"

import {
  BarChart3,
  Car,
  TrendingUp,
  Users,
  Award,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Vote,
  UserCheck,
  AlertTriangle,
  Wrench,
  FileText,
  Calendar,
  Bell,
  Route,
  Search,
  Coins,
  Wallet,
} from "lucide-react"

interface SidebarProps {
  role: "driver" | "investor" | "admin"
  className?: string
  mobileWidth?: string
}

/* ---------------- Navigation definitions --------------- */
const navigationItems = {
  driver: [
    { name: "My Vehicle", href: "/dashboard/driver", icon: Car },
    { name: "Maintenance", href: "/dashboard/driver/maintenance", icon: Wrench },
    { name: "Loan Terms", href: "/dashboard/driver/loan-terms", icon: FileText },
    { name: "Repayment", href: "/dashboard/driver/repayment", icon: Calendar },
    { name: "Support", href: "/dashboard/driver/support", icon: HelpCircle },
    { name: "Trips", href: "/dashboard/driver/trips", icon: Route },
    { name: "Performance", href: "/dashboard/driver/performance", icon: Award },
    { name: "Notifications", href: "/dashboard/driver/notifications", icon: Bell },
  ],
  investor: [
    { name: "Discover Vehicles", href: "/dashboard/investor", icon: Search },
    { name: "My Investments", href: "/dashboard/investor/investments", icon: TrendingUp },
    { name: "Governance Tokens", href: "/dashboard/investor/tokens", icon: Coins },
    { name: "DAO Zone", href: "/dashboard/investor/dao", icon: Vote },
    { name: "Invest CTA", href: "/dashboard/investor/invest", icon: Wallet },
  ],
  admin: [
    { name: "KYC Management", href: "/dashboard/admin", icon: UserCheck },
    { name: "User Management", href: "/dashboard/admin/users", icon: Users },
    { name: "Driver Onboarding Review", href: "/dashboard/admin/drivers", icon: Users },
    { name: "Vehicle Approval", href: "/dashboard/admin/vehicles", icon: Car },
    { name: "Issue Resolution", href: "/dashboard/admin/issues", icon: AlertTriangle },
    { name: "Governance Moderation", href: "/dashboard/admin/governance", icon: Vote },
    { name: "Reports & Analytics", href: "/dashboard/admin/reports", icon: BarChart3 },
  ],
} as const

/* ---------------- Sidebar component ------------------- */
export function Sidebar({ role, className, mobileWidth = "w-64" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter() // Initialize router
  const { toast } = useToast() // Initialize toast
  const items = navigationItems[role]

 
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
        
        router.push('/signin');
        router.refresh();
      } else {
        toast({ title: "Logout Failed", description: "Something went wrong.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred during logout.", variant: "destructive" });
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card text-foreground hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile with backdrop blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer with improved transitions and touch targets */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-card/95 backdrop-blur-sm border-r border-border/20",
          mobileWidth,
          "transform transition-all duration-300 ease-in-out md:translate-x-0",
          "shadow-lg md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ChainMoveLogo className="h-6 w-auto" />
              <span className="text-xl font-semibold text-foreground">ChainMove</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Role Badge */}
          <div className="px-6 py-2">
            <Badge variant="outline" className="text-xs capitalize">
              {role} dashboard
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <nav className="space-y-1 px-2 py-4">
              {items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      "group relative overflow-hidden",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 shrink-0 transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                    {isActive && (
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </nav>

          {/* Footer actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              href={`/dashboard/${role}/settings`}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <button
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

/* default export for backward-compatibility */
export default Sidebar
