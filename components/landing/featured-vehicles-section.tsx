import {
	Car,
	TrendingUp,
	Users,
	Coins as CoinsIcon,
	Search,
} from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

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

export function FeaturedVehiclesSection() {
  return (
    <section className="py-20 bg-muted/50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
            <Car className="h-8 w-8 mr-3 text-[#E57700]" />
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
              className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up dark:bg-gray-800 dark:border-gray-700"
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
                <Badge className="absolute top-3 right-3 bg-[#E57700] hover:bg-[#E57700]/90 flex items-center dark:text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {vehicle.roi} ROI
                </Badge>
                <div className="absolute top-3 left-3">
                  <div className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center">
                    <CoinsIcon className="h-4 w-4 text-[#E57700]" />
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center dark:text-white">{vehicle.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <Car className="h-3 w-3 mr-1" />
                  {vehicle.type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-bold text-foreground dark:text-white">{vehicle.price}</span>
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
                <div className="w-full bg-muted dark:bg-gray-700 rounded-full h-2 mb-4 mt-3">
                  <div
                    className="bg-[#E57700] h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${vehicle.funded}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  <span>{vehicle.funded}% tokenized</span>
                  <span>{100 - vehicle.funded}% available</span>
                </div>
                <Button className="w-full bg-[#E57700] hover:bg-[#E57700]/90 transform hover:scale-105 transition-all duration-200 flex items-center justify-center dark:text-white">
                  <CoinsIcon className="h-4 w-4 mr-2" />
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
            className="transform hover:scale-105 transition-all duration-200 flex items-center mx-auto dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            asChild
          >
            <Link href="/marketplace">
              <Search className="h-5 w-5 mr-2" />
              View All Opportunities
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
