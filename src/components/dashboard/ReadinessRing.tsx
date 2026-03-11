'use client'

import { useEffect, useRef } from 'react'

interface ReadinessRingProps {
  score: number          // 0-100
  sessions: number
  trend: 'improving' | 'declining' | 'stable'
}

export function ReadinessRing({ score, sessions, trend }: ReadinessRingProps) {
  const circleRef = useRef<SVGCircleElement>(null)

  const radius = 72
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const offset = circumference - (clampedScore / 100) * circumference

  const trendColor =
    trend === 'improving' ? '#10b981' : trend === 'declining' ? '#f87171' : '#818cf8'

  const label =
    clampedScore >= 80 ? 'Interview Ready' :
    clampedScore >= 60 ? 'On Track' :
    clampedScore >= 40 ? 'Needs Practice' : 'Just Starting'

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.strokeDashoffset = String(circumference)
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)'
      el.style.strokeDashoffset = String(offset)
    })
  }, [score, circumference, offset])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{ background: trendColor }}
        />
        <svg width="180" height="180" viewBox="0 0 180 180" className="relative z-10">
          {/* Track */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="#1f1f23"
            strokeWidth="12"
          />
          {/* Filled arc */}
          <circle
            ref={circleRef}
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={trendColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform="rotate(-90 90 90)"
          />
          {/* Score text */}
          <text x="90" y="82" textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="inherit">
            {clampedScore}%
          </text>
          <text x="90" y="100" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="inherit">
            {label}
          </text>
        </svg>
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs text-neutral-500">{sessions} session{sessions !== 1 ? 's' : ''} completed</p>
      </div>
    </div>
  )
}
