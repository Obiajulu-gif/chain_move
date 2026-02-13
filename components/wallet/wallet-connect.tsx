"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Copy, ExternalLink, CheckCircle, AlertCircle, Globe, Shield, Zap, X } from "lucide-react"

interface WalletOption {
  id: string
  name: string
  icon: string
  description: string
  isInstalled: boolean
  isPopular?: boolean
}

interface WalletConnectProps {
  onWalletConnect?: (walletInfo: { address: string; balance: string; network: string }) => void
  className?: string
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect using browser extension",
    isInstalled: typeof window !== "undefined" && !!(window as any).ethereum,
    isPopular: true,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect using mobile wallet",
    isInstalled: true,
    isPopular: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Connect using Coinbase",
    isInstalled: typeof window !== "undefined" && !!(window as any).coinbaseWalletExtension,
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Connect using Trust Wallet",
    isInstalled: true,
  },
]

export function WalletConnect({ onWalletConnect, className }: WalletConnectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<{
    address: string
    balance: string
    network: string
    walletName: string
  } | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is already connected
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      setConnectedWallet(JSON.parse(savedWallet))
    }
  }, [])

  const connectWallet = async (walletId: string) => {
    setIsConnecting(true)
    setSelectedWallet(walletId)

    try {
      // Simulate wallet connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockWalletInfo = {
        address: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
        balance: "2.45 ETH",
        network: "Lisk Sepolia Testnet",
        walletName: walletOptions.find((w) => w.id === walletId)?.name || "Unknown",
      }

      setConnectedWallet(mockWalletInfo)
      localStorage.setItem("connectedWallet", JSON.stringify(mockWalletInfo))
      setIsOpen(false)
      onWalletConnect?.(mockWalletInfo)

      toast({
        title: "Wallet Connected Successfully",
        description: `Connected to ${mockWalletInfo.walletName}`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
      setSelectedWallet(null)
    }
  }

  const disconnectWallet = () => {
    setConnectedWallet(null)
    localStorage.removeItem("connectedWallet")
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    })
  }

  const copyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet.address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (connectedWallet) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge className="bg-green-600 text-white flex items-center space-x-1 px-3 py-1">
          <CheckCircle className="h-3 w-3" />
          <span className="hidden md:inline">Connected</span>
        </Badge>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">{formatAddress(connectedWallet.address)}</span>
              <span className="md:hidden">Wallet</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center text-foreground">
                <Wallet className="h-5 w-5 mr-2 text-[#E57700]" />
                Wallet Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Card className="bg-muted border-border">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Wallet</span>
                      <span className="font-medium text-foreground">{connectedWallet.walletName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Network</span>
                      <Badge className="bg-[#E57700] text-white">{connectedWallet.network}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="font-bold text-foreground">{connectedWallet.balance}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Address</span>
                      <div className="flex items-center space-x-2 p-2 bg-background rounded border">
                        <span className="font-mono text-sm text-foreground flex-1 truncate">
                          {connectedWallet.address}
                        </span>
                        <Button size="sm" variant="ghost" onClick={copyAddress}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-[#E57700] hover:bg-[#E57700]/90 text-white ${className}`}>
          <Wallet className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Connect Wallet</span>
          <span className="md:hidden">Wallet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border text-foreground max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center text-foreground">
            <Wallet className="h-5 w-5 mr-2 text-[#E57700]" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your preferred wallet to connect to ChainMove
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <Card
              key={wallet.id}
              className={`cursor-pointer transition-all hover:border-[#E57700] ${
                selectedWallet === wallet.id && isConnecting
                  ? "border-[#E57700] bg-[#E57700]/5"
                  : "bg-card border-border hover:bg-muted/50"
              }`}
              onClick={() => !isConnecting && connectWallet(wallet.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{wallet.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">{wallet.name}</h3>
                        {wallet.isPopular && <Badge className="bg-[#E57700] text-white text-xs">Popular</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{wallet.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!wallet.isInstalled && <AlertCircle className="h-4 w-4 text-yellow-500" title="Not installed" />}
                    {selectedWallet === wallet.id && isConnecting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E57700] border-t-transparent" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-start space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mt-0.5 text-[#E57700]" />
            <div>
              <p className="font-medium text-foreground">Secure Connection</p>
              <p>Your wallet connection is secured by blockchain technology and encrypted protocols.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <Zap className="h-6 w-6 text-[#E57700] mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Fast</p>
          </div>
          <div className="text-center">
            <Shield className="h-6 w-6 text-[#E57700] mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
          <div className="text-center">
            <Globe className="h-6 w-6 text-[#E57700] mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Decentralized</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
