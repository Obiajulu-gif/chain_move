"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const earningsData = [
  { month: "Jan", earnings: 1200, trips: 45 },
  { month: "Feb", earnings: 1450, trips: 52 },
  { month: "Mar", earnings: 1680, trips: 58 },
  { month: "Apr", earnings: 1520, trips: 55 },
  { month: "May", earnings: 1890, trips: 67 },
  { month: "Jun", earnings: 2100, trips: 72 },
]

export function EarningsChart() {
  return (
    <ChartContainer
      config={{
        earnings: {
          label: "Earnings ($)",
          color: "hsl(var(--chart-1))",
        },
        trips: {
          label: "Trips",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={earningsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="var(--color-earnings)"
            strokeWidth={3}
            dot={{ fill: "var(--color-earnings)", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
