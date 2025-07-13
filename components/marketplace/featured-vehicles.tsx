import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, DollarSign, Eye, Heart } from "lucide-react"
import Image from "next/image"

export function FeaturedVehicles({ featuredVehicles, getDemandColor }: {
  featuredVehicles: any[],
  getDemandColor: (demand: string) => string
}) {
  return (
    <Card className="bg-card dark:bg-[#23232A] border-border">
      <CardHeader>
        <CardTitle className="text-foreground dark:text-white flex items-center">
          <Star className="h-5 w-5 mr-2 text-[#E57700]" />
          Featured Investment Opportunities
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-gray-300">
          High-demand vehicles with excellent ROI potential and proven track records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="bg-muted dark:bg-[#18181B] border-border hover:border-[#E57700] transition-colors">
              <div className="relative">
                <Image
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3 flex flex-col space-y-1">
                  <Badge className={`${getDemandColor(vehicle.demand)} text-white text-xs`}>
                    {vehicle.demand}
                  </Badge>
                  <Badge className="bg-[#E57700] text-white text-xs">{vehicle.roi}% ROI</Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 left-3 text-white hover:bg-black/20"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground dark:text-white">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{vehicle.type}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground dark:text-white">
                      ${vehicle.price.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-foreground dark:text-white">{vehicle.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.location}</span>
                  </div>
                  {/* Funding Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground dark:text-gray-300">Funding Progress</span>
                      <span className="text-sm text-foreground dark:text-white">{vehicle.fundingProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-[#E57700] dark:bg-[#FFD580] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${vehicle.fundingProgress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2">{vehicle.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 2).map((feature: string) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-[#E57700] dark:bg-[#FFD580] hover:bg-[#E57700]/90 dark:hover:bg-[#FFD580]/90 text-white dark:text-[#142841]">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Invest Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#23232A]"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
