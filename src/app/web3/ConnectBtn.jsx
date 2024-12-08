import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaSignOutAlt } from "react-icons/fa";

export const ConnectBtn = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="bg-gray-950 border border-gray-500 hover:bg-gray-800 whitespace-nowrap text-dark px-6 py-2.5 rounded-lg active:scale-95 font-bold"
                    onClick={openConnectModal}
                    type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="bg-gray-950 border border-gray-500 hover:bg-gray-800 whitespace-nowrap text-dark px-6 py-2.5 rounded-lg active:scale-95 font-bold"
                    onClick={openChainModal}
                    type="button">
                    Switch network
                  </button>
                );
              }
              return (
                <div className="flex gap-3">
                  <button
                    className="bg-gray-950 border border-gray-500 hover:bg-gray-800 text-dark px-6 whitespace-nowrap py-2.5 rounded-lg active:scale-95"
                    onClick={openAccountModal}
                    type="button">
                    {account.displayName}
                    <FaSignOutAlt className="inline ml-2" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
