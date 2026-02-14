"use client"

import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "/investor", label: "Investor" },
  { href: "/driver", label: "Driver" },
  { href: "/about", label: "About Us" },
]

interface NavbarProps {
  variant?: "default" | "dark"
}

export function Navbar({ variant = "default" }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const darkVariant = variant === "dark"

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        darkVariant
          ? "border-b border-white/10 bg-cm-dark/95 backdrop-blur-xl"
          : isScrolled || isOpen
            ? "border-b border-white/10 bg-cm-dark/85 backdrop-blur-xl"
            : "bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-24 items-center justify-between">
          <Link href="/investor" className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/10">
              <Image
                src={landingAssets.logo}
                alt="ChainMove logo"
                fill
                className="object-contain p-1.5"
                sizes="36px"
                priority
              />
            </div>
            <span className="text-xl font-semibold leading-none text-cm-text sm:text-[26px]">ChainMove</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-[15px] font-medium leading-none transition-colors",
                    active ? "text-cm-orange" : "text-white/85 hover:text-cm-text",
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/signin"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-transparent px-5 py-2.5 text-sm font-medium text-cm-text transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/auth"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-cm-orange px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#de6805]"
            >
              Get Started!
            </Link>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <Container>
          <div className="mb-5 rounded-3xl border border-white/10 bg-cm-dark-2 p-4 md:hidden">
            <nav className="grid gap-2">
              {navLinks.map((link) => {
                const active = pathname === link.href

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium",
                      active ? "bg-white/10 text-cm-orange" : "text-cm-text/90",
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-3 grid gap-2">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/20 px-4 py-2.5 text-center text-sm font-medium text-cm-text"
              >
                Log in
              </Link>
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-cm-orange px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Get Started!
              </Link>
            </div>
          </div>
        </Container>
      ) : null}
    </header>
  )
}
