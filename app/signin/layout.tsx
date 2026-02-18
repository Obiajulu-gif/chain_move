import type { ReactNode } from "react"

import { Providers } from "@/app/Providers"

export default function SignInLayout({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>
}
