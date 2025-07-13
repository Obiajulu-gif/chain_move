import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function VehicleCategories({ vehicleCategories }: { vehicleCategories: any[] }) {
  return (
    <Card className="bg-card dark:bg-[#23232A] border-border">
      <CardHeader>
        <CardTitle className="text-foreground dark:text-white">Vehicle Categories</CardTitle>
        <CardDescription className="text-muted-foreground dark:text-gray-300">
          Explore different types of vehicles available for investment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicleCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-muted dark:bg-[#18181B] border-border hover:border-[#E57700] transition-colors cursor-pointer"
            >
              <div className="relative">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={150}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-[#E57700] dark:bg-[#FFD580] text-white dark:text-[#142841]">{category.avgROI}% Avg ROI</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground dark:text-white">{category.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{category.description}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-300">Available:</span>
                    <span className="font-medium text-foreground dark:text-white">{category.count} vehicles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground dark:text-gray-300">Price Range:</span>
                    <span className="font-medium text-foreground dark:text-white">{category.priceRange}</span>
                  </div>
                  <Button className="w-full bg-[#E57700] dark:bg-[#FFD580] hover:bg-[#E57700]/90 dark:hover:bg-[#FFD580]/90 text-white dark:text-[#142841]">
                    Browse {category.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
