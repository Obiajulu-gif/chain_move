"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, ChevronLeft, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUserDisplayName, useAuth } from "@/hooks/use-auth"
import { usePathname, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const ConnectButtonWidget = dynamic(
  () => import("./ConnectButtonWidget").then((mod) => mod.ConnectButtonWidget),
  { ssr: false },
)

interface HeaderProps {
  userName?: string
  userStatus?: string
  notificationCount?: number
  showBackButton?: boolean
  className?: string
}

const STATUS_VARIANTS = new Set(["verified", "verified investor", "verified driver", "system administrator"])

function inferRoleLabel(pathname: string, userStatus: string, role?: string) {
  if (role === "investor") return "Investor"
  if (role === "driver") return "Driver"
  if (role === "admin") return "Admin"

  const normalizedStatus = userStatus.toLowerCase()
  if (normalizedStatus.includes("investor")) return "Investor"
  if (normalizedStatus.includes("driver")) return "Driver"
  if (normalizedStatus.includes("admin")) return "Admin"

  if (pathname.includes("/dashboard/investor")) return "Investor"
  if (pathname.includes("/dashboard/driver")) return "Driver"
  if (pathname.includes("/dashboard/admin")) return "Admin"

  return "User"
}

export function Header({
  userStatus = "Active",
  notificationCount = 0,
  showBackButton = false,
  className,
}: HeaderProps) {
  const { user: authUser } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const roleLabel = inferRoleLabel(pathname, userStatus, authUser?.role)
  const resolvedUserName = getUserDisplayName(authUser, roleLabel)

  const normalizedStatus = userStatus.toLowerCase()
  const isVerified = STATUS_VARIANTS.has(normalizedStatus)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur md:px-6",
        className,
      )}
    >
      <div className="flex h-12 items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          {showBackButton ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : null}

          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            <p className="truncate text-xs text-muted-foreground">Welcome back, {resolvedUserName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <Badge
              variant={isVerified ? "default" : "secondary"}
              className={cn(
                "text-xs font-medium",
                isVerified ? "bg-green-600 text-white hover:bg-green-600" : "bg-yellow-600 text-white hover:bg-yellow-600",
              )}
            >
              {userStatus}
            </Badge>
          </div>

          <ThemeToggle className="hidden sm:inline-flex" />

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {notificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            ) : null}
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden lg:block">
              <p className="max-w-[140px] truncate text-sm font-medium text-foreground">{resolvedUserName}</p>
            </div>
          </div>

          <div>
            <ConnectButtonWidget />
          </div>
        </div>
      </div>
    </header>
  )
}
