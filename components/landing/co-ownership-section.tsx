import { Users, Coins as CoinsIcon, TrendingUp, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const coOwnershipBenefits = [
  {
    icon: Users,
    title: "Shared Investment Risk",
    description:
      "Distribute investment risk across multiple co-owners, reducing individual exposure while maintaining earning potential.",
  },
  {
    icon: CoinsIcon,
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

export function CoOwnershipSection() {
  return (
    <section className="py-20 bg-muted/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <CoinsIcon className="h-8 w-8 mr-3 text-[#E57700]" />
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
              className="text-center border-2 hover:border-[#E57700] transition-all duration-300 transform hover:scale-105 dark:bg-gray-800 dark:border-gray-700"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-[#E57700]/10 dark:bg-[#E57700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-[#E57700]" />
                </div>
                <CardTitle className="text-foreground">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base dark:text-gray-300">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
