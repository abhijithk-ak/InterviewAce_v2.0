"use client"

import { useEffect, useState } from 'react'

type SessionTypeChartProps = {
  data: {
    technical: number
    behavioral: number
    'system-design': number
  }
  height?: number
}

const COLORS = {
  technical: '#3B82F6',
  behavioral: '#10B981', 
  'system-design': '#F59E0B'
}

const TYPE_LABELS = {
  technical: 'Technical',
  behavioral: 'Behavioral',
  'system-design': 'System Design'
}

const ICONS = {
  technical: '</>',
  behavioral: '💬',
  'system-design': '🏗️'
}

export function SessionTypeChart({ data, height = 300 }: SessionTypeChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chartData = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: type as keyof typeof TYPE_LABELS,
      count,
      percentage: count,
      color: COLORS[type as keyof typeof COLORS]
    }))

  const totalSessions = Object.values(data).reduce((sum, count) => sum + count, 0)

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">Loading session distribution...</p>
        </div>
      </div>
    )
  }

  if (chartData.length === 0 || totalSessions === 0) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">No sessions completed yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" style={{ height }}>      
      {/* Legend */}
      <div className="space-y-3">
        {chartData.map((item) => {
          const percentage = Math.round((item.count / totalSessions) * 100)
          
          return (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-neutral-300 font-medium">
                    {ICONS[item.type]} {TYPE_LABELS[item.type]}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{item.count}</div>
                  <div className="text-xs text-neutral-400">{percentage}%</div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="bg-neutral-700 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Summary */}
      <div className="text-center pt-2">
        <div className="text-lg font-bold text-white">{totalSessions}</div>
        <div className="text-sm text-neutral-400">Total Sessions</div>
      </div>
    </div>
  )
}