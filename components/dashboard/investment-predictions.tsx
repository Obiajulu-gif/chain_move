"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

/**
 * Dummy forecast data — replace with real model output when available.
 */
const forecastData = [
  { month: "Jul", expected: 53000 },
  { month: "Aug", expected: 54500 },
  { month: "Sep", expected: 56300 },
  { month: "Oct", expected: 57900 },
  { month: "Nov", expected: 59600 },
  { month: "Dec", expected: 61250 },
]

export function InvestmentPredictions() {
  return (
    <Card className="bg-[#2a3441] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Forecast</CardTitle>
        <CardDescription className="text-gray-400">
          Projected portfolio value for the next&nbsp;6&nbsp;months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            expected: {
              label: "Forecasted Value ($)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="expected"
                stroke="var(--color-expected)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default InvestmentPredictions
