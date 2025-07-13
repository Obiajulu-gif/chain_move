import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PlatformProvider } from "@/contexts/platform-context";
import { Providers } from "./Providers";
import { ClientLayout } from "@/components/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ChainMove - Decentralized Vehicle Financing Platform",
	description:
		"Empowering drivers and investors through blockchain-powered vehicle financing in Africa. ChainMove connects vehicle owners with investors using blockchain technology.",
	generator: "chainmove.xyz",
	metadataBase: new URL("https://chainmove.xyz"),
	keywords: [
		"vehicle financing",
		"blockchain",
		"Africa",
		"investment",
		"drivers",
		"decentralized finance",
		"DeFi",
		"tricycles",
		"carter",
		"transportation",
	],
	authors: [{ name: "Okoye Emmanuel Obiajulu" }],
	creator: "ChainMove",
	publisher: "ChainMove",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://chainmove.xyz",
		title: "ChainMove - Decentralized Vehicle Financing Platform",
		description:
			"Empowering drivers and investors through blockchain-powered vehicle financing in Africa",
		siteName: "ChainMove",
		images: [
			{
				url: "/images/chainmovelogo.png",
				width: 1200,
				height: 630,
				alt: "ChainMove Logo",
			},
		],
	},
	twitter: {
		card: "ChainMove",
		title: "ChainMove - Decentralized Vehicle Financing Platform",
		description:
			"Empowering drivers and investors through blockchain-powered vehicle financing in Africa",
		site: "@ChainMove1",
		creator: "@ChainMove1",
		images: ["/images/chainmovelogo.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/images/chainmovelogo.png", sizes: "16x16", type: "image/png" },
			{ url: "/images/chainmovelogo.png", sizes: "32x32", type: "image/png" },
		],
		apple: [{ url: "/images/chainmovelogo.png" }],
		other: [
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#E57700",
			},
		],
	},
	manifest: "/site.webmanifest",
	applicationName: "ChainMove",
	referrer: "origin-when-cross-origin",
	category: "finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            <PlatformProvider>
              {children}
              <Toaster />
            </PlatformProvider>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
