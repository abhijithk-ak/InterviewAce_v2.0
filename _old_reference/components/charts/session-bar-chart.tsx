"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { generateDailyActivityData, emptyDailyData } from "@/lib/chart-data"
import { useSessions } from "@/components/providers/SessionsProvider"

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
  minutes: {
    label: "Minutes",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function SessionBarChart() {
  const { sessions } = useSessions()
  const [activeChart, setActiveChart] = React.useState<"sessions" | "minutes">("sessions")
  
  const dailyActivityData = sessions.length > 0 ? generateDailyActivityData(sessions) : emptyDailyData

  const total = React.useMemo(
    () => ({
      sessions: dailyActivityData.reduce((acc, curr) => acc + curr.sessions, 0),
      minutes: dailyActivityData.reduce((acc, curr) => acc + curr.minutes, 0),
    }),
    [dailyActivityData],
  )

  return (
    <Card className="py-0 animate-fade-in stagger-1">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Weekly Activity</CardTitle>
          <CardDescription>Your practice sessions this week</CardDescription>
        </div>
        <div className="flex">
          {(["sessions", "minutes"] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 transition-colors"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">{chartConfig[key].label}</span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[key].toLocaleString()}
                {key === "minutes" ? " min" : ""}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={dailyActivityData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent className="w-[150px]" />} />
            <Bar
              dataKey={activeChart}
              fill={activeChart === "sessions" ? "var(--chart-1)" : "var(--chart-2)"}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
