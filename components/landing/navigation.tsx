"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Search, UserCheck, Rocket, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState("home")

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center" onClick={() => setActiveNav("home")}>
              <Image src="/images/chainmovelogo.png" alt="ChainMove Logo" width={40} height={40} className="mr-3" />
              <span className="text-2xl font-bold text-[#E57700]">ChainMove</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                <Link
                  href="/marketplace"
                  className={`px-3 py-2 text-sm font-medium transition-colors relative flex items-center ${
                    activeNav === "marketplace"
                      ? "text-[#E57700] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E57700]"
                      : "text-foreground hover:text-[#E57700]"
                  }`}
                  onClick={() => setActiveNav("marketplace")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Marketplace
                </Link>
                <Link
                  href="/about"
                  className={`px-3 py-2 text-sm font-medium transition-colors relative flex items-center ${
                    activeNav === "about"
                      ? "text-[#E57700] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E57700]"
                      : "text-foreground hover:text-[#E57700]"
                  }`}
                  onClick={() => setActiveNav("about")}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  About Us
                </Link>
                <Link
                  href="/announcements"
                  className={`px-3 py-2 text-sm font-medium transition-colors relative flex items-center ${
                    activeNav === "announcements"
                      ? "text-[#E57700] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E57700]"
                      : "text-foreground hover:text-[#E57700]"
                  }`}
                  onClick={() => setActiveNav("announcements")}
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Announcements
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-border hover:border-[#E57700] hover:text-[#E57700] flex items-center"
                asChild
              >
                <Link href="/signin">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button className="bg-[#E57700] hover:bg-[#E57700]/90 shadow-lg flex items-center" asChild>
                <Link href="/auth">
                  <Zap className="h-4 w-4 mr-2" />
                  Get Started
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/marketplace"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-[#E57700] hover:bg-muted rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="h-4 w-4 mr-2" />
                Marketplace
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-[#E57700] hover:bg-muted rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                About Us
              </Link>
              <Link
                href="/announcements"
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-[#E57700] hover:bg-muted rounded-md flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Rocket className="h-4 w-4 mr-2" />
                Announcements
              </Link>
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full mb-2 flex items-center justify-center" asChild>
                  <Link href="/signin">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 flex items-center justify-center" asChild>
                  <Link href="/auth">
                    <Zap className="h-4 w-4 mr-2" />
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
