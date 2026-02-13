import Link from "next/link"
import { BookOpen, ExternalLink, Clock, Target, TrendingUp, Star, Play, ArrowRight } from "lucide-react"
import { redirect } from "next/navigation"
import { LEARNING_RESOURCES, type Resource } from "@/lib/resources"
import { connectDB } from "@/lib/db/mongoose"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { SessionModel } from "@/lib/db/models/Session"
import { auth } from "@/lib/auth"

async function getLearningData(userEmail: string) {
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

    // Real analytics calculation
    const totalSessions = sessions.length
    
    let realAnalytics = null
    
    if (totalSessions > 0) {
      // Calculate real skill averages from sessions
      const skillData = {
        technical: [] as number[],
        confidence: [] as number[],
        clarity: [] as number[],
        communication: [] as number[]
      }

      sessions.forEach(session => {
        session.questions.forEach((question: any) => {
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

      // Calculate averages
      const skillAverages = {
        technical: skillData.technical.length > 0 
          ? Math.round(skillData.technical.reduce((a, b) => a + b, 0) / skillData.technical.length) 
          : 5,
        communication: skillData.communication.length > 0 
          ? Math.round(skillData.communication.reduce((a, b) => a + b, 0) / skillData.communication.length) 
          : 5,
        confidence: skillData.confidence.length > 0 
          ? Math.round(skillData.confidence.reduce((a, b) => a + b, 0) / skillData.confidence.length) 
          : 5,
        clarity: skillData.clarity.length > 0 
          ? Math.round(skillData.clarity.reduce((a, b) => a + b, 0) / skillData.clarity.length) 
          : 5
      }

      const scoresSum = sessions.reduce((sum, session) => sum + (session.overallScore || 0), 0)
      const averageScore = Math.round(scoresSum / totalSessions)

      // Calculate trend
      const recentScores = sessions.slice(0, 5).map(s => s.overallScore || 0).reverse()
      let scoreTrend: 'improving' | 'declining' | 'stable' = 'stable'
      if (recentScores.length >= 2) {
        const firstHalf = recentScores.slice(0, Math.ceil(recentScores.length / 2))
        const secondHalf = recentScores.slice(Math.ceil(recentScores.length / 2))
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
        
        if (secondAvg > firstAvg + 5) scoreTrend = 'improving'
        else if (firstAvg > secondAvg + 5) scoreTrend = 'declining'
      }

      realAnalytics = {
        totalSessions,
        averageScore,
        skillBreakdown: skillAverages,
        scoreTrend,
        recentPerformance: recentScores
      }
    }
    
    return {
      profile: userProfile,
      analytics: realAnalytics,
      totalSessions,
      needsOnboarding: false
    }
  } catch (error) {
    console.error('Learning data error:', error)
    return null
  }
}

export default async function LearningHubPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  const learningData = await getLearningData(session.user.email)
  
  if (!learningData) {
    return (
      <div className="min-h-screen bg-neutral-900 -m-8 flex items-center justify-center">
        <p className="text-neutral-400">Failed to load learning data</p>
      </div>
    )
  }

  const { profile, analytics, totalSessions } = learningData

  // Get personalized resources based on user's weak areas and domains
  const personalizedResources = LEARNING_RESOURCES.filter(category => {
    return profile.domains.some((domain: string) => 
      category.id.includes(domain) || 
      category.id.includes('fundamentals') ||
      category.id.includes('behavioral')
    )
  }).slice(0, 3)

  // If no personalized match, show general categories
  const recommendedCategories = personalizedResources.length > 0 
    ? personalizedResources 
    : LEARNING_RESOURCES.slice(0, 3)

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            Learning Hub
          </h1>
          <p className="text-neutral-400">
            {totalSessions === 0 
              ? "Curated learning resources to jumpstart your interview preparation" 
              : "Personalized learning resources based on your performance"}
          </p>
        </div>

        {totalSessions === 0 ? (
          // New User Experience
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Start Your Learning Journey</h2>
                  <p className="text-neutral-300 mb-4">
                    Build a strong foundation with these carefully curated learning paths designed for {profile.experienceLevel} level interviews.
                  </p>
                  <Link href="/interview/setup">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Take Practice Interview First
                    </button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Paths for New Users */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Recommended Learning Paths</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedCategories.map((category) => (
                  <div key={category.id} className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                      <p className="text-neutral-400 text-sm">{category.description}</p>
                    </div>
                    <div className="space-y-3">
                      {category.resources.slice(0, 3).map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded border border-neutral-600 hover:bg-neutral-700 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium uppercase tracking-wider ${
                              resource.difficulty === 'advanced' ? 'text-red-400' :
                              resource.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {resource.type}
                            </span>
                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {resource.duration}
                            </span>
                          </div>
                          <h4 className="font-medium text-white text-sm mb-1">{resource.title}</h4>
                          <p className="text-neutral-400 text-xs">{resource.description.slice(0, 80)}...</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Existing User Experience with Real Analytics
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-600/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Your Learning Progress</h2>
                  <p className="text-neutral-300">
                    Based on {totalSessions} completed sessions
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{analytics!.averageScore}%</div>
                  <div className={`text-sm font-medium ${
                    analytics!.scoreTrend === 'improving' ? 'text-green-400' :
                    analytics!.scoreTrend === 'declining' ? 'text-red-400' : 'text-neutral-400'
                  }`}>
                    {analytics!.scoreTrend === 'improving' ? '↗️ Improving' :
                     analytics!.scoreTrend === 'declining' ? '↘️ Needs Focus' : '→ Stable'}
                  </div>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analytics!.skillBreakdown).map(([skill, score]) => (
                  <div key={skill} className="bg-neutral-800/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{score}/10</p>
                    <p className="text-xs text-neutral-300 capitalize">{skill}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Improve Your Weak Areas</h2>
                <span className="text-sm text-green-400">Personalized for you</span>
              </div>
              
              {/* Focus on weakest skill */}
              <div className="mb-6">
                {(() => {
                  const skills = Object.entries(analytics!.skillBreakdown)
                  const weakestSkill = skills.reduce((min, skill) => skill[1] < min[1] ? skill : min)
                  const targetCategory = LEARNING_RESOURCES.find(cat => 
                    cat.name.toLowerCase().includes(weakestSkill[0]) ||
                    cat.id.includes(weakestSkill[0])
                  ) || LEARNING_RESOURCES[0]
                  
                  return (
                    <div className="bg-yellow-600/20 rounded-lg p-6 border border-yellow-600/30">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-yellow-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Priority Focus Area</h3>
                          <p className="text-neutral-300 text-sm">
                            Your {weakestSkill[0]} skills need attention (scored {weakestSkill[1]}/10)
                          </p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {targetCategory.resources.slice(0, 2).map((resource) => (
                          <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 bg-neutral-800 rounded border border-neutral-600 hover:bg-neutral-700 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-yellow-400 font-medium uppercase tracking-wider">
                                {resource.type}
                              </span>
                              <span className="text-xs text-neutral-400">{resource.duration}</span>
                            </div>
                            <h4 className="font-medium text-white mb-1">{resource.title}</h4>
                            <p className="text-neutral-400 text-sm">{resource.description.slice(0, 100)}...</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* All Learning Categories */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">All Learning Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LEARNING_RESOURCES.map((category) => (
                  <div key={category.id} className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                      <p className="text-neutral-400 text-sm">{category.description}</p>
                    </div>
                    <div className="space-y-3">
                      {category.resources.slice(0, 3).map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded border border-neutral-600 hover:bg-neutral-700 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium uppercase tracking-wider ${
                              resource.difficulty === 'advanced' ? 'text-red-400' :
                              resource.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {resource.type}
                            </span>
                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {resource.duration}
                            </span>
                          </div>
                          <h4 className="font-medium text-white text-sm mb-1">{resource.title}</h4>
                          <p className="text-neutral-400 text-xs">{resource.description.slice(0, 80)}...</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}