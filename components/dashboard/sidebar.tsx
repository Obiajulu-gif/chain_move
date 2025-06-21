"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChainMoveLogo } from "@/components/chain-move-logo"
import { ThemeToggle } from "@/components/theme-toggle"

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
    { name: "Driver Onboarding Review", href: "/dashboard/admin/drivers", icon: Users },
    { name: "Vehicle Approval", href: "/dashboard/admin/vehicles", icon: Car },
    { name: "Issue Resolution", href: "/dashboard/admin/issues", icon: AlertTriangle },
    { name: "Governance Moderation", href: "/dashboard/admin/governance", icon: Vote },
    { name: "Reports & Analytics", href: "/dashboard/admin/reports", icon: BarChart3 },
  ],
} as const

/* ---------------- Sidebar component ------------------- */
export function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const items = navigationItems[role]

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

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
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
            {items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative",
                    isActive ? "bg-[#E57700] text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-[#E57700] text-white text-xs px-2 py-1">{item.badge}</Badge>
                  )}
                </Link>
              )
            })}
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
              onClick={() => {
                // simple client-side logout redirect; replace with real action if needed
                window.location.href = "/signin"
              }}
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
