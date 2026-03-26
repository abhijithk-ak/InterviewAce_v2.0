"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Line,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

type ScoreTrendChartProps = {
  data: Array<{
    date: string
    score: number
    type?: string
    difficulty?: string
  }>
  height?: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload
  const score = point?.score as number
  const movingAvg = point?.movingAverage as number | undefined
  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-neutral-400 text-xs mb-1">Session {label}</p>
      <p className={`text-lg font-bold ${
        score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
      }`}>{score}%</p>
      {typeof movingAvg === 'number' && (
        <p className="text-indigo-300 text-xs">3-session avg: {movingAvg}%</p>
      )}
      {(point?.type || point?.difficulty) && (
        <p className="text-neutral-400 text-xs mt-1">
          {(point?.type || 'Unknown')} • {(point?.difficulty || 'Unknown')}
        </p>
      )}
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

  const chartData = data.map((d, i) => {
    const windowStart = Math.max(0, i - 2)
    const window = data.slice(windowStart, i + 1)
    const movingAverage = Math.round(window.reduce((sum, item) => sum + item.score, 0) / window.length)

    return {
    session: i + 1,
    score: d.score,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: d.type,
      difficulty: d.difficulty,
      movingAverage,
    }
  })

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
        <Line
          type="monotone"
          dataKey="movingAverage"
          stroke="#22d3ee"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
          name="Moving Average"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
