import Link from "next/link"
import { BookOpen, ExternalLink, Clock, Target, TrendingUp, Star, Play, ArrowRight } from "lucide-react"
import { redirect } from "next/navigation"
import { LEARNING_RESOURCES, type Resource } from "@/lib/resources"
import { connectDB } from "@/lib/db/mongoose"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { SessionModel } from "@/lib/db/models/Session"
import { auth } from "@/lib/auth"
import { getPersonalizedRecommendations, type RecommendationContext } from "@/lib/recommendation-engine"

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

  // Use mathematical recommendation engine instead of simple filtering
  const recommendationContext: RecommendationContext = {
    profile,
    analytics,
    totalSessions
  }

  const { recommendations, deficits, targetDifficulty, primaryFocus, isNewUser } = 
    getPersonalizedRecommendations(recommendationContext)

  const recommendedCategories = recommendations.slice(0, 3)

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
          // New User Experience - Personalized based on onboarding
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome, {profile.experienceLevel === 'student' ? 'Future Developer!' : profile.experienceLevel === 'fresher' ? 'Rising Developer!' : profile.experienceLevel === 'junior' ? 'Growing Developer!' : 'Seasoned Developer!'}</h2>
                  <p className="text-neutral-300 mb-4">
                    Based on your interest in <span className="text-blue-400 font-medium">{profile.domains.join(', ')}</span> and your goal to {profile.interviewGoals.includes('prepare-for-job-interviews') ? 'ace job interviews' : profile.interviewGoals.includes('practice-technical-skills') ? 'strengthen technical skills' : profile.interviewGoals.includes('build-confidence') ? 'build confidence' : 'improve your skills'}, we've curated these learning paths specifically for you.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.weakAreas && profile.weakAreas.length > 0 && (
                      <>
                        <span className="text-neutral-400 text-sm">Focus areas:</span>
                        {profile.weakAreas.slice(0, 3).map((area: string) => (
                          <span key={area} className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                            {area.replace('-', ' ')}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  <Link href="/interview/setup">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Start Your First Practice Interview
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

            {/* Personalized Learning Paths */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Mathematical Recommendation Engine</h2>
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full">
                  Primary Focus: {primaryFocus[0]} (deficit: {primaryFocus[1].toFixed(1)}/10)
                </div>
                <div className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full">
                  Target Difficulty: {targetDifficulty}
                </div>
                <div className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full">
                  Experience: {profile.experienceLevel} level
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedCategories.map((category) => (
                  <div key={category.id} className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <div className="flex items-center gap-2">
                          {(category as any).score >= 50 && (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">High Match</span>
                          )}
                          <span className="bg-neutral-700 text-neutral-300 px-2 py-1 rounded text-xs font-mono">
                            {(category as any).score?.toFixed(1) || '0.0'}
                          </span>
                        </div>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2">{category.description}</p>
                      {(category as any).matchReason && (
                        <p className="text-blue-300 text-xs italic">→ {(category as any).matchReason}</p>
                      )}
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
                <div>
                  <h2 className="text-xl font-semibold text-white">Adaptive Learning Recommendations</h2>
                  <p className="text-neutral-400 text-sm mt-1">Based on your performance data, we've refined your learning path from your initial onboarding preferences</p>
                </div>
                <span className="text-sm text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance-Based
                </span>
              </div>

              {/* Evolution from onboarding */}
              <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Your Initial Focus Areas
                    </h3>
                    <div className="space-y-2">
                      <div className="text-neutral-400 text-sm">From onboarding:</div>
                      <div className="flex flex-wrap gap-2">
                        {profile.domains.map((domain: string) => (
                          <span key={domain} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {domain.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                      {profile.weakAreas && profile.weakAreas.length > 0 && (
                        <div className="mt-3">
                          <div className="text-neutral-400 text-sm">Identified weak areas:</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {profile.weakAreas.slice(0, 2).map((area: string) => (
                              <span key={area} className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                                {area.replace('-', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Current Performance Focus
                    </h3>
                    <div className="space-y-2">
                      <div className="text-neutral-400 text-sm">After {analytics!.totalSessions} practice sessions:</div>
                      <div className="space-y-2">
                        {Object.entries(analytics!.skillBreakdown)
                          .sort(([,a], [,b]) => a - b)
                          .slice(0, 2)
                          .map(([skill, score]) => (
                          <div key={skill} className="flex items-center justify-between bg-neutral-800 rounded px-3 py-2">
                            <span className="text-white capitalize">{skill}</span>
                            <span className={`text-sm font-medium ${
                              score < 5 ? 'text-red-400' : score < 7 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {score}/10 - {score < 5 ? 'Needs focus' : score < 7 ? 'Improving' : 'Strong'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-600/10 rounded-lg border border-blue-600/20">
                  <div className="text-blue-300 text-sm mb-1">💡 How we've adapted your learning path:</div>
                  <div className="text-neutral-300 text-sm">
                    We started with your onboarding preferences but now prioritize areas where your performance shows the most room for improvement. This ensures you're always working on what matters most for your growth.
                  </div>
                </div>
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