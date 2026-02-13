// Overview KPI Cards Component

import { Card, CardContent } from "@/components/ui"
import { Brain, Target, TrendingUp, AlertTriangle } from "lucide-react"

type OverviewData = {
  totalSessions: number
  averageScore: number  // 0-100 scale
  strongestSkill: string
  strongestSkillScore: number  // 0-10 scale
  weakestSkill: string
  weakestSkillScore: number  // 0-10 scale
}

type OverviewCardsProps = {
  data: OverviewData
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const {
    totalSessions,
    averageScore,
    strongestSkill,
    strongestSkillScore,
    weakestSkill,
    weakestSkillScore
  } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Sessions */}
      <Card className="border-neutral-700 bg-neutral-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Total Sessions</p>
              <p className="text-2xl font-bold text-white">{totalSessions}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      {/* Average Score */}
      <Card className="border-neutral-700 bg-neutral-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-white">{averageScore}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      {/* Strongest Skill */}
      <Card className="border-neutral-700 bg-neutral-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Strongest Skill</p>
              <p className="text-lg font-bold text-white">{strongestSkill}</p>
              <p className="text-sm text-green-400">{strongestSkillScore.toFixed(1)}/10</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      {/* Weakest Skill */}
      <Card className="border-neutral-700 bg-neutral-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Weakest Skill</p>
              <p className="text-lg font-bold text-white">{weakestSkill}</p>
              <p className="text-sm text-orange-400">{weakestSkillScore.toFixed(1)}/10</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}