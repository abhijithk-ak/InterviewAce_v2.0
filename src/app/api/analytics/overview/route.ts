import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { SessionModel } from "@/lib/db/models/Session"
import { migrateSubscore } from "@/lib/evaluation/normalize"

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

      skillBreakdown.technical = Math.round(
        technicalScores.reduce((sum: number, s: number) => sum + s, 0) / technicalScores.length
      )
      skillBreakdown.confidence = Math.round(
        confidenceScores.reduce((sum: number, s: number) => sum + s, 0) / confidenceScores.length
      )
      skillBreakdown.clarity = Math.round(
        clarityScores.reduce((sum: number, s: number) => sum + s, 0) / clarityScores.length
      )
      skillBreakdown.communication = Math.round(
        overallScores.reduce((sum: number, s: number) => sum + s, 0) / overallScores.length
      )
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

    return NextResponse.json({
      totalSessions,
      averageScore,
      avgDuration,
      skillBreakdown,
      scoreTrend,
    })
  } catch (err) {
    console.error("Analytics error:", err)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
