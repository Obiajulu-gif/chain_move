import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PlatformProvider } from "@/contexts/platform-context"


const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "ChainMove",
    template: "ChainMove | %s",
  },
  description:
    "ChainMove is a blockchain-powered mobility financing platform connecting disciplined investors with verified drivers through structured vehicle ownership.",
  openGraph: {
    title: "ChainMove",
    description:
      "ChainMove is a blockchain-powered mobility financing platform connecting disciplined investors with verified drivers through structured vehicle ownership.",
    siteName: "ChainMove",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainMove",
    description:
      "ChainMove is a blockchain-powered mobility financing platform connecting disciplined investors with verified drivers through structured vehicle ownership.",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ibmPlexSans.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <PlatformProvider>
            {children}
            <Toaster />
          </PlatformProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
