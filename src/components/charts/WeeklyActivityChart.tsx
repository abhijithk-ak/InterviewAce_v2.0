'use client'

import React from 'react'

interface WeeklyActivityData {
  day: string
  sessions: number
}

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[]
  height?: number
}

export function WeeklyActivityChart({ data, height = 200 }: WeeklyActivityChartProps) {
  const maxSessions = Math.max(...data.map(d => d.sessions), 1)
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2 px-2">
        {days.map((day) => {
          const dayData = data.find(d => d.day === day) || { day, sessions: 0 }
          const barHeight = (dayData.sessions / maxSessions) * (height - 40)
          
          return (
            <div key={day} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-blue-500/80 rounded-t transition-all duration-300 hover:bg-blue-400 min-h-[4px]"
                style={{ height: `${barHeight}px` }}
              />
              <div className="text-xs text-neutral-400 mt-2">{day}</div>
              <div className="text-xs text-neutral-500">{dayData.sessions}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}