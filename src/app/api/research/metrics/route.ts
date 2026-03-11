/**
 * Research Metrics API - Admin-only endpoint for IEEE paper analytics
 * Fetches comprehensive evaluation data across all users
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/config/admin"
import { connectDB } from "@/lib/db/mongoose"
import { SessionModel } from "@/lib/db/models/Session"

export async function GET(req: NextRequest) {
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required", success: false },
        { status: 401 }
      )
    }

    // Admin authorization check
    if (!isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required", success: false },
        { status: 403 }
      )
    }

    await connectDB()

    // Fetch ALL sessions across all users for research analysis
    const allSessions = await SessionModel.find({})
      .sort({ startedAt: -1 })
      .lean()

    const totalEvaluations = allSessions.length

    if (totalEvaluations === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalEvaluations: 0,
          totalQuestions: 0,
          deterministicAverage: 0,
          semanticAverage: 0,
          hybridAverage: 0,
          deterministicStdDev: 0,
          semanticStdDev: 0,
          hybridStdDev: 0,
          correlation: null,
          aiSuccessRate: 0,
          fallbackRate: 0,
          avgLatency: 0,
          scoreDistribution: [
            { range: "0-20", deterministic: 0, semantic: 0, hybrid: 0 },
            { range: "21-40", deterministic: 0, semantic: 0, hybrid: 0 },
            { range: "41-60", deterministic: 0, semantic: 0, hybrid: 0 },
            { range: "61-80", deterministic: 0, semantic: 0, hybrid: 0 },
            { range: "81-100", deterministic: 0, semantic: 0, hybrid: 0 },
          ],
          methodComparison: [],
          timeSeriesData: [],
          timeSeriesDataByDay: [],
          sessionTimelineData: [],
          difficultyBreakdown: {},
          typeBreakdown: {},
          scatterPlotData: [],
          boxPlotData: [],
        },
      })
    }

    // Extract all question-level metrics for detailed analysis
    const allQuestionMetrics: Array<{
      det: number
      sem: number
      hyb: number
      latency: number
      answerLength: number
      timestamp: Date
      difficulty: string
      type: string
      aiSource: string
    }> = []

    allSessions.forEach((session) => {
      session.questions?.forEach((question: any) => {
        // Pull from metrics field (new sessions)
        if (question.metrics?.deterministicScore != null) {
          allQuestionMetrics.push({
            det: question.metrics.deterministicScore,
            sem: question.metrics.semanticScore || 0, // Already in 0-100 scale
            hyb: question.metrics.finalScore,
            latency: question.metrics.responseTime || 0,
            answerLength: question.metrics.answerLength || 0,
            timestamp: new Date(question.metrics.timestamp || session.startedAt),
            difficulty: session.config?.difficulty || "medium",
            type: session.config?.type || "technical",
            aiSource: question.evaluation?.source || "fallback",
          })
        }
        // Fallback: pull from evaluation field (old sessions)
        else if (question.evaluation?.deterministicScore != null) {
          allQuestionMetrics.push({
            det: question.evaluation.deterministicScore,
            sem: question.evaluation.semanticScore || 0, // Already in 0-100 scale
            hyb: question.evaluation.finalScore || question.evaluation.score || question.evaluation.deterministicScore,
            latency: 0,
            answerLength: 0,
            timestamp: session.startedAt,
            difficulty: session.config?.difficulty || "medium",
            type: session.config?.type || "technical",
            aiSource: "unknown",
          })
        }
      })
    })

    const totalQuestions = allQuestionMetrics.length

    // Calculate averages
    const avgDet = allQuestionMetrics.reduce((s, m) => s + m.det, 0) / totalQuestions
    const avgSem = allQuestionMetrics.reduce((s, m) => s + m.sem, 0) / totalQuestions
    const avgHyb = allQuestionMetrics.reduce((s, m) => s + m.hyb, 0) / totalQuestions

    // Calculate standard deviations
    const stdDevDet = Math.sqrt(
      allQuestionMetrics.reduce((s, m) => s + Math.pow(m.det - avgDet, 2), 0) / totalQuestions
    )
    const stdDevSem = Math.sqrt(
      allQuestionMetrics.reduce((s, m) => s + Math.pow(m.sem - avgSem, 2), 0) / totalQuestions
    )
    const stdDevHyb = Math.sqrt(
      allQuestionMetrics.reduce((s, m) => s + Math.pow(m.hyb - avgHyb, 2), 0) / totalQuestions
    )

    // Calculate correlation between deterministic and semantic scores
    let correlation: number | null = null
    if (totalQuestions >= 2) {
      let num = 0,
        denD = 0,
        denS = 0
      for (const m of allQuestionMetrics) {
        const dD = m.det - avgDet
        const dS = m.sem - avgSem
        num += dD * dS
        denD += dD * dD
        denS += dS * dS
      }
      const denom = Math.sqrt(denD * denS)
      correlation = denom === 0 ? null : Math.round((num / denom) * 1000) / 1000
    }

    // AI success rate
    const aiSuccessCount = allQuestionMetrics.filter((m) => m.aiSource === "ai").length
    const aiSuccessRate = totalQuestions > 0 ? Math.round((aiSuccessCount / totalQuestions) * 100) : 0
    const fallbackRate = 100 - aiSuccessRate

    // Average latency
    const latencies = allQuestionMetrics.filter((m) => m.latency > 0).map((m) => m.latency)
    const avgLatency =
      latencies.length > 0 ? Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 10) / 10 : 0

    // Score distribution (histograms) - always show all ranges even if 0
    const scoreRanges = [
      { range: "0-20", min: 0, max: 20 },
      { range: "21-40", min: 21, max: 40 },
      { range: "41-60", min: 41, max: 60 },
      { range: "61-80", min: 61, max: 80 },
      { range: "81-100", min: 81, max: 100 },
    ]

    const scoreDistribution = scoreRanges.map((r) => ({
      range: r.range,
      deterministic: allQuestionMetrics.filter((m) => m.det >= r.min && m.det <= r.max).length,
      semantic: allQuestionMetrics.filter((m) => m.sem >= r.min && m.sem <= r.max).length,
      hybrid: allQuestionMetrics.filter((m) => m.hyb >= r.min && m.hyb <= r.max).length,
    }))

    // Scatter plot data for correlation visualization (sample 100 points max for performance)
    const scatterSample = allQuestionMetrics
      .slice(0, Math.min(100, totalQuestions))
      .map(m => ({
        deterministic: m.det,
        semantic: m.sem,
        hybrid: m.hyb,
      }))

    // Box plot data (for statistical distribution visualization)
    const detSorted = [...allQuestionMetrics.map(m => m.det)].sort((a, b) => a - b)
    const semSorted = [...allQuestionMetrics.map(m => m.sem)].sort((a, b) => a - b)
    const hybSorted = [...allQuestionMetrics.map(m => m.hyb)].sort((a, b) => a - b)

    const getBoxPlotStats = (sorted: number[]) => {
      const n = sorted.length
      if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0 }
      return {
        min: sorted[0],
        q1: sorted[Math.floor(n * 0.25)],
        median: sorted[Math.floor(n * 0.5)],
        q3: sorted[Math.floor(n * 0.75)],
        max: sorted[n - 1],
      }
    }

    const boxPlotData = [
      { method: "Deterministic", ...getBoxPlotStats(detSorted) },
      { method: "Semantic", ...getBoxPlotStats(semSorted) },
      { method: "Hybrid", ...getBoxPlotStats(hybSorted) },
    ]

    // Method comparison for bar chart
    const methodComparison = [
      {
        method: "Deterministic",
        avgScore: Math.round(avgDet * 10) / 10,
        stdDev: Math.round(stdDevDet * 10) / 10,
        sampleCount: totalQuestions,
      },
      {
        method: "Semantic",
        avgScore: Math.round(avgSem * 10) / 10,
        stdDev: Math.round(stdDevSem * 10) / 10,
        sampleCount: totalQuestions,
      },
      {
        method: "Hybrid",
        avgScore: Math.round(avgHyb * 10) / 10,
        stdDev: Math.round(stdDevHyb * 10) / 10,
        sampleCount: totalQuestions,
      },
    ]

    // Time series data - SESSION-BASED (per session, chronological)
    const sessionTimelineData = allSessions
      .map((session, index) => {
        // Calculate average scores for this session's questions
        const sessionQuestions = allQuestionMetrics.filter((m) => 
          m.timestamp >= session.startedAt && 
          (!session.endedAt || m.timestamp <= session.endedAt)
        )
        
        if (sessionQuestions.length === 0) return null

        const avgDet = sessionQuestions.reduce((s, m) => s + m.det, 0) / sessionQuestions.length
        const avgSem = sessionQuestions.reduce((s, m) => s + m.sem, 0) / sessionQuestions.length
        const avgHyb = sessionQuestions.reduce((s, m) => s + m.hyb, 0) / sessionQuestions.length

        return {
          sessionNumber: index + 1,
          sessionId: session._id.toString(),
          timestamp: session.startedAt,
          date: session.startedAt.toISOString().split("T")[0],
          deterministic: Math.round(avgDet * 10) / 10,
          semantic: Math.round(avgSem * 10) / 10,
          hybrid: Math.round(avgHyb * 10) / 10,
          questionCount: sessionQuestions.length,
          role: session.config?.role || "Unknown",
          difficulty: session.config?.difficulty || "medium",
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime())
      .map((item: any, idx: number) => ({ ...item, sessionNumber: idx + 1 }))

    // Time series data - DAY-BASED (last 30 days, grouped by day)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentMetrics = allQuestionMetrics.filter((m) => m.timestamp >= thirtyDaysAgo)

    // Group by date
    const dateGroups: Record<
      string,
      { det: number[]; sem: number[]; hyb: number[] }
    > = {}

    recentMetrics.forEach((m) => {
      const date = m.timestamp.toISOString().split("T")[0]
      if (!dateGroups[date]) {
        dateGroups[date] = { det: [], sem: [], hyb: [] }
      }
      dateGroups[date].det.push(m.det)
      dateGroups[date].sem.push(m.sem)
      dateGroups[date].hyb.push(m.hyb)
    })

    const timeSeriesDataByDay = Object.entries(dateGroups)
      .map(([date, scores]) => ({
        date,
        deterministic: Math.round((scores.det.reduce((a, b) => a + b, 0) / scores.det.length) * 10) / 10,
        semantic: Math.round((scores.sem.reduce((a, b) => a + b, 0) / scores.sem.length) * 10) / 10,
        hybrid: Math.round((scores.hyb.reduce((a, b) => a + b, 0) / scores.hyb.length) * 10) / 10,
        count: scores.det.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Breakdown by difficulty
    const difficultyBreakdown: Record<string, { count: number; avgScore: number }> = {}
    const difficultyGroups: Record<string, number[]> = {}

    allQuestionMetrics.forEach((m) => {
      const diff = m.difficulty.toLowerCase()
      if (!difficultyGroups[diff]) {
        difficultyGroups[diff] = []
      }
      difficultyGroups[diff].push(m.hyb)
    })

    Object.entries(difficultyGroups).forEach(([diff, scores]) => {
      difficultyBreakdown[diff] = {
        count: scores.length,
        avgScore: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
      }
    })

    // Breakdown by interview type
    const typeBreakdown: Record<string, { count: number; avgScore: number }> = {}
    const typeGroups: Record<string, number[]> = {}

    allQuestionMetrics.forEach((m) => {
      const type = m.type.toLowerCase().replace(/[\s_]+/g, "-")
      if (!typeGroups[type]) {
        typeGroups[type] = []
      }
      typeGroups[type].push(m.hyb)
    })

    Object.entries(typeGroups).forEach(([type, scores]) => {
      typeBreakdown[type] = {
        count: scores.length,
        avgScore: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalEvaluations,
        totalQuestions,
        deterministicAverage: Math.round(avgDet * 10) / 10,
        semanticAverage: Math.round(avgSem * 10) / 10,
        hybridAverage: Math.round(avgHyb * 10) / 10,
        deterministicStdDev: Math.round(stdDevDet * 10) / 10,
        semanticStdDev: Math.round(stdDevSem * 10) / 10,
        hybridStdDev: Math.round(stdDevHyb * 10) / 10,
        correlation,
        aiSuccessRate,
        fallbackRate,
        avgLatency: avgLatency / 1000, // Convert ms to seconds
        scoreDistribution,
        methodComparison,
        timeSeriesData: timeSeriesDataByDay, // Legacy: day-based for backward compatibility
        timeSeriesDataByDay, // NEW: Explicit day-based aggregation
        sessionTimelineData, // NEW: Per-session chronological data
        difficultyBreakdown,
        typeBreakdown,
        scatterPlotData: scatterSample,
        boxPlotData,
      },
    })
  } catch (error) {
    console.error("Research metrics error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch research metrics",
      },
      { status: 500 }
    )
  }
}
