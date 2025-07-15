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

      {/* Driver Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/driver-hero.jpg" alt="Driver background" fill className="object-cover opacity-10" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 flex items-center">
                <Car className="h-8 w-8 mr-3" />
                For Drivers & Entrepreneurs
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Access vehicle co-ownership opportunities and build your mobility business with shared investment and
                reduced risk. Partner with investors to grow your fleet.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Co-ownership reduces individual investment burden
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="flex items-center">
                    <Coins className="h-4 w-4 mr-2" />
                    Tokenized ownership with transparent profit sharing
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Scale your business with shared capital
                  </span>
                </li>
              </ul>
              <Button
                size="lg"
                className="bg-[#E57700] hover:bg-[#E57700]/90 transform hover:scale-105 transition-all duration-200 flex items-center"
                asChild
              >
                <Link href="/auth?role=driver">
                  <FileText className="h-5 w-5 mr-2" />
                  Start Co-Ownership
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
                <Image
                  src="/images/driver-hero.jpg"
                  alt="Driver with vehicle"
                  width={600}
                  height={400}
                  className="rounded-xl w-full h-64 object-cover"
                />
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground font-medium flex items-center justify-center">
                    <Car className="h-4 w-4 mr-2" />
                    Start Your Co-Ownership Journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Section */}
      <section className="py-20 bg-[#142841] dark:bg-[#0a1420] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/investor-dashboard.jpg"
            alt="Investment background"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-white/10 backdrop-blur rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300">
                <Image
                  src="/images/investor-dashboard.jpg"
                  alt="Investment dashboard"
                  width={600}
                  height={400}
                  className="rounded-xl w-full h-64 object-cover"
                />
                <div className="mt-4 text-center">
                  <p className="text-gray-200 font-medium flex items-center justify-center">
                    <Coins className="h-4 w-4 mr-2" />
                    Tokenized Investment Dashboard
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 flex items-center">
                <DollarSign className="h-8 w-8 mr-3" />
                For Investors & DAOs
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Diversify your portfolio with tokenized mobility assets. Co-own vehicles, participate in DAO governance,
                and earn returns from the growing shared mobility economy.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="flex items-center">
                    <Coins className="h-4 w-4 mr-2" />
                    Fractional ownership through tokenization
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Co-invest with other stakeholders
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Liquid tokenized assets with trading capability
                  </span>
                </li>
              </ul>
              <Button
                size="lg"
                className="bg-[#E57700] hover:bg-[#E57700]/90 transform hover:scale-105 transition-all duration-200 flex items-center"
                asChild
              >
                <Link href="/auth?role=investor">
                  <Coins className="h-5 w-5 mr-2" />
                  Start Co-Investing
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />

      <Footer />
    </div>
  )
}
