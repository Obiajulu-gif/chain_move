"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const votingData = [
  { proposal: "EV Incentives", for: 1850, against: 420, abstain: 230 },
  { proposal: "Asia Expansion", for: 2100, against: 680, abstain: 320 },
  { proposal: "Credit Updates", for: 1650, against: 890, abstain: 460 },
  { proposal: "Fee Structure", for: 1200, against: 1100, abstain: 700 },
]

export function DaoVotingChart() {
  return (
    <ChartContainer
      config={{
        for: {
          label: "For",
          color: "hsl(var(--chart-1))",
        },
        against: {
          label: "Against",
          color: "hsl(var(--chart-2))",
        },
        abstain: {
          label: "Abstain",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={votingData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="proposal" type="category" width={100} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="for" stackId="a" fill="var(--color-for)" />
          <Bar dataKey="against" stackId="a" fill="var(--color-against)" />
          <Bar dataKey="abstain" stackId="a" fill="var(--color-abstain)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
