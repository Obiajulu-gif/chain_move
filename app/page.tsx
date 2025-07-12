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
  HelpCircle,
  Coins,
  Share2,
  Layers,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import Image from "next/image"
import Marquee from "@/components/ui/marquee"
import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { Footer } from "@/components/landing/footer"

const featuredVehicles = [
  {
    id: 1,
    name: "Toyota Corolla 2020",
    type: "Sedan",
    price: "$15,000",
    roi: "12%",
    funded: 75,
    coOwners: 12,
    tokenPrice: "$125",
    image: "/images/vehicle-1.jpg",
  },
  {
    id: 2,
    name: "Honda Civic 2021",
    type: "Sedan",
    price: "$18,000",
    roi: "14%",
    funded: 60,
    coOwners: 8,
    tokenPrice: "$225",
    image: "/images/vehicle-2.jpg",
  },
  {
    id: 3,
    name: "Ford Transit 2019",
    type: "Van",
    price: "$25,000",
    roi: "16%",
    funded: 40,
    coOwners: 15,
    tokenPrice: "$167",
    image: "/images/vehicle-3.jpg",
  },
  {
    id: 4,
    name: "Yamaha MT-07",
    type: "Motorcycle",
    price: "$8,000",
    roi: "18%",
    funded: 90,
    coOwners: 20,
    tokenPrice: "$40",
    image: "/images/vehicle-4.jpg",
  },
]

const partners = [
	{ name: "Lisk", logo: "/partners/lisk.png" },
	{ name: "AyaHq", logo: "/partners/ayahq.png" },
	{ name: "BlockchainUNN", logo: "/partners/BlockchainUNN.png" },
	{ name: "GIDA", logo: "/partners/GIDA.jpeg" },
];

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

const coOwnershipBenefits = [
  {
    icon: Users,
    title: "Shared Investment Risk",
    description:
      "Distribute investment risk across multiple co-owners, reducing individual exposure while maintaining earning potential.",
  },
  {
    icon: Coins,
    title: "Tokenized Assets",
    description:
      "Each vehicle is tokenized on the blockchain, allowing for transparent ownership tracking and easy transfer of ownership stakes.",
  },
  {
    icon: TrendingUp,
    title: "Proportional Returns",
    description:
      "Earn returns proportional to your ownership stake from vehicle usage, rentals, and asset appreciation.",
  },
  {
    icon: Shield,
    title: "Smart Contract Security",
    description:
      "All co-ownership agreements are secured by smart contracts, ensuring transparent and automated profit distribution.",
  },
]

const faqs = [
  {
    question: "How does vehicle co-ownership work on ChainMove?",
    answer:
      "Vehicle co-ownership allows multiple investors to jointly own a vehicle through blockchain tokenization. Each vehicle is divided into tokens representing ownership stakes. Co-owners earn proportional returns from vehicle usage and can trade their tokens on our marketplace.",
  },
  {
    question: "What is asset tokenization and how does it benefit me?",
    answer:
      "Asset tokenization converts physical vehicles into digital tokens on the blockchain. This enables fractional ownership, easier trading, transparent ownership records, and automated profit distribution through smart contracts. You can own a piece of multiple vehicles instead of buying one entirely.",
  },
  {
    question: "How are returns distributed among co-owners?",
    answer:
      "Returns are automatically distributed through smart contracts based on your ownership percentage. If you own 10% of a vehicle's tokens, you receive 10% of the net income from that vehicle's operations, including ride-sharing, rentals, and any asset appreciation.",
  },
  {
    question: "Can I sell my vehicle tokens?",
    answer:
      "Yes! Vehicle tokens can be traded on our marketplace, providing liquidity for your investment. You can sell your entire stake or partial ownership to other investors, making it easy to adjust your portfolio or exit investments.",
  },
  {
    question: "What types of vehicles can be co-owned and tokenized?",
    answer:
      "We support tokenization of cars, motorcycles, trucks, vans, and commercial vehicles used for ride-sharing, delivery, logistics, and personal transportation. Each vehicle undergoes verification and valuation before tokenization.",
  },
  {
    question: "How is vehicle maintenance and management handled?",
    answer:
      "Vehicle maintenance is managed by the primary operator (usually the driver) with costs deducted from gross earnings before profit distribution. All maintenance records are tracked on the blockchain for transparency among co-owners.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <StatsSection />

      {/* Co-Ownership Explanation Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Coins className="h-8 w-8 mr-3 text-[#E57700]" />
              Revolutionary Vehicle Co-Ownership
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of mobility investment through blockchain-powered fractional ownership and asset
              tokenization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coOwnershipBenefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border-2 hover:border-[#E57700] transition-all duration-300 transform hover:scale-105"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-[#E57700]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-[#E57700]" />
                  </div>
                  <CardTitle className="text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
            <Card className="text-center border-2 hover:border-[#E57700] transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="relative h-48">
                <Image src="/images/driver-hero.jpg" alt="Choose investment" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#E57700]/80 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse">
                    <Search className="h-8 w-8 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-center">
                  <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-2">
                    1
                  </span>
                  Discover Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Browse tokenized vehicles available for co-ownership. View details, returns, and current co-owners for
                  each asset.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#E57700] transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="relative h-48">
                <Image src="/images/blockchain-tech.jpg" alt="Purchase tokens" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#E57700]/80 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse delay-200">
                    <Coins className="h-8 w-8 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-center">
                  <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-2">
                    2
                  </span>
                  Purchase Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Buy vehicle tokens to become a co-owner. Start with any amount and build your mobility asset
                  portfolio.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#E57700] transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <div className="relative h-48">
                <Image src="/images/investor-dashboard.jpg" alt="Earn returns" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#E57700]/80 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse delay-400">
                    <TrendingUp className="h-8 w-8 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-center">
                  <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-2">
                    3
                  </span>
                  Earn & Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Receive proportional returns from vehicle operations and trade tokens on our marketplace for
                  liquidity.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Car className="h-8 w-8 mr-3" />
              Featured Co-Ownership Opportunities
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover tokenized vehicles available for fractional ownership
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle, index) => (
              <Card
                key={vehicle.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <Image
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-[#E57700] flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {vehicle.roi} ROI
                  </Badge>
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                      <Coins className="h-4 w-4 text-[#E57700]" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">{vehicle.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    {vehicle.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <span className="font-bold text-foreground">{vehicle.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Token Price</span>
                      <span className="font-bold text-[#E57700]">{vehicle.tokenPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Co-Owners
                      </span>
                      <span className="text-sm font-medium">{vehicle.coOwners}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-4 mt-3">
                    <div
                      className="bg-[#E57700] h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${vehicle.funded}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-4">
                    <span>{vehicle.funded}% tokenized</span>
                    <span>{100 - vehicle.funded}% available</span>
                  </div>
                  <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                    <Coins className="h-4 w-4 mr-2" />
                    Buy Tokens
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="transform hover:scale-105 transition-all duration-200 flex items-center"
              asChild
            >
              <Link href="/marketplace">
                <Search className="h-5 w-5 mr-2" />
                View All Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
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
              <Card
                key={index}
                className="text-center border-2 hover:border-[#E57700] transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="relative h-32">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-[#142841]/60 dark:bg-[#0a1420]/60 flex items-center justify-center">
                    <feature.icon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Partners Section */}
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
                className="flex items-center justify-center mx-8 bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={40}
                  className="opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
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

      {/* FAQ Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <HelpCircle className="h-8 w-8 mr-3" />
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Get answers to common questions about vehicle co-ownership and tokenization
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border shadow-sm">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50 rounded-lg">
                    <span className="font-semibold text-foreground flex items-center">
                      <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-3">
                        Q{index + 1}
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    <div className="flex items-start">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                        A
                      </span>
                      <span>{faq.answer}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
