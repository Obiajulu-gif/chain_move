"use client"

import { Car, TrendingUp, Users, DollarSign } from "lucide-react"

const stats = [
  { label: "Vehicles Funded", value: "20", prefix: "", icon: Car },
  { label: "Average ROI", value: "15.2", prefix: "%", icon: TrendingUp },
  { label: "Active Investors", value: "37", prefix: "", icon: Users },
  { label: "Total Funded", value: "45", prefix: "$", suffix: "M", icon: DollarSign },
]

export function StatsSection() {
  return (
<<<<<<< Updated upstream
    <section className="py-16 bg-background dark:bg-gray-900">
=======
    <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100">
>>>>>>> Stashed changes
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative text-center bg-white rounded-3xl p-8 pt-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Floating icon */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#E57700] rounded-full flex items-center justify-center shadow-md border-4 border-white">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold text-[#142841] mb-2 mt-2 tracking-tight">
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-gray-500 text-base font-medium tracking-wide mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
