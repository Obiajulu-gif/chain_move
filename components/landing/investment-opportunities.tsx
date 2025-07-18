"use client"

import {
  Car,
  Coins,
  ArrowRight,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const featuredVehicles = [
    {
        id: 1,
        name: "Commuter Bus",
        type: "Bus",
        price: 3500,
        image: "/assets/commuter bus.webp",
        tokenPrice: 125,
        coOwners: 12,
        funded: 75,
        roi: "12%",
    },
    {
        id: 2,
        name: "Daylong Motorcycle 2024",
        type: "Motorcycle",
        price: 1800,
        image: "/assets/daylong-motorcycle-price-in-nigeria.jpg",
        tokenPrice: 225,
        coOwners: 8,
        funded: 60,
        roi: "14%",
    },
    {
        id: 3,
        name: "Tricycle (Keke NAPEP) 2024",
        type: "Tricycle",
        price: 2500,
        image: "/assets/keke-nigeria.png",
        tokenPrice: 167,
        coOwners: 15,
        funded: 40,
        roi: "16%",
    },
    {
        id: 4,
        name: "Suzuki Every Mini Bus",
        type: "Shuttle Bus",
        price: 28000,
        image: "/assets/mOlcqsJ5-Suzuki-Every-Mini-Bus-Price-In-Nigeria-Korope-For-Business.jpg",
        tokenPrice: 40,
        coOwners: 20,
        funded: 90,
        roi: "18%",
    },
]

export function InvestmentOpportunities() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center justify-center">
            <Car className="h-8 w-8 mr-3 text-[#E57700]" />
            Investment Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and co-own a diverse range of tokenized vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border-transparent hover:border-orange-500 border-2 flex flex-col">
              <div className="relative p-4">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  width={400}
                  height={300}
                  className="rounded-2xl object-cover w-full h-52 transform group-hover:scale-105 transition-transform duration-300"
                />
                {/* ROI badge top right */}
                <div className="absolute top-4 right-4 bg-[#E57700] text-white rounded-xl px-3 py-1 flex items-center gap-1 text-xs font-semibold shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
                  {vehicle.roi} ROI
                </div>
                {/* Coins icon top left */}
                <div className="absolute top-4 left-4 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  <Coins className="h-4 w-4 text-[#E57700]" />
                </div>
              </div>
              <CardContent className="p-6 pt-2 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-card-foreground">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center mb-4">
                    <Car className="w-4 h-4 mr-2" />
                    {vehicle.type}
                </p>

                <div className="space-y-3 my-4 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <span className="font-bold text-card-foreground">${vehicle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Token Price</span>
                      <span className="font-bold text-[#E57700]">${vehicle.tokenPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Co-Owners
                      </span>
                      <span className="text-sm font-medium text-card-foreground">{vehicle.coOwners}</span>
                    </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                    <div
                      className="bg-[#E57700] h-2.5 rounded-full"
                      style={{ width: `${vehicle.funded}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                    <span>{vehicle.funded}% tokenized</span>
                    <span>{100 - vehicle.funded}% available</span>
                </div>
                
                <Button asChild className="w-full mt-auto bg-[#E57700] hover:bg-[#E57700]/90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105">
                    <Link href={`/marketplace/vehicles/${vehicle.id}`}>
                        <Coins className="w-4 h-4 mr-2" />
                        Buy Tokens
                    </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
            <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-8 py-3 transition-all duration-300 transform hover:scale-105">
                <Link href="/marketplace">
                    View All Opportunities
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  )
} 