import type { ReactNode } from "react"

import { MotionProvider } from "@/components/motion/motion-provider"
import { Providers } from "@/app/Providers"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <MotionProvider>{children}</MotionProvider>
    </Providers>
  )
}
