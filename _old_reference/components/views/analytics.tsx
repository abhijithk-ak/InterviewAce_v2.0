"use client"
import { motion } from "framer-motion"
import { VIEW_TRANSITION, type Session } from "@/lib/data"
import { PerformanceAreaChart } from "@/components/charts/performance-area-chart"
import { SessionBarChart } from "@/components/charts/session-bar-chart"
import { SkillRadialChart } from "@/components/charts/skill-radial-chart"
import { SessionPieChart } from "@/components/charts/session-pie-chart"
import { ProgressLineChart } from "@/components/charts/progress-line-chart"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { ChartErrorBoundary } from "@/components/ui/error-boundary"
import { TrendingUp, Target, Clock, Trophy, BarChart3 } from "lucide-react"

interface AnalyticsProps {
  sessions?: Session[]
}

export function Analytics({ sessions = [] }: AnalyticsProps) {
  const totalSessions = sessions.length
  const avgScore = totalSessions > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / totalSessions) : 0
  const totalTime = sessions.reduce((acc, s) => acc + (s.duration || 0), 0)
  const bestScore = totalSessions > 0 ? Math.max(...sessions.map((s) => s.score)) : 0

  // Show empty state for new users
  const showEmptyState = totalSessions === 0

  return (
    <motion.div {...VIEW_TRANSITION} className="space-y-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Performance Analytics</h1>
        <p className="text-muted-foreground">
          Deep dive into your interview strengths and track your progress over time.
        </p>
      </header>

      {/* Show empty state for new users */}
      {showEmptyState ? (
        <CardCustom className="p-12 text-center">
          <BarChart3 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Analytics Yet</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            Complete your first interview session to start seeing detailed performance analytics and insights.
          </p>
        </CardCustom>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CardCustom className="p-5">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium mb-2">
                <Target className="w-4 h-4" />
                Total Sessions
              </div>
              <div className="text-3xl font-bold">{totalSessions}</div>
              {showEmptyState && (
                <div className="text-xs text-neutral-400 mt-1">Complete your first interview</div>
              )}
            </CardCustom>
            <CardCustom className="p-5">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium mb-2">
                <TrendingUp className="w-4 h-4" />
                Average Score
              </div>
              <div className="text-3xl font-bold">{avgScore}%</div>
            </CardCustom>
            <CardCustom className="p-5">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium mb-2">
                <Clock className="w-4 h-4" />
                Total Practice
              </div>
              <div className="text-3xl font-bold">{Math.round(totalTime / 60)}h</div>
              {showEmptyState && (
                <div className="text-xs text-neutral-400 mt-1">Start practicing to track time</div>
              )}
            </CardCustom>
            <CardCustom className="p-5">
              <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium mb-2">
                <Trophy className="w-4 h-4" />
                Best Score
              </div>
              <div className="text-3xl font-bold">{bestScore > 0 ? `${bestScore}%` : "N/A"}</div>
              {showEmptyState && (
                <div className="text-xs text-neutral-400 mt-1">Your best score will appear here</div>
              )}
            </CardCustom>
          </div>

          {/* Main Performance Chart */}
          <ChartErrorBoundary>
            <PerformanceAreaChart />
          </ChartErrorBoundary>

          {/* Activity & Skills Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartErrorBoundary>
              <SessionBarChart />
            </ChartErrorBoundary>
            <ChartErrorBoundary>
              <ProgressLineChart />
            </ChartErrorBoundary>
          </div>

          {/* Distribution Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartErrorBoundary>
              <SessionPieChart />
            </ChartErrorBoundary>
            <ChartErrorBoundary>
              <SkillRadialChart />
            </ChartErrorBoundary>
          </div>
        </>
      )}
    </motion.div>
  )
}
