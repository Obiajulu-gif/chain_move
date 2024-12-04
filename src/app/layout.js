// app/layout.js
import "./globals.css";

import LayoutHandler from "./LayoutHandler";
import WalletProvider from "./WalletProvider";

export const metadata = {
  title: "ChainMove",
  description: "The decentralized transport system on  Blockchain",
  icons: {
    icon: "/images/blockridelogo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <LayoutHandler>{children}</LayoutHandler>
        </WalletProvider>
      </body>
    </html>
  );
}
