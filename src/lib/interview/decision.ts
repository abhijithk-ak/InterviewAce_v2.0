/**
 * Interview Decision Engine
 * Controls interview flow and state transitions
 */

export interface DecisionContext {
  questionIndex: number
  totalQuestions: number
  currentScore: number
  sessionScores: number[]
  averageScore: number
  lastResponse: {
    source: "ai" | "fallback"
    success: boolean
  }
  config: {
    role: string
    type: string
    difficulty: string
  }
}

export interface DecisionResult {
  shouldContinue: boolean
  shouldEnd: boolean
  nextAction: "next_question" | "follow_up" | "end_interview"
  reason: string
  confidence: number
}

/**
 * Main decision function for interview flow
 */
export function makeInterviewDecision(context: DecisionContext): DecisionResult {
  
  // 1. Check maximum questions reached
  if (context.questionIndex >= context.totalQuestions - 1) {
    return {
      shouldContinue: false,
      shouldEnd: true,
      nextAction: "end_interview",
      reason: "Maximum questions reached",
      confidence: 1.0
    }
  }
  
  // 2. Check for early termination due to very poor performance
  if (context.averageScore < 30 && context.questionIndex >= 2) {
    return {
      shouldContinue: false,
      shouldEnd: true,
      nextAction: "end_interview", 
      reason: "Performance significantly below threshold",
      confidence: 0.8
    }
  }
  
  // 3. Check for early completion due to excellent performance
  if (context.averageScore >= 95 && context.questionIndex >= 3) {
    return {
      shouldContinue: false,
      shouldEnd: true,
      nextAction: "end_interview",
      reason: "Consistently excellent performance demonstrated",
      confidence: 0.9
    }
  }
  
  // 4. Determine if follow-up needed based on current answer
  if (shouldAskFollowUp(context)) {
    return {
      shouldContinue: true,
      shouldEnd: false,
      nextAction: "follow_up",
      reason: `Current answer needs clarification (score: ${context.currentScore})`,
      confidence: 0.7
    }
  }
  
  // 5. Continue with next question
  return {
    shouldContinue: true,
    shouldEnd: false,
    nextAction: "next_question",
    reason: "Continue with standard interview flow",
    confidence: 0.9
  }
}

/**
 * Determine if a follow-up question is needed
 */
function shouldAskFollowUp(context: DecisionContext): boolean {
  
  // Don't follow up if we're near the end
  if (context.questionIndex >= context.totalQuestions - 2) {
    return false
  }
  
  // Follow up thresholds based on difficulty
  const followUpThresholds = {
    "easy": 50,
    "medium": 60,
    "hard": 70
  }
  
  const threshold = followUpThresholds[context.config.difficulty as keyof typeof followUpThresholds] || 60
  
  // Follow up if current score is below threshold
  return context.currentScore < threshold
}

/**
 * Calculate session progress metrics
 */
export function calculateProgress(scores: number[]): {
  average: number
  trend: "improving" | "declining" | "stable"
  consistency: number
} {
  
  if (scores.length === 0) {
    return { average: 0, trend: "stable", consistency: 0 }
  }
  
  const average = scores.reduce((a, b) => a + b, 0) / scores.length
  
  // Calculate trend (last half vs first half)
  let trend: "improving" | "declining" | "stable" = "stable"
  
  if (scores.length >= 4) {
    const midpoint = Math.floor(scores.length / 2)
    const firstHalf = scores.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint
    const secondHalf = scores.slice(midpoint).reduce((a, b) => a + b, 0) / (scores.length - midpoint)
    
    const difference = secondHalf - firstHalf
    
    if (difference > 10) trend = "improving"
    else if (difference < -10) trend = "declining"
  }
  
  // Calculate consistency (inverse of standard deviation)
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - average, 2), 0) / scores.length
  const stdDev = Math.sqrt(variance)
  const consistency = Math.max(0, 100 - stdDev) / 100 // Normalize to 0-1
  
  return { average, trend, consistency }
}

/**
 * Validate decision context
 */
export function validateDecisionContext(context: any): context is DecisionContext {
  return (
    typeof context === "object" &&
    typeof context.questionIndex === "number" &&
    typeof context.totalQuestions === "number" &&
    typeof context.currentScore === "number" &&
    Array.isArray(context.sessionScores) &&
    typeof context.averageScore === "number" &&
    typeof context.config === "object"
  )
}