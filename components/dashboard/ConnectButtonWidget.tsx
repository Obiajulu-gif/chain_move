"use client";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi'
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export const ConnectButtonWidget = () => {
  const { address } = useAccount();
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  // Store openConnectModal in a ref so it can be used in handleLogout
  const openConnectModalRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const registerWallet = async () => {
      if (address) {
        console.log("account connected", address);
        setStatus("validating...");
        try {
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: address, walletaddress: address, role: "driver" }),
          });

          const data = await res.json();
          console.log("returned data", data);
          if (data.success) {
            console.log("validation successful");
            setStatus("logging you in...");
            // Try login after signup
            try {
              const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletaddress: address }),
              });

              const loginData = await loginRes.json();
              console.log("returned data", loginData);
              if (loginData.token || loginData.success) {
                console.log("login successful");
                setStatus("login complete");
                toast({ title: "Login Successful", description: `Welcome back, ${loginData.user.name}!` });
                // Redirect based on role
                // router.push(`/dashboard/${loginData.user.role}`);
              } else {
                console.log("login failed");
                setStatus("login failed");
              }
            } catch (err) {
              console.log("error", err);
              setStatus("Error Signing In");
            } finally {
              console.log("case closed");
              setStatus("");

            }
          } else {
            console.log("validation failed");
            setStatus("validation failed");
          }
        } catch (err) {
          console.log("error", err);
          setStatus("Error Signing In");
        } finally {
          console.log("case closed");
        }
      } else {
        console.log("account not connected");
      }
    };

    registerWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);



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
        // Store openConnectModal in ref for use in handleLogout
        openConnectModalRef.current = openConnectModal;

        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} type="button" className='w-full max-w-md mx-auto bg-[#E57700] hover:bg-[#E57700]/90 text-white py-3 flex items-center justify-center'>
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button" className='w-full max-w-md mx-auto bg-[#E57700] hover:bg-[#E57700]/90 text-white py-3 flex items-center justify-center'>
                    Wrong network
                  </Button>
                );
              }
              return (
                <button onClick={openAccountModal} className='w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-[#E57700] text-white py-2 px-4 rounded'>
                  {account.displayName}
                  {account.displayBalance
                    ? ` (${account.displayBalance})`
                    : ''}
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
