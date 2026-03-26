// Dashboard - Server Component
// Command Center with unique widgets distinct from Analytics

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { SessionModel } from "@/lib/db/models/Session"

import { WeeklyActivityChart } from "@/components/charts"
import { ReadinessRing } from "@/components/dashboard/ReadinessRing"
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap"
import { ScoreSparkline } from "@/components/dashboard/ScoreSparkline"
import Link from "next/link"
import {
  BookOpen, Target, ExternalLink, Play, ChevronRight,
  ArrowRight, Clock, Zap, Activity,
  ArrowUpRight, ArrowDownRight, Minus, CheckCircle2, Circle,
  Flame, Trophy, BarChart2, Brain, MessageSquare, Layers, Users
} from "lucide-react"

import { calculateTopPriorityRecommendation } from "@/lib/recommendation/priority"
import { LEARNING_RESOURCES } from "@/lib/resources"

type SessionData = {
  _id: string
  config: {
    role: string
    type: string
    difficulty: string
  }
  startedAt: string
  endedAt?: string
  overallScore?: number
  questions: Array<{
    evaluation?: {
      score?: number
      overallScore?: number
      finalScore?: number
      conceptScore?: number
      semanticScore?: number
      clarityScore?: number
      clarity?: number
      technical_depth?: number
    }
    metrics?: {
      overallScore?: number
      finalScore?: number
      conceptScore?: number
      semanticScore?: number
      clarityScore?: number
    }
  }>
}

type DashboardData = {
  totalSessions: number
  averageScore: number
  bestScore: number
  strongestSkill: string
  strongestSkillScore: number
  weakestSkill: string
  weakestSkillScore: number
  skillScores: { concept: number; semantic: number; clarity: number; overall: number }
  sessions: SessionData[]
  recommendation: any
  scoreTrend: 'improving' | 'declining' | 'stable'
  recentPerformance: number[]
  learningRecommendations: any[]
  weeklyActivity: Array<{ day: string; sessions: number }>
  improvement: number
  // New unique data
  heatmapData: Array<{ date: string; count: number }>
  sessionsByType: { technical: number; behavioral: number; 'system-design': number; hr: number }
  recentScoreHistory: number[]  // last 10 scores oldest→newest
  currentStreak: number
  longestStreak: number
  successRate: number  // % sessions >= 60 score
}

async function getDashboardData(userEmail: string): Promise<DashboardData | null> {
  await connectDB()
  
  // Get user profile (required for recommendations) - let redirect throw naturally
  const userProfile = await UserProfileModel.findOne({ userId: userEmail })
  if (!userProfile) {
    redirect('/onboarding')
  }
  
  try {

    // Get user sessions from MongoDB
    const sessions = await SessionModel.find({ userEmail })
      .sort({ startedAt: -1 })
      .lean()

    // Convert MongoDB ObjectId to string
    const sessionsData: SessionData[] = sessions.map(session => ({
      _id: session._id.toString(),
      config: session.config,
      startedAt: session.startedAt.toISOString(),
      endedAt: session.endedAt?.toISOString(),
      overallScore: session.overallScore,
      questions: session.questions || []
    }))

    // Calculate analytics (server-side only, deterministic)
    const totalSessions = sessionsData.length
    
    // Average Score (0-100 scale)
    const scoresSum = sessionsData.reduce((sum, session) => 
      sum + (session.overallScore || 0), 0)
    const averageScore = totalSessions > 0 
      ? Math.round(scoresSum / totalSessions) 
      : 0

    // Calculate skill breakdown from question evaluations (0-10 scale)
    const skillData = {
      concept: [] as number[],
      semantic: [] as number[],
      clarity: [] as number[],
      overall: [] as number[]
    }

    sessionsData.forEach(session => {
      session.questions.forEach(question => {
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

    // Calculate skill averages (0-10 scale)
    const skillAverages = {
      concept: skillData.concept.length > 0 
        ? skillData.concept.reduce((a, b) => a + b, 0) / skillData.concept.length 
        : 5,
      semantic: skillData.semantic.length > 0 
        ? skillData.semantic.reduce((a, b) => a + b, 0) / skillData.semantic.length 
        : 5,
      clarity: skillData.clarity.length > 0 
        ? skillData.clarity.reduce((a, b) => a + b, 0) / skillData.clarity.length 
        : 5,
      overall: skillData.overall.length > 0 
        ? skillData.overall.reduce((a, b) => a + b, 0) / skillData.overall.length 
        : 5
    }

    // Find strongest and weakest skills
    const skills = Object.entries(skillAverages)
    const strongestSkill = skills.reduce((max, skill) => 
      skill[1] > max[1] ? skill : max)
    const weakestSkill = skills.reduce((min, skill) => 
      skill[1] < min[1] ? skill : min)

    // Calculate domain performance for recommendations (0-10 scale)
    const domainPerformance = {
      frontend: skillAverages.concept,
      backend: skillAverages.concept,
      'system-design': skillAverages.concept,
      algorithms: skillAverages.concept,
      behavioral: skillAverages.clarity,
      general: (skillAverages.concept + skillAverages.overall) / 2
    }

    // Calculate score trend
    const recentScores = sessionsData.slice(0, 5).map(s => s.overallScore || 0).reverse()
    let scoreTrend: 'improving' | 'declining' | 'stable' = 'stable'
    if (recentScores.length >= 2) {
      const firstHalf = recentScores.slice(0, Math.ceil(recentScores.length / 2))
      const secondHalf = recentScores.slice(Math.ceil(recentScores.length / 2))
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
      
      if (secondAvg > firstAvg + 5) scoreTrend = 'improving'
      else if (firstAvg > secondAvg + 5) scoreTrend = 'declining'
    }

    // Generate single deterministic recommendation
    const recommendation = calculateTopPriorityRecommendation(
      {
        experienceLevel: userProfile.experienceLevel,
        domains: userProfile.domains,
        confidenceLevel: userProfile.confidenceLevel,
        weakAreas: userProfile.weakAreas || []
      },
      domainPerformance
    )
    // Calculate score trend data for charts
    const scoreTrendData = sessionsData.slice(0, 10).reverse().map(session => ({
      date: session.startedAt,
      score: session.overallScore || 0
    }))

    // Calculate session type distribution
    const sessionTypes = {
      technical: sessionsData.filter(s => s.config.type === 'technical').length,
      behavioral: sessionsData.filter(s => s.config.type === 'behavioral').length,
      'system-design': sessionsData.filter(s => s.config.type === 'system-design').length
    }
    // Get learning recommendations for new users or weak areas
    const learningRecommendations = totalSessions === 0 
      ? LEARNING_RESOURCES.slice(0, 3).map(category => category.resources[0])
      : LEARNING_RESOURCES
          .find(cat => cat.id.includes(weakestSkill[0]) || cat.id.includes(userProfile.domains[0]))
          ?.resources.slice(0, 3) || []

    // Calculate weekly activity (last 7 days)
    const today = new Date()
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyActivity = weekDays.map((day, index) => {
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() - (today.getDay() - index))
      
      const dayStart = new Date(targetDate)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(targetDate)
      dayEnd.setHours(23, 59, 59, 999)
      
      const sessionsCount = sessionsData.filter(session => {
        const sessionDate = new Date(session.startedAt)
        return sessionDate >= dayStart && sessionDate <= dayEnd
      }).length
      
      return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index === 0 ? 6 : index - 1], sessions: sessionsCount }
    })

    // Reorder to start from Monday
    const reorderedActivity = [
      ...weeklyActivity.slice(1), // Mon-Sat
      weeklyActivity[0] // Sun
    ]

    // ── NEW: Activity Heatmap (last 35 days) ──
    const heatmapData: Array<{ date: string; count: number }> = []
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const dEnd = new Date(d)
      dEnd.setHours(23, 59, 59, 999)
      const count = sessionsData.filter(s => {
        const sd = new Date(s.startedAt)
        return sd >= d && sd <= dEnd
      }).length
      heatmapData.push({ date: d.toISOString(), count })
    }

    // ── NEW: Session type breakdown ──
    const sessionsByType = {
      technical: sessionsData.filter(s => s.config.type?.toLowerCase().trim() === 'technical').length,
      behavioral: sessionsData.filter(s => {
        const t = s.config.type?.toLowerCase().trim()
        return t === 'behavioral' || t === 'behavioural'
      }).length,
      'system-design': sessionsData.filter(s => {
        const t = s.config.type?.toLowerCase().trim().replace(/[\s_]+/g, '-')
        return t === 'system-design'
      }).length,
      hr: sessionsData.filter(s => s.config.type?.toLowerCase().trim() === 'hr').length,
    }

    // ── NEW: Recent score history (oldest→newest, last 10) ──
    const recentScoreHistory = sessionsData
      .slice(0, 10)
      .reverse()
      .map(s => s.overallScore || 0)

    // ── NEW: Streak calculation ──
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    const todayStart = new Date(today)
    todayStart.setHours(0, 0, 0, 0)

    for (let i = 0; i < heatmapData.length; i++) {
      const dayFromEnd = heatmapData[heatmapData.length - 1 - i]
      if (dayFromEnd.count > 0) {
        if (i === 0 || heatmapData[heatmapData.length - i].count > 0) {
          currentStreak++
          tempStreak++
        } else break
      } else {
        if (i === 0) currentStreak = 0
        break
      }
    }
    // Simplified: count consecutive days from today backwards
    currentStreak = 0
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].count > 0) currentStreak++
      else break
    }
    // Longest streak
    for (const day of heatmapData) {
      if (day.count > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    // ── NEW: Success rate (% sessions >= 60) ──
    const successRate = totalSessions > 0
      ? Math.round((sessionsData.filter(s => (s.overallScore || 0) >= 60).length / totalSessions) * 100)
      : 0

    return {
      totalSessions,
      averageScore,
      bestScore: Math.max(...sessionsData.map(s => s.overallScore || 0), 0),
      strongestSkill: strongestSkill[0].charAt(0).toUpperCase() + strongestSkill[0].slice(1),
      strongestSkillScore: Math.round(strongestSkill[1] * 10),
      weakestSkill: weakestSkill[0].charAt(0).toUpperCase() + weakestSkill[0].slice(1),
      weakestSkillScore: Math.round(weakestSkill[1] * 10),
      skillScores: {
        concept:       Math.round(skillAverages.concept * 10),
        semantic:      Math.round(skillAverages.semantic * 10),
        clarity:       Math.round(skillAverages.clarity * 10),
        overall:       Math.round(skillAverages.overall * 10),
      },
      sessions: sessionsData,
      recommendation,
      scoreTrend,
      recentPerformance: recentScores,
      learningRecommendations,
      weeklyActivity: reorderedActivity,
      improvement: recentScores.length >= 2
        ? recentScores[recentScores.length - 1] - recentScores[0]
        : 0,
      heatmapData,
      sessionsByType,
      recentScoreHistory,
      currentStreak,
      longestStreak,
      successRate,
    }

  } catch (error) {
    console.error('Dashboard data error:', error)
    return null
  }
}

function getNormalizedQuestionScores(question: any) {
  const evaluation = question?.evaluation ?? {}
  const metrics = question?.metrics ?? {}
  const breakdown = evaluation.breakdown ?? {}

  return {
    concept: firstDefined(metrics.conceptScore, breakdown.conceptScore, evaluation.conceptScore),
    semantic: firstDefined(metrics.semanticScore, breakdown.semanticScore, evaluation.semanticScore),
    clarity: firstDefined(metrics.clarityScore, breakdown.clarityScore, evaluation.clarityScore),
    overall: firstDefined(metrics.overallScore, evaluation.overallScore, metrics.finalScore, evaluation.finalScore, evaluation.score),
  }
}

function firstDefined(...values: Array<number | undefined | null>) {
  return values.find((value): value is number => typeof value === 'number' && Number.isFinite(value))
}

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  const dashboardData = await getDashboardData(session.user.email)
  
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Failed to load dashboard data</p>
      </div>
    )
  }

  const {
    totalSessions,
    averageScore,
    bestScore,
    skillScores,
    sessions,
    recommendation,
    scoreTrend,
    recentPerformance,
    learningRecommendations,
    weeklyActivity,
    improvement,
    heatmapData,
    sessionsByType,
    recentScoreHistory,
    currentStreak,
    longestStreak,
    successRate,
  } = dashboardData

  const userName = session.user?.name?.split(' ')[0] ?? 'there'
  const hour = new Date().getUTCHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const TYPE_META: Record<string, { icon: string; color: string; label: string; barColor: string }> = {
    technical:      { icon: '</>', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', label: 'Technical', barColor: '#6366f1' },
    behavioral:     { icon: '💬',  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Behavioral', barColor: '#10b981' },
    'system-design':{ icon: '🏗️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'System Design', barColor: '#f59e0b' },
    hr:             { icon: '🎯',  color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', label: 'HR', barColor: '#ec4899' },
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting}, {userName} 👋
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              {totalSessions === 0
                ? 'Ready to start your interview prep journey?'
                : `${totalSessions} session${totalSessions > 1 ? 's' : ''} completed · Keep it up!`}
            </p>
          </div>
          <Link href="/interview/setup">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
              <Play className="w-4 h-4" /> New Session
            </button>
          </Link>
        </div>

        {totalSessions === 0 ? (
          /* ─────────── NEW USER ─────────── */
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-neutral-900/0 border border-indigo-500/20 rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Get Started</span>
                  <h2 className="text-2xl font-bold text-white mt-2 mb-2">Welcome to InterviewAce</h2>
                  <p className="text-neutral-400 mb-6 max-w-lg">
                    Practice realistic AI-conducted interviews, track your performance over time, and get personalized recommendations to ace your next job interview.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/interview/setup">
                      <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/25">
                        <Play className="w-4 h-4" /> Start First Interview
                      </button>
                    </Link>
                    <Link href="/learning-hub">
                      <button className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Browse Resources
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex w-28 h-28 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl items-center justify-center flex-shrink-0">
                  <Target className="w-14 h-14 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Quick action cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { href: '/interview/setup', icon: <Play className="w-5 h-5 text-indigo-400" />, bg: 'bg-indigo-500/10', label: 'Practice Interviews', desc: 'Mock interviews for Technical, Behavioral, System Design & HR', cta: 'Start Now', ctaColor: 'text-indigo-400' },
                { href: '/learning-hub', icon: <BookOpen className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/10', label: 'Learning Hub', desc: 'Curated resources to sharpen your technical and soft skills.', cta: 'Explore', ctaColor: 'text-emerald-400' },
                { href: '/github-wrap', icon: <Activity className="w-5 h-5 text-purple-400" />, bg: 'bg-purple-500/10', label: 'GitHub Analysis', desc: 'Analyze your coding activity and showcase project portfolio.', cta: 'Connect', ctaColor: 'text-purple-400' },
              ].map(card => (
                <Link key={card.href} href={card.href} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 transition-all group hover:translate-y-[-2px]">
                  <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-4`}>
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{card.label}</h3>
                  <p className="text-neutral-500 text-xs mb-4 leading-relaxed">{card.desc}</p>
                  <div className={`flex items-center text-xs font-medium ${card.ctaColor} group-hover:gap-2 gap-1 transition-all`}>
                    {card.cta} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Learning recommendations */}
            {learningRecommendations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white">Recommended to Start</h2>
                  <Link href="/learning-hub" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    All resources <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {learningRecommendations.slice(0, 3).map((r: any) => (
                    <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-indigo-400 uppercase tracking-wide">{r.type}</span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration}</span>
                      </div>
                      <h3 className="font-medium text-white text-sm mb-1.5">{r.title}</h3>
                      <p className="text-neutral-500 text-xs mb-3 line-clamp-2">{r.description}</p>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-xs font-medium gap-1 transition-colors">
                        Start Learning <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─────────── RETURNING USER ─────────── */
          <>
            {/* ══ ROW 1: Readiness Ring + Streak Stats + Next Challenge ══ */}
            <div className="grid lg:grid-cols-3 gap-4">

              {/* Readiness Ring */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center hover:border-neutral-700 transition-colors">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-4">Interview Readiness</p>
                <ReadinessRing score={averageScore} sessions={totalSessions} trend={scoreTrend} />
              </div>

              {/* Stats grid: 4 micro-cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Streak */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-orange-500/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Current Streak</span>
                    <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-bold text-orange-400">{currentStreak}</div>
                  <div className="text-xs text-neutral-600">days in a row</div>
                </div>
                {/* Longest streak */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Longest Run</span>
                    <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-bold text-amber-400">{longestStreak}</div>
                  <div className="text-xs text-neutral-600">personal best</div>
                </div>
                {/* Success rate */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Pass Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">{successRate}%</div>
                  <div className="text-xs text-neutral-600">scored ≥ 60</div>
                </div>
                {/* Best score */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Best Score</span>
                    <Zap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-bold text-indigo-400">{bestScore}%</div>
                  <div className="text-xs text-neutral-600">all time</div>
                </div>
              </div>

              {/* Next Challenge CTA */}
              {recommendation ? (
                <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-neutral-900 border border-indigo-500/25 rounded-xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Next Challenge</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 capitalize leading-snug">
                      {recommendation.domain.replace(/-/g, ' ')} Practice
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-4">{recommendation.reason}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        recommendation.suggestedDifficulty === 'hard'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : recommendation.suggestedDifficulty === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>{recommendation.suggestedDifficulty} difficulty</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/interview/setup" className="flex-1">
                      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                        <Play className="w-4 h-4" /> Practice Now
                      </button>
                    </Link>
                    <Link href="/learning-hub">
                      <button className="bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 px-3 py-2.5 rounded-lg text-sm transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-white mb-1">Keep Practicing</h3>
                    <p className="text-xs text-neutral-500">Start a new session to unlock personalized recommendations.</p>
                  </div>
                  <Link href="/interview/setup">
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                      New Session
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* ══ ROW 2: Activity Heatmap + Interview Type Breakdown ══ */}
            <div className="grid lg:grid-cols-5 gap-4">

              {/* Activity Heatmap (GitHub-style) */}
              <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-base font-semibold text-white">Practice Activity</h2>
                    <span className="text-xs text-neutral-600">· last 35 days</span>
                  </div>
                  <span className="text-xs text-neutral-500 bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-full">
                    {heatmapData.filter(d => d.count > 0).length} active days
                  </span>
                </div>
                <ActivityHeatmap data={heatmapData} totalSessions={totalSessions} />
              </div>

              {/* Interview Type Breakdown — horizontal bars */}
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-2 mb-5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-base font-semibold text-white">Interview Mix</h2>
                </div>
                <div className="space-y-4">
                  {(Object.entries(sessionsByType) as [string, number][]).map(([type, count]) => {
                    const m = TYPE_META[type] ?? TYPE_META['technical']
                    const pct = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.icon}</span>
                            <span className="text-xs font-medium text-neutral-300">{m.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">{count} session{count !== 1 ? 's' : ''}</span>
                            <span className="text-xs font-bold text-white w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, backgroundColor: m.barColor }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-neutral-800">
                  <p className="text-xs text-neutral-500 text-center">
                    {totalSessions === 1
                      ? 'Only 1 type explored — try a different interview style!'
                      : Object.values(sessionsByType).filter(v => v > 0).length >= 3
                      ? '✓ Great mix — you\'re covering multiple interview types'
                      : 'Try different interview types for a well-rounded prep'}
                  </p>
                </div>
              </div>
            </div>

            {/* ══ ROW 3: Recent Sessions (with sparklines) + Weekly Activity ══ */}
            <div className="grid lg:grid-cols-5 gap-4">

              {/* Recent Sessions with score sparkline */}
              <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Recent Sessions</h2>
                  <Link href="/sessions" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {sessions.slice(0, 5).map((s, idx) => {
                    const typeKey = s.config.type?.toLowerCase().trim().replace(/[\s_]+/g, '-')
                    const m = TYPE_META[typeKey] ?? TYPE_META['technical']
                    const score = s.overallScore ?? 0
                    // Build mini sparkline for each session from session-level data
                    const sessionSubs = s.questions
                      .filter(q => q.evaluation?.score != null)
                      .map(q => (q.evaluation!.score! * 10))
                    return (
                      <div key={s._id} className="flex items-center gap-3 p-3 bg-neutral-800/60 hover:bg-neutral-800 rounded-lg transition-colors group border border-transparent hover:border-neutral-700">
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm flex-shrink-0 ${m.color}`}>
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
                        {/* Mini sparkline per session */}
                        {sessionSubs.length >= 2 && (
                          <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                            <ScoreSparkline scores={sessionSubs} width={60} height={24} />
                          </div>
                        )}
                        <div className={`text-base font-bold flex-shrink-0 min-w-[3rem] text-right ${
                          score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>{score}%</div>
                      </div>
                    )
                  })}
                </div>
                <Link href="/interview/setup" className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-indigo-400 transition-colors py-2.5 border border-dashed border-neutral-700 hover:border-indigo-500/40 rounded-lg group">
                  <Play className="w-3 h-3 group-hover:text-indigo-400" /> Start new session
                </Link>
              </div>

              {/* Right: Weekly bar + resource */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-indigo-400" />
                      <h2 className="text-sm font-semibold text-white">This Week</h2>
                    </div>
                    <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full border border-neutral-700">
                      {weeklyActivity.reduce((s, d) => s + d.sessions, 0)}
                    </span>
                  </div>
                  <WeeklyActivityChart data={weeklyActivity} height={130} />
                </div>

                {/* Score trend insight */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">Score Trend</span>
                  </div>
                  {recentScoreHistory.length >= 2 ? (
                    <>
                      <div className="mb-3">
                        <ScoreSparkline scores={recentScoreHistory} width={200} height={50} />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Last {recentScoreHistory.length} sessions</span>
                        <span className={`font-semibold flex items-center gap-1 ${
                          scoreTrend === 'improving' ? 'text-emerald-400' :
                          scoreTrend === 'declining' ? 'text-red-400' : 'text-neutral-400'
                        }`}>
                          {scoreTrend === 'improving'
                            ? <><ArrowUpRight className="w-3 h-3" /> Improving</>
                            : scoreTrend === 'declining'
                            ? <><ArrowDownRight className="w-3 h-3" /> Declining</>
                            : <><Minus className="w-3 h-3" /> Stable</>}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-neutral-500">Complete more sessions to see your score trend.</p>
                  )}
                </div>

                {/* Top resource */}
                {learningRecommendations.slice(0, 1).map((r: any) => (
                  <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">{r.type}</span>
                      <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration}</span>
                    </div>
                    <h4 className="font-medium text-white text-sm mb-1.5 line-clamp-2">{r.title}</h4>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-xs font-medium gap-1 transition-colors">
                      Study Now <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
