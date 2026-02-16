"use client"

import { ThemeProvider } from "./providers"
import { useSyncExternalStore } from "react"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )

  if (!mounted) {
    return null
  }

  return <ThemeProvider>{children}</ThemeProvider>
}
