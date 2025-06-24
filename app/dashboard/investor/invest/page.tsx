"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Wallet, Shield, FileText, CheckCircle, AlertTriangle, DollarSign, TrendingUp, Clock, Zap } from "lucide-react"
import Image from "next/image"

interface WalletConnection {
  name: string
  icon: string
  connected: boolean
  address?: string
}

const mockWallets: WalletConnection[] = [
  {
    name: "MetaMask",
    icon: "/placeholder.svg?height=40&width=40",
    connected: false,
  },
  {
    name: "WalletConnect",
    icon: "/placeholder.svg?height=40&width=40",
    connected: false,
  },
  {
    name: "Coinbase Wallet",
    icon: "/placeholder.svg?height=40&width=40",
    connected: false,
  },
]

export default function InvestCTAPage() {
  const [wallets, setWallets] = useState<WalletConnection[]>(mockWallets)
  const [connectedWallet, setConnectedWallet] = useState<WalletConnection | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState([1000])
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [step, setStep] = useState<"connect" | "select" | "invest" | "confirm">("connect")

  const connectWallet = (walletName: string) => {
    const updatedWallets = wallets.map((wallet) =>
      wallet.name === walletName
        ? { ...wallet, connected: true, address: "0x1234...5678" }
        : { ...wallet, connected: false, address: undefined },
    )
    setWallets(updatedWallets)
    setConnectedWallet(updatedWallets.find((w) => w.name === walletName) || null)
    setStep("select")
  }

  const disconnectWallet = () => {
    setWallets(mockWallets)
    setConnectedWallet(null)
    setStep("connect")
  }

  const featuredVehicles = [
    {
      id: "1",
      name: "Tesla Model 3 2022",
      image: "/placeholder.svg?height=200&width=300",
      roi: 19.5,
      amount: 35000,
      funded: 85,
      risk: "Low",
      location: "Cape Town, South Africa",
    },
    {
      id: "2",
      name: "Toyota Corolla 2020",
      image: "/placeholder.svg?height=200&width=300",
      roi: 16.5,
      amount: 15000,
      funded: 75,
      risk: "Low",
      location: "Lagos, Nigeria",
    },
    {
      id: "3",
      name: "Honda Civic 2021",
      image: "/placeholder.svg?height=200&width=300",
      roi: 15.2,
      amount: 18000,
      funded: 60,
      risk: "Low",
      location: "Accra, Ghana",
    },
  ]

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <Sidebar 
        role="investor" 
        className="md:w-64 lg:w-72"
        mobileWidth="w-64"
      />

      <div className="md:ml-64 lg:ml-72">
        <Header 
          userName="Marcus" 
          userStatus="Verified Investor"
          className="md:pl-6 lg:pl-8"
        />

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Hero Section */}
          <div className="mb-6 sm:mb-8">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 items-center">
              <div className="relative">
                <Image
                  src="/images/dashboard-hero.png"
                  alt="Invest CTA hero"
                  width={600}
                  height={400}
                  className="rounded-lg sm:rounded-2xl object-cover w-full h-[200px] sm:h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg sm:rounded-2xl" />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Start Investing Today</h1>
                  <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
                    Connect your wallet and sign smart contracts to begin investing in mobility assets. Secure,
                    transparent, and decentralized.
                  </p>
                </div>
                <div className="flex flex-wrap justify-start gap-2 sm:gap-3">
                  <div className="w-2 h-2 bg-[#E57700] rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Process Steps */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card
              className={`${step === "connect" ? "bg-[#E57700]/20 border-[#E57700]" : "bg-[#2a3441]"} border-gray-700`}
            >
              <CardContent className="p-4 text-center">
                <Wallet className={`h-8 w-8 mx-auto mb-2 ${step === "connect" ? "text-[#E57700]" : "text-gray-400"}`} />
                <p className={`text-sm font-medium ${step === "connect" ? "text-[#E57700]" : "text-gray-400"}`}>
                  Connect Wallet
                </p>
              </CardContent>
            </Card>

            <Card
              className={`${step === "select" ? "bg-[#E57700]/20 border-[#E57700]" : "bg-[#2a3441]"} border-gray-700`}
            >
              <CardContent className="p-4 text-center">
                <TrendingUp
                  className={`h-8 w-8 mx-auto mb-2 ${step === "select" ? "text-[#E57700]" : "text-gray-400"}`}
                />
                <p className={`text-sm font-medium ${step === "select" ? "text-[#E57700]" : "text-gray-400"}`}>
                  Select Vehicle
                </p>
              </CardContent>
            </Card>

            <Card
              className={`${step === "invest" ? "bg-[#E57700]/20 border-[#E57700]" : "bg-[#2a3441]"} border-gray-700`}
            >
              <CardContent className="p-4 text-center">
                <DollarSign
                  className={`h-8 w-8 mx-auto mb-2 ${step === "invest" ? "text-[#E57700]" : "text-gray-400"}`}
                />
                <p className={`text-sm font-medium ${step === "invest" ? "text-[#E57700]" : "text-gray-400"}`}>
                  Set Amount
                </p>
              </CardContent>
            </Card>

            <Card
              className={`${step === "confirm" ? "bg-[#E57700]/20 border-[#E57700]" : "bg-[#2a3441]"} border-gray-700`}
            >
              <CardContent className="p-4 text-center">
                <FileText
                  className={`h-8 w-8 mx-auto mb-2 ${step === "confirm" ? "text-[#E57700]" : "text-gray-400"}`}
                />
                <p className={`text-sm font-medium ${step === "confirm" ? "text-[#E57700]" : "text-gray-400"}`}>
                  Sign Contract
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Step 1: Connect Wallet */}
          {step === "connect" && (
            <Card className="bg-[#2a3441] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Your Wallet
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose a wallet to connect and start investing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {wallets.map((wallet) => (
                    <Card
                      key={wallet.name}
                      className="bg-[#1a2332] border-gray-600 hover:border-[#E57700] transition-colors cursor-pointer"
                    >
                      <CardContent className="p-6 text-center">
                        <Image
                          src={wallet.icon || "/placeholder.svg"}
                          alt={wallet.name}
                          width={40}
                          height={40}
                          className="mx-auto mb-3"
                        />
                        <h3 className="text-white font-medium mb-2">{wallet.name}</h3>
                        <Button
                          className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                          onClick={() => connectWallet(wallet.name)}
                        >
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-medium">Secure Connection</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        Your wallet connection is encrypted and secure. We never store your private keys.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Vehicle */}
          {step === "select" && connectedWallet && (
            <div className="space-y-6">
              <Card className="bg-[#2a3441] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      Wallet Connected
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={disconnectWallet}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Disconnect
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {connectedWallet.name} • {connectedWallet.address}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#2a3441] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Select a Vehicle to Invest In</CardTitle>
                  <CardDescription className="text-gray-400">
                    Choose from our featured investment opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredVehicles.map((vehicle) => (
                      <Card
                        key={vehicle.id}
                        className={`${selectedVehicle === vehicle.id ? "border-[#E57700] bg-[#E57700]/10" : "border-gray-600"} bg-[#1a2332] cursor-pointer transition-colors`}
                        onClick={() => setSelectedVehicle(vehicle.id)}
                      >
                        <div className="relative">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={vehicle.name}
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-2 right-2 bg-[#E57700] text-white">{vehicle.roi}% ROI</Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-white font-medium mb-2">{vehicle.name}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Amount</span>
                              <span className="text-white">${vehicle.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Funded</span>
                              <span className="text-white">{vehicle.funded}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Risk</span>
                              <Badge className="bg-green-600 text-white text-xs">{vehicle.risk}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedVehicle && (
                    <div className="mt-6 text-center">
                      <Button
                        className="bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                        onClick={() => setStep("invest")}
                      >
                        Continue with Selected Vehicle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Set Investment Amount */}
          {step === "invest" && selectedVehicle && (
            <div className="space-y-6">
              <Card className="bg-[#2a3441] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Set Investment Amount</CardTitle>
                  <CardDescription className="text-gray-400">Choose how much you want to invest</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">
                        Investment Amount: ${investmentAmount[0].toLocaleString()}
                      </label>
                      <Slider
                        value={investmentAmount}
                        onValueChange={setInvestmentAmount}
                        max={10000}
                        min={100}
                        step={100}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$100</span>
                        <span>$10,000</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-[#1a2332] rounded-lg">
                        <TrendingUp className="h-6 w-6 text-[#E57700] mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Expected ROI</p>
                        <p className="text-lg font-bold text-white">19.5%</p>
                      </div>
                      <div className="text-center p-4 bg-[#1a2332] rounded-lg">
                        <DollarSign className="h-6 w-6 text-[#E57700] mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Monthly Return</p>
                        <p className="text-lg font-bold text-white">
                          ${Math.round((investmentAmount[0] * 0.195) / 12)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-[#1a2332] rounded-lg">
                        <Clock className="h-6 w-6 text-[#E57700] mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Term</p>
                        <p className="text-lg font-bold text-white">60 months</p>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white"
                      onClick={() => setStep("confirm")}
                    >
                      Proceed to Contract Signing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Confirm and Sign Contract */}
          {step === "confirm" && (
            <div className="space-y-6">
              <Card className="bg-[#2a3441] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Smart Contract Review
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Review and sign the investment smart contract
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Contract Summary */}
                    <div className="p-4 bg-[#1a2332] rounded-lg">
                      <h3 className="text-white font-medium mb-3">Investment Summary</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Vehicle</span>
                          <span className="text-white">Tesla Model 3 2022</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Investment Amount</span>
                          <span className="text-white">${investmentAmount[0].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected ROI</span>
                          <span className="text-green-400">19.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Contract Term</span>
                          <span className="text-white">60 months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Monthly Return</span>
                          <span className="text-white">${Math.round((investmentAmount[0] * 0.195) / 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Expected Return</span>
                          <span className="text-green-400">
                            ${Math.round(investmentAmount[0] * 1.195).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Terms */}
                    <div className="p-4 bg-[#1a2332] rounded-lg">
                      <h3 className="text-white font-medium mb-3">Key Contract Terms</h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                          <span>Automated monthly payments via smart contract</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                          <span>Vehicle ownership as collateral</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                          <span>Insurance coverage included</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                          <span>Early repayment option available</span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Warning */}
                    <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="text-yellow-400 font-medium">Investment Risk Notice</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            All investments carry risk. Past performance does not guarantee future results. Please
                            ensure you understand the terms before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sign Contract Button */}
                    <div className="text-center">
                      <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white px-8 py-3 text-lg">
                        <Zap className="h-5 w-5 mr-2" />
                        Sign Smart Contract
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">This will open your wallet to sign the transaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
