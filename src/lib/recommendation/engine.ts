// Main Recommendation Engine
// Combines all recommendation systems into intelligent learning suggestions

import { 
  calculateAdaptiveDifficulty, 
  getNextDifficultyProgression,
  type DifficultyInput,
  type DifficultyLevel
} from "./difficulty"
import { 
  mapDomainsToQuestions, 
  recommendSessionConfig, 
  getDomainResourceMapping,
  type UserDomain 
} from "./domain-mapper"
import { 
  generateLearningPath,
  type LearningPath 
} from "./learning-path"
import { getResourcesForWeakAreas, type Resource } from "@/lib/resources"

export interface UserProfile {
  experienceLevel: "student" | "fresher" | "junior" | "senior"
  domains: UserDomain[]
  interviewGoals: string[]
  confidenceLevel: number // 1-5
  weakAreas: string[]
}

export interface AnalyticsData {
  totalSessions: number
  averageScore: number // 0-100
  skillBreakdown: {
    technical: number // 0-10
    communication: number // 0-10  
    confidence: number // 0-10
    clarity: number // 0-10
  }
  scoreTrend: "improving" | "declining" | "stable"
  recentPerformance: number[] // Last 5 session scores
}

export interface RecommendationOutput {
  // Primary recommendation
  primaryFocus: string
  suggestedRole: "frontend" | "backend" | "fullstack" | "general" 
  suggestedDifficulty: DifficultyLevel
  suggestedType: "technical" | "behavioral" | "hr" | "system-design"
  
  // Urgency and explanation
  urgencyLevel: "critical" | "high" | "medium" | "low"
  explanation: string
  nextActionTitle: string
  nextActionDescription: string
  
  // Resources and learning
  recommendedResources: Resource[]
  learningPath: LearningPath
  
  // Session configuration
  sessionConfig: {
    role: string
    type: string
    difficulty: string
  }
  
  // Progress insights
  progressInsights: {
    trend: string
    momentum: string
    nextMilestone: string
  }
}

/**
 * Main recommendation engine - generates personalized learning recommendations
 * Fully deterministic: same inputs always produce same outputs
 */
export function generateRecommendations(
  profile: UserProfile,
  analytics: AnalyticsData
): RecommendationOutput {
  
  // Step 1: Calculate adaptive difficulty
  const difficultyInput: DifficultyInput = {
    confidenceLevel: profile.confidenceLevel,
    averageScore: analytics.averageScore,
    experienceLevel: profile.experienceLevel,
    sessionsCompleted: analytics.totalSessions,
    recentPerformanceTrend: analytics.scoreTrend
  }
  
  const difficultyRec = calculateAdaptiveDifficulty(difficultyInput)
  
  // Step 2: Identify weakest skill area
  const skillEntries = Object.entries(analytics.skillBreakdown)
  const weakestSkill = skillEntries.reduce((min, current) => 
    current[1] < min[1] ? current : min
  )
  
  // Step 3: Determine primary focus and urgency (with strong profile bias)
  const urgencyScore = calculateUrgencyScore(analytics.skillBreakdown, profile.confidenceLevel, profile)
  const urgencyLevel = mapUrgencyScore(urgencyScore)
  const primaryFocus = generatePrimaryFocus(weakestSkill[0], weakestSkill[1], profile)
  
  // Step 4: Map domains to session configuration
  const sessionConfig = recommendSessionConfig(profile.domains, weakestSkill[0])
  
  // Step 5: Generate learning resources
  const resourceCategories = profile.weakAreas.length > 0 
    ? profile.weakAreas 
    : [mapSkillToResourceCategory(weakestSkill[0])]
  const recommendedResources = getResourcesForWeakAreas(resourceCategories).slice(0, 3)
  
  // Step 6: Generate comprehensive learning path
  const learningPath = generateLearningPath(
    profile.weakAreas,
    analytics.skillBreakdown,
    profile.experienceLevel,
    profile.domains
  )
  
  // Step 7: Generate progress insights
  const progressInsights = generateProgressInsights(analytics, profile)
  
  // Step 8: Create explanation and next action
  const explanation = generateExplanation(
    weakestSkill, 
    analytics.averageScore, 
    profile.confidenceLevel,
    analytics.scoreTrend
  )
  
  const nextAction = generateNextAction(
    primaryFocus,
    sessionConfig.type,
    difficultyRec.suggestedDifficulty,
    urgencyLevel
  )
  
  return {
    primaryFocus,
    suggestedRole: sessionConfig.role as any,
    suggestedDifficulty: difficultyRec.suggestedDifficulty,
    suggestedType: sessionConfig.type as any,
    urgencyLevel,
    explanation,
    nextActionTitle: nextAction.title,
    nextActionDescription: nextAction.description,
    recommendedResources,
    learningPath,
    sessionConfig: {
      role: sessionConfig.role,
      type: sessionConfig.type, 
      difficulty: difficultyRec.suggestedDifficulty
    },
    progressInsights
  }
}

/**
 * Calculate urgency score (0-100) with strong profile bias weighting
 * Formula: skillDeficit (60%) + profileWeakArea (30%) + experienceBias (10%)
 */
function calculateUrgencyScore(
  skillBreakdown: Record<string, number>,
  confidenceLevel: number,
  profile: UserProfile
): number {
  // 1. Skill Deficit Score (60% weight)
  const skillWeights = {
    technical: 0.4,   // Most important for interviews
    communication: 0.25,
    clarity: 0.2,
    confidence: 0.15
  }
  
  let skillDeficitScore = 0
  Object.entries(skillBreakdown).forEach(([skill, score]) => {
    const weight = skillWeights[skill as keyof typeof skillWeights] || 0.1
    const deficit = Math.max(0, 6 - score) // Anything below 6/10 is concerning
    skillDeficitScore += deficit * weight * 10 // Scale to 0-100
  })
  
  // 2. Profile Weak Area Boost (30% weight)
  let profileWeightScore = 0
  const profileWeakAreas = profile.weakAreas || []
  
  // Strong profile bias - if user explicitly identified weak areas, boost priority
  profileWeakAreas.forEach(weakArea => {
    if (weakArea === "algorithm-design" || weakArea === "system-architecture") {
      profileWeightScore += 25 // Major boost for critical areas
    } else if (weakArea === "communication-clarity") {
      profileWeightScore += 20 // Significant boost for soft skills
    } else {
      profileWeightScore += 15 // Standard boost for other areas
    }
  })
  
  // Job prep goals boost technical priority
  if (profile.interviewGoals.includes("job-prep") || profile.interviewGoals.includes("career-change")) {
    profileWeightScore += 15 // Boost technical focus
  }
  
  // 3. Experience Level Bias (10% weight)
  let experienceBias = 0
  switch (profile.experienceLevel) {
    case "student":
      experienceBias = 20 // Higher urgency - needs more preparation
      break
    case "fresher": 
      experienceBias = 15 // Moderate urgency
      break
    case "junior":
      experienceBias = 10 // Lower urgency - some experience
      break
    case "senior":
      experienceBias = 5 // Lowest urgency - experienced
      break
  }
  
  // Final weighted calculation
  const finalScore = (skillDeficitScore * 0.6) + (profileWeightScore * 0.3) + (experienceBias * 0.1)
  
  // Confidence multiplier (profile-aware)
  let confidenceMultiplier = 1.0
  if (confidenceLevel <= 2) {
    confidenceMultiplier = 1.3 // Low confidence increases urgency
  } else if (confidenceLevel >= 4) {
    confidenceMultiplier = 0.8 // High confidence reduces urgency
  }
  
  return Math.min(100, finalScore * confidenceMultiplier)
}

/**
 * Map numerical urgency score to category
 */
function mapUrgencyScore(score: number): "critical" | "high" | "medium" | "low" {
  if (score >= 70) return "critical"
  if (score >= 50) return "high"  
  if (score >= 25) return "medium"
  return "low"
}

/**
 * Generate human-readable primary focus description with profile context
 */
function generatePrimaryFocus(skillName: string, skillScore: number, profile: UserProfile): string {
  // Check if this aligns with user's identified weak areas
  const profileWeakAreas = profile.weakAreas || []
  const isProfileIdentified = profileWeakAreas.some(area => 
    area.includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(area)
  )
  
  const focusMap = {
    technical: isProfileIdentified ? "Technical Skills (Self-Identified)" : "Technical Depth",
    communication: isProfileIdentified ? "Communication (Self-Identified)" : "Communication Skills", 
    clarity: isProfileIdentified ? "Clarity (Self-Identified)" : "Response Clarity",
    confidence: isProfileIdentified ? "Confidence Building (Self-Identified)" : "Interview Confidence"
  }
  
  const focus = focusMap[skillName as keyof typeof focusMap] || "Core Skills"
  
  // Profile-aware urgency level
  let level = "Improving"
  if (isProfileIdentified && skillScore < 6) {
    level = "Priority Area"
  } else if (skillScore < 4) {
    level = "Critical"
  } else if (skillScore < 6) {
    level = "Developing"
  } else {
    level = "Maintaining"
  }
  
  return `${focus} (${level})`
}

/**
 * Map skill breakdown keys to resource categories
 */
function mapSkillToResourceCategory(skillName: string): string {
  const mapping = {
    technical: "algorithm-design",
    communication: "communication-clarity",
    clarity: "communication-clarity", 
    confidence: "confidence-building"
  }
  
  return mapping[skillName as keyof typeof mapping] || "algorithm-design"  
}

/**
 * Generate progress insights and momentum analysis
 */
function generateProgressInsights(analytics: AnalyticsData, profile: UserProfile) {
  let trendDescription = ""
  let momentum = ""
  let nextMilestone = ""
  
  // Trend analysis
  switch (analytics.scoreTrend) {
    case "improving":
      trendDescription = `Performance improving steadily (${Math.round(analytics.averageScore)}% average)`
      momentum = "positive"
      break
    case "declining": 
      trendDescription = `Performance declined in recent sessions (${Math.round(analytics.averageScore)}% average)`
      momentum = "concerning"
      break
    case "stable":
      trendDescription = `Performance stable at ${Math.round(analytics.averageScore)}%`
      momentum = "steady"
      break
  }
  
  // Next milestone
  if (analytics.averageScore < 50) {
    nextMilestone = "Reach 50% average score"
  } else if (analytics.averageScore < 70) {
    nextMilestone = "Achieve 70% consistency"
  } else {
    nextMilestone = "Master advanced scenarios"
  }
  
  return {
    trend: trendDescription,
    momentum,
    nextMilestone
  }
}

/**
 * Generate detailed explanation for recommendations
 */
function generateExplanation(
  weakestSkill: [string, number],
  averageScore: number, 
  confidenceLevel: number,
  trend: string
): string {
  const [skillName, skillScore] = weakestSkill
  
  let explanation = `Your ${skillName} score is ${skillScore}/10, which is your primary area for improvement. `
  
  if (averageScore < 40) {
    explanation += "Focus on fundamentals to build a strong foundation. "
  } else if (averageScore < 70) {
    explanation += "You're progressing well - time to tackle intermediate challenges. "
  } else {
    explanation += "Strong performance overall - ready for advanced practice. "
  }
  
  if (confidenceLevel <= 2) {
    explanation += "Building confidence through easier questions will help your overall performance."
  } else if (confidenceLevel >= 4) {
    explanation += "Your confidence is good - push yourself with more challenging material."
  }
  
  if (trend === "improving") {
    explanation += " Great progress momentum!"
  } else if (trend === "declining") {
    explanation += " Let's reverse the recent decline with targeted practice."
  }
  
  return explanation
}

/**
 * Generate next action recommendation
 */
function generateNextAction(
  primaryFocus: string,
  sessionType: string,
  difficulty: DifficultyLevel,
  urgency: string
) {
  const urgencyPrefix = urgency === "critical" ? "🚨 Urgent:" : urgency === "high" ? "⚡ Priority:" : "📚"
  
  const title = `${urgencyPrefix} ${primaryFocus} Practice`
  
  const description = `Start a ${difficulty} ${sessionType} session to improve your weakest skill area. This targeted practice will have the biggest impact on your interview performance.`
  
  return { title, description }
}

// Re-export types and utilities
export { 
  calculateAdaptiveDifficulty,
  mapDomainsToQuestions, 
  generateLearningPath,
  type DifficultyLevel,
  type UserDomain
}