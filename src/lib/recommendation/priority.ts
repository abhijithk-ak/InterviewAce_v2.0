// Deterministic Priority Calculation for Dashboard Recommendations

type Domain = 'frontend' | 'backend' | 'system-design' | 'algorithms' | 'behavioral' | 'general'

type OnboardingData = {
  experienceLevel: 'entry' | 'mid' | 'senior'
  domains: Domain[]
  confidenceLevel: number  // 1-3 scale
  weakAreas?: Domain[]
}

type DomainPerformance = {
  [key in Domain]?: number  // 0-10 scale average
}

export type PriorityResult = {
  domain: Domain
  priority: number
  reason: string
  suggestedDifficulty: 'easy' | 'medium' | 'hard'
  nextAction: string
}

/**
 * Calculate deterministic priority score for each domain
 * Formula:
 * PerformanceFactor = 10 - avgDomainScore
 * InterestFactor = onboarding.domains.includes(domain) ? 2 : 0
 * WeakAreaFactor = onboarding.weakAreas.includes(domain) ? 3 : 0
 * ConfidenceFactor = (3 - confidenceLevel) * 0.5
 * 
 * PriorityScore = PerformanceFactor * 0.5 + InterestFactor * 0.2 + WeakAreaFactor * 0.2 + ConfidenceFactor * 0.1
 */
export function calculateDomainPriority(
  domain: Domain,
  onboarding: OnboardingData,
  performance: DomainPerformance
): { priority: number; factors: Record<string, number> } {
  // Performance Factor: Higher priority for lower performance
  const avgScore = performance[domain] ?? 5 // Default to 5 if no data
  const performanceFactor = 10 - avgScore

  // Interest Factor: Higher priority for user-selected domains
  const interestFactor = onboarding.domains.includes(domain) ? 2 : 0

  // Weak Area Factor: Higher priority for self-identified weak areas
  const weakAreaFactor = onboarding.weakAreas?.includes(domain) ? 3 : 0

  // Confidence Factor: Higher priority for lower confidence users
  const confidenceFactor = (3 - onboarding.confidenceLevel) * 0.5

  // Calculate weighted priority score
  const priority = 
    performanceFactor * 0.5 +
    interestFactor * 0.2 +
    weakAreaFactor * 0.2 +
    confidenceFactor * 0.1

  return {
    priority,
    factors: {
      performanceFactor,
      interestFactor,
      weakAreaFactor,
      confidenceFactor
    }
  }
}

/**
 * Get difficulty suggestion based on experience and performance
 */
function getSuggestedDifficulty(
  domain: Domain,
  experienceLevel: OnboardingData['experienceLevel'],
  avgScore: number
): 'easy' | 'medium' | 'hard' {
  // Base difficulty on experience level
  let baseDifficulty: number
  switch (experienceLevel) {
    case 'entry':
      baseDifficulty = 1 // easy
      break
    case 'mid':
      baseDifficulty = 2 // medium  
      break
    case 'senior':
      baseDifficulty = 3 // hard
      break
  }

  // Adjust based on performance (lower score = easier difficulty)
  if (avgScore < 4) {
    baseDifficulty = Math.max(1, baseDifficulty - 1)
  } else if (avgScore > 7) {
    baseDifficulty = Math.min(3, baseDifficulty + 1)
  }

  switch (baseDifficulty) {
    case 1:
      return 'easy'
    case 2:
      return 'medium'
    case 3:
      return 'hard'
    default:
      return 'medium'
  }
}

/**
 * Generate deterministic recommendation reason
 */
function generateReason(
  domain: Domain,
  avgScore: number,
  isWeakArea: boolean,
  isInterested: boolean
): string {
  if (isWeakArea) {
    return `Based on self-identified weakness in ${domain}`
  }
  
  if (avgScore < 5) {
    return `Based on low performance in ${domain} (${avgScore.toFixed(1)}/10)`
  }
  
  if (isInterested) {
    return `Based on your interest in ${domain} development`
  }
  
  return `Based on performance analysis in ${domain}`
}

/**
 * Calculate single highest-priority recommendation
 */
export function calculateTopPriorityRecommendation(
  onboarding: OnboardingData,
  performance: DomainPerformance
): PriorityResult | null {
  const domains: Domain[] = ['frontend', 'backend', 'system-design', 'algorithms', 'behavioral', 'general']
  
  let topRecommendation: PriorityResult | null = null
  let highestPriority = -1

  for (const domain of domains) {
    const { priority } = calculateDomainPriority(domain, onboarding, performance)
    
    if (priority > highestPriority) {
      const avgScore = performance[domain] ?? 5
      const isWeakArea = onboarding.weakAreas?.includes(domain) ?? false
      const isInterested = onboarding.domains.includes(domain)
      
      highestPriority = priority
      topRecommendation = {
        domain,
        priority,
        reason: generateReason(domain, avgScore, isWeakArea, isInterested),
        suggestedDifficulty: getSuggestedDifficulty(domain, onboarding.experienceLevel, avgScore),
        nextAction: 'Start Interview'
      }
    }
  }

  return topRecommendation
}

/**
 * Convert domain to display name
 */
export function getDomainDisplayName(domain: Domain): string {
  switch (domain) {
    case 'frontend':
      return 'Frontend Development'
    case 'backend':
      return 'Backend Development'
    case 'system-design':
      return 'System Design'
    case 'algorithms':
      return 'Algorithms & Data Structures'
    case 'behavioral':
      return 'Behavioral Questions'
    case 'general':
      return 'General Programming'
    default:
      return domain
  }
}