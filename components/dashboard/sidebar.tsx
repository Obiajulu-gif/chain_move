"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLogout } from "@privy-io/react-auth"
import type { LucideIcon } from "lucide-react"
import {
  Bell,
  Car,
  ChevronDown,
  Coins,
  Compass,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldAlert,
  Settings,
  UserCheck,
  Users,
  Vote,
  Wallet,
  Wrench,
  X,
} from "lucide-react"

import { ChainMoveLogo } from "@/components/chain-move-logo"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type DashboardRole = "driver" | "investor" | "admin"

interface SidebarItemConfig {
  label: string
  href: string
  icon: LucideIcon
}

interface SidebarSectionConfig {
  id: string
  label: string
  items: SidebarItemConfig[]
  defaultExpanded?: boolean
}

interface SidebarProps {
  role: DashboardRole
  className?: string
  mobileWidth?: string
}

interface SidebarItemProps {
  item: SidebarItemConfig
  isActive: boolean
  onNavigate: () => void
}

interface SidebarSectionProps {
  section: SidebarSectionConfig
  pathname: string
  onNavigate: () => void
}

const SIDEBAR_SECTIONS: Record<DashboardRole, SidebarSectionConfig[]> = {
  investor: [
    {
      id: "investor-overview",
      label: "Overview",
      defaultExpanded: true,
      items: [{ label: "Dashboard", href: "/dashboard/investor", icon: LayoutDashboard }],
    },
    {
      id: "investor-investments",
      label: "Investments",
      defaultExpanded: true,
      items: [
        { label: "Portfolio", href: "/dashboard/investor/investments", icon: Layers },
        { label: "Explore Opportunities", href: "/dashboard/investor/opportunities", icon: Compass },
        { label: "DAO Zone", href: "/dashboard/investor/dao", icon: Vote },
      ],
    },
    {
      id: "investor-finances",
      label: "Finances",
      defaultExpanded: true,
      items: [
        { label: "My Wallet", href: "/dashboard/investor/wallet", icon: Wallet },
        { label: "Governance Tokens", href: "/dashboard/investor/tokens", icon: Coins },
      ],
    },
    {
      id: "investor-account",
      label: "Account",
      defaultExpanded: true,
      items: [{ label: "Settings", href: "/dashboard/investor/settings", icon: Settings }],
    },
  ],
  driver: [
    {
      id: "driver-overview",
      label: "Overview",
      defaultExpanded: true,
      items: [{ label: "Dashboard", href: "/dashboard/driver", icon: LayoutDashboard }],
    },
    {
      id: "driver-operations",
      label: "Operations",
      defaultExpanded: true,
      items: [
        { label: "KYC Verification", href: "/dashboard/driver/kyc", icon: UserCheck },
        { label: "Maintenance", href: "/dashboard/driver/maintenance", icon: Wrench },
        { label: "Loan Terms", href: "/dashboard/driver/loan-terms", icon: FileText },
        { label: "Repayment", href: "/dashboard/driver/repayment", icon: Wallet },
      ],
    },
    {
      id: "driver-account",
      label: "Account",
      defaultExpanded: true,
      items: [
        { label: "Notifications", href: "/dashboard/driver/notifications", icon: Bell },
        { label: "Documents", href: "/dashboard/driver/documents", icon: FileText },
      ],
    },
  ],
  admin: [
    {
      id: "admin-overview",
      label: "Overview",
      defaultExpanded: true,
      items: [{ label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard }],
    },
    {
      id: "admin-management",
      label: "Management",
      defaultExpanded: true,
      items: [
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Drivers", href: "/dashboard/admin/drivers", icon: Car },
        { label: "Vehicles", href: "/dashboard/admin/vehicles", icon: Car },
      ],
    },
    {
      id: "admin-governance",
      label: "Governance",
      defaultExpanded: true,
      items: [
        { label: "Reports", href: "/dashboard/admin/reports", icon: FileText },
        { label: "Issues", href: "/dashboard/admin/issues", icon: ShieldAlert },
        { label: "Governance", href: "/dashboard/admin/governance", icon: Vote },
      ],
    },
  ],
}

function isActivePath(pathname: string, href: string) {
  const isRootDashboard =
    href === "/dashboard/investor" || href === "/dashboard/driver" || href === "/dashboard/admin"

  if (isRootDashboard) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarItem({ item, isActive, onNavigate }: SidebarItemProps) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
      <span className="truncate">{item.label}</span>
      {isActive ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden="true" /> : null}
    </Link>
  )
}

export function SidebarSection({ section, pathname, onNavigate }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded ?? true)

  return (
    <section className="space-y-1.5">
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        className="flex w-full items-center justify-between px-2 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{section.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isExpanded ? "rotate-0" : "-rotate-90")} />
      </button>

      {isExpanded ? (
        <div className="space-y-1">
          {section.items.map((item) => (
            <SidebarItem key={item.href} item={item} isActive={isActivePath(pathname, item.href)} onNavigate={onNavigate} />
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function Sidebar({ role, className, mobileWidth = "w-64" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { logout } = useLogout()

  const sections = useMemo(() => SIDEBAR_SECTIONS[role], [role])

  const closeMobileSidebar = () => setIsOpen(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      await logout().catch(() => undefined)

      toast({
        title: "Logged out",
        description: "Your session has ended successfully.",
      })

      router.push("/signin")
      router.refresh()
    } catch {
      toast({
        title: "Logout failed",
        description: "Something went wrong while logging out.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-3 top-3 z-50 border border-border bg-background text-foreground shadow-sm hover:bg-muted md:hidden"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-[#0D1422]/35 backdrop-blur-[1px] md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform border-r border-border bg-[#F8FAFD] transition-transform duration-300 ease-out dark:bg-[#0B1220]",
          mobileWidth,
          "md:w-64 md:translate-x-0 lg:w-72",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[60px] items-center border-b border-border px-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <ChainMoveLogo width={24} height={24} className="h-6 w-6" />
              <span className="text-xl font-semibold leading-none text-foreground">ChainMove</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
            {sections.map((section) => (
              <SidebarSection key={section.id} section={section} pathname={pathname} onNavigate={closeMobileSidebar} />
            ))}
          </nav>

          <div className="border-t border-border px-4 py-3">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
