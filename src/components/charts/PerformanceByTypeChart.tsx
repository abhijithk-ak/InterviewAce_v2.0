"use client"

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from 'recharts'

type PerformanceByTypeChartProps = {
  data: {
    technical: number
    behavioral: number
    'system-design': number
    hr: number
    technicalSessions: number
    behavioralSessions: number
    'system-designSessions': number
    hrSessions: number
  }
  height?: number
}

const TYPE_META = [
  { key: 'technical', label: 'Technical', color: '#6366f1' },
  { key: 'behavioral', label: 'Behavioral', color: '#10b981' },
  { key: 'system-design', label: 'System Design', color: '#f59e0b' },
  { key: 'hr', label: 'HR', color: '#ec4899' },
] as const

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white font-semibold text-sm">{point?.name}</p>
      <p className="text-indigo-300 text-sm font-bold">Avg Score: {point?.score}%</p>
      <p className="text-neutral-400 text-xs">{point?.sessions} sessions</p>
    </div>
  )
}

export function PerformanceByTypeChart({ data, height = 260 }: PerformanceByTypeChartProps) {
  const chartData = TYPE_META.map((meta) => ({
    name: meta.label,
    score: data[meta.key],
    sessions: data[`${meta.key}Sessions` as keyof typeof data] ?? 0,
    color: meta.color,
  }))

  const hasData = chartData.some((item) => item.sessions > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center text-neutral-400" style={{ height }}>
        <div className="text-center">
          <div className="text-2xl mb-2">📉</div>
          <p className="text-sm">No interview-type performance data yet</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
