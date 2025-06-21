"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle, UserCheck, Users } from "lucide-react"
import Image from "next/image"
import Marquee from "@/components/ui/marquee"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Uber Driver",
    content: "ChainMove helped me get my first vehicle with transparent terms. Now I'm earning $2,000+ monthly!",
    rating: 5,
    image: "/images/testimonial-1.jpg",
  },
  {
    name: "Michael Chen",
    role: "Investor",
    content: "I've earned 18% ROI on my vehicle investments. The blockchain transparency gives me confidence.",
    rating: 5,
    image: "/images/testimonial-2.jpg",
  },
  {
    name: "Amara Okafor",
    role: "Delivery Driver",
    content: "Traditional banks rejected me, but ChainMove's alternative scoring got me approved in 24 hours.",
    rating: 5,
    image: "/images/testimonial-3.jpg",
  },
  {
    name: "David Rodriguez",
    role: "Fleet Owner",
    content: "Expanded my fleet from 2 to 15 vehicles through ChainMove's decentralized financing.",
    rating: 5,
    image: "/images/testimonial-4.jpg",
  },
  {
    name: "Fatima Al-Rashid",
    role: "Taxi Driver",
    content: "The smart contract payments are automatic and transparent. No more payment delays!",
    rating: 5,
    image: "/images/testimonial-5.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#142841] text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 mr-3" />
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-200">Real stories from drivers and investors transforming mobility</p>
        </div>

        {/* Single marquee - left to right */}
        <Marquee className="mb-8" pauseOnHover>
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="w-80 bg-white/10 border-white/20 text-white mx-4 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-15 h-15 mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#E57700] rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-300 flex items-center">
                      <UserCheck className="h-3 w-3 mr-1" />
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#E57700] text-[#E57700]" />
                  ))}
                </div>
                <p className="text-gray-200">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
