/**
 * Score Normalization Module
 * Ensures consistent scoring across the entire system
 * 
 * UNIVERSAL SCALE:
 * - Subscores (technical, clarity, confidence, communication): 0-10
 * - Overall Score: 0-100
 */

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Normalize raw score (0-100 scale) to subscore (0-10 scale)
 * Used for individual dimension scores
 */
export function normalizeSubscore(raw: number): number {
  // Raw scores from scorers are 0-100
  // Normalize to 0-10 scale
  return clamp(Math.round(raw / 10), 0, 10)
}

/**
 * Calculate overall score (0-100) from normalized subscores (0-10 each)
 * Uses weighted average based on importance
 * Now supports custom weights and optional semantic score
 */
export function normalizeOverall(
  subscores: {
    relevance: number     // 0-10
    clarity: number       // 0-10
    technical: number     // 0-10
    confidence: number    // 0-10
    structure: number     // 0-10
    semantic?: number     // 0-10 (optional)
  },
  customWeights?: {
    relevance: number
    clarity: number
    technical: number
    confidence: number
    structure: number
    semantic?: number
  }
): number {
  // Use custom weights if provided, otherwise use defaults
  const weights = customWeights || {
    relevance: 0.30,
    clarity: 0.20,
    technical: 0.25,
    confidence: 0.15,
    structure: 0.10,
  }

  let weighted =
    subscores.relevance * weights.relevance +
    subscores.clarity * weights.clarity +
    subscores.technical * weights.technical +
    subscores.confidence * weights.confidence +
    subscores.structure * weights.structure

  // Add semantic weight if available
  if (subscores.semantic !== undefined && weights.semantic !== undefined) {
    weighted += subscores.semantic * weights.semantic
  }

  // Multiply by 10 to get 0-100 scale
  let rawScore = Math.round(weighted * 10)
  
  // Apply smoothing curve to make scoring more forgiving
  // Without smoothing: most users get 30-40 scores
  // With smoothing: 30 → 45, 50 → 61, 70 → 76, 90 → 93
  const smoothed = Math.round(Math.sqrt(rawScore / 100) * 100)
  
  return clamp(smoothed, 0, 100)
}

/**
 * Legacy compatibility: convert old 0-100 subscores to 0-10
 */
export function migrateSubscore(oldScore: number): number {
  if (oldScore <= 10) return oldScore // Already normalized
  return normalizeSubscore(oldScore) // Convert from 0-100 to 0-10
}
