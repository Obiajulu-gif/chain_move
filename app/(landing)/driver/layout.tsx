import type { ReactNode } from "react"
import { Footer } from "@/components/landing/Footer"
import { Navbar } from "@/components/landing/Navbar"

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
