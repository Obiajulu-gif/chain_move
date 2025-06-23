"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const metricsData = [
  { month: "Jan", applications: 45, approvals: 38, defaults: 2 },
  { month: "Feb", applications: 52, approvals: 44, defaults: 1 },
  { month: "Mar", applications: 58, approvals: 51, defaults: 3 },
  { month: "Apr", applications: 55, approvals: 47, defaults: 2 },
  { month: "May", applications: 67, approvals: 59, defaults: 1 },
  { month: "Jun", applications: 72, approvals: 65, defaults: 2 },
]

export function AdminMetricsChart() {
  return (
    <ChartContainer
      config={{
        applications: {
          label: "Applications",
          color: "hsl(var(--chart-1))",
        },
        approvals: {
          label: "Approvals",
          color: "hsl(var(--chart-2))",
        },
        defaults: {
          label: "Defaults",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={metricsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="applications" fill="var(--color-applications)" />
          <Bar dataKey="approvals" fill="var(--color-approvals)" />
          <Bar dataKey="defaults" fill="var(--color-defaults)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
