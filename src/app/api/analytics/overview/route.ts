import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { SessionModel } from "@/lib/db/models/Session"
import { migrateSubscore } from "@/lib/evaluation/normalize"

// Disable Next.js caching for this route — always recalculate live metrics
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    // Fetch all sessions for this user
    const sessions = await SessionModel.find({
      userEmail: session.user.email,
    })
      .sort({ startedAt: -1 })
      .lean()

    if (sessions.length === 0) {
      return NextResponse.json({
        totalSessions: 0,
        averageScore: 0,
        avgDuration: 0,
        skillBreakdown: {
          technical: 0,
          communication: 0,
          confidence: 0,
          clarity: 0,
        },
        scoreTrend: [],
      })
    }

    // Calculate metrics
    const totalSessions = sessions.length

    // Average score
    const scores = sessions
      .map((s) => s.overallScore)
      .filter((score): score is number => score != null)
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0

    // Average duration (in minutes)
    const durations = sessions
      .filter((s) => s.startedAt && s.endedAt)
      .map((s) => {
        const start = new Date(s.startedAt).getTime()
        const end = new Date(s.endedAt).getTime()
        return (end - start) / 1000 / 60 // minutes
      })
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length)
      : 0

    // Skill breakdown (from evaluations)
    // Normalize scores to 0-10 scale (handles both old 0-100 and new 0-10)
    const allEvaluations = sessions.flatMap((s) =>
      s.questions
        .filter((q: any) => q.evaluation)
        .map((q: any) => q.evaluation)
    )

    const skillBreakdown = {
      technical: 0,
      communication: 0,
      confidence: 0,
      clarity: 0,
    }

    if (allEvaluations.length > 0) {
      // Calculate averages with normalization (handles legacy 0-100 scores)
      const technicalScores = allEvaluations.map((e: any) => 
        migrateSubscore(e.technical_depth || e.technical || 0)
      )
      const confidenceScores = allEvaluations.map((e: any) => 
        migrateSubscore(e.confidence || 0)
      )
      const clarityScores = allEvaluations.map((e: any) => 
        migrateSubscore(e.clarity || 0)
      )
      const overallScores = allEvaluations.map((e: any) => 
        migrateSubscore(e.score || 0)
      )

      // Subscores are 0-10 from migrateSubscore; multiply by 10 for 0-100 percentage display
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
      skillBreakdown.technical     = Math.round(avg(technicalScores)     * 10)
      skillBreakdown.confidence    = Math.round(avg(confidenceScores)    * 10)
      skillBreakdown.clarity       = Math.round(avg(clarityScores)       * 10)
      skillBreakdown.communication = Math.round(avg(overallScores)       * 10)
    }

    // Score trend (last 10 sessions)
    const scoreTrend = sessions
      .slice(0, 10)
      .reverse()
      .filter((s) => s.overallScore != null)
      .map((s) => ({
        date: new Date(s.startedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: s.overallScore,
      }))

    // ── Evaluation comparison (hybrid vs deterministic vs semantic) ────────────
    // Collect per-question metrics from all sessions
    const allMetrics = sessions.flatMap((s) =>
      (s.questions as any[])
        .filter((q) => q.metrics?.deterministicScore != null)
        .map((q) => ({
          deterministicScore: q.metrics.deterministicScore as number,
          semanticScore: (q.metrics.semanticScore as number) * 10, // normalise 0-10 → 0-100
          finalScore: q.metrics.finalScore as number,
        }))
    )

    // Also pull from evaluation fields for sessions saved before metrics existed
    const allEvaluationScores = sessions.flatMap((s) =>
      (s.questions as any[])
        .filter((q) => q.evaluation?.deterministicScore != null && q.metrics == null)
        .map((q) => ({
          deterministicScore: q.evaluation.deterministicScore as number,
          semanticScore: (q.evaluation.semanticScore as number) * 10,
          finalScore: q.evaluation.finalScore as number,
        }))
    )

    const combinedScores = [...allMetrics, ...allEvaluationScores]

    let evaluationComparison = {
      deterministicAverage: 0,
      semanticAverage: 0,
      hybridAverage: 0,
      correlation: null as number | null,
      sampleCount: combinedScores.length,
    }

    if (combinedScores.length > 0) {
      const n = combinedScores.length
      const avgDet = combinedScores.reduce((s, m) => s + m.deterministicScore, 0) / n
      const avgSem = combinedScores.reduce((s, m) => s + m.semanticScore, 0) / n
      const avgHyb = combinedScores.reduce((s, m) => s + m.finalScore, 0) / n

      // Pearson correlation between deterministicScore and semanticScore
      let correlation: number | null = null
      if (n >= 2) {
        const meanD = avgDet
        const meanS = avgSem
        let num = 0, denD = 0, denS = 0
        for (const m of combinedScores) {
          const dD = m.deterministicScore - meanD
          const dS = m.semanticScore - meanS
          num  += dD * dS
          denD += dD * dD
          denS += dS * dS
        }
        const denom = Math.sqrt(denD * denS)
        correlation = denom === 0 ? null : Math.round((num / denom) * 1000) / 1000
      }

      evaluationComparison = {
        deterministicAverage: Math.round(avgDet * 10) / 10,
        semanticAverage:      Math.round(avgSem * 10) / 10,
        hybridAverage:        Math.round(avgHyb * 10) / 10,
        correlation,
        sampleCount: n,
      }
    }

    // ── Per-session comparison trend (last 10 sessions with hybrid data) ───────
    const comparisonTrend = sessions
      .slice(0, 10)
      .reverse()
      .map((s) => {
        const questions = (s.questions as any[]).filter(
          (q) => q.metrics?.deterministicScore != null
        )
        if (questions.length === 0) return null
        const avgD = questions.reduce((a: number, q: any) => a + q.metrics.deterministicScore, 0) / questions.length
        const avgS = questions.reduce((a: number, q: any) => a + q.metrics.semanticScore * 10, 0) / questions.length
        const avgF = questions.reduce((a: number, q: any) => a + q.metrics.finalScore, 0) / questions.length
        return {
          date: new Date(s.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          deterministicScore: Math.round(avgD * 10) / 10,
          semanticScore:      Math.round(avgS * 10) / 10,
          finalScore:         Math.round(avgF * 10) / 10,
        }
      })
      .filter(Boolean)

    return NextResponse.json({
      totalSessions,
      averageScore,
      avgDuration,
      skillBreakdown,
      scoreTrend,
      evaluationComparison,
      comparisonTrend,
    })
  } catch (err) {
    console.error("Analytics error:", err)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
