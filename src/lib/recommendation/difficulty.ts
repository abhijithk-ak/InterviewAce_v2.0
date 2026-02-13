// Adaptive Difficulty Calculation Engine
// Deterministic logic for difficulty progression

export type DifficultyLevel = "easy" | "medium" | "hard"

export interface DifficultyInput {
  confidenceLevel: number // 1-5 from onboarding
  averageScore: number // 0-100 from analytics  
  experienceLevel: "student" | "fresher" | "junior" | "senior"
  sessionsCompleted: number
  recentPerformanceTrend: "improving" | "declining" | "stable"
}

export interface DifficultyRecommendation {
  suggestedDifficulty: DifficultyLevel
  confidenceBoost: boolean // Start easier to build confidence
  challengeMode: boolean // Push harder for growth
  explanation: string
}

/**
 * Calculate adaptive difficulty based on user profile and performance
 * Fully deterministic - same inputs always produce same output
 */
export function calculateAdaptiveDifficulty(input: DifficultyInput): DifficultyRecommendation {
  const { confidenceLevel, averageScore, experienceLevel, sessionsCompleted, recentPerformanceTrend } = input

  // Base difficulty score (0-100)
  let difficultyScore = 0

  // Experience level contribution (40% weight)
  const experienceWeight = {
    student: 10,
    fresher: 25, 
    junior: 50,
    senior: 75
  }
  difficultyScore += experienceWeight[experienceLevel] * 0.4

  // Performance contribution (30% weight)  
  difficultyScore += averageScore * 0.3

  // Confidence contribution (20% weight)
  difficultyScore += (confidenceLevel - 1) * 25 * 0.2 // Scale 1-5 to 0-100

  // Session experience contribution (10% weight)
  const sessionBonus = Math.min(sessionsCompleted * 2, 20) // Cap at 20 points
  difficultyScore += sessionBonus * 0.1

  // Trend adjustments
  if (recentPerformanceTrend === "improving") {
    difficultyScore += 10 // Push slightly harder
  } else if (recentPerformanceTrend === "declining") {
    difficultyScore -= 15 // Scale back to build confidence
  }

  // Apply experience level caps (strong profile bias)
  const needsConfidenceBoost = confidenceLevel <= 2 || averageScore < 30
  const readyForChallenge = confidenceLevel >= 4 && averageScore > 70 && recentPerformanceTrend === "improving"
  
  // Student experience level cap - never exceed medium difficulty
  const isStudentCapped = experienceLevel === "student" && difficultyScore > 50

  // Final difficulty mapping with profile bias
  let suggestedDifficulty: DifficultyLevel
  let explanation: string

  if (needsConfidenceBoost) {
    suggestedDifficulty = "easy"
    explanation = `Starting with easier questions to build confidence (confidence: ${confidenceLevel}/5, score: ${Math.round(averageScore)}%)`
  } else if (isStudentCapped) {
    suggestedDifficulty = "medium"
    explanation = `Medium level recommended for student experience (capped for appropriate learning curve)`
  } else if (readyForChallenge && experienceLevel !== "student") {
    suggestedDifficulty = "hard" 
    explanation = `Challenging you with harder questions for growth (confidence: ${confidenceLevel}/5, score: ${Math.round(averageScore)}%, trending up)`
  } else {
    // Standard mapping based on composite score
    if (difficultyScore < 35) {
      suggestedDifficulty = "easy"
      explanation = `Recommended easy level for skill building (composite score: ${Math.round(difficultyScore)})`
    } else if (difficultyScore < 65) {
      suggestedDifficulty = "medium"
      explanation = `Recommended medium level for balanced practice (composite score: ${Math.round(difficultyScore)})`
    } else {
      // Hard difficulty only for non-students
      suggestedDifficulty = experienceLevel === "student" ? "medium" : "hard"
      explanation = experienceLevel === "student" 
        ? `Medium level recommended for student progression (composite score: ${Math.round(difficultyScore)})`
        : `Recommended hard level for advanced challenge (composite score: ${Math.round(difficultyScore)})`
    }
  }

  return {
    suggestedDifficulty,
    confidenceBoost: needsConfidenceBoost,
    challengeMode: readyForChallenge,
    explanation
  }
}

/**
 * Get next difficulty progression
 * Helps users gradually increase challenge level
 */
export function getNextDifficultyProgression(
  currentDifficulty: DifficultyLevel,
  recentSuccessRate: number // 0-1
): DifficultyLevel {
  const progressionThreshold = 0.75 // 75% success rate to advance
  
  if (recentSuccessRate >= progressionThreshold) {
    switch (currentDifficulty) {
      case "easy": return "medium"
      case "medium": return "hard" 
      case "hard": return "hard" // Already at max
    }
  }
  
  // If success rate is low, consider stepping down
  if (recentSuccessRate < 0.4) {
    switch (currentDifficulty) {
      case "hard": return "medium"
      case "medium": return "easy"
      case "easy": return "easy" // Already at min
    }
  }
  
  // Maintain current level
  return currentDifficulty
}