import { redirect } from "next/navigation"
import Link from "next/link"
import { BarChart2, TrendingUp, Award, Clock, Play, BookOpen, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { SessionModel } from "@/lib/db/models/Session"
import { ScoreTrendChart, SkillBreakdownChart, SessionTypeChart, PerformanceByTypeChart } from "@/components/charts"

// Always fetch fresh data — never use cached analytics
export const dynamic = 'force-dynamic'
export const revalidate = 0

type AnalyticsData = {
  totalSessions: number
  averageScore: number
  bestScore: number
  avgDuration: number
  skillBreakdown: {
    concept: number
    semantic: number
    clarity: number
    overall: number
  }
  scoreTrend: Array<{ date: string; score: number; type: string; difficulty: string }>
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
  improvementSuggestions: string[]
  performanceByType: {
    technical: number
    behavioral: number
    'system-design': number
    hr: number
    technicalSessions: number
    behavioralSessions: number
    'system-designSessions': number
    hrSessions: number
  }
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
      concept: [] as number[],
      semantic: [] as number[],
      clarity: [] as number[],
      overall: [] as number[]
    }

    sessions.forEach(session => {
      session.questions?.forEach((question: any) => {
        const normalized = getNormalizedQuestionScores(question)
        if (normalized.concept != null) {
          skillData.concept.push(normalized.concept)
        }
        if (normalized.semantic != null) {
          skillData.semantic.push(normalized.semantic)
        }
        if (normalized.clarity != null) {
          skillData.clarity.push(normalized.clarity)
        }
        if (normalized.overall != null) {
          skillData.overall.push(normalized.overall / 10)
        }
      })
    })

    // Subscores are stored on 0-10 scale; multiply by 10 for 0-100 percentage display
    const avg10 = (arr: number[]) =>
      arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0
    const skillBreakdown = {
      concept:       Math.round(avg10(skillData.concept)       * 10),
      semantic:      Math.round(avg10(skillData.semantic)      * 10),
      clarity:       Math.round(avg10(skillData.clarity)       * 10),
      overall:       Math.round(avg10(skillData.overall)       * 10),
    }

    // Score trend — oldest → newest, overallScore is already 0-100
    const trendSessions = sessions.filter(s => s.overallScore != null)
    const recentSessions = trendSessions.slice(0, 10).reverse()
    const scoreTrend = recentSessions.map((session) => ({
      date: session.startedAt.toISOString(),
      score: session.overallScore || 0,
      type: session.config?.type || 'Unknown',
      difficulty: session.config?.difficulty || 'Unknown',
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

    // Average score by interview type
    const performanceBuckets: Record<string, { total: number; count: number }> = {
      technical: { total: 0, count: 0 },
      behavioral: { total: 0, count: 0 },
      'system-design': { total: 0, count: 0 },
      hr: { total: 0, count: 0 },
    }

    sessions.forEach((session) => {
      const rawType = session.config?.type?.toLowerCase().trim().replace(/[\s_]+/g, '-')
      const score = session.overallScore
      if (score == null) return

      let typeKey: keyof typeof performanceBuckets | null = null
      if (rawType === 'technical') typeKey = 'technical'
      else if (rawType === 'behavioral' || rawType === 'behavioural') typeKey = 'behavioral'
      else if (rawType === 'system-design' || rawType === 'systemdesign' || rawType === 'system_design') typeKey = 'system-design'
      else if (rawType === 'hr') typeKey = 'hr'

      if (!typeKey) return

      performanceBuckets[typeKey].total += score
      performanceBuckets[typeKey].count += 1
    })

    const performanceByType = {
      technical: performanceBuckets.technical.count > 0 ? Math.round(performanceBuckets.technical.total / performanceBuckets.technical.count) : 0,
      behavioral: performanceBuckets.behavioral.count > 0 ? Math.round(performanceBuckets.behavioral.total / performanceBuckets.behavioral.count) : 0,
      'system-design': performanceBuckets['system-design'].count > 0 ? Math.round(performanceBuckets['system-design'].total / performanceBuckets['system-design'].count) : 0,
      hr: performanceBuckets.hr.count > 0 ? Math.round(performanceBuckets.hr.total / performanceBuckets.hr.count) : 0,
      technicalSessions: performanceBuckets.technical.count,
      behavioralSessions: performanceBuckets.behavioral.count,
      'system-designSessions': performanceBuckets['system-design'].count,
      hrSessions: performanceBuckets.hr.count,
    }

    // Improvement suggestions derived from evaluation errors and feedback text
    const suggestionCounts = {
      conceptual: 0,
      examples: 0,
      structure: 0,
      precision: 0,
    }

    sessions.forEach((session) => {
      session.questions?.forEach((question: any) => {
        const evaluation = question?.evaluation ?? {}
        const textCorpus = [
          ...(Array.isArray(evaluation.errors) ? evaluation.errors : []),
          evaluation.explanation,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const normalized = getNormalizedQuestionScores(question)

        if (/(incorrect|contradict|wrong|misunderstand|concept)/.test(textCorpus) || (normalized.concept ?? 10) < 6) {
          suggestionCounts.conceptual += 1
        }
        if (/(example|specific|detail|elaborat|concrete)/.test(textCorpus) || ((question?.answer?.length ?? 0) < 80)) {
          suggestionCounts.examples += 1
        }
        if (/(clarity|structure|organize|coherent|unclear|vague)/.test(textCorpus) || (normalized.clarity ?? 10) < 6) {
          suggestionCounts.structure += 1
        }
        if (/(accuracy|precise|terminology|assumption|overgeneral)/.test(textCorpus) || (normalized.semantic ?? 10) < 6) {
          suggestionCounts.precision += 1
        }
      })
    })

    const suggestionCatalog: Array<{ key: keyof typeof suggestionCounts; label: string }> = [
      { key: 'conceptual', label: 'Improve conceptual explanations' },
      { key: 'examples', label: 'Provide more concrete examples' },
      { key: 'structure', label: 'Structure answers more clearly' },
      { key: 'precision', label: 'Use more precise technical language' },
    ]

    const improvementSuggestions = suggestionCatalog
      .sort((a, b) => suggestionCounts[b.key] - suggestionCounts[a.key])
      .filter((item) => suggestionCounts[item.key] > 0)
      .slice(0, 3)
      .map((item) => item.label)

    const fallbackSuggestions = [
      'Improve conceptual explanations',
      'Provide more concrete examples',
      'Structure answers more clearly',
    ]

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
      improvementSuggestions: improvementSuggestions.length > 0 ? improvementSuggestions : fallbackSuggestions,
      performanceByType,
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
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 col-span-2">
                    <div className="text-xs text-neutral-500 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Avg Duration
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{analytics!.avgDuration}<span className="text-sm font-normal text-neutral-500 ml-1">min</span></div>
                    <div className="text-xs text-neutral-600 mt-1">Per session</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Improvement Suggestions + Performance by Type ── */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4">Improvement Suggestions</h2>
                <div className="space-y-3">
                  {analytics!.improvementSuggestions.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-800/80 border border-neutral-700">
                      <span className="w-2 h-2 mt-2 rounded-full bg-indigo-400" />
                      <span className="text-sm text-neutral-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Performance by Interview Type</h2>
                  <span className="text-xs text-neutral-500">Average score</span>
                </div>
                <PerformanceByTypeChart data={analytics!.performanceByType} height={240} />
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

function getNormalizedQuestionScores(question: any) {
  const evaluation = question?.evaluation ?? {}
  const metrics = question?.metrics ?? {}
  const breakdown = evaluation.breakdown ?? {}

  return {
    concept: firstDefined(
      metrics.conceptScore,
      breakdown.conceptScore,
      evaluation.conceptScore,
    ),
    semantic: firstDefined(
      metrics.semanticScore,
      breakdown.semanticScore,
      evaluation.semanticScore,
    ),
    clarity: firstDefined(
      metrics.clarityScore,
      breakdown.clarityScore,
      evaluation.clarityScore,
    ),
    overall: firstDefined(
      metrics.overallScore,
      evaluation.overallScore,
      metrics.finalScore,
      evaluation.finalScore,
      evaluation.score
    ),
  }
}

function firstDefined(...values: Array<number | undefined | null>) {
  return values.find((value): value is number => typeof value === 'number' && Number.isFinite(value))
}

