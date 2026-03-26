/**
 * Research Metrics API - Admin-only endpoint for IEEE paper analytics
 * Fetches comprehensive evaluation data across all users
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/config/admin"
import { connectDB } from "@/lib/db/mongoose"
import { SessionModel } from "@/lib/db/models/Session"

const HYBRID_METHOD = "AI + MiniLM Hybrid"

type QuestionMetric = {
  det: number
  sem: number
  clarity: number
  hyb: number
  latency: number
  answerLength: number
  timestamp: Date
  difficulty: string
  type: string
  answerLabel: "correct" | "partial" | "incorrect" | "unknown"
}

type SessionTimelinePoint = {
  sessionNumber: number
  sessionId: string
  date: string
  timestamp: string
  deterministic: number
  semantic: number
  hybrid: number
  questionCount: number
}

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

    const researchQuery = { "config.source": "research" }
    const hasResearchDataset = (await SessionModel.countDocuments(researchQuery)) > 0

    // Prefer the explicitly tagged research dataset when present.
    const allSessions = await SessionModel.find(hasResearchDataset ? researchQuery : {})
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
          clarityAverage: 0,
          hybridAverage: 0,
          deterministicStdDev: 0,
          semanticStdDev: 0,
          clarityStdDev: 0,
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
          errorDetectionEffectiveness: [],
          hybridContributionAnalysis: [],
          difficultyBreakdown: {},
          typeBreakdown: {},
          scatterPlotData: [],
          boxPlotData: [],
        },
      })
    }

    // Extract all question-level metrics for detailed analysis
    const allQuestionMetrics: QuestionMetric[] = []

    // Helper: breakdown scores are 0-10; some older sessions mistakenly stored them
    // at 0-100 scale. Auto-detect by threshold and normalise to 0-100.
    const toHundred = (v: number | null | undefined): number => {
      if (!v || !Number.isFinite(v)) return 0
      return Math.min(100, v > 10 ? v : v * 10)
    }

    const normalizeAnswerLabel = (value: unknown): QuestionMetric["answerLabel"] => {
      if (value === "correct" || value === "partial" || value === "incorrect") {
        return value
      }
      return "unknown"
    }

    const extractQuestionScores = (
      question: any
    ): { det: number; sem: number; hyb: number } | null => {
      if (question.metrics?.conceptScore != null || question.metrics?.overallScore != null) {
        return {
          det: toHundred(question.metrics.conceptScore),
          sem: toHundred(question.metrics.semanticScore),
          hyb: Math.min(100, Math.max(0, question.metrics.overallScore || question.metrics.finalScore || 0)),
        }
      }

      if (question.evaluation?.breakdown != null) {
        const bd = question.evaluation.breakdown
        return {
          det: toHundred(bd.conceptScore),
          sem: toHundred(bd.semanticScore),
          hyb: Math.min(100, Math.max(0, question.evaluation.overallScore || 0)),
        }
      }

      if (question.metrics?.deterministicScore != null) {
        return {
          det: Math.min(100, Math.max(0, question.metrics.deterministicScore)),
          sem: toHundred(question.metrics.semanticScore),
          hyb: Math.min(100, Math.max(0, question.metrics.finalScore || 0)),
        }
      }

      if (question.evaluation?.conceptScore != null || question.evaluation?.overallScore != null) {
        return {
          det: toHundred(question.evaluation.conceptScore),
          sem: toHundred(question.evaluation.semanticScore),
          hyb: Math.min(100, Math.max(0, question.evaluation.overallScore || question.evaluation.finalScore || question.evaluation.score || 0)),
        }
      }

      if (question.evaluation?.deterministicScore != null) {
        return {
          det: Math.min(100, Math.max(0, question.evaluation.deterministicScore)),
          sem: toHundred(question.evaluation.semanticScore),
          hyb: Math.min(100, Math.max(0, question.evaluation.finalScore || question.evaluation.score || question.evaluation.deterministicScore)),
        }
      }

      return null
    }

    allSessions.forEach((session) => {
      session.questions?.forEach((question: any) => {
        // PRIORITY 1: Canonical format — metrics with conceptScore / overallScore (new sessions)
        if (question.metrics?.conceptScore != null || question.metrics?.overallScore != null) {
          allQuestionMetrics.push({
            det: toHundred(question.metrics.conceptScore),
            sem: toHundred(question.metrics.semanticScore),
            clarity: toHundred(question.metrics.clarityScore ?? question.evaluation?.breakdown?.clarityScore),
            hyb: Math.min(100, Math.max(0, question.metrics.overallScore || question.metrics.finalScore || 0)),
            latency: question.metrics.responseTime || 0,
            answerLength: question.metrics.answerLength || 0,
            timestamp: new Date(question.metrics.timestamp || session.startedAt),
            difficulty: session.config?.difficulty || "medium",
            type: session.config?.type || "technical",
            answerLabel: normalizeAnswerLabel(question.researchLabel),
          })
        }
        // PRIORITY 2: Canonical evaluation with nested breakdown (no metrics saved)
        else if (question.evaluation?.breakdown != null) {
          const bd = question.evaluation.breakdown
          allQuestionMetrics.push({
            det: toHundred(bd.conceptScore),
            sem: toHundred(bd.semanticScore),
            clarity: toHundred(bd.clarityScore),
            hyb: Math.min(100, Math.max(0, question.evaluation.overallScore || 0)),
            latency: question.metrics?.responseTime || 0,
            answerLength: question.metrics?.answerLength || 0,
            timestamp: new Date(question.metrics?.timestamp || session.startedAt),
            difficulty: session.config?.difficulty || "medium",
            type: session.config?.type || "technical",
            answerLabel: normalizeAnswerLabel(question.researchLabel),
          })
        }
        // PRIORITY 3: Legacy metrics field
        else if (question.metrics?.deterministicScore != null) {
          allQuestionMetrics.push({
            det: Math.min(100, Math.max(0, question.metrics.deterministicScore)),
            sem: toHundred(question.metrics.semanticScore),
            clarity: toHundred(question.metrics.clarityScore ?? question.evaluation?.clarityScore),
            hyb: Math.min(100, Math.max(0, question.metrics.finalScore || 0)),
            latency: question.metrics.responseTime || 0,
            answerLength: question.metrics.answerLength || 0,
            timestamp: new Date(question.metrics.timestamp || session.startedAt),
            difficulty: session.config?.difficulty || "medium",
            type: session.config?.type || "technical",
            answerLabel: normalizeAnswerLabel(question.researchLabel),
          })
        }
        // PRIORITY 4: Legacy flat evaluation field (old sessions without nested breakdown)
        else if (question.evaluation?.conceptScore != null || question.evaluation?.overallScore != null) {
          allQuestionMetrics.push({
            det: toHundred(question.evaluation.conceptScore),
            sem: toHundred(question.evaluation.semanticScore),
            clarity: toHundred(question.evaluation.clarityScore ?? question.evaluation.clarity),
            hyb: Math.min(100, Math.max(0, question.evaluation.overallScore || question.evaluation.finalScore || question.evaluation.score || 0)),
            latency: question.metrics?.responseTime || 0,
            answerLength: question.metrics?.answerLength || 0,
            timestamp: new Date(question.metrics?.timestamp || session.startedAt),
            difficulty: session.config?.difficulty || "medium",
            type: session.config?.type || "technical",
            answerLabel: normalizeAnswerLabel(question.researchLabel),
          })
        }
        // PRIORITY 5: Oldest legacy format (deterministicScore only)
        else if (question.evaluation?.deterministicScore != null) {
          allQuestionMetrics.push({
            det: Math.min(100, Math.max(0, question.evaluation.deterministicScore)),
            sem: toHundred(question.evaluation.semanticScore),
            clarity: toHundred(question.evaluation.clarityScore ?? question.evaluation.clarity),
            hyb: Math.min(100, Math.max(0, question.evaluation.finalScore || question.evaluation.score || question.evaluation.deterministicScore)),
            latency: 0,
            answerLength: 0,
            timestamp: session.startedAt,
            difficulty: session.config?.difficulty || "medium",
            type: session.config?.type || "technical",
            answerLabel: normalizeAnswerLabel(question.researchLabel),
          })
        }
      })
    })

    const totalQuestions = allQuestionMetrics.length

    if (totalQuestions === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalEvaluations,
          totalQuestions: 0,
          deterministicAverage: 0,
          semanticAverage: 0,
          clarityAverage: 0,
          hybridAverage: 0,
          deterministicStdDev: 0,
          semanticStdDev: 0,
          clarityStdDev: 0,
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
          errorDetectionEffectiveness: [],
          hybridContributionAnalysis: [],
          difficultyBreakdown: {},
          typeBreakdown: {},
          scatterPlotData: [],
          boxPlotData: [],
        },
      })
    }

    // Calculate averages
    const avgDet = allQuestionMetrics.reduce((s, m) => s + m.det, 0) / totalQuestions
    const avgSem = allQuestionMetrics.reduce((s, m) => s + m.sem, 0) / totalQuestions
    const avgClarity = allQuestionMetrics.reduce((s, m) => s + m.clarity, 0) / totalQuestions
    const avgHyb = allQuestionMetrics.reduce((s, m) => s + m.hyb, 0) / totalQuestions

    // Calculate standard deviations
    const stdDevDet = Math.sqrt(
      allQuestionMetrics.reduce((s, m) => s + Math.pow(m.det - avgDet, 2), 0) / totalQuestions
    )
    const stdDevSem = Math.sqrt(
      allQuestionMetrics.reduce((s, m) => s + Math.pow(m.sem - avgSem, 2), 0) / totalQuestions
    )
    const stdDevClarity = Math.sqrt(
      allQuestionMetrics.reduce((s, m) => s + Math.pow(m.clarity - avgClarity, 2), 0) / totalQuestions
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

    // AI success rate is measured per session for the experiment.
    const aiSuccessCount = allSessions.filter((session: any) =>
      session.evaluationMethod === HYBRID_METHOD ||
      session.questions?.some((question: any) => question.evaluation?.evaluationMethod === HYBRID_METHOD)
    ).length
    const aiSuccessRate = totalEvaluations > 0 ? Math.round((aiSuccessCount / totalEvaluations) * 100) : 0
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
        answerQuality: m.answerLabel,
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
      { method: "Concept Score", ...getBoxPlotStats(detSorted) },
      { method: "Semantic Similarity", ...getBoxPlotStats(semSorted) },
      { method: "Final Hybrid Score", ...getBoxPlotStats(hybSorted) },
    ]

    // Method comparison for bar chart
    const methodComparison = [
      {
        method: "Concept Score",
        avgScore: Math.round(avgDet * 10) / 10,
        stdDev: Math.round(stdDevDet * 10) / 10,
        sampleCount: totalQuestions,
      },
      {
        method: "Semantic Similarity",
        avgScore: Math.round(avgSem * 10) / 10,
        stdDev: Math.round(stdDevSem * 10) / 10,
        sampleCount: totalQuestions,
      },
      {
        method: "Final Hybrid Score",
        avgScore: Math.round(avgHyb * 10) / 10,
        stdDev: Math.round(stdDevHyb * 10) / 10,
        sampleCount: totalQuestions,
      },
    ]

    const qualityOrder: Array<QuestionMetric["answerLabel"]> = ["correct", "partial", "incorrect"]
    const qualityLabel: Record<QuestionMetric["answerLabel"], string> = {
      correct: "Correct",
      partial: "Partial",
      incorrect: "Incorrect",
      unknown: "Unknown",
    }

    const errorDetectionEffectiveness = qualityOrder
      .map((label) => {
        const items = allQuestionMetrics.filter((metric) => metric.answerLabel === label)
        if (items.length === 0) return null

        const conceptAverage = items.reduce((sum, metric) => sum + metric.det, 0) / items.length
        const semanticAverage = items.reduce((sum, metric) => sum + metric.sem, 0) / items.length
        const clarityAverage = items.reduce((sum, metric) => sum + metric.clarity, 0) / items.length
        const hybridAverage = items.reduce((sum, metric) => sum + metric.hyb, 0) / items.length

        return {
          label: qualityLabel[label],
          avgConcept: Math.round(conceptAverage * 10) / 10,
          avgSemantic: Math.round(semanticAverage * 10) / 10,
          avgClarity: Math.round(clarityAverage * 10) / 10,
          avgHybrid: Math.round(hybridAverage * 10) / 10,
          count: items.length,
        }
      })
      .filter(Boolean)

    const hybridContributionAnalysis = errorDetectionEffectiveness.map((entry: any) => ({
      label: entry.label,
      conceptContribution: Math.round(entry.avgConcept * 0.6 * 10) / 10,
      semanticContribution: Math.round(entry.avgSemantic * 0.25 * 10) / 10,
      clarityContribution: Math.round(entry.avgClarity * 0.15 * 10) / 10,
      totalHybrid: entry.avgHybrid,
      count: entry.count,
    }))

    const sessionTimelineData: SessionTimelinePoint[] = allSessions
      .map((session: any) => {
        const sessionScores = (session.questions ?? [])
          .map((question: any) => extractQuestionScores(question))
          .filter(Boolean) as Array<{ det: number; sem: number; hyb: number }>

        if (sessionScores.length === 0) {
          return null
        }

        const det = sessionScores.reduce((sum, score) => sum + score.det, 0) / sessionScores.length
        const sem = sessionScores.reduce((sum, score) => sum + score.sem, 0) / sessionScores.length
        const hyb = sessionScores.reduce((sum, score) => sum + score.hyb, 0) / sessionScores.length
        const startedAt = session.startedAt ? new Date(session.startedAt) : new Date()

        return {
          sessionNumber: 0,
          sessionId: String(session._id),
          date: startedAt.toISOString().split("T")[0],
          timestamp: startedAt.toISOString(),
          deterministic: Math.round(det * 10) / 10,
          semantic: Math.round(sem * 10) / 10,
          hybrid: Math.round(hyb * 10) / 10,
          questionCount: sessionScores.length,
        }
      })
      .filter((value): value is SessionTimelinePoint => value != null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((item, index) => ({
        ...item,
        sessionNumber: index + 1,
      }))

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
        clarityAverage: Math.round(avgClarity * 10) / 10,
        hybridAverage: Math.round(avgHyb * 10) / 10,
        deterministicStdDev: Math.round(stdDevDet * 10) / 10,
        semanticStdDev: Math.round(stdDevSem * 10) / 10,
        clarityStdDev: Math.round(stdDevClarity * 10) / 10,
        hybridStdDev: Math.round(stdDevHyb * 10) / 10,
        correlation,
        aiSuccessRate,
        fallbackRate,
        avgLatency: avgLatency / 1000, // Convert ms to seconds
        scoreDistribution,
        methodComparison,
        timeSeriesData: sessionTimelineData,
        timeSeriesDataByDay: [],
        sessionTimelineData,
        errorDetectionEffectiveness,
        hybridContributionAnalysis,
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
