"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, MapPin, Star, Eye, Plus } from "lucide-react"
import Image from "next/image"

const opportunities = [
  {
    id: 1,
    vehicleName: "Tesla Model 3 2022",
    type: "Electric Sedan",
    requestedAmount: 35000,
    fundedAmount: 21000,
    roi: 18.5,
    riskLevel: "Low",
    location: "Lagos, Nigeria",
    driverRating: 4.9,
    timeRemaining: "5 days",
    monthlyReturn: 520,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 2,
    vehicleName: "Honda CR-V 2021",
    type: "SUV",
    requestedAmount: 28000,
    fundedAmount: 8400,
    roi: 16.2,
    riskLevel: "Medium",
    location: "Abuja, Nigeria",
    driverRating: 4.7,
    timeRemaining: "12 days",
    monthlyReturn: 380,
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 3,
    vehicleName: "Yamaha R15 2023",
    type: "Motorcycle",
    requestedAmount: 12000,
    fundedAmount: 9600,
    roi: 22.0,
    riskLevel: "High",
    location: "Port Harcourt, Nigeria",
    driverRating: 4.8,
    timeRemaining: "2 days",
    monthlyReturn: 220,
    image: "/placeholder.svg?height=150&width=200",
  },
]

export function InvestmentOpportunities() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Investment Opportunities</h2>
          <p className="text-gray-400">Discover new vehicles seeking funding</p>
        </div>
        <Button className="bg-[#E57700] hover:bg-[#E57700]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="grid gap-6">
        {opportunities.map((opportunity) => {
          const fundingProgress = (opportunity.fundedAmount / opportunity.requestedAmount) * 100

          return (
            <Card key={opportunity.id} className="bg-[#2a3441] border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={opportunity.image || "/placeholder.svg"}
                      alt={opportunity.vehicleName}
                      width={100}
                      height={75}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{opportunity.vehicleName}</h3>
                      <p className="text-gray-400">{opportunity.type}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-400">{opportunity.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-lg font-bold text-green-400">{opportunity.roi}% ROI</span>
                    </div>
                    <Badge
                      className={
                        opportunity.riskLevel === "Low"
                          ? "bg-green-600 text-white"
                          : opportunity.riskLevel === "Medium"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                      }
                    >
                      {opportunity.riskLevel} Risk
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Requested</p>
                    <p className="text-lg font-semibold text-white">${opportunity.requestedAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Funded</p>
                    <p className="text-lg font-semibold text-white">${opportunity.fundedAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Monthly Return</p>
                    <p className="text-lg font-semibold text-white">${opportunity.monthlyReturn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Driver Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold text-white">{opportunity.driverRating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-white">{Math.round(fundingProgress)}% Complete</span>
                  </div>
                  <Progress value={fundingProgress} className="h-2 bg-gray-600" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>${opportunity.fundedAmount.toLocaleString()} raised</span>
                    <span>{opportunity.timeRemaining} remaining</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-[#E57700] hover:bg-[#E57700]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Invest Now
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
