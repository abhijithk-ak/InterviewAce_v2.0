"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartData = [
  { type: "technical", sessions: 18, fill: "oklch(0.15 0 0)" },
  { type: "behavioral", sessions: 12, fill: "oklch(0.35 0 0)" },
  { type: "systemDesign", sessions: 10, fill: "oklch(0.55 0 0)" },
  { type: "coding", sessions: 5, fill: "oklch(0.75 0 0)" },
]

const chartDataDark = [
  { type: "technical", sessions: 18, fill: "oklch(0.95 0 0)" },
  { type: "behavioral", sessions: 12, fill: "oklch(0.75 0 0)" },
  { type: "systemDesign", sessions: 10, fill: "oklch(0.55 0 0)" },
  { type: "coding", sessions: 5, fill: "oklch(0.35 0 0)" },
]

const chartConfig = {
  sessions: {
    label: "Sessions",
  },
  technical: {
    label: "Technical",
    color: "oklch(0.15 0 0)",
  },
  behavioral: {
    label: "Behavioral",
    color: "oklch(0.35 0 0)",
  },
  systemDesign: {
    label: "System Design",
    color: "oklch(0.55 0 0)",
  },
  coding: {
    label: "Coding",
    color: "oklch(0.75 0 0)",
  },
} satisfies ChartConfig

export function SessionPieChart() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const data = isDark ? chartDataDark : chartData

  const totalSessions = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.sessions, 0)
  }, [data])

  return (
    <Card className="flex flex-col animate-fade-in stagger-3">
      <CardHeader className="items-center pb-0">
        <CardTitle>Session Distribution</CardTitle>
        <CardDescription>By interview type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="type" />} />
            <Pie data={data} dataKey="sessions" nameKey="type" innerRadius={60} strokeWidth={5} stroke="var(--card)">
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalSessions}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Sessions
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Technical sessions lead <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Total sessions completed this month</div>
      </CardFooter>
    </Card>
  )
}
