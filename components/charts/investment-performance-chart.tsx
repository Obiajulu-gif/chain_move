"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { month: "Jan", portfolio: 25000, returns: 1250 },
  { month: "Feb", portfolio: 27500, returns: 1375 },
  { month: "Mar", portfolio: 29800, returns: 1490 },
  { month: "Apr", portfolio: 31200, returns: 1560 },
  { month: "May", portfolio: 33500, returns: 1675 },
  { month: "Jun", portfolio: 36200, returns: 1810 },
]

export function InvestmentPerformanceChart() {
  return (
    <ChartContainer
      config={{
        portfolio: {
          label: "Portfolio Value ($)",
          color: "hsl(var(--chart-1))",
        },
        returns: {
          label: "Monthly Returns ($)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="portfolio"
            stroke="var(--color-portfolio)"
            fill="var(--color-portfolio)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
