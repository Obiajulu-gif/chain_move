import type { ReactNode } from "react"

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <div className="bg-white text-[#1f1f1f]">{children}</div>
}
