"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"

/**
 * Sample monthly repayment data.
 * Replace this with real data fetched from your API once available.
 */
const repaymentData = [
  { month: "Jan", ahead: 1, onTrack: 6, late: 1 },
  { month: "Feb", ahead: 0, onTrack: 7, late: 1 },
  { month: "Mar", ahead: 2, onTrack: 6, late: 0 },
  { month: "Apr", ahead: 1, onTrack: 7, late: 0 },
  { month: "May", ahead: 0, onTrack: 8, late: 0 },
  { month: "Jun", ahead: 1, onTrack: 7, late: 0 },
]

export function RepaymentAnalytics() {
  return (
    <Card className="bg-[#2a3441] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Repayment Analytics</CardTitle>
        <CardDescription className="text-gray-400">Monthly overview of repayment performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ahead: { label: "Ahead", color: "hsl(var(--chart-1))" },
            onTrack: { label: "On Track", color: "hsl(var(--chart-2))" },
            late: { label: "Late", color: "hsl(var(--chart-3))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={repaymentData} barCategoryGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="ahead" stackId="a" fill="var(--color-ahead)" />
              <Bar dataKey="onTrack" stackId="a" fill="var(--color-onTrack)" />
              <Bar dataKey="late" stackId="a" fill="var(--color-late)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RepaymentAnalytics
