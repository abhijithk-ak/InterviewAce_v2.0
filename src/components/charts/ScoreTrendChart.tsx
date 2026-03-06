"use client"

import { useEffect, useState } from 'react'

type ScoreTrendChartProps = {
  data: Array<{ date: string; score: number }>
  height?: number
}

export function ScoreTrendChart({ data, height = 300 }: ScoreTrendChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-neutral-400" style={{ height }}>
        <div className="text-center">
          <div className="text-2xl mb-2">📈</div>
          <p className="text-sm">Score trend will appear here</p>
        </div>
      </div>
    )
  }

  const maxScore = Math.max(...data.map(d => d.score))
  const minScore = Math.min(...data.map(d => d.score))
  const range = maxScore - minScore || 1

  return (
    <div className="space-y-4" style={{ height }}>
      <div className="flex justify-between text-sm text-neutral-400">
        <span>Progress Over Time</span>
        <span>{data.length} Sessions</span>
      </div>
      
      <div className="relative flex items-end justify-between bg-neutral-900 rounded-lg p-4" style={{ height: height - 60 }}>
        {data.map((point, index) => {
          const barHeight = Math.max(((point.score - minScore) / range) * (height - 120), 20)
          const isLast = index === data.length - 1
          
          return (
            <div key={index} className="flex flex-col items-center group relative">
              <div 
                className={`w-6 md:w-8 rounded-t transition-all duration-500 ${
                  point.score >= 80 ? 'bg-green-500' :
                  point.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                } hover:opacity-80 ${isLast ? 'animate-pulse' : ''}`}
                style={{ height: `${barHeight}px` }}
              />
              
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-neutral-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                Score: {point.score}%<br/>
                {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              
              {/* X-axis label */}
              <span className="text-xs text-neutral-500 mt-2 transform -rotate-45">
                {index + 1}
              </span>
            </div>
          )
        })}
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-500 -ml-8">
          <span>{maxScore}%</span>
          <span>{Math.round((maxScore + minScore) / 2)}%</span>
          <span>{minScore}%</span>
        </div>
      </div>
      
      <div className="flex justify-center">
        <span className="text-xs text-neutral-400">Session Number</span>
      </div>
    </div>
  )
}