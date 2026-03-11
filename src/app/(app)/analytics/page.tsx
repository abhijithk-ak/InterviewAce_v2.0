import { redirect } from "next/navigation"
import Link from "next/link"
import { BarChart2, TrendingUp, Award, Clock, Zap, Play, BookOpen, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { SessionModel } from "@/lib/db/models/Session"
import { ScoreTrendChart, SkillBreakdownChart, SessionTypeChart } from "@/components/charts"

// Always fetch fresh data — never use cached analytics
export const dynamic = 'force-dynamic'
export const revalidate = 0

type AnalyticsData = {
  totalSessions: number
  averageScore: number
  bestScore: number
  avgDuration: number
  skillBreakdown: {
    technical: number
    communication: number
    confidence: number
    clarity: number
  }
  scoreTrend: Array<{ date: string; score: number }>
  sessionsByType: {
    technical: number
    behavioral: number
    'system-design': number
    hr: number
  }
  difficultyBreakdown: {
    easy: number
    medium: number
    hard: number
  }
  recentSessions: Array<{
    _id: string
    config: {
      role: string
      type: string
      difficulty: string
    }
    startedAt: string
    overallScore?: number
  }>
  improvement: number
  successRate: number
}

async function getAnalyticsData(userEmail: string) {
  await connectDB()
  
  const userProfile = await UserProfileModel.findOne({ userId: userEmail })
  if (!userProfile) {
    redirect('/onboarding')
  }

  try {
    // Get user sessions for real analytics
    const sessions = await SessionModel.find({ userEmail })
      .sort({ startedAt: -1 })
      .lean()

    const totalSessions = sessions.length
    
    if (totalSessions === 0) {
      return {
        profile: userProfile,
        analytics: null,
        totalSessions: 0
      }
    }

    // Calculate real analytics from sessions
    const scoresSum = sessions.reduce((sum, session) => sum + (session.overallScore || 0), 0)
    const averageScore = Math.round(scoresSum / totalSessions)
    const bestScore = Math.max(...sessions.map(s => s.overallScore || 0))

    // Calculate duration (if available)
    const durationsSum = sessions.reduce((sum, session) => {
      if (session.endedAt && session.startedAt) {
        const duration = (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000 / 60
        return sum + duration
      }
      return sum
    }, 0)
    const avgDuration = Math.round(durationsSum / sessions.filter(s => s.endedAt).length) || 25

    // Calculate skill breakdown from question evaluations
    const skillData = {
      technical: [] as number[],
      confidence: [] as number[],
      clarity: [] as number[],
      communication: [] as number[]
    }

    sessions.forEach(session => {
      session.questions?.forEach((question: any) => {
        if (question.evaluation) {
          if (question.evaluation.technical_depth !== undefined) {
            skillData.technical.push(question.evaluation.technical_depth)
          }
          if (question.evaluation.confidence !== undefined) {
            skillData.confidence.push(question.evaluation.confidence)
          }
          if (question.evaluation.clarity !== undefined) {
            skillData.clarity.push(question.evaluation.clarity)
          }
          // Communication is calculated as average of clarity and confidence
          if (question.evaluation.clarity !== undefined && question.evaluation.confidence !== undefined) {
            skillData.communication.push((question.evaluation.clarity + question.evaluation.confidence) / 2)
          } else if (question.evaluation.clarity !== undefined) {
            skillData.communication.push(question.evaluation.clarity)
          } else if (question.evaluation.confidence !== undefined) {
            skillData.communication.push(question.evaluation.confidence)
          }
        }
      })
    })

    // Subscores are stored on 0-10 scale; multiply by 10 for 0-100 percentage display
    const avg10 = (arr: number[]) =>
      arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0
    const skillBreakdown = {
      technical:     Math.round(avg10(skillData.technical)     * 10),
      communication: Math.round(avg10(skillData.communication) * 10),
      confidence:    Math.round(avg10(skillData.confidence)    * 10),
      clarity:       Math.round(avg10(skillData.clarity)       * 10),
    }

    // Score trend — oldest → newest, overallScore is already 0-100
    const trendSessions = sessions.filter(s => s.overallScore != null)
    const recentSessions = trendSessions.slice(0, 10).reverse()
    const scoreTrend = recentSessions.map((session) => ({
      date: session.startedAt.toISOString(),
      score: session.overallScore || 0
    }))

    // Session type breakdown - normalize case and add logging
    console.log("Sample session:", sessions[0])
    const sessionsByType = {
      technical: 0,
      behavioral: 0,
      'system-design': 0,
      hr: 0,
    }

    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0
    }

    // Safely aggregate with normalization
    sessions.forEach(session => {
      if (session.config) {
        // Normalize type — handles both "Technical" and "technical", "HR" and "hr"
        const type = session.config.type?.toLowerCase().trim().replace(/[\s_]+/g, '-')
        if (type === 'technical') sessionsByType.technical++
        else if (type === 'behavioral' || type === 'behavioural') sessionsByType.behavioral++
        else if (type === 'system-design' || type === 'systemdesign' || type === 'system_design') sessionsByType['system-design']++
        else if (type === 'hr') sessionsByType.hr++

        // Normalize difficulty (handle both "Medium" and "medium")
        const difficulty = session.config.difficulty?.toLowerCase().trim()
        if (difficulty === 'easy') difficultyBreakdown.easy++
        else if (difficulty === 'medium') difficultyBreakdown.medium++
        else if (difficulty === 'hard') difficultyBreakdown.hard++
      }
    })

    console.log("Session types:", sessionsByType)
    console.log("Difficulty breakdown:", difficultyBreakdown)

    // Format recent sessions
    const formattedRecentSessions = sessions.slice(0, 5).map(session => ({
      _id: session._id.toString(),
      config: session.config,
      startedAt: session.startedAt.toISOString(),
      overallScore: session.overallScore
    }))

    // Improvement: diff between latest and first session score
    const trendWithScore = sessions.filter(s => s.overallScore != null)
    const improvement = trendWithScore.length >= 2
      ? (trendWithScore[0].overallScore ?? 0) - (trendWithScore[trendWithScore.length - 1].overallScore ?? 0)
      : 0

    // Success rate: sessions scoring >= 70
    const successRate = totalSessions > 0
      ? Math.round((sessions.filter(s => (s.overallScore ?? 0) >= 70).length / totalSessions) * 100)
      : 0

    const analytics: AnalyticsData = {
      totalSessions,
      averageScore,
      bestScore,
      avgDuration,
      skillBreakdown,
      scoreTrend,
      sessionsByType,
      difficultyBreakdown,
      recentSessions: formattedRecentSessions,
      improvement,
      successRate,
    }
    
    return {
      profile: userProfile,
      analytics,
      totalSessions
    }
  } catch (error) {
    console.error('Analytics data error:', error)
    return null
  }
}

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/login')
  }

  const analyticsData = await getAnalyticsData(session.user.email)

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-neutral-400">Failed to load analytics data</p>
      </div>
    )
  }

  const { analytics, totalSessions } = analyticsData

  const TYPE_META: Record<string, { label: string; icon: string; color: string }> = {
    technical:      { label: 'Technical',    icon: '</>', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    behavioral:     { label: 'Behavioral',   icon: '💬',  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    'system-design':{ label: 'System Design',icon: '🏗️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    hr:             { label: 'HR',           icon: '🎯',  color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  }

  const SKILL_META: Record<string, { color: string; dot: string }> = {
    technical:     { color: 'text-indigo-400', dot: 'bg-indigo-500' },
    communication: { color: 'text-emerald-400', dot: 'bg-emerald-500' },
    confidence:    { color: 'text-amber-400',   dot: 'bg-amber-500' },
    clarity:       { color: 'text-purple-400',  dot: 'bg-purple-500' },
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <BarChart2 className="h-6 w-6 text-indigo-400" />
              Performance Analytics
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              {totalSessions === 0
                ? 'Complete your first interview to see insights'
                : `Insights from ${totalSessions} completed session${totalSessions > 1 ? 's' : ''}`}
            </p>
          </div>
          <Link href="/interview/setup">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Play className="w-4 h-4" /> New Session
            </button>
          </Link>
        </div>

        {totalSessions === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BarChart2 className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No analytics yet</h3>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6">
              Complete your first interview session to unlock performance trends, skill breakdowns, and personalized insights.
            </p>
            <Link href="/interview/setup">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
                Start First Interview
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* ── KPI row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Sessions',
                  value: String(analytics!.totalSessions),
                  sub: 'completed',
                  icon: <BarChart2 className="w-5 h-5 text-indigo-400" />,
                  accent: 'text-indigo-400',
                  badge: null,
                },
                {
                  label: 'Average Score',
                  value: `${analytics!.averageScore}%`,
                  sub: 'all sessions',
                  icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                  accent: analytics!.averageScore >= 70 ? 'text-emerald-400' : analytics!.averageScore >= 50 ? 'text-amber-400' : 'text-red-400',
                  badge: null,
                },
                {
                  label: 'Best Score',
                  value: `${analytics!.bestScore}%`,
                  sub: 'personal best',
                  icon: <Award className="w-5 h-5 text-amber-400" />,
                  accent: 'text-amber-400',
                  badge: null,
                },
                {
                  label: 'Improvement',
                  value: analytics!.improvement === 0 ? '—' : `${analytics!.improvement > 0 ? '+' : ''}${analytics!.improvement}%`,
                  sub: 'vs first session',
                  icon: analytics!.improvement > 0
                    ? <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    : analytics!.improvement < 0
                    ? <ArrowDownRight className="w-5 h-5 text-red-400" />
                    : <Minus className="w-5 h-5 text-neutral-400" />,
                  accent: analytics!.improvement > 0 ? 'text-emerald-400' : analytics!.improvement < 0 ? 'text-red-400' : 'text-neutral-400',
                  badge: null,
                },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{kpi.label}</span>
                    {kpi.icon}
                  </div>
                  <div className={`text-3xl font-bold ${kpi.accent} mb-1`}>{kpi.value}</div>
                  <div className="text-xs text-neutral-600">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* ── Score Progression + Skill Radar side-by-side ── */}
            <div className="grid lg:grid-cols-5 gap-4">
              {/* Score Trend — wider */}
              <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Score Progression</h2>
                  <span className="text-xs text-neutral-500 bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-full">
                    Last {analytics!.scoreTrend.length} sessions
                  </span>
                </div>
                <ScoreTrendChart data={analytics!.scoreTrend} height={260} />
              </div>

              {/* Skill Radar */}
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Skill Radar</h2>
                  <span className="text-xs text-neutral-500">0 – 100</span>
                </div>
                <SkillBreakdownChart data={analytics!.skillBreakdown} height={260} />
              </div>
            </div>

            {/* ── Skill bars ── */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-base font-semibold text-white mb-5">Skill Breakdown</h2>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                {Object.entries(analytics!.skillBreakdown).map(([skill, score]) => {
                  const meta = SKILL_META[skill] ?? { color: 'text-neutral-300', dot: 'bg-neutral-500' }
                  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'
                  return (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                          <span className="text-sm font-medium text-neutral-200 capitalize">{skill}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${meta.color}`}>{score}%</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            score >= 80 ? 'bg-emerald-500/15 text-emerald-400' :
                            score >= 60 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'
                          }`}>{label}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${meta.dot}`}
                          style={{ width: `${Math.min(score, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Session Distribution + Difficulty side-by-side ── */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Session type donut */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Session Distribution</h2>
                  <span className="text-xs text-neutral-500 bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-full">
                    {totalSessions} total
                  </span>
                </div>
                <SessionTypeChart data={analytics!.sessionsByType} height={220} />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {Object.entries(analytics!.sessionsByType).map(([type, count]) => {
                    const m = TYPE_META[type]
                    const pct = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
                    return (
                      <div key={type} className={`flex items-center justify-between p-2.5 rounded-lg border ${m.color}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{m.icon}</span>
                          <span className="text-xs font-medium">{m.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white text-sm font-bold">{count}</span>
                          <span className="text-neutral-500 text-xs ml-1">({pct}%)</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Difficulty + quick stats */}
              <div className="space-y-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <h2 className="text-base font-semibold text-white mb-5">Difficulty Levels</h2>
                  <div className="space-y-4">
                    {Object.entries(analytics!.difficultyBreakdown).map(([d, count]) => {
                      const pct = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
                      const cls = d === 'hard' ? { dot: 'bg-red-500', bar: 'bg-red-500', text: 'text-red-400' }
                                : d === 'medium' ? { dot: 'bg-amber-500', bar: 'bg-amber-500', text: 'text-amber-400' }
                                : { dot: 'bg-emerald-500', bar: 'bg-emerald-500', text: 'text-emerald-400' }
                      return (
                        <div key={d}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${cls.dot}`} />
                              <span className="text-sm text-neutral-200 capitalize font-medium">{d}</span>
                            </div>
                            <div className={`text-sm font-bold ${cls.text}`}>{count} <span className="text-neutral-500 font-normal text-xs">({pct}%)</span></div>
                          </div>
                          <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div className={`h-full ${cls.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                    <div className="text-xs text-neutral-500 mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Success Rate
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{analytics!.successRate}%</div>
                    <div className="text-xs text-neutral-600 mt-1">Sessions ≥ 70%</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                    <div className="text-xs text-neutral-500 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Avg Duration
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{analytics!.avgDuration}<span className="text-sm font-normal text-neutral-500 ml-1">min</span></div>
                    <div className="text-xs text-neutral-600 mt-1">Per session</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Recent Sessions ── */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Recent Sessions</h2>
                <Link href="/sessions" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {analytics!.recentSessions.map((s) => {
                  const typeKey = s.config.type?.toLowerCase().trim().replace(/[\s_]+/g, '-')
                  const m = TYPE_META[typeKey] ?? TYPE_META['technical']
                  const score = s.overallScore ?? 0
                  return (
                    <div key={s._id} className="flex items-center gap-4 p-3 bg-neutral-800 hover:bg-neutral-800/80 rounded-lg transition-colors">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm ${m.color}`}>
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {s.config.role} · {m.label}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {new Date(s.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {s.config.difficulty}
                        </div>
                      </div>
                      <div className={`text-lg font-bold min-w-[50px] text-right ${
                        score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {score}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex gap-3">
              <Link href="/interview/setup" className="flex-1">
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Start New Session
                </button>
              </Link>
              <Link href="/learning-hub" className="flex-1">
                <button className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" /> Improve Skills
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
