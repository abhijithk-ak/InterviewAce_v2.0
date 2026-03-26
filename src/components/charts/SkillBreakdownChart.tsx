"use client"

import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts'

type SkillBreakdownChartProps = {
  data: {
    concept: number
    semantic: number
    clarity: number
    overall: number
  }
  height?: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white font-semibold">{row?.skill}</p>
      <p className="text-indigo-400 text-sm font-bold">{payload[0]?.value}%</p>
      <p className="text-neutral-400 text-xs mt-1">{row?.description}</p>
    </div>
  )
}

export function SkillBreakdownChart({ data, height = 300 }: SkillBreakdownChartProps) {
  const chartData = [
    {
      skill: 'Knowledge Accuracy',
      value: data.concept,
      description: 'How accurately your core concepts match expected technical understanding.',
    },
    {
      skill: 'Answer Coverage',
      value: data.semantic,
      description: 'How completely your response covers the expected points and context.',
    },
    {
      skill: 'Communication Clarity',
      value: data.clarity,
      description: 'How clearly and coherently you explain your answer structure and reasoning.',
    },
    {
      skill: 'Overall',
      value: data.overall,
      description: 'Your blended hybrid interview performance across all scoring dimensions.',
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={chartData} outerRadius="76%" margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
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
