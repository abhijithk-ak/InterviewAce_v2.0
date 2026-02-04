"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generatePerformanceOverTimeData, emptyPerformanceData } from "@/lib/chart-data"
import { useSessions } from "@/components/providers/SessionsProvider"

const chartConfig = {
  score: {
    label: "Score",
  },
  technical: {
    label: "Technical",
    color: "var(--chart-1)",
  },
  behavioral: {
    label: "Behavioral",
    color: "var(--chart-2)",
  },
  systemDesign: {
    label: "System Design",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function PerformanceAreaChart() {
  const { sessions } = useSessions()
  const [timeRange, setTimeRange] = React.useState("90d")
  const chartData = sessions.length > 0 ? generatePerformanceOverTimeData(sessions) : emptyPerformanceData

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-03-18")
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return performanceOverTimeData.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate
    })
  }, [timeRange])

  return (
    <Card className="pt-0 animate-fade-in">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>Track your interview scores across categories</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTechnical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillBehavioral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillSystemDesign" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="systemDesign"
              type="natural"
              fill="url(#fillSystemDesign)"
              stroke="var(--chart-3)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="behavioral"
              type="natural"
              fill="url(#fillBehavioral)"
              stroke="var(--chart-2)"
              strokeWidth={2}
              stackId="b"
            />
            <Area
              dataKey="technical"
              type="natural"
              fill="url(#fillTechnical)"
              stroke="var(--chart-1)"
              strokeWidth={2}
              stackId="c"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
