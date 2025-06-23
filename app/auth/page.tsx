"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wallet, Mail, Car, TrendingUp, ArrowLeft, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")
  const [selectedRole, setSelectedRole] = useState<"driver" | "investor" | null>(
    (roleParam as "driver" | "investor") || null,
  )

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#142841] via-[#1e3a5f] to-[#3A7CA5] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center text-white hover:text-[#E57700] mb-8 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/chainmovelogo.png" alt="ChainMove Logo" width={60} height={60} className="mr-4" />
              <h1 className="text-5xl font-bold text-white">Join ChainMove</h1>
            </div>
            <p className="text-2xl text-gray-200 max-w-2xl mx-auto">
              Choose your path to revolutionize mobility financing through blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card
              className="cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 hover:border-[#E57700] transform hover:scale-105 bg-white/95 backdrop-blur"
              onClick={() => setSelectedRole("driver")}
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E57700]/20 to-transparent"></div>
                <CardHeader className="text-center pb-6 relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#E57700] to-[#ff8c00] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Car className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-[#142841] mb-3">I'm a Driver</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Get financing for your vehicle and build your mobility business with blockchain transparency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">Access transparent vehicle financing</span>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">No traditional credit history required</span>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">Build financial credibility on-chain</span>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">Automated smart contract payments</span>
                    </div>
                  </div>
                  <Button className="w-full mt-8 bg-[#E57700] hover:bg-[#E57700]/90 text-white py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Car className="h-5 w-5 mr-2" />
                    Continue as Driver
                  </Button>
                </CardContent>
              </div>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-2xl transition-all duration-500 border-2 hover:border-[#E57700] transform hover:scale-105 bg-white/95 backdrop-blur"
              onClick={() => setSelectedRole("investor")}
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E57700]/20 to-transparent"></div>
                <CardHeader className="text-center pb-6 relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#E57700] to-[#ff8c00] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <TrendingUp className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-[#142841] mb-3">I'm an Investor</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Fund mobility assets, earn returns, and participate in DAO governance decisions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">Earn 12-20% APY on vehicle investments</span>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">Fractional ownership through tokenization</span>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">Participate in DAO governance</span>
                    </div>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-[#E57700] rounded-full mr-4"></div>
                      <span className="text-gray-700">Transparent blockchain-based returns</span>
                    </div>
                  </div>
                  <Button className="w-full mt-8 bg-[#E57700] hover:bg-[#E57700]/90 text-white py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Continue as Investor
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-200 text-lg mb-6">
              Powered by blockchain technology for maximum transparency and security
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center text-gray-300">
                <Shield className="h-6 w-6 mr-2 text-[#E57700]" />
                <span>Secure & Transparent</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Zap className="h-6 w-6 mr-2 text-[#E57700]" />
                <span>Smart Contracts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#142841] via-[#1e3a5f] to-[#3A7CA5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-white hover:text-[#E57700] mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Image src="/images/chainmovelogo.png" alt="ChainMove Logo" width={48} height={48} className="mr-3" />
            <h1 className="text-3xl font-bold text-white">ChainMove</h1>
          </div>
          <Badge className="bg-[#E57700] text-white mb-4 px-4 py-2 text-sm">
            {selectedRole === "driver" ? (
              <>
                <Car className="h-4 w-4 mr-2" />
                Driver Registration
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Investor Registration
              </>
            )}
          </Badge>
          <Button
            variant="ghost"
            onClick={() => setSelectedRole(null)}
            className="text-gray-300 hover:text-white text-sm"
          >
            Change Role
          </Button>
        </div>

        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#142841]">
              {selectedRole === "driver" ? "Join as Driver" : "Join as Investor"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {selectedRole === "driver"
                ? "Get started with vehicle financing on the blockchain"
                : "Start investing in mobility assets and earn returns"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="wallet" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="wallet" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-4">
                <div className="space-y-4">
                  <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white py-3 flex items-center justify-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect MetaMask
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 py-3 flex items-center justify-center"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect WalletConnect
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 py-3 flex items-center justify-center"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect Coinbase Wallet
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="border-gray-300 focus:border-[#E57700] focus:ring-[#E57700]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      className="border-gray-300 focus:border-[#E57700] focus:ring-[#E57700]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="border-gray-300 focus:border-[#E57700] focus:ring-[#E57700]"
                    />
                  </div>
                  <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white py-3">Create Account</Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="#" className="text-[#E57700] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-[#E57700]" />
                <span>Your data is secured with enterprise-grade encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
