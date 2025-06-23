"use client"

import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const repaymentData = [
  { month: "Jan", planned: 450, actual: 450, balance: 14550 },
  { month: "Feb", planned: 450, actual: 450, balance: 14100 },
  { month: "Mar", planned: 450, actual: 450, balance: 13650 },
  { month: "Apr", planned: 450, actual: 450, balance: 13200 },
  { month: "May", planned: 450, actual: 450, balance: 12750 },
  { month: "Jun", planned: 450, actual: 450, balance: 12300 },
  { month: "Jul", planned: 450, actual: 0, balance: 12300 },
  { month: "Aug", planned: 450, actual: 0, balance: 12300 },
]

export function RepaymentProgressChart() {
  return (
    <ChartContainer
      config={{
        planned: {
          label: "Planned Payment",
          color: "hsl(var(--chart-1))",
        },
        actual: {
          label: "Actual Payment",
          color: "hsl(var(--chart-2))",
        },
        balance: {
          label: "Remaining Balance",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={repaymentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--color-balance)"
            fill="var(--color-balance)"
            fillOpacity={0.3}
          />
          <Line type="monotone" dataKey="planned" stroke="var(--color-planned)" strokeWidth={2} strokeDasharray="5 5" />
          <Line type="monotone" dataKey="actual" stroke="var(--color-actual)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
