"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { TrendingUp } from "lucide-react"

// Update the vehicle type to include funding details
interface Vehicle {
  _id: string;
  name: string;
  type: string;
  year: number;
  price: number;
  roi: number;
  image?: string;
  features: string[];
  totalFundedAmount?: number; // Add this field
  fundingStatus?: "Open" | "Funded" | "Active";
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onInvest: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onInvest }: VehicleCardProps) {
  const fundedAmount = vehicle.totalFundedAmount || 0;
  const fundingProgress = (fundedAmount / vehicle.price) * 100;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0 relative">
        <Image
          src={vehicle.image || "/placeholder.svg"}
          alt={vehicle.name}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
            <Badge className="bg-green-600 text-white border-green-700">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                {vehicle.roi.toFixed(1)}% Expected ROI
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-2">{vehicle.name}</CardTitle>
        <div className="text-sm text-muted-foreground mb-4">
            <span>{vehicle.year} &bull; {vehicle.type}</span>
            <p className="font-bold text-lg text-foreground mt-1">${vehicle.price.toLocaleString()}</p>
        </div>
        
        {/* --- NEW: FUNDING PROGRESS BAR --- */}
        <div className="space-y-2 mb-4">
            <Progress value={fundingProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>${fundedAmount.toLocaleString()} funded</span>
                <span>{fundingProgress.toFixed(0)}%</span>
            </div>
        </div>

        <div className="flex flex-wrap gap-2">
            {vehicle.features.slice(0, 3).map((feature) => (
                <Badge key={feature} variant="outline">{feature}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 mt-auto">
        <Button onClick={() => onInvest(vehicle)} className="w-full bg-[#E57700] hover:bg-[#E57700]/90 text-white">
          Invest Now
        </Button>
      </CardFooter>
    </Card>
  )
}