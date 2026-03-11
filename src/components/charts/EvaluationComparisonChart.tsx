"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from 'recharts'

type EvaluationComparisonData = {
  deterministicAverage: number
  semanticAverage: number
  hybridAverage: number
  correlation: number | null
  sampleCount: number
}

type EvaluationComparisonChartProps = {
  data: EvaluationComparisonData
  height?: number
}

const BARS = [
  { key: 'deterministicAverage', label: 'Deterministic', color: '#6366f1' },
  { key: 'semanticAverage',      label: 'Semantic (ML)',  color: '#8b5cf6' },
  { key: 'hybridAverage',        label: 'Hybrid',         color: '#10b981' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-neutral-400 text-xs mb-1">{label}</p>
      <p style={{ color: payload[0]?.fill }} className="text-lg font-bold">
        {payload[0]?.value?.toFixed(1)}%
      </p>
    </div>
  )
}

export function EvaluationComparisonChart({ data, height = 280 }: EvaluationComparisonChartProps) {
  if (data.sampleCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-neutral-400 gap-2" style={{ height }}>
        <div className="text-3xl">🔬</div>
        <p className="text-sm">No hybrid evaluation data yet</p>
        <p className="text-xs text-neutral-500">Complete interviews to generate comparison data</p>
      </div>
    )
  }

  const chartData = BARS.map(b => ({
    name: b.label,
    value: data[b.key as keyof EvaluationComparisonData] as number,
    color: b.color,
  }))

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={52}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="value" position="top" formatter={(v: number) => `${v.toFixed(1)}%`}
              style={{ fill: '#D1D5DB', fontSize: 12, fontWeight: 600 }} />
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 border-t border-neutral-700 pt-4">
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">Det. vs Semantic Gap</div>
          <div className={`text-base font-bold ${
            Math.abs(data.deterministicAverage - data.semanticAverage) <= 5 ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {data.deterministicAverage - data.semanticAverage > 0 ? '+' : ''}
            {(data.deterministicAverage - data.semanticAverage).toFixed(1)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">Correlation</div>
          <div className={`text-base font-bold ${
            data.correlation === null ? 'text-neutral-400'
              : data.correlation >= 0.7 ? 'text-green-400'
              : data.correlation >= 0.4 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {data.correlation === null ? 'N/A' : `r = ${data.correlation.toFixed(2)}`}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-1">Samples</div>
          <div className="text-base font-bold text-neutral-300">{data.sampleCount}</div>
        </div>
      </div>
    </div>
  )
}
