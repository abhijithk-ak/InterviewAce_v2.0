"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { weeklyScoresData } from "@/lib/chart-data"

const chartConfig = {
  avgScore: {
    label: "Avg Score",
    color: "var(--chart-1)",
  },
  target: {
    label: "Target",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ProgressLineChart() {
  const { sessions } = useSessions()
  const weeklyScoresData = sessions.length > 0 ? generateWeeklyScoresData(sessions) : emptyWeeklyData
  return (
    <Card className="animate-fade-in stagger-2">
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Your scores vs target goals</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart accessibilityLayer data={weeklyScoresData} margin={{ top: 24, left: 24, right: 24 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => value.split(" ")[1]}
            />
            <YAxis domain={[60, 100]} hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="target"
              type="monotone"
              stroke="var(--chart-3)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              dataKey="avgScore"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-1)", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "var(--chart-1)" }}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Exceeded target by 3 points <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Weekly average compared to your goals</div>
      </CardFooter>
    </Card>
  )
}
