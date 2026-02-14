import type { ReactNode } from "react"
import { Footer } from "@/components/landing/Footer"
import { Navbar } from "@/components/landing/Navbar"

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white text-[#1f1f1f]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
