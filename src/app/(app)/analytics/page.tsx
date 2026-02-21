import { redirect } from "next/navigation"
import Link from "next/link"
import { BarChart2, TrendingUp, Award, Target, Clock, CheckCircle, Calendar, Play, BookOpen } from "lucide-react"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { SessionModel } from "@/lib/db/models/Session"

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
          if (question.evaluation.technical_depth) {
            skillData.technical.push(question.evaluation.technical_depth)
          }
          if (question.evaluation.confidence) {
            skillData.confidence.push(question.evaluation.confidence)
          }
          if (question.evaluation.clarity) {
            skillData.clarity.push(question.evaluation.clarity)
          }
          if (question.evaluation.score) {
            skillData.communication.push(question.evaluation.score)
          }
        }
      })
    })

    const skillBreakdown = {
      technical: skillData.technical.length > 0 
        ? Math.round((skillData.technical.reduce((a, b) => a + b, 0) / skillData.technical.length) * 10) / 10
        : 5.0,
      communication: skillData.communication.length > 0 
        ? Math.round((skillData.communication.reduce((a, b) => a + b, 0) / skillData.communication.length) * 10) / 10
        : 5.0,
      confidence: skillData.confidence.length > 0 
        ? Math.round((skillData.confidence.reduce((a, b) => a + b, 0) / skillData.confidence.length) * 10) / 10
        : 5.0,
      clarity: skillData.clarity.length > 0 
        ? Math.round((skillData.clarity.reduce((a, b) => a + b, 0) / skillData.clarity.length) * 10) / 10
        : 5.0
    }

    // Calculate score trend over time (last 10 sessions)
    const recentSessions = sessions.slice(0, 10).reverse()
    const scoreTrend = recentSessions.map((session, index) => ({
      date: `Session ${index + 1}`,
      score: session.overallScore || 0
    }))

    // Session type breakdown - normalize case and add logging
    console.log("Sample session:", sessions[0])
    const sessionsByType = {
      technical: 0,
      behavioral: 0,
      'system-design': 0,
      hr: 0
    }

    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0
    }

    // Safely aggregate with normalization
    sessions.forEach(session => {
      if (session.config) {
        // Normalize type (handle both "Technical" and "technical")
        const type = session.config.type?.toLowerCase().trim()
        if (type === 'technical') sessionsByType.technical++
        else if (type === 'behavioral') sessionsByType.behavioral++
        else if (type === 'system-design' || type === 'systemdesign') sessionsByType['system-design']++
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

    const analytics: AnalyticsData = {
      totalSessions,
      averageScore,
      bestScore,
      avgDuration,
      skillBreakdown,
      scoreTrend,
      sessionsByType,
      difficultyBreakdown,
      recentSessions: formattedRecentSessions
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
      <div className="min-h-screen bg-neutral-900 -m-8 flex items-center justify-center">
        <p className="text-neutral-400">Failed to load analytics data</p>
      </div>
    )
  }

  const { profile, analytics, totalSessions } = analyticsData

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart2 className="h-8 w-8 text-blue-400" />
            Performance Analytics
          </h1>
          <p className="text-neutral-400">
            {totalSessions === 0 
              ? "Complete your first interview to see detailed analytics and insights" 
              : `Insights from ${totalSessions} completed interview sessions`}
          </p>
        </div>

        {totalSessions === 0 ? (
          // New User Experience
          <div className="space-y-8">
            {/* Empty State */}
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart2 className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">No Analytics Yet</h3>
              <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                Complete your first interview session to unlock detailed analytics, performance trends, and personalized insights.
              </p>
              <Link href="/interview/setup">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Start First Interview
                </button>
              </Link>
            </div>

            {/* Preview of what they'll get */}
            <div className="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
              <h3 className="text-lg font-semibold text-white mb-4">What You'll See After Your First Session</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-medium text-white mb-2">Performance Trends</h4>
                  <p className="text-neutral-400 text-sm">Track your improvement over time with detailed score analysis</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-medium text-white mb-2">Skill Breakdown</h4>
                  <p className="text-neutral-400 text-sm">Identify strengths and areas for improvement across different skills</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h4 className="font-medium text-white mb-2">Detailed Insights</h4>
                  <p className="text-neutral-400 text-sm">Get personalized recommendations and performance comparisons</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Existing User Experience with Real Analytics
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Total Sessions</span>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{analytics!.totalSessions}</div>
                <div className="text-sm text-neutral-500">completed</div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Average Score</span>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{analytics!.averageScore}%</div>
                <div className="text-sm text-neutral-500">performance</div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Best Score</span>
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{analytics!.bestScore}%</div>
                <div className="text-sm text-neutral-500">personal best</div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Avg Duration</span>
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{analytics!.avgDuration}</div>
                <div className="text-sm text-neutral-500">minutes</div>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold text-white mb-6">Skill Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Object.entries(analytics!.skillBreakdown).map(([skill, score]) => (
                  <div key={skill} className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      score >= 8 ? 'text-green-400' :
                      score >= 6 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {score}/10
                    </div>
                    <div className="text-sm text-neutral-300 capitalize mb-2">{skill}</div>
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score >= 8 ? 'bg-green-400' :
                          score >= 6 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trend */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold text-white mb-6">Score Progression</h2>
              <div className="space-y-4">
                {analytics!.scoreTrend.map((point, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-neutral-300">{point.date}</span>
                    <div className="flex items-center gap-4 flex-1 mx-4">
                      <div className="w-full bg-neutral-700 rounded-full h-2 max-w-md">
                        <div
                          className={`h-2 rounded-full ${
                            point.score >= 80 ? 'bg-green-400' :
                            point.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${point.score}%` }}
                        />
                      </div>
                      <span className={`font-medium ${
                        point.score >= 80 ? 'text-green-400' :
                        point.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {point.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Breakdowns */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Session Types */}
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 className="text-lg font-semibold text-white mb-4">Session Types</h2>
                <div className="space-y-3">
                  {Object.entries(analytics!.sessionsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-300 text-sm">
                          {type === 'technical' ? '</>' : 
                           type === 'behavioral' ? '💬' : '🏗️'}
                        </span>
                        <span className="text-neutral-300 capitalize">{type.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-neutral-700 rounded-full h-2 w-16">
                          <div
                            className="bg-blue-400 h-2 rounded-full"
                            style={{ width: `${(count / totalSessions) * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Distribution */}
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 className="text-lg font-semibold text-white mb-4">Difficulty Levels</h2>
                <div className="space-y-3">
                  {Object.entries(analytics!.difficultyBreakdown).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          difficulty === 'hard' ? 'bg-red-400' :
                          difficulty === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        <span className="text-neutral-300 capitalize">{difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-neutral-700 rounded-full h-2 w-16">
                          <div
                            className={`h-2 rounded-full ${
                              difficulty === 'hard' ? 'bg-red-400' :
                              difficulty === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`}
                            style={{ width: `${(count / totalSessions) * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
                <Link href="/sessions" className="text-blue-400 hover:text-blue-300 text-sm">
                  View all sessions →
                </Link>
              </div>
              <div className="space-y-3">
                {analytics!.recentSessions.map((sessionData) => (
                  <div key={sessionData._id} className="flex items-center justify-between p-3 bg-neutral-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-300">
                        {sessionData.config.type === 'technical' ? '</>' : 
                         sessionData.config.type === 'behavioral' ? '💬' : '🏗️'}
                      </span>
                      <div>
                        <div className="text-white font-medium">
                          {sessionData.config.role} • {sessionData.config.type.charAt(0).toUpperCase() + sessionData.config.type.slice(1)}
                        </div>
                        <div className="text-neutral-400 text-sm">
                          {new Date(sessionData.startedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })} • {sessionData.config.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${
                      (sessionData.overallScore || 0) >= 80 ? 'text-green-400' :
                      (sessionData.overallScore || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {sessionData.overallScore || 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/interview/setup" className="flex-1">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Start New Session
                </button>
              </Link>
              <Link href="/learning-hub" className="flex-1">
                <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Improve Skills
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
