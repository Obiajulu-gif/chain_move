"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Megaphone } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { Input } from "@/components/ui/input"
import React from "react"
import { cn } from "@/lib/utils"

const featuredAnnouncements = [
  {
    id: 1,
    title: "ChainMove Launches on Lisk Mainnet",
    excerpt: "Decentralized vehicle financing is now live on the Lisk mainnet.",
    image: "/images/announcement-1.jpg",
    partnerLogo: "/partners/lisk.webp",
  },
  {
    id: 2,
    title: "$2M Seed Funding Round Completed",
    excerpt: "Successfully raised $2M to accelerate platform development.",
    image: "/images/announcement-2.jpg",
    partnerLogo: "/partners/polygon.webp",
  },
  {
    id: 3,
    title: "Partnership with Major African Mobility Companies",
    excerpt: "Strategic partnerships established across Africa.",
    image: "/images/announcement-3.jpg",
    partnerLogo: "/partners/aave.webp",
  },
]

const allAnnouncements = [
  {
    id: 1,
    title: "New Alternative Credit Scoring Model",
    excerpt: "A revolutionary credit scoring system that doesn't rely on traditional credit history.",
    category: "Technology",
    status: "Published",
    daysLeft: null,
    date: "2024-12-20",
    image: "/images/announcement-1.jpg",
    prize: "N/A",
    buidls: 12,
  },
  {
    id: 2,
    title: "First 100 Vehicles Successfully Funded",
    excerpt: "Milestone achievement as ChainMove facilitates funding for its first 100 vehicles.",
    category: "Milestone",
    status: "Ongoing",
    daysLeft: 38,
    date: "2024-11-30",
    image: "/images/announcement-2.jpg",
    prize: "$1.5M+",
    buidls: 100,
  },
  {
    id: 3,
    title: "Security Audit Completed by CertiK",
    excerpt: "ChainMove smart contracts successfully audited by leading blockchain security firm CertiK.",
    category: "Security",
    status: "Completed",
    daysLeft: null,
    date: "2024-11-15",
    image: "/images/announcement-3.jpg",
    prize: "N/A",
    buidls: 21,
  },
  {
    id: 4,
    title: "ChainMove Governance DAO Launch",
    excerpt: "Introducing decentralized governance for the ChainMove ecosystem.",
    category: "DAO",
    status: "Upcoming",
    daysLeft: 1,
    date: "2024-12-05",
    image: "/images/announcement-1.jpg",
    prize: "N/A",
    buidls: 5,
  },
]

const categories = ["All", "Product Launch", "Funding", "Partnership", "Technology", "Milestone", "Security"]

export default function AnnouncementsPage() {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(null)
  const [selected, setSelected] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")

  // Auto-play carousel every 5 seconds
  React.useEffect(() => {
    if (!carouselApi) return

    setScrollSnaps(carouselApi.scrollSnapList())

    const onSelect = () => setSelected(carouselApi.selectedScrollSnap())
    carouselApi.on("select", onSelect)
    onSelect()

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  // Auto-play carousel every 5 seconds
  React.useEffect(() => {
    if (!carouselApi) return

    const id = setInterval(() => {
      carouselApi.scrollNext()
    }, 5000)

    return () => clearInterval(id)
  }, [carouselApi])

  // filtered list
  const displayedAnnouncements = allAnnouncements.filter(a => selectedCategory === "All" ? true : a.category === selectedCategory)

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Panel */}
          <div className="text-left">
            <h1 className="flex items-center gap-3 text-4xl lg:text-5xl font-bold text-foreground mb-4">
              <Megaphone className="h-8 w-8 text-[#E57700]" />
              Announcements
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Get the freshest ChainMove news, product launches, and milestone highlights—all in one place.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Share feedback, connect with our community, and help drive the future of decentralized mobility finance.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <a
                href="https://x.com/ChainMove1"
                target="_blank"
                className="inline-flex items-center gap-2 text-[#E57700] hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.15 4.15 0 001.82-2.28 8.27 8.27 0 01-2.62 1 4.13 4.13 0 00-7 3.76A11.7 11.7 0 013 5.15a4.13 4.13 0 001.28 5.51 4.07 4.07 0 01-1.87-.52v.05a4.14 4.14 0 003.31 4.05 4.2 4.2 0 01-1.86.07 4.14 4.14 0 003.86 2.87A8.31 8.31 0 012 19.54 11.72 11.72 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.34 8.34 0 0022.46 6z" /></svg>
                Follow us on X
              </a>
              <a
                href="https://t.me/chainmove_official"
                target="_blank"
                className="inline-flex items-center gap-2 text-[#E57700] hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.04 14.33l-.37 5.01c.53 0 .76-.23 1.04-.5l2.5-2.39 5.18 3.78c.95.52 1.65.25 1.9-.88l3.44-16.1c.35-1.63-.59-2.27-1.78-1.83L2.2 9.17c-1.62.63-1.6 1.54-.29 1.96l4.44 1.39 10.3-6.46c.48-.31.92-.14.56.2"/></svg>
                Join our Telegram
              </a>
            </div>
            {/* Removed governance action buttons for announcement-only page */}
          </div>

          {/* Right Panel - Carousel */}
          <div className="w-full group relative">
            <Carousel className="w-full" setApi={setCarouselApi}>
              <CarouselContent>
                {featuredAnnouncements.map((announcement) => (
                  <CarouselItem key={announcement.id}>
                    <Card className="border-2 border-transparent hover:border-[#E57700] transition-colors duration-300 overflow-hidden">
                      <CardContent className="relative aspect-[16/9] p-0">
                        <Image
                          src={announcement.image}
                          alt={announcement.title}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                          <div className="flex items-center gap-2 mb-2">
                            <Image
                              src={announcement.partnerLogo}
                              alt="Partner Logo"
                              width={24}
                              height={24}
                            />
                            <span className="text-white font-semibold">ChainMove x Partner</span>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {announcement.title}
                          </h3>
                          <p className="text-white/80">{announcement.excerpt}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

            {/* Hover Arrows */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => carouselApi?.scrollPrev()}
            >
              <ArrowRight className="rotate-180" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => carouselApi?.scrollNext()}
            >
              <ArrowRight />
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-4 gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  className={cn(
                    "w-2 h-2 rounded-full bg-gray-300 transition-all",
                    selected === index && "bg-[#E57700] w-4"
                  )}
                  onClick={() => carouselApi?.scrollTo(index)}
                />
              ))}
            </div>

            </Carousel>
          </div>
        </div>

        {/* Explore Announcements Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Explore Announcements ({allAnnouncements.length})
          </h2>
          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-md",
                  selectedCategory === cat ? "bg-[#E57700] text-white" : "bg-[#0B1324] text-white hover:bg-[#E57700]"
                )}
              >
                {cat}
              </Button>
            ))}
        </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="overflow-hidden rounded-3xl border-2 border-transparent hover:border-[#E57700] hover:shadow-2xl transition-all duration-300 group bg-[#0B1324] text-white">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={announcement.image}
                      alt={announcement.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-[#232B3E] text-white font-semibold px-3 py-1 text-xs">
                        {announcement.category}
                      </Badge>
                      <span className="flex items-center text-xs text-gray-300">
                        <span className="ml-1">{announcement.date ? announcement.date : "Jan 15, 2025"}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-[#E57700]">
                        {announcement.title}
                      </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      {announcement.excerpt}
                    </p>
                    <Link href="#" className="text-[#E57700] font-semibold hover:underline inline-flex items-center">
                      Read full announcement <span className="ml-1">→</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
      </main>
    </div>
  )
}
