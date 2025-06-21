"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Car, DollarSign, Rocket, Play, Users, Coins, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#142841] via-[#1e3a5f] to-[#3A7CA5] dark:from-[#0a1420] dark:via-[#0f1d30] dark:to-[#1a2d45] text-white py-20 lg:py-32 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0">
        <Image src="/images/hero-bg.jpg" alt="Hero background" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-[#142841]/80 via-[#1e3a5f]/80 to-[#3A7CA5]/80 dark:from-[#0a1420]/90 dark:via-[#0f1d30]/90 dark:to-[#1a2d45]/90"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E57700]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <Badge className="mb-6 bg-[#E57700] hover:bg-[#E57700]/90 animate-bounce flex items-center w-fit">
              <Rocket className="h-4 w-4 mr-2" />
              Now Live on Lisk Blockchain
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block animate-slide-in-left">Co-Own Vehicles</span>
              <span className="block text-[#E57700] animate-slide-in-right delay-300">Tokenize Mobility</span>
              <span className="block text-2xl lg:text-3xl font-normal text-gray-200 mt-4 animate-fade-in delay-600 flex items-center">
                <Coins className="h-8 w-8 mr-3" />
                Fractional Vehicle Ownership
              </span>
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed animate-fade-in-up delay-700">
              Revolutionary blockchain platform enabling fractional vehicle ownership and mobility asset tokenization.
              Co-invest in vehicles, earn from shared mobility, and participate in the future of transportation finance.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-800">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-lg p-3">
                <Users className="h-5 w-5 text-[#E57700]" />
                <span className="text-sm font-medium">Fractional Ownership</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-lg p-3">
                <Coins className="h-5 w-5 text-[#E57700]" />
                <span className="text-sm font-medium">Asset Tokenization</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-lg p-3">
                <Shield className="h-5 w-5 text-[#E57700]" />
                <span className="text-sm font-medium">Blockchain Security</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-900">
              <Button
                size="lg"
                className="bg-[#E57700] hover:bg-[#E57700]/90 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center"
                asChild
              >
                <Link href="/auth?role=driver">
                  <Car className="h-5 w-5 mr-2" />
                  Co-Own a Vehicle
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white hover:bg-white hover:text-[#142841] transform hover:scale-105 transition-all duration-200 flex items-center"
                asChild
              >
                <Link href="/auth?role=investor">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Invest in Mobility
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in-right delay-500">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
              <Image
                src="/images/dashboard-hero.png"
                alt="ChainMove Platform"
                width={600}
                height={400}
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="flex items-center justify-center mt-4">
                <Button variant="ghost" className="text-white hover:bg-white/20 flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <p className="text-center mt-2 text-gray-200 flex items-center justify-center">
                <Rocket className="h-4 w-4 mr-2" />
                Empowering Shared Mobility Through Blockchain
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
