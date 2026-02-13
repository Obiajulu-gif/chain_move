import { ArrowLeft, Calendar, TrendingUp, Megaphone, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ChainMoveLogo } from "@/components/chain-move-logo"

const announcements = [
  {
    id: 1,
    title: "ChainMove Launches on Lisk Mainnet",
    excerpt:
      "We're excited to announce that ChainMove is now live on Lisk mainnet, bringing decentralized vehicle financing to the masses.",
    content:
      "After months of development and testing, ChainMove has successfully launched on Lisk mainnet. This milestone marks the beginning of our mission to democratize vehicle financing through blockchain technology. Users can now access real vehicle financing opportunities with transparent terms and automated smart contract execution.",
    date: "2025-01-15",
    category: "Product Launch",
    featured: true,
    image: "/images/announcement-1.jpg",
    icon: Zap,
  },
  {
    id: 2,
    title: "$2M Seed Funding Round Completed",
    excerpt:
      "ChainMove successfully raises $2M in seed funding from leading blockchain VCs to accelerate platform development.",
    content:
      "We're thrilled to announce the completion of our $2M seed funding round, led by Blockchain Capital with participation from Lisk Ecosystem Fund, Polygon Ventures, and several angel investors. This funding will accelerate our product development, expand our team, and support our mission to bring vehicle financing to underserved markets globally.",
    date: "2024-12-10",
    category: "Funding",
    featured: true,
    image: "/images/announcement-2.jpg",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "Partnership with Leading African Mobility Companies",
    excerpt: "Strategic partnerships established with major ride-hailing and logistics companies across Africa.",
    content:
      "ChainMove has formed strategic partnerships with leading mobility companies across Nigeria, Kenya, and Ghana. These partnerships will provide direct access to drivers seeking vehicle financing and create a robust ecosystem for our platform. Partners include major ride-hailing platforms, logistics companies, and vehicle dealerships.",
    date: "2024-11-28",
    category: "Partnership",
    featured: false,
    image: "/images/announcement-3.jpg",
    icon: Award,
  },
  {
    id: 4,
    title: "New Alternative Credit Scoring Model",
    excerpt: "Introducing our revolutionary credit scoring system that doesn't rely on traditional credit history.",
    content:
      "Our new alternative credit scoring model uses blockchain transaction history, mobile money usage patterns, social verification, and other alternative data points to assess creditworthiness. This innovation allows us to serve previously unbanked populations while maintaining low default rates.",
    date: "2024-11-15",
    category: "Technology",
    featured: false,
    image: "/images/announcement-1.jpg",
    icon: Megaphone,
  },
  {
    id: 5,
    title: "First 100 Vehicles Successfully Funded",
    excerpt: "Milestone achievement as ChainMove facilitates funding for its first 100 vehicles on the platform.",
    content:
      "We're proud to announce that ChainMove has successfully facilitated funding for our first 100 vehicles, representing over $1.5M in total financing. These vehicles are now generating income for drivers across Nigeria, Ghana, and Kenya, while providing attractive returns to our investors.",
    date: "2024-10-30",
    category: "Milestone",
    featured: false,
    image: "/images/announcement-2.jpg",
    icon: Award,
  },
  {
    id: 6,
    title: "Security Audit Completed by CertiK",
    excerpt: "ChainMove smart contracts successfully audited by leading blockchain security firm CertiK.",
    content:
      "Our smart contracts have been thoroughly audited by CertiK, one of the leading blockchain security firms. The audit found no critical vulnerabilities and confirmed the security and reliability of our platform. This gives our users confidence in the safety of their investments and loans.",
    date: "2024-10-15",
    category: "Security",
    featured: false,
    image: "/images/announcement-3.jpg",
    icon: Zap,
  },
]

const categories = ["All", "Product Launch", "Funding", "Partnership", "Technology", "Milestone", "Security"]

const categoryIcons = {
  "Product Launch": Zap,
  Funding: TrendingUp,
  Partnership: Award,
  Technology: Megaphone,
  Milestone: Award,
  Security: Zap,
}

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#E57700]">
                <ChainMoveLogo />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth">Login</Link>
              </Button>
              <Button className="bg-[#E57700] hover:bg-[#E57700]/90" asChild>
                <Link href="/auth">Connect Wallet</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#E57700] mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-[#142841] mb-4">📢 Announcements</h1>
          <p className="text-xl text-gray-600">
            Stay updated with the latest news, product updates, and milestones from ChainMove
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="hover:bg-[#E57700] hover:text-white hover:border-[#E57700]"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Announcements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#142841] mb-6">⭐ Featured Announcements</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {announcements
              .filter((announcement) => announcement.featured)
              .map((announcement) => (
                <Card key={announcement.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={announcement.image || "/placeholder.svg"}
                      alt={announcement.title}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#E57700]">{announcement.category}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <CardTitle className="text-xl text-[#142841] hover:text-[#E57700] transition-colors">
                      {announcement.title}
                    </CardTitle>
                    <CardDescription className="text-base">{announcement.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">{announcement.content}</p>
                    <Button variant="outline" className="hover:bg-[#E57700] hover:text-white">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        {/* All Announcements */}
        <section>
          <h2 className="text-2xl font-bold text-[#142841] mb-6">📰 All Announcements</h2>
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#E57700]/10 rounded-full flex items-center justify-center">
                        {announcement.icon ? (
                          <announcement.icon className="h-6 w-6 text-[#E57700]" />
                        ) : (
                          <Zap className="h-6 w-6 text-[#E57700]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{announcement.category}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(announcement.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-[#142841] mb-2 hover:text-[#E57700] transition-colors cursor-pointer">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{announcement.excerpt}</p>
                      <Button variant="ghost" size="sm" className="text-[#E57700] hover:bg-[#E57700]/10 p-0">
                        Read full announcement →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-[#142841] text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">📧 Stay Updated</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest announcements, product updates, and insights delivered
            directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E57700]"
            />
            <Button className="bg-[#E57700] hover:bg-[#E57700]/90">Subscribe</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
