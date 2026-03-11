'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

interface WeeklyActivityData {
  day: string
  sessions: number
}

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[]
  height?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const v = payload[0].value as number
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 shadow-xl">
      <p className="text-neutral-400 text-xs">{label}</p>
      <p className="text-indigo-400 text-sm font-bold">{v} session{v !== 1 ? 's' : ''}</p>
    </div>
  )
}

export function WeeklyActivityChart({ data, height = 200 }: WeeklyActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -28, bottom: 0 }} barSize={30}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6B7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.sessions > 0 ? '#6366f1' : '#1f1f23'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}