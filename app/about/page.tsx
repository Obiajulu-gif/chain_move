import { ArrowLeft, Users, Target, Globe, Shield, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Former Goldman Sachs VP with 10+ years in fintech and blockchain innovation.",
    image: "/images/team-1.jpg",
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "Ex-Ethereum core developer with expertise in smart contracts and DeFi protocols.",
    image: "/images/team-2.jpg",
  },
  {
    name: "Amara Okafor",
    role: "Head of Operations",
    bio: "Former Uber operations lead with deep understanding of mobility markets in Africa.",
    image: "/images/team-3.jpg",
  },
  {
    name: "David Rodriguez",
    role: "Head of Risk",
    bio: "Former credit risk analyst at JPMorgan with expertise in alternative lending.",
    image: "/images/team-4.jpg",
  },
]

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description:
      "Every transaction, every decision, every outcome is recorded on the blockchain for complete transparency.",
  },
  {
    icon: Users,
    title: "Financial Inclusion",
    description: "Breaking down barriers to vehicle financing for underserved communities worldwide.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Leveraging cutting-edge blockchain technology to revolutionize traditional financing.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Creating economic opportunities and improving mobility access across emerging markets.",
  },
]

const milestones = [
  {
    year: "2023",
    title: "Company Founded",
    description: "ChainMove was established with a vision to democratize vehicle financing.",
  },
  { year: "2023", title: "Seed Funding", description: "Raised $2M in seed funding from leading blockchain VCs." },
  { year: "2024", title: "MVP Launch", description: "Launched our minimum viable product on Lisk testnet." },
  {
    year: "2024",
    title: "Mainnet Launch",
    description: "Successfully deployed on Lisk mainnet with first vehicle fundings.",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description: "Expanding operations to 5 new countries across Africa and Asia.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="ChainMove Logo" width={32} height={32} className="mr-2" />
                <span className="text-2xl font-bold text-[#E57700]">ChainMove</span>
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
          <h1 className="text-4xl font-bold text-[#142841] mb-4">About ChainMove</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            We're revolutionizing vehicle financing through blockchain technology, creating opportunities for drivers
            and investors worldwide.
          </p>
        </div>

        {/* Mission Section */}
        <section className="py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#142841] mb-6">Our Mission 🎯</h2>
              <p className="text-lg text-gray-600 mb-6">
                ChainMove exists to democratize access to vehicle financing by connecting drivers who need vehicles with
                investors seeking real-world asset returns. We leverage blockchain technology to create transparent,
                efficient, and inclusive financial solutions.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our platform eliminates traditional banking barriers, using alternative credit scoring and smart
                contracts to serve underbanked communities while providing investors with attractive, asset-backed
                returns.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-[#E57700] mb-2">$45M+</div>
                  <div className="text-gray-600">Total Funded</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#E57700] mb-2">2,847</div>
                  <div className="text-gray-600">Vehicles Financed</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/about-mission.jpg"
                alt="ChainMove mission"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#142841] mb-4">Our Values 💎</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-2 hover:border-[#E57700] transition-colors">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#E57700] rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-[#142841]">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#142841] mb-4">Meet Our Team 👥</h2>
            <p className="text-lg text-gray-600">Experienced leaders from fintech, blockchain, and mobility sectors</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-[#142841]">{member.name}</CardTitle>
                  <CardDescription className="text-[#E57700] font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#142841] mb-4">Our Journey 📅</h2>
            <p className="text-lg text-gray-600">Key milestones in ChainMove's growth</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E57700]"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#E57700] rounded-full flex items-center justify-center relative z-10">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-6">
                      <div className="flex items-center mb-2">
                        <Badge className="bg-[#142841] text-white mr-3">{milestone.year}</Badge>
                        <h3 className="text-lg font-semibold text-[#142841]">{milestone.title}</h3>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold text-[#142841] mb-4">Join the Revolution 🚀</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the future of vehicle financing. Whether you're a driver seeking financing or an investor looking
            for returns, ChainMove has opportunities for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#E57700] hover:bg-[#E57700]/90" asChild>
              <Link href="/auth?role=driver">
                Apply for Financing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth?role=investor">
                Start Investing <Target className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
