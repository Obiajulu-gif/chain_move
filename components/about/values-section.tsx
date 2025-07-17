import { Shield, Users, Zap, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export function ValuesSection() {
  return (
    <section className="py-16 bg-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#142841] dark:text-white mb-4">Our Values 💎</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">The principles that guide everything we do</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <Card
            key={index}
            className="group text-center border-2 border-gray-200 dark:border-gray-700 hover:border-[#E57700] dark:hover:border-[#FFD580] transition-colors transform duration-300 ease-out bg-white dark:bg-[#23232A] hover:scale-105 active:scale-100"
          >
            <CardHeader>
              <div
                className="w-16 h-16 bg-[#E57700] dark:bg-[#FFD580] rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              >
                <value.icon className="h-8 w-8 text-white dark:text-[#142841]" />
              </div>
              <CardTitle className="text-[#142841] dark:text-white">{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300">{value.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
