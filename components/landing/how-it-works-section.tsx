import { Search, Coins, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Discover Vehicles",
      description:
        "Browse tokenized vehicles available for co-ownership. View details, returns, and current co-owners for each asset.",
      image: "/images/driver-hero.jpg",
      step: 1,
    },
    {
      icon: Coins,
      title: "Purchase Tokens",
      description:
        "Buy vehicle tokens to become a co-owner. Start with any amount and build your mobility asset portfolio.",
      image: "/images/blockchain-tech.jpg",
      step: 2,
    },
    {
      icon: TrendingUp,
      title: "Earn & Trade",
      description:
        "Receive proportional returns from vehicle operations and trade tokens on our marketplace for liquidity.",
      image: "/images/investor-dashboard.jpg",
      step: 3,
    },
  ]

  return (
    <section className="py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 mr-3 text-[#E57700]" />
            How ChainMove Co-Ownership Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A simple, transparent process that enables fractional vehicle ownership through blockchain technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card 
              key={step.step}
              className="text-center border-2 hover:border-[#E57700] transition-all duration-300 transform hover:scale-105 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="relative h-48">
                <Image 
                  src={step.image} 
                  alt={step.title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#E57700]/80 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse" 
                       style={{ animationDelay: `${(step.step - 1) * 200}ms` }}>
                    <step.icon className="h-8 w-8 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center justify-center">
                  <span className="w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center text-white text-sm mr-2">
                    {step.step}
                  </span>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base dark:text-gray-300">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
