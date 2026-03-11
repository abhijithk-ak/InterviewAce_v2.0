"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type SessionTypeChartProps = {
  data: {
    technical: number
    behavioral: number
    'system-design': number
    hr?: number
  }
  height?: number
}

const PALETTE = [
  { key: 'technical',    label: 'Technical',    color: '#6366f1' },
  { key: 'behavioral',   label: 'Behavioral',   color: '#10b981' },
  { key: 'system-design',label: 'System Design',color: '#f59e0b' },
  { key: 'hr',           label: 'HR',           color: '#ec4899' },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white font-semibold text-sm">{d.name}</p>
      <p style={{ color: d.payload.fill }} className="font-bold">{d.value} sessions</p>
      <p className="text-neutral-400 text-xs">{d.payload.pct}%</p>
    </div>
  )
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function SessionTypeChart({ data, height = 280 }: SessionTypeChartProps) {
  const total = Object.values(data).reduce((s, v) => s + (v ?? 0), 0)

  const chartData = PALETTE
    .filter(p => (data[p.key as keyof typeof data] ?? 0) > 0)
    .map(p => ({
      name: p.label,
      value: data[p.key as keyof typeof data] ?? 0,
      fill: p.color,
      pct: total > 0 ? Math.round(((data[p.key as keyof typeof data] ?? 0) / total) * 100) : 0,
    }))

  if (chartData.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center text-neutral-400" style={{ height }}>
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">No sessions yet</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.fill} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => <span style={{ color: '#D1D5DB', fontSize: 13 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
