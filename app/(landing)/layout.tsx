import type { ReactNode } from "react"
import { LandingScrollBehavior } from "@/components/landing/landing-scroll-behavior"
import { MotionProvider } from "@/components/motion/motion-provider"

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <LandingScrollBehavior />
      <div className="bg-white text-[#1f1f1f]">{children}</div>
    </MotionProvider>
  )
}
