import { landingAssets } from "@/components/landing/assets"
import { Container } from "@/components/landing/Container"
import { Github, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const quickLinks = [
  { label: "Home", href: "/investor" },
  { label: "How It Works", href: "/investor#how-it-works" },
  { label: "For Drivers", href: "/driver" },
  { label: "For Investors", href: "/investor" },
  { label: "Cities", href: "#" },
  { label: "FAQs", href: "/investor#faqs" },
]

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-cm-dark py-20 text-cm-text">
      <Container>
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/investor" className="inline-flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20 bg-white/10">
                <Image src={landingAssets.logo} alt="ChainMove logo" fill className="object-contain p-1.5" />
              </div>
              <span className="text-2xl font-semibold leading-none text-cm-text md:text-[30px]">ChainMove</span>
            </Link>

            <div className="mt-7 flex items-center gap-2.5">
              <Link
                href="#"
                aria-label="GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 text-white/85 transition-colors hover:border-white/45 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="X"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 text-white/85 transition-colors hover:border-white/45 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 text-white/85 transition-colors hover:border-white/45 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold leading-none text-cm-text md:text-[22px]">Quick Links</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-white/70 md:text-base">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold leading-none text-cm-text md:text-[22px]">Company</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-white/70 md:text-base">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold leading-none text-cm-text md:text-[22px]">Contact Info</h3>
            <div className="mt-5 space-y-2.5 text-sm text-white/70 md:text-base">
              <p>Email: support@chainmove.ng</p>
              <p>Phone: +234 XXX XXX XXXX</p>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-4 text-sm text-white/45 md:flex-row md:items-center md:justify-between md:text-base">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <p>Copyright 2026 ChainMove</p>
            <Link href="#" className="transition-colors hover:text-white/70">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-white/70">
              Privacy & Cookies policy
            </Link>
          </div>
          <p className="text-white/65">hello@chainmove.xyz</p>
        </div>
      </Container>
    </footer>
  )
}
