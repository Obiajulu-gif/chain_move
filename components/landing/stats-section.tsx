"use client"

import { Car, TrendingUp, Users, DollarSign } from "lucide-react"

const stats = [
  { label: "Vehicles Funded", value: "2,847", prefix: "", icon: Car },
  { label: "Average ROI", value: "15.2", prefix: "%", icon: TrendingUp },
  { label: "Active Investors", value: "12,450", prefix: "", icon: Users },
  { label: "Total Funded", value: "45", prefix: "$", suffix: "M", icon: DollarSign },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-12 h-12 bg-[#E57700] rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-[#142841] mb-2">
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
