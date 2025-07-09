import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PlatformProvider } from "@/contexts/platform-context"
import { Providers } from "./Providers"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChainMove - Decentralized Vehicle Financing Platform",
  description: "Empowering drivers and investors through blockchain-powered vehicle financing",
  generator: 'chainmove.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <PlatformProvider>
              {children}
              <Toaster />
            </PlatformProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
