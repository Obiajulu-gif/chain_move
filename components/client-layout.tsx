"use client"

import { ThemeProvider } from "./providers"
import { useEffect, useState } from "react"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <ThemeProvider>{children}</ThemeProvider>
}
