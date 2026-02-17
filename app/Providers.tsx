"use client"

import type { FC, ReactNode } from "react"
import { PrivyProvider } from "@privy-io/react-auth"

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <PrivyProvider
      appId={privyAppId ?? ""}
      config={{
        loginMethods: ["email", "sms"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "all-users",
          },
          showWalletUIs: true,
        },
        appearance: {
          theme: "light",
          accentColor: "#F2780E",
          logo: "/images/chainmovelogo.png",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
