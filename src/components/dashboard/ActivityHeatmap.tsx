'use client'

interface ActivityDay {
  date: string      // ISO date string
  count: number
}

interface ActivityHeatmapProps {
  data: ActivityDay[]   // last ~35 days
  totalSessions: number
}

function getColor(count: number): string {
  if (count === 0) return '#1a1a1e'
  if (count === 1) return '#3730a3'
  if (count === 2) return '#4f46e5'
  return '#818cf8'
}

function getTooltipText(count: number, date: string): string {
  const d = new Date(date)
  const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (count === 0) return `No sessions on ${label}`
  return `${count} session${count > 1 ? 's' : ''} on ${label}`
}

export function ActivityHeatmap({ data, totalSessions }: ActivityHeatmapProps) {
  // Build a 5×7 grid (5 weeks)
  const weeks: ActivityDay[][] = []
  const padded = [...data]
  
  // Pad to multiple of 7 from the left (oldest days)
  while (padded.length < 35) {
    padded.unshift({ date: '', count: 0 })
  }
  // Take last 35
  const cells = padded.slice(-35)
  for (let w = 0; w < 5; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7))
  }

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const activeDays = data.filter(d => d.count > 0).length

  return (
    <div className="w-full">
      <div className="flex gap-1 items-start">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1 pt-1">
          {dayLabels.map((d, i) => (
            <div key={i} className="h-4 w-3 text-[9px] text-neutral-600 flex items-center">{d}</div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex gap-1 flex-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={day.date ? getTooltipText(day.count, day.date) : ''}
                  className="h-4 rounded-[3px] transition-opacity hover:opacity-80 cursor-default"
                  style={{ backgroundColor: getColor(day.count) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-neutral-600">{activeDays} active day{activeDays !== 1 ? 's' : ''} in the last 5 weeks</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-600">Less</span>
          {[0, 1, 2, 3].map(v => (
            <div key={v} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: getColor(v) }} />
          ))}
          <span className="text-[10px] text-neutral-600">More</span>
        </div>
      </div>
    </div>
  )
}
