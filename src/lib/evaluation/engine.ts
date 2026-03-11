/**
 * Algorithmic Evaluation Engine
 * Pure deterministic scoring - no AI required
 * Produces explainable, auditable results
 * 
 * Now supports optional ML-based semantic evaluation
 */

import {
  relevanceScore,
  clarityScore,
  technicalScore,
  confidenceScore,
  structureScore,
} from "./scorers"
import { getRelevantKeywords } from "./keywords"
import { wordCount } from "./preprocessor"
import { normalizeSubscore, normalizeOverall } from "./normalize"

// Dynamic import for ML module to avoid bundling during build
// import { semanticScore } from "../ml/semanticEvaluator" // Moved to dynamic import below

export type EvaluationWeights = {
  relevance: number    // 30%
  clarity: number      // 20%
  technical: number    // 25%
  confidence: number   // 15%
  structure: number    // 10%
  semantic?: number    // Optional: 0-20% (when enabled, other weights are adjusted)
}

export const DEFAULT_WEIGHTS: EvaluationWeights = {
  relevance: 0.30,
  clarity: 0.20,
  technical: 0.25,
  confidence: 0.15,
  structure: 0.10,
  // semantic: 0.0  // Disabled by default
}

export const SEMANTIC_ENHANCED_WEIGHTS: EvaluationWeights = {
  relevance: 0.25,    // Reduced from 30%
  clarity: 0.15,      // Reduced from 20%
  technical: 0.25,    // Kept same
  confidence: 0.10,   // Reduced from 15%
  structure: 0.10,    // Kept same
  semantic: 0.15,     // New: 15%
}

export type ScoreBreakdown = {
  relevance: number      // 0-10 scale
  clarity: number        // 0-10 scale
  technical: number      // 0-10 scale
  confidence: number     // 0-10 scale
  structure: number      // 0-10 scale
  semantic?: number      // 0-10 scale (optional ML-based semantic similarity)
}

export type EvaluationResult = {
  overallScore: number   // 0-100 scale
  breakdown: ScoreBreakdown
  strengths: string[]
  improvements: string[]
  feedback: string
  metadata: {
    wordCount: number
    evaluationMethod: "algorithmic" | "hybrid" // "hybrid" when semantic is enabled
    version: string
    semanticEnabled?: boolean
  }
}

export type EvaluationOptions = {
  weights?: EvaluationWeights
  enableSemantic?: boolean  // Enable ML-based semantic evaluation
  skipSemantic?: boolean    // Skip semantic even if enabled (for testing)
}

/**
 * Main evaluation function
 * Analyzes answer using deterministic NLP-based scoring
 * Optionally includes ML-based semantic similarity
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  context: {
    role: string
    type: string
    difficulty?: string
  },
  options: EvaluationOptions = {}
): Promise<EvaluationResult> {
  const {
    weights = DEFAULT_WEIGHTS,
    enableSemantic = false,
    skipSemantic = false,
  } = options

  // Get domain-specific keywords
  const domainKeywords = getRelevantKeywords(context.role, context.type)

  // Calculate raw scores (0-100 scale)
  const rawScores: any = {
    relevance: relevanceScore(question, answer),
    clarity: clarityScore(answer),
    technical: technicalScore(answer, domainKeywords),
    confidence: confidenceScore(answer),
    structure: structureScore(answer),
  }

  // Calculate semantic score if enabled
  let semanticScoreRaw: number | undefined
  if (enableSemantic && !skipSemantic && weights.semantic && weights.semantic > 0) {
    try {
      // Dynamic import to avoid bundling during build
      const { semanticScore } = await import('../ml/semanticEvaluator')
      
      // Compute ML-based semantic similarity (0-10 scale)
      semanticScoreRaw = await semanticScore(question, answer)
      rawScores.semantic = semanticScoreRaw * 10 // Convert to 0-100 scale for consistency
    } catch (error) {
      console.warn('Semantic evaluation failed, falling back to deterministic only:', error)
      // Continue without semantic score
    }
  }

  // Normalize subscores to 0-10 scale
  const normalizedScores: ScoreBreakdown = {
    relevance: normalizeSubscore(rawScores.relevance),
    clarity: normalizeSubscore(rawScores.clarity),
    technical: normalizeSubscore(rawScores.technical),
    confidence: normalizeSubscore(rawScores.confidence),
    structure: normalizeSubscore(rawScores.structure),
  }

  // Add normalized semantic score if available
  if (rawScores.semantic !== undefined) {
    normalizedScores.semantic = normalizeSubscore(rawScores.semantic)
  }

  // Calculate overall score (0-100 scale) from normalized subscores
  const overall = normalizeOverall(normalizedScores, weights)

  // Derive strengths and improvements (use raw scores for thresholds)
  const strengths = deriveStrengths(rawScores)
  const improvements = deriveImprovements(rawScores)
  const feedback = generateFeedback(rawScores, context)

  return {
    overallScore: overall,
    breakdown: normalizedScores,
    strengths,
    improvements,
    feedback,
    metadata: {
      wordCount: wordCount(answer),
      evaluationMethod: rawScores.semantic !== undefined ? "hybrid" : "algorithmic",
      version: "2.0.0", // Updated to 2.0.0 for semantic support
      semanticEnabled: rawScores.semantic !== undefined,
    },
  }
}

/**
 * Synchronous version of evaluateAnswer (without semantic scoring)
 * For backward compatibility and cases where async is not suitable
 */
export function evaluateAnswerSync(
  question: string,
  answer: string,
  context: {
    role: string
    type: string
    difficulty?: string
  },
  weights: EvaluationWeights = DEFAULT_WEIGHTS
): EvaluationResult {
  // Get domain-specific keywords
  const domainKeywords = getRelevantKeywords(context.role, context.type)

  // Calculate raw scores (0-100 scale)
  const rawScores = {
    relevance: relevanceScore(question, answer),
    clarity: clarityScore(answer),
    technical: technicalScore(answer, domainKeywords),
    confidence: confidenceScore(answer),
    structure: structureScore(answer),
  }

  // Normalize subscores to 0-10 scale
  const normalizedScores: ScoreBreakdown = {
    relevance: normalizeSubscore(rawScores.relevance),
    clarity: normalizeSubscore(rawScores.clarity),
    technical: normalizeSubscore(rawScores.technical),
    confidence: normalizeSubscore(rawScores.confidence),
    structure: normalizeSubscore(rawScores.structure),
  }

  // Calculate overall score (0-100 scale) from normalized subscores
  const overall = normalizeOverall(normalizedScores)

  // Derive strengths and improvements (use raw scores for thresholds)
  const strengths = deriveStrengths(rawScores)
  const improvements = deriveImprovements(rawScores)
  const feedback = generateFeedback(rawScores, context)

  return {
    overallScore: overall,
    breakdown: normalizedScores,
    strengths,
    improvements,
    feedback,
    metadata: {
      wordCount: wordCount(answer),
      evaluationMethod: "algorithmic",
      version: "1.0.0",
    },
  }
}

/**
 * Identify strengths based on high-scoring dimensions
 */
function deriveStrengths(scores: any): string[] {
  const strengths: string[] = []

  if (scores.relevance >= 75) {
    strengths.push("Directly addressed the question with relevant information")
  }
  if (scores.clarity >= 75) {
    strengths.push("Clear and well-structured explanation")
  }
  if (scores.technical >= 75) {
    strengths.push("Strong technical knowledge and terminology usage")
  }
  if (scores.confidence >= 75) {
    strengths.push("Confident delivery with concrete examples")
  }
  if (scores.structure >= 75) {
    strengths.push("Logical flow and organized presentation")
  }
  if (scores.semantic !== undefined && scores.semantic >= 75) {
    strengths.push("Strong semantic alignment between question and answer")
  }

  // If no strong areas, find the best one
  if (strengths.length === 0) {
    const maxScore = Math.max(...Object.values(scores).filter((v): v is number => typeof v === 'number'))
    if (scores.relevance === maxScore) {
      strengths.push("Answer shows understanding of the question topic")
    } else if (scores.clarity === maxScore) {
      strengths.push("Response has good readability")
    } else if (scores.technical === maxScore) {
      strengths.push("Uses some relevant technical concepts")
    } else if (scores.semantic === maxScore) {
      strengths.push("Answer relates well to the question context")
    } else {
      strengths.push("Shows effort in structuring the response")
    }
  }

  return strengths
}

/**
 * Identify areas for improvement based on low-scoring dimensions
 */
function deriveImprovements(scores: any): string[] {
  const improvements: string[] = []

  if (scores.relevance < 60) {
    improvements.push("Address the question more directly with specific examples")
  }
  if (scores.clarity < 60) {
    improvements.push("Break down complex ideas into clearer sentences")
  }
  if (scores.technical < 60) {
    improvements.push("Include more domain-specific terminology and concepts")
  }
  if (scores.confidence < 60) {
    improvements.push("Use more assertive language with concrete action verbs")
  }
  if (scores.structure < 60) {
    improvements.push("Organize your response with a clear beginning, middle, and end")
  }
  if (scores.semantic !== undefined && scores.semantic < 60) {
    improvements.push("Ensure your answer more directly relates to the core question")
  }

  // Always provide at least 2 improvements
  if (improvements.length === 0) {
    const minScore = Math.min(...Object.values(scores).filter((v): v is number => typeof v === 'number'))
    if (scores.relevance === minScore) {
      improvements.push("Ensure all points directly relate to the question")
    }
    if (scores.technical === minScore && improvements.length < 2) {
      improvements.push("Incorporate more specific technical details")
    }
    if (scores.semantic === minScore && improvements.length < 2) {
      improvements.push("Align your answer more closely with the question intent")
    }
  }

  // Ensure we have at least 2 improvements
  if (improvements.length === 1) {
    improvements.push("Practice explaining concepts with real-world examples")
  }

  return improvements.slice(0, 3) // Max 3 improvements
}

/**
 * Generate human-readable feedback
 */
function generateFeedback(scores: any, context: { type: string }): string {
  const scoreValues = Object.values(scores).filter((v): v is number => typeof v === 'number')
  const overall = scoreValues.reduce((sum, val) => sum + val, 0) / scoreValues.length

  let feedback = ""

  if (overall >= 80) {
    feedback = "Excellent response! You demonstrated strong understanding and communication skills. "
  } else if (overall >= 65) {
    feedback = "Good answer with solid fundamentals. "
  } else if (overall >= 50) {
    feedback = "Decent response, but there's room for improvement. "
  } else {
    feedback = "Your answer needs more development. "
  }

  // Add specific dimension feedback
  if (scores.technical < 60 && context.type === "technical") {
    feedback += "Focus on including more technical details and specific technologies. "
  }
  if (scores.structure < 60 && context.type === "behavioral") {
    feedback += "Try using the STAR format (Situation, Task, Action, Result) for behavioral questions. "
  }
  if (scores.relevance < 60) {
    feedback += "Make sure to directly address what the question is asking. "
  }
  if (scores.clarity < 60) {
    feedback += "Work on making your explanations clearer and more concise. "
  }
  if (scores.semantic !== undefined && scores.semantic < 60) {
    feedback += "Consider how your answer connects to the core intent of the question. "
  }

  return feedback.trim()
}

/**
 * Batch evaluation for multiple answers (async version with semantic support)
 */
export async function evaluateMultipleAnswers(
  questionAnswerPairs: Array<{
    question: string
    answer: string
  }>,
  context: {
    role: string
    type: string
    difficulty?: string
  },
  options: EvaluationOptions = {}
): Promise<EvaluationResult[]> {
  return Promise.all(
    questionAnswerPairs.map(({ question, answer }) =>
      evaluateAnswer(question, answer, context, options)
    )
  )
}

/**
 * Synchronous batch evaluation (without semantic scoring)
 */
export function evaluateMultipleAnswersSync(
  questionAnswerPairs: Array<{
    question: string
    answer: string
  }>,
  context: {
    role: string
    type: string
    difficulty?: string
  }
): EvaluationResult[] {
  return questionAnswerPairs.map(({ question, answer }) =>
    evaluateAnswerSync(question, answer, context)
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HYBRID EVALUATION — Combines deterministic scoring with ML semantic scoring
// Formula: finalScore = deterministicScore * 0.6 + (semanticRaw * 10) * 0.4
// Both operands are on 0-100 scale before weighting.
// ─────────────────────────────────────────────────────────────────────────────

export type HybridEvaluationResult = {
  /** Deterministic overall score (0-100) from rule-based engine */
  deterministicScore: number
  /** Raw semantic similarity score (0-10) from Sentence-BERT */
  semanticScore: number
  /** Combined final score: deterministicScore * 0.6 + semanticScore * 10 * 0.4 (0-100) */
  finalScore: number
  /** Per-dimension subscores (0-10) from the deterministic pass */
  subscores: ScoreBreakdown
  /** Qualitative analysis from the deterministic pass */
  details: {
    strengths: string[]
    improvements: string[]
    feedback: string
  }
  metadata: {
    evaluationMethod: "hybrid"
    wordCount: number
    version: string
    deterministicWeight: 0.6
    semanticWeight: 0.4
  }
}

/**
 * Hybrid evaluation combining deterministic NLP scoring with ML semantic similarity.
 *
 * Steps:
 *   1. Run deterministic evaluateAnswerSync() for structured, explainable scores.
 *   2. Run semanticScore() (Sentence-BERT via @xenova/transformers) for embedding similarity.
 *   3. Blend: finalScore = deterministicScore * 0.6 + (semanticRaw * 10) * 0.4
 *
 * The ML module is dynamically imported to avoid bundling issues at build time.
 * If semantic scoring fails, finalScore falls back to deterministicScore.
 */
export async function evaluateAnswerHybrid(
  question: string,
  answer: string,
  context: {
    role: string
    type: string
    difficulty?: string
  }
): Promise<HybridEvaluationResult> {
  // Step 1: deterministic pass (synchronous, always succeeds)
  const deterministic = evaluateAnswerSync(question, answer, context)

  // Step 2: ML semantic pass (async, may fail gracefully)
  let semanticRaw = 0
  let semanticSucceeded = false
  try {
    const { semanticScore: computeSemanticScore } = await import('../ml/semanticEvaluator')
    semanticRaw = await computeSemanticScore(question, answer) // 0-10 scale
    semanticSucceeded = true
  } catch (error) {
    console.warn('[evaluateAnswerHybrid] Semantic scoring failed, using deterministicScore only:', error)
  }

  // Step 3: blend scores (both on 0-100 scale before weighting)
  const semanticAs100 = semanticRaw * 10
  const finalScore = semanticSucceeded
    ? Math.round(deterministic.overallScore * 0.6 + semanticAs100 * 0.4)
    : deterministic.overallScore

  return {
    deterministicScore: deterministic.overallScore,
    semanticScore: semanticRaw,
    finalScore,
    subscores: deterministic.breakdown,
    details: {
      strengths: deterministic.strengths,
      improvements: deterministic.improvements,
      feedback: deterministic.feedback,
    },
    metadata: {
      evaluationMethod: "hybrid",
      wordCount: deterministic.metadata.wordCount,
      version: "1.0.0",
      deterministicWeight: 0.6,
      semanticWeight: 0.4,
    },
  }
}
