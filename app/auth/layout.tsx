import type { ReactNode } from "react"

import { Providers } from "@/app/Providers"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>
}
