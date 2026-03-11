"use client"

import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts'

type SkillBreakdownChartProps = {
  data: {
    technical: number
    communication: number
    confidence: number
    clarity: number
  }
  height?: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white font-semibold">{payload[0]?.payload?.skill}</p>
      <p className="text-indigo-400 text-sm font-bold">{payload[0]?.value}%</p>
    </div>
  )
}

export function SkillBreakdownChart({ data, height = 300 }: SkillBreakdownChartProps) {
  const chartData = [
    { skill: 'Technical',      value: data.technical      },
    { skill: 'Communication',  value: data.communication  },
    { skill: 'Confidence',     value: data.confidence     },
    { skill: 'Clarity',        value: data.clarity        },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 500 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
