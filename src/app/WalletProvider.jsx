"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  goerli,
  polygon,
  optimism,
  arbitrum,
  base,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
	appName: "Chain Move",
	projectId: "24911ae43d4f2f85e9408da2d8c99868",
	chains: [mainnet, goerli, polygon, optimism, arbitrum, base],
	ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
const WalletProvider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
