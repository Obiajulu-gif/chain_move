import { http, createConfig } from "wagmi";
import {
  sepolia,
  iotexTestnet,
  mainnet,
  goerli,
  polygon,
  optimism,
  arbitrum,
  base,
} from "wagmi/chains";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  iopayWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [iopayWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  { appName: "Chain Move", projectId: "24911ae43d4f2f85e9408da2d8c99868" }
);

export const wagmiConfig = createConfig({
  appName: "Chain Move",
  projectId: "24911ae43d4f2f85e9408da2d8c99868",
  chains: [
    sepolia,
    iotexTestnet,
    mainnet,
    goerli,
    polygon,
    optimism,
    arbitrum,
    base,
  ],
  connectors,
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [sepolia.id]: http(),
    [iotexTestnet.id]: http(),
  },
});
