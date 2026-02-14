"use client"

import type React from "react"

import { BatteryCharging, Fuel, MapPin, Thermometer } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type StatusMetric = {
  label: string
  value: string | number
  icon: React.ReactNode
  variant?: "normal" | "warning" | "critical"
}

const metrics: StatusMetric[] = [
  {
    label: "Battery",
    value: "82%",
    icon: <BatteryCharging className="h-4 w-4 text-green-400" />,
  },
  {
    label: "Fuel",
    value: "58%",
    icon: <Fuel className="h-4 w-4 text-yellow-400" />,
  },
  {
    label: "Engine Temp",
    value: "93 °C",
    icon: <Thermometer className="h-4 w-4 text-red-400" />,
    variant: "warning",
  },
  {
    label: "Last GPS",
    value: "Ikeja, Lagos",
    icon: <MapPin className="h-4 w-4 text-blue-400" />,
  },
]

export function RealTimeStatus() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="flex items-center justify-between rounded-lg bg-[#1a2332] p-3">
          <div className="flex items-center gap-3">
            {m.icon}
            <span className="text-sm text-gray-300">{m.label}</span>
          </div>
          <div className="text-sm font-semibold text-white">{m.value}</div>
          {m.variant === "warning" && <Badge className="ml-2 bg-red-600 text-white">High</Badge>}
        </div>
      ))}
    </div>
  )
}
