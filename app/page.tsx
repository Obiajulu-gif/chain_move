"use client"

import {
  Target,
  Shield,
  Users,
  Award,
  Car,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Search,
  CheckCircle,
  FileText,
  Coins,
  Share2,
  Layers,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import Marquee from "@/components/ui/marquee"
import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { CoOwnershipSection } from "@/components/landing/co-ownership-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { Footer } from "@/components/landing/footer"
import { InvestmentOpportunities } from "@/components/landing/investment-opportunities"
import { FAQSection } from "@/components/landing/faq-section"
import InteractiveSections from "@/components/landing/interactive-sections"

const partners = [
  { name: "Lisk", logo: "/partners/lisk.png" },
  { name: "AyaHq", logo: "/partners/ayahq.png" },
  { name: "BlockchainUNN", logo: "/partners/BlockchainUNN.png" },
  { name: "GIDA", logo: "/partners/GIDA.jpeg" },
  { name: "Aave", logo: "/partners/aave.webp" },
  { name: "Chainlink", logo: "/partners/chainlink.webp" },
  { name: "Polygon", logo: "/partners/polygon.webp" },
  { name: "MetaMask", logo: "/partners/metamask.png" },
  { name: "Uniswap", logo: "/partners/uniswap.webp" },
]

const features = [
  {
    icon: Coins,
    title: "Fractional Ownership",
    description: "Own a fraction of vehicles through blockchain tokenization and smart contracts",
    image: "/images/blockchain-tech.jpg",
  },
  {
    icon: Share2,
    title: "Co-Investment Platform",
    description: "Pool resources with other investors to co-own high-value mobility assets",
    image: "/images/driver-hero.jpg",
  },
  {
    icon: Layers,
    title: "Asset Tokenization",
    description: "Convert physical vehicles into tradeable digital tokens on the blockchain",
    image: "/images/about-mission.jpg",
  },
  {
    icon: BarChart3,
    title: "Shared Returns",
    description: "Earn proportional returns from vehicle usage and appreciation",
    image: "/images/investor-dashboard.jpg",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <StatsSection />

      <CoOwnershipSection />

      <InvestmentOpportunities />

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 mr-3" />
              How ChainMove Co-Ownership Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A simple, transparent process that enables fractional vehicle ownership through blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center rounded-3xl shadow-xl hover:shadow-2xl border-0 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-[#181C23]">
              <div className="relative h-48">
                <Image src="/images/driver-hero.jpg" alt="Choose investment" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#E57700]/80 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse">
                    <Search className="h-8 w-8 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center">
                  <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-2">
                    1
                  </span>
                  Discover Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">
                  Browse tokenized vehicles available for co-ownership. View details, returns, and current co-owners for each asset.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-3xl shadow-xl hover:shadow-2xl border-0 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-[#181C23]">
              <div className="relative h-48">
                <Image src="/images/blockchain-tech.jpg" alt="Purchase tokens" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#E57700]/80 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse delay-200">
                    <Coins className="h-8 w-8 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center">
                  <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-2">
                    2
                  </span>
                  Purchase Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">
                  Buy vehicle tokens to become a co-owner. Start with any amount and build your mobility asset
                  portfolio.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-3xl shadow-xl hover:shadow-2xl border-0 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden bg-[#181C23]">
              <div className="relative h-48">
                <Image src="/images/investor-dashboard.jpg" alt="Earn returns" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#E57700]/80 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse delay-400">
                    <TrendingUp className="h-8 w-8 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center">
                  <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-2">
                    3
                  </span>
                  Earn & Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-300">
                  Receive proportional returns from vehicle operations and trade tokens on our marketplace for
                  liquidity.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 mr-3" />
              Why Choose ChainMove Co-Ownership
            </h2>
            <p className="text-xl text-muted-foreground">Revolutionary features that redefine vehicle investment</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col rounded-2xl border border-gray-700 bg-[#181C23] shadow-lg overflow-hidden transition-all duration-300 hover:border-[#E57700] group"
              >
                {/* Top image with overlay and icon */}
                <div className="relative h-36">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                {/* Bottom content */}
                <div className="flex-1 flex flex-col justify-center items-center px-6 py-6 bg-[#181C23]">
                  <div className="text-lg font-bold text-white mb-2 text-center">{feature.title}</div>
                  <div className="text-gray-300 text-base text-center">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Trusted Partners Section - KEEPING FROM GITHUB PULL */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Award className="h-6 w-6 mr-3" />
              Trusted Partners
            </h2>
            <p className="text-muted-foreground">Powered by leading blockchain and fintech partners</p>
          </div>

          <Marquee pauseOnHover className="[--duration:30s]">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center mx-8 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={140}
                  height={50}
                  className="transition-transform duration-300 hover:scale-105 object-contain"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Interactive Sections - Drivers & Investors */}
      <InteractiveSections />

      <FAQSection />

      <Footer />
    </div>
  )
}
