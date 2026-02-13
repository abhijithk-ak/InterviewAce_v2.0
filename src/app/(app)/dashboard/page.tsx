// Clean Dashboard - Server Component Only
// Deterministic Control Center with 3 Sections Only

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { SessionModel } from "@/lib/db/models/Session"

import { OverviewCards } from "@/components/dashboard/OverviewCards"
import { RecentSessions } from "@/components/dashboard/RecentSessions"
import { RecommendationCard } from "@/components/dashboard/RecommendationCard"
import Link from "next/link"
import { BookOpen, TrendingUp, Target, ExternalLink, Play, ArrowRight, Clock } from "lucide-react"

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
      confidence?: number
      clarity?: number
      technical_depth?: number
    }
  }>
}

type DashboardData = {
  totalSessions: number
  averageScore: number
  strongestSkill: string
  strongestSkillScore: number
  weakestSkill: string
  weakestSkillScore: number
  sessions: SessionData[]
  recommendation: any
  scoreTrend: 'improving' | 'declining' | 'stable'
  recentPerformance: number[]
  learningRecommendations: any[]
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
      technical: [] as number[],
      confidence: [] as number[],
      clarity: [] as number[],
      communication: [] as number[]
    }

    sessionsData.forEach(session => {
      session.questions.forEach(question => {
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

    // Calculate skill averages (0-10 scale)
    const skillAverages = {
      technical: skillData.technical.length > 0 
        ? skillData.technical.reduce((a, b) => a + b, 0) / skillData.technical.length 
        : 5,
      confidence: skillData.confidence.length > 0 
        ? skillData.confidence.reduce((a, b) => a + b, 0) / skillData.confidence.length 
        : 5,
      clarity: skillData.clarity.length > 0 
        ? skillData.clarity.reduce((a, b) => a + b, 0) / skillData.clarity.length 
        : 5,
      communication: skillData.communication.length > 0 
        ? skillData.communication.reduce((a, b) => a + b, 0) / skillData.communication.length 
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
      frontend: skillAverages.technical, // Simplified mapping
      backend: skillAverages.technical,
      'system-design': skillAverages.technical,
      algorithms: skillAverages.technical,
      behavioral: skillAverages.communication,
      general: (skillAverages.technical + skillAverages.communication) / 2
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

    // Get learning recommendations for new users or weak areas
    const learningRecommendations = totalSessions === 0 
      ? LEARNING_RESOURCES.slice(0, 3).map(category => category.resources[0])
      : LEARNING_RESOURCES
          .find(cat => cat.id.includes(weakestSkill[0]) || cat.id.includes(userProfile.domains[0]))
          ?.resources.slice(0, 3) || []

    return {
      totalSessions,
      averageScore,
      strongestSkill: strongestSkill[0].charAt(0).toUpperCase() + strongestSkill[0].slice(1),
      strongestSkillScore: Math.round(strongestSkill[1] * 10), // Convert to 0-100 scale
      weakestSkill: weakestSkill[0].charAt(0).toUpperCase() + weakestSkill[0].slice(1),
      weakestSkillScore: Math.round(weakestSkill[1] * 10), // Convert to 0-100 scale
      sessions: sessionsData,
      recommendation,
      scoreTrend,
      recentPerformance: recentScores,
      learningRecommendations
    }

  } catch (error) {
    console.error('Dashboard data error:', error)
    return null
  }
}

export default async function Dashboard() {
  // Server-side session check
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  // Fetch all data server-side (no client fetch, no useEffect)
  const dashboardData = await getDashboardData(session.user.email)
  
  if (!dashboardData) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-neutral-400">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  const {
    totalSessions,
    averageScore,
    strongestSkill,
    strongestSkillScore,
    weakestSkill,
    weakestSkillScore,
    sessions,
    recommendation,
    scoreTrend,
    recentPerformance,
    learningRecommendations
  } = dashboardData

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-400">
            Your interview performance overview
          </p>
        </div>

        {totalSessions === 0 ? (
          // New User Experience
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to InterviewAce!</h2>
                  <p className="text-neutral-300 mb-4">Start your interview preparation journey with personalized practice sessions.</p>
                  <Link href="/interview/setup">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Start First Interview
                    </button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Target className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Getting Started Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/interview/setup" className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Practice Interviews</h3>
                <p className="text-neutral-400 text-sm mb-3">Start with personalized mock interviews tailored to your experience level.</p>
                <div className="flex items-center text-blue-400 text-sm group-hover:text-blue-300">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              <Link href="/learning-hub" className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors group">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Learning Hub</h3>
                <p className="text-neutral-400 text-sm mb-3">Explore curated resources to strengthen your technical and behavioral skills.</p>
                <div className="flex items-center text-green-400 text-sm group-hover:text-green-300">
                  <span>Explore Resources</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>

              <Link href="/github-wrap" className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">GitHub Analysis</h3>
                <p className="text-neutral-400 text-sm mb-3">Get insights into your coding patterns and project portfolio.</p>
                <div className="flex items-center text-purple-400 text-sm group-hover:text-purple-300">
                  <span>View Analysis</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>

            {/* Recommended Learning Path */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recommended Learning Path</h2>
                <Link href="/learning-hub" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {learningRecommendations.map((resource: any, index: number) => (
                  <div key={resource.id} className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">
                        {resource.type}
                      </span>
                      <span className="text-xs text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.duration}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{resource.title}</h3>
                    <p className="text-neutral-400 text-sm mb-4">{resource.description}</p>
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      Start Learning <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Existing User Experience
          <div className="space-y-8">
            {/* Enhanced Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Total Sessions</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{totalSessions}</div>
                <div className="text-sm text-neutral-500">completed</div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Average Score</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{averageScore}%</div>
                <div className="text-sm text-neutral-500">performance</div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Trend</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {scoreTrend === 'improving' ? '↗️' : scoreTrend === 'declining' ? '↘️' : '→'}
                </div>
                <div className={`text-sm capitalize ${
                  scoreTrend === 'improving' ? 'text-green-400' :
                  scoreTrend === 'declining' ? 'text-red-400' : 'text-neutral-400'
                }`}>
                  {scoreTrend}
                </div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">Best Score</span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.max(...sessions.map(s => s.overallScore || 0))}%
                </div>
                <div className="text-sm text-neutral-500">personal best</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Sessions */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
                  <Link href="/sessions" className="text-neutral-400 hover:text-white text-sm transition-colors">
                    View all
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((sessionData, index) => (
                    <div key={sessionData._id} className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                            <span className="text-neutral-300 text-sm">
                              {sessionData.config.type === 'technical' ? '</>' : 
                               sessionData.config.type === 'behavioral' ? '💬' : 
                               sessionData.config.type === 'system-design' ? '🏗️' : '🎯'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white capitalize">
                              {sessionData.config.type} • {sessionData.config.role}
                            </div>
                            <div className="text-sm text-neutral-400">
                              {new Date(sessionData.startedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric"
                              })} • {sessionData.config.difficulty}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${
                            (sessionData.overallScore || 0) >= 80 ? 'text-green-400' :
                            (sessionData.overallScore || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {sessionData.overallScore || 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {sessions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">No sessions yet</h3>
                      <p className="text-neutral-400 mb-4">Start your first interview to see your progress here</p>
                      <Link href="/interview/setup">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Start Interview
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Recommended</h2>
                  <span className="text-sm text-neutral-400">Based on performance</span>
                </div>
                
                {/* Single Priority Recommendation */}
                {recommendation ? (
                  <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-blue-400 font-medium uppercase tracking-wider">
                        Priority Focus
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        recommendation.suggestedDifficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                        recommendation.suggestedDifficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {recommendation.suggestedDifficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                      {recommendation.domain.replace('-', ' ')} Practice
                    </h3>
                    <p className="text-neutral-400 text-sm mb-4">{recommendation.reason}</p>
                    <div className="flex gap-2">
                      <Link href="/interview/setup">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                          Start Practice
                        </button>
                      </Link>
                      <Link href="/learning-hub">
                        <button className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded text-sm transition-colors">
                          Study Resources
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-400 text-center py-8">
                    Complete more sessions for personalized recommendations.
                  </div>
                )}

                {/* Learning Resources for Current Week Area */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Learn More</h3>
                  {learningRecommendations.slice(0, 2).map((resource: any, index: number) => (
                    <div key={resource.id} className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-green-400 font-medium uppercase tracking-wider">
                          {resource.type}
                        </span>
                        <span className="text-xs text-neutral-400">{resource.duration}</span>
                      </div>
                      <h4 className="font-medium text-white mb-1">{resource.title}</h4>
                      <p className="text-neutral-400 text-sm mb-3">{resource.description.slice(0, 80)}...</p>
                      <a 
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-400 hover:text-green-300 text-sm transition-colors"
                      >
                        Study Now <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
