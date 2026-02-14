import type { ReactNode } from "react"
import { Footer } from "@/components/landing/Footer"
import { Navbar } from "@/components/landing/Navbar"

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar variant="dark" />
      <main>{children}</main>
      <Footer />
    </>
  )
}
