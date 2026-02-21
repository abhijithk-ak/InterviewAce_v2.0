/**
 * Mathematical Recommendation Engine
 * IEEE-level deterministic algorithm for personalized learning recommendations
 */

import { LEARNING_RESOURCES } from "@/lib/resources"
import type { IUserProfile } from "@/lib/db/models/UserProfile"

export type SkillDeficits = {
  technical: number
  communication: number
  confidence: number
  clarity: number
}

export type RecommendationContext = {
  profile: IUserProfile
  analytics?: {
    skillBreakdown: {
      technical: number
      communication: number
      confidence: number
      clarity: number
    }
    averageScore: number
    totalSessions: number
    scoreTrend: 'improving' | 'declining' | 'stable'
  } | null
  totalSessions: number
}

/**
 * Step 1: Calculate Skill Deficits
 * Returns deficit scores (0-10, higher = needs more improvement)
 */
export function calculateSkillDeficits(context: RecommendationContext): SkillDeficits {
  const { analytics, profile } = context

  if (!analytics || context.totalSessions === 0) {
    // NEW USER: Use onboarding confidence as baseline
    const baseDeficit = Math.max(0, 6 - profile.confidenceLevel) // Scale 1-5 confidence to deficit
    
    return {
      technical: baseDeficit + 2, // Assume technical needs work for new users
      communication: baseDeficit + (profile.interviewGoals.includes('improve-communication') ? 3 : 1),
      confidence: Math.max(0, 8 - profile.confidenceLevel * 1.6), // Scale to 0-8
      clarity: baseDeficit + (profile.interviewGoals.includes('improve-communication') ? 2 : 1)
    }
  }

  // EXISTING USER: Calculate from performance data
  const { skillBreakdown, averageScore } = analytics
  
  return {
    technical: Math.max(0, 10 - skillBreakdown.technical),
    communication: Math.max(0, 10 - skillBreakdown.communication),
    confidence: Math.max(0, 10 - skillBreakdown.confidence),
    clarity: Math.max(0, 10 - skillBreakdown.clarity)
  }
}

/**
 * Step 2: Calculate Dynamic Difficulty
 * Returns appropriate difficulty based on performance and confidence
 */
export function calculateDynamicDifficulty(context: RecommendationContext): 'easy' | 'medium' | 'hard' {
  const { analytics, profile } = context

  if (!analytics || context.totalSessions === 0) {
    // NEW USER: Base on experience + confidence
    if (profile.experienceLevel === 'student' || profile.confidenceLevel <= 2) return 'easy'
    if (profile.experienceLevel === 'senior' && profile.confidenceLevel >= 4) return 'hard'
    return 'medium'
  }

  // EXISTING USER: Base on performance
  const { averageScore, skillBreakdown } = analytics
  const avgSkillScore = Object.values(skillBreakdown).reduce((a, b) => a + b, 0) / 4

  if (averageScore < 40 || avgSkillScore < 4) return 'easy'
  if (averageScore > 70 && avgSkillScore > 7) return 'hard'
  return 'medium'
}

/**
 * Step 3: Score Resources Based on Mathematical Criteria
 */
export function scoreResources(context: RecommendationContext) {
  const deficits = calculateSkillDeficits(context)
  const targetDifficulty = calculateDynamicDifficulty(context)
  const { profile, analytics } = context

  // Find primary focus (skill with highest deficit)
  const primaryDeficit = Object.entries(deficits)
    .sort(([,a], [,b]) => b - a)[0] // Highest deficit = primary focus

  console.log('🎯 Recommendation Engine:', {
    primaryDeficit,
    deficits,
    targetDifficulty,
    userDomains: profile.domains,
    totalSessions: context.totalSessions
  })

  return LEARNING_RESOURCES.map(category => {
    let score = 0

    // 1. PRIMARY DEFICIT MATCHING (40% weight)
    const categoryTargetsPrimary = categoryTargetsSkill(category, primaryDeficit[0])
    if (categoryTargetsPrimary) score += 40

    // 2. DOMAIN ALIGNMENT (25% weight)  
    const domainMatch = profile.domains.some(domain => 
      category.id.includes(domain.replace('-', '')) ||
      category.name.toLowerCase().includes(domain) ||
      (category as any).tags?.includes(domain)
    )
    if (domainMatch) score += 25

    // 3. DIFFICULTY APPROPRIATENESS (20% weight)
    // Map interview difficulties to resource difficulties
    const difficultyMapping = {
      "easy": "beginner",
      "medium": "intermediate", 
      "hard": "advanced"
    } as const
    
    const mappedDifficulty = difficultyMapping[targetDifficulty as keyof typeof difficultyMapping] || "intermediate"
    const difficultyScore = category.resources.filter(r => r.difficulty === mappedDifficulty).length
    score += (difficultyScore / category.resources.length) * 20

    // 4. WEAK AREAS FROM ONBOARDING (15% weight)
    const weakAreaMatch = (profile.weakAreas || []).some(weak => 
      category.id.includes(weak.replace('-', '')) ||
      category.name.toLowerCase().includes(weak.replace('-', ' '))
    )
    if (weakAreaMatch) score += 15

    // 5. PERFORMANCE TREND BONUS (existing users only)
    if (analytics && analytics.scoreTrend === 'declining') {
      // Boost foundational categories for declining users
      if (category.id.includes('fundamentals') || category.id.includes('basic')) {
        score += 10
      }
    }

    return {
      ...category,
      score: Math.round(score * 10) / 10, // Round to 1 decimal
      primaryMatch: categoryTargetsPrimary,
      difficultyAlignment: targetDifficulty,
      matchReason: generateMatchReason(category, primaryDeficit[0], domainMatch, weakAreaMatch)
    }
  })
  .sort((a, b) => (b.score || 0) - (a.score || 0))
}

/**
 * Helper: Check if category targets specific skill
 */
function categoryTargetsSkill(category: any, skill: string): boolean {
  const skillMap = {
    technical: ['algorithm', 'coding', 'system-design', 'data-structures'],
    communication: ['behavioral', 'soft-skills', 'presentation'],
    confidence: ['fundamentals', 'practice', 'mock-interview'],
    clarity: ['communication', 'behavioral', 'presentation']
  }
  
  const keywords = skillMap[skill as keyof typeof skillMap] || []
  return keywords.some(keyword => 
    category.id.includes(keyword) || 
    category.name.toLowerCase().includes(keyword)
  )
}

/**
 * Helper: Generate human-readable match reason
 */
function generateMatchReason(category: any, primarySkill: string, domainMatch: boolean, weakAreaMatch: boolean): string {
  const reasons = []
  
  if (categoryTargetsSkill(category, primarySkill)) {
    reasons.push(`Targets your weakest skill: ${primarySkill}`)
  }
  
  if (domainMatch) {
    reasons.push('Matches your domain interests')
  }
  
  if (weakAreaMatch) {
    reasons.push('Addresses identified weak areas')
  }
  
  return reasons.join(' • ') || 'General skill building'
}

/**
 * Main Export: Get Personalized Recommendations
 */
export function getPersonalizedRecommendations(context: RecommendationContext) {
  const scoredResources = scoreResources(context)
  const deficits = calculateSkillDeficits(context)
  const targetDifficulty = calculateDynamicDifficulty(context)
  
  return {
    recommendations: scoredResources.slice(0, 4), // Top 4 matches
    deficits,
    targetDifficulty,
    primaryFocus: Object.entries(deficits)
      .sort(([,a], [,b]) => b - a)[0], // [skill, deficit]
    isNewUser: context.totalSessions === 0
  }
}