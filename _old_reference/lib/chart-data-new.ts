import type { Session } from "./data"

// Dynamic chart data generators based on actual session data

// Generate performance over time data from sessions
export function generatePerformanceOverTimeData(sessions: Session[]) {
  if (sessions.length === 0) return []
  
  // Group sessions by week
  const weeklyData: Record<string, { technical: number[], behavioral: number[], systemDesign: number[] }> = {}
  
  sessions.forEach(session => {
    const date = new Date(session.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { technical: [], behavioral: [], systemDesign: [] }
    }
    
    if (session.type === "Technical") weeklyData[weekKey].technical.push(session.score)
    else if (session.type === "Behavioral") weeklyData[weekKey].behavioral.push(session.score)
    else if (session.type === "System Design") weeklyData[weekKey].systemDesign.push(session.score)
  })
  
  return Object.entries(weeklyData)
    .map(([date, scores]) => ({
      date,
      technical: scores.technical.length > 0 ? Math.round(scores.technical.reduce((a, b) => a + b, 0) / scores.technical.length) : 0,
      behavioral: scores.behavioral.length > 0 ? Math.round(scores.behavioral.reduce((a, b) => a + b, 0) / scores.behavioral.length) : 0,
      systemDesign: scores.systemDesign.length > 0 ? Math.round(scores.systemDesign.reduce((a, b) => a + b, 0) / scores.systemDesign.length) : 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-12) // Last 12 weeks
}

// Generate session distribution data
export function generateSessionDistributionData(sessions: Session[]) {
  const distribution: Record<string, number> = {}
  
  sessions.forEach(session => {
    const type = session.type.toLowerCase().replace(" ", "")
    distribution[type] = (distribution[type] || 0) + 1
  })
  
  return Object.entries(distribution).map(([type, count]) => ({
    type,
    sessions: count,
    fill: `var(--color-${type})`
  }))
}

// Generate skill breakdown from sessions
export function generateSkillBreakdownData(sessions: Session[]) {
  if (sessions.length === 0) return []
  
  const skills = {
    technical: [] as number[],
    communication: [] as number[],
    confidence: [] as number[],
    relevance: [] as number[]
  }
  
  sessions.forEach(session => {
    if (session.scores) {
      skills.technical.push(session.scores.technical)
      skills.communication.push(session.scores.communication)
      skills.confidence.push(session.scores.confidence)
      skills.relevance.push(session.scores.relevance)
    }
  })
  
  return [
    { 
      skill: "Technical", 
      score: skills.technical.length > 0 ? Math.round(skills.technical.reduce((a, b) => a + b, 0) / skills.technical.length) : 0,
      fill: "var(--color-technical)" 
    },
    { 
      skill: "Communication", 
      score: skills.communication.length > 0 ? Math.round(skills.communication.reduce((a, b) => a + b, 0) / skills.communication.length) : 0,
      fill: "var(--color-communication)" 
    },
    { 
      skill: "Confidence", 
      score: skills.confidence.length > 0 ? Math.round(skills.confidence.reduce((a, b) => a + b, 0) / skills.confidence.length) : 0,
      fill: "var(--color-problemSolving)" 
    },
    { 
      skill: "Relevance", 
      score: skills.relevance.length > 0 ? Math.round(skills.relevance.reduce((a, b) => a + b, 0) / skills.relevance.length) : 0,
      fill: "var(--color-cultureFit)" 
    },
  ]
}

// Generate daily activity data for current week
export function generateDailyActivityData(sessions: Session[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  
  const dailyStats: Record<string, { sessions: number, minutes: number }> = {}
  days.forEach(day => dailyStats[day] = { sessions: 0, minutes: 0 })
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.date)
    if (sessionDate >= weekStart && sessionDate <= today) {
      const dayName = days[sessionDate.getDay()]
      dailyStats[dayName].sessions++
      dailyStats[dayName].minutes += session.duration || 0
    }
  })
  
  return days.map(day => ({
    day,
    sessions: dailyStats[day].sessions,
    minutes: dailyStats[day].minutes
  }))
}

// Generate weekly progress data
export function generateWeeklyScoresData(sessions: Session[]) {
  if (sessions.length === 0) return []
  
  const weeklyScores: Record<string, number[]> = {}
  
  sessions.forEach(session => {
    const date = new Date(session.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]
    
    if (!weeklyScores[weekKey]) weeklyScores[weekKey] = []
    weeklyScores[weekKey].push(session.score)
  })
  
  return Object.entries(weeklyScores)
    .map(([date, scores], index) => ({
      week: `Week ${index + 1}`,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      target: 85
    }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-6) // Last 6 weeks
}

// Generate score distribution
export function generateScoreDistributionData(sessions: Session[]) {
  const distribution = {
    excellent: 0, // 90+
    good: 0,      // 75-89
    average: 0,   // 60-74
    needsWork: 0  // <60
  }
  
  sessions.forEach(session => {
    if (session.score >= 90) distribution.excellent++
    else if (session.score >= 75) distribution.good++
    else if (session.score >= 60) distribution.average++
    else distribution.needsWork++
  })
  
  return [
    { category: "excellent", count: distribution.excellent, fill: "var(--color-excellent)" },
    { category: "good", count: distribution.good, fill: "var(--color-good)" },
    { category: "average", count: distribution.average, fill: "var(--color-average)" },
    { category: "needsWork", count: distribution.needsWork, fill: "var(--color-needsWork)" },
  ].filter(item => item.count > 0)
}

// Fallback data for empty states (for chart structure only)
export const emptyPerformanceData = [{ date: new Date().toISOString().split('T')[0], technical: 0, behavioral: 0, systemDesign: 0 }]
export const emptyDistributionData = [{ type: "technical", sessions: 0, fill: "var(--color-technical)" }]
export const emptySkillData = [
  { skill: "Technical", score: 0, fill: "var(--color-technical)" },
  { skill: "Communication", score: 0, fill: "var(--color-communication)" },
]
export const emptyDailyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({ day, sessions: 0, minutes: 0 }))
export const emptyWeeklyData = [{ week: "Week 1", avgScore: 0, target: 85 }]
export const emptyScoreDistribution = [{ category: "excellent", count: 0, fill: "var(--color-excellent)" }]