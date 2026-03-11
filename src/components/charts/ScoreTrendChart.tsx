"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

type ScoreTrendChartProps = {
  data: Array<{ date: string; score: number }>
  height?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const score = payload[0]?.value as number
  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-neutral-400 text-xs mb-1">Session {label}</p>
      <p className={`text-lg font-bold ${
        score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
      }`}>{score}%</p>
    </div>
  )
}

export function ScoreTrendChart({ data, height = 300 }: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-neutral-400" style={{ height }}>
        <div className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <p className="text-sm">Complete more sessions to see your trend</p>
        </div>
      </div>
    )
  }

  const chartData = data.map((d, i) => ({
    session: i + 1,
    score: d.score,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  const avg = Math.round(chartData.reduce((s, d) => s + d.score, 0) / chartData.length)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis
          dataKey="session"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Session', position: 'insideBottom', offset: -2, fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#6B7280', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={avg} stroke="#4B5563" strokeDasharray="4 4"
          label={{ value: `Avg ${avg}%`, fill: '#9CA3AF', fontSize: 11, position: 'insideTopRight' }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#scoreGradient)"
          dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
