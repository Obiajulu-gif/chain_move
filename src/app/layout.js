// app/layout.js
import "./globals.css";
import { Montserrat } from "next/font/google";
import LayoutHandler from "./LayoutHandler";
import WalletProvider from "./WalletProvider";

export const metadata = {
  title: "ChainMove",
  description: "The decentralized transport system on  Blockchain",
  icons: {
    icon: "/images/blockridelogo.svg",
  },
};
const montserrat = Montserrat({
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-montserrat">
        <WalletProvider>
          <LayoutHandler>{children}</LayoutHandler>
        </WalletProvider>
      </body>
    </html>
  );
}
