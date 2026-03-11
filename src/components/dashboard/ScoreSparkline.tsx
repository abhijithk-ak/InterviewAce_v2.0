'use client'

interface ScoreSparklineProps {
  scores: number[]   // last N scores, oldest→newest
  width?: number
  height?: number
}

export function ScoreSparkline({ scores, width = 80, height = 28 }: ScoreSparklineProps) {
  if (scores.length < 2) {
    return <div style={{ width, height }} className="flex items-center justify-center">
      <div className="w-8 h-px bg-neutral-700" />
    </div>
  }

  const minVal = Math.min(...scores)
  const maxVal = Math.max(...scores)
  const range = maxVal - minVal || 1

  const points = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * (width - 4) + 2
    const y = height - 2 - ((s - minVal) / range) * (height - 4)
    return `${x},${y}`
  })

  const path = points.join(' L ')
  const last = scores[scores.length - 1]
  const first = scores[0]
  const trending = last >= first

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={path}
        fill="none"
        stroke={trending ? '#10b981' : '#f87171'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      <circle
        cx={Number(points[points.length - 1].split(',')[0])}
        cy={Number(points[points.length - 1].split(',')[1])}
        r="2.5"
        fill={trending ? '#10b981' : '#f87171'}
      />
    </svg>
  )
}
