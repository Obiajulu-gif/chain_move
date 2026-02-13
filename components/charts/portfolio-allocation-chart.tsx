"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const allocationData = [
  { name: "Sedans", value: 45, color: "#E57700" },
  { name: "SUVs", value: 25, color: "#3A7CA5" },
  { name: "Motorcycles", value: 15, color: "#142841" },
  { name: "Commercial", value: 15, color: "#6B7280" },
]

export function PortfolioAllocationChart() {
  return (
    <ChartContainer
      config={{
        sedans: { label: "Sedans", color: "#E57700" },
        suvs: { label: "SUVs", color: "#3A7CA5" },
        motorcycles: { label: "Motorcycles", color: "#142841" },
        commercial: { label: "Commercial", color: "#6B7280" },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={allocationData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {allocationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
