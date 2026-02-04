"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartData = [
  { skill: "technical", score: 88, fill: "oklch(0.15 0 0)" },
  { skill: "communication", score: 72, fill: "oklch(0.35 0 0)" },
  { skill: "problemSolving", score: 94, fill: "oklch(0.55 0 0)" },
  { skill: "cultureFit", score: 85, fill: "oklch(0.7 0 0)" },
]

const chartDataDark = [
  { skill: "technical", score: 88, fill: "oklch(0.95 0 0)" },
  { skill: "communication", score: 72, fill: "oklch(0.75 0 0)" },
  { skill: "problemSolving", score: 94, fill: "oklch(0.55 0 0)" },
  { skill: "cultureFit", score: 85, fill: "oklch(0.4 0 0)" },
]

const chartConfig = {
  score: {
    label: "Score",
  },
  technical: {
    label: "Technical",
    color: "oklch(0.15 0 0)",
  },
  communication: {
    label: "Communication",
    color: "oklch(0.35 0 0)",
  },
  problemSolving: {
    label: "Problem Solving",
    color: "oklch(0.55 0 0)",
  },
  cultureFit: {
    label: "Culture Fit",
    color: "oklch(0.7 0 0)",
  },
} satisfies ChartConfig

export function SkillRadialChart() {
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

  return (
    <Card className="flex flex-col animate-fade-in stagger-4">
      <CardHeader className="items-center pb-0">
        <CardTitle>Skill Breakdown</CardTitle>
        <CardDescription>Your interview skill scores</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={data} startAngle={-90} endAngle={270} innerRadius={30} outerRadius={110}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="skill" />} />
            <RadialBar dataKey="score" background>
              <LabelList
                position="insideStart"
                dataKey="skill"
                className="fill-white dark:fill-black capitalize mix-blend-difference"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Based on your last 10 sessions</div>
      </CardFooter>
    </Card>
  )
}
