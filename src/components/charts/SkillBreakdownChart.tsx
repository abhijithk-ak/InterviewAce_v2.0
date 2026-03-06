"use client"

import { useEffect, useState } from 'react'

type SkillBreakdownChartProps = {
  data: {
    technical: number
    communication: number
    confidence: number
    clarity: number
  }
  height?: number
}

const COLORS = {
  technical: '#3B82F6',
  communication: '#10B981', 
  confidence: '#F59E0B',
  clarity: '#8B5CF6'
}

const SKILL_LABELS = {
  technical: 'Technical',
  communication: 'Communication',
  confidence: 'Confidence',
  clarity: 'Clarity'
}

export function SkillBreakdownChart({ data, height = 300 }: SkillBreakdownChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center text-neutral-400" style={{ height }}>
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">Loading skill breakdown...</p>
        </div>
      </div>
    )
  }

  const chartData = Object.entries(data).map(([skill, value]) => ({
    skill: skill as keyof typeof SKILL_LABELS,
    value: Math.round(value * 10), // Convert to 0-100 scale
    color: COLORS[skill as keyof typeof COLORS]
  }))

  return (
    <div className="space-y-6" style={{ height }}>
      <div className="text-center text-sm text-neutral-400">
        Skill Performance (0-100 scale)
      </div>
      
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={item.skill} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white font-medium">
                  {SKILL_LABELS[item.skill]}
                </span>
              </div>
              <span className={`font-bold text-lg ${
                item.value >= 80 ? 'text-green-400' :
                item.value >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {item.value}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-neutral-700 rounded-full h-6">
                <div 
                  className="h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{ 
                    width: `${item.value}%`, 
                    backgroundColor: item.color
                  }}
                >
                  {item.value > 15 && (
                    <span className="text-white text-sm font-medium">
                      {item.value}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full" />
          <span>Excellent (80+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span>Good (60-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full" />
          <span>Needs Work (&lt;60)</span>
        </div>
      </div>
    </div>
  )
}