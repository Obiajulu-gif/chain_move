import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, DollarSign, Eye } from "lucide-react"
import Image from "next/image"

export function BrowseAllVehicles({
  filteredVehicles,
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  categoryFilter,
  setCategoryFilter,
  getDemandColor,
}: {
  filteredVehicles: any[],
  searchTerm: string,
  setSearchTerm: (v: string) => void,
  locationFilter: string,
  setLocationFilter: (v: string) => void,
  categoryFilter: string,
  setCategoryFilter: (v: string) => void,
  getDemandColor: (demand: string) => string,
}) {
  return (
    <Card className="bg-card dark:bg-[#23232A] border-border">
      <CardHeader>
        <CardTitle className="text-foreground dark:text-white flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Browse All Vehicles
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-gray-300">
          Search and filter vehicles to find your perfect investment opportunity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-300" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background dark:bg-[#18181B] border-border text-foreground dark:text-white"
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="bg-background dark:bg-[#18181B] border-border text-foreground dark:text-white">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="nigeria">Nigeria</SelectItem>
              <SelectItem value="ghana">Ghana</SelectItem>
              <SelectItem value="kenya">Kenya</SelectItem>
              <SelectItem value="south africa">South Africa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-background dark:bg-[#18181B] border-border text-foreground dark:text-white">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tricycle">Tricycle (Keke)</SelectItem>
              <SelectItem value="motorcycle">Motorcycle (Okada)</SelectItem>
              <SelectItem value="mini bus">Mini Bus</SelectItem>
              <SelectItem value="18-seater">18-Seater Bus</SelectItem>
              <SelectItem value="pickup">Pickup Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="bg-muted dark:bg-[#18181B] border-border hover:border-[#E57700] transition-colors">
              <div className="relative">
                <Image
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <Badge className={`${getDemandColor(vehicle.demand)} text-white text-xs`}>
                    {vehicle.demand}
                  </Badge>
                  <Badge className="bg-[#E57700] dark:bg-[#FFD580] text-white dark:text-[#142841] text-xs">{vehicle.roi}% ROI</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground dark:text-white">{vehicle.name}</h3>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{vehicle.type}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground dark:text-white">${vehicle.price.toLocaleString()}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-foreground dark:text-white">{vehicle.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-[#E57700] dark:bg-[#FFD580] hover:bg-[#E57700]/90 dark:hover:bg-[#FFD580]/90 text-white dark:text-[#142841]">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Invest
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
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground dark:text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground dark:text-white mb-2">No vehicles found</h3>
            <p className="text-muted-foreground dark:text-gray-300 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setLocationFilter("all")
                setCategoryFilter("all")
              }}
              className="bg-[#E57700] dark:bg-[#FFD580] hover:bg-[#E57700]/90 dark:hover:bg-[#FFD580]/90 text-white dark:text-[#142841]"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
