/**
 * Algorithmic Evaluation Engine
 * Pure deterministic scoring - no AI required
 * Produces explainable, auditable results
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

export type EvaluationWeights = {
  relevance: number    // 30%
  clarity: number      // 20%
  technical: number    // 25%
  confidence: number   // 15%
  structure: number    // 10%
}

export const DEFAULT_WEIGHTS: EvaluationWeights = {
  relevance: 0.30,
  clarity: 0.20,
  technical: 0.25,
  confidence: 0.15,
  structure: 0.10,
}

export type ScoreBreakdown = {
  relevance: number      // 0-10 scale
  clarity: number        // 0-10 scale
  technical: number      // 0-10 scale
  confidence: number     // 0-10 scale
  structure: number      // 0-10 scale
}

export type EvaluationResult = {
  overallScore: number   // 0-100 scale
  breakdown: ScoreBreakdown
  strengths: string[]
  improvements: string[]
  feedback: string
  metadata: {
    wordCount: number
    evaluationMethod: "algorithmic"
    version: string
  }
}

/**
 * Main evaluation function
 * Analyzes answer using deterministic NLP-based scoring
 */
export function evaluateAnswer(
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
function deriveStrengths(scores: ScoreBreakdown): string[] {
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

  // If no strong areas, find the best one
  if (strengths.length === 0) {
    const maxScore = Math.max(...Object.values(scores))
    if (scores.relevance === maxScore) {
      strengths.push("Answer shows understanding of the question topic")
    } else if (scores.clarity === maxScore) {
      strengths.push("Response has good readability")
    } else if (scores.technical === maxScore) {
      strengths.push("Uses some relevant technical concepts")
    } else {
      strengths.push("Shows effort in structuring the response")
    }
  }

  return strengths
}

/**
 * Identify areas for improvement based on low-scoring dimensions
 */
function deriveImprovements(scores: ScoreBreakdown): string[] {
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

  // Always provide at least 2 improvements
  if (improvements.length === 0) {
    const minScore = Math.min(...Object.values(scores))
    if (scores.relevance === minScore) {
      improvements.push("Ensure all points directly relate to the question")
    }
    if (scores.technical === minScore && improvements.length < 2) {
      improvements.push("Incorporate more specific technical details")
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
function generateFeedback(scores: ScoreBreakdown, context: { type: string }): string {
  const overall = (
    scores.relevance * 0.3 +
    scores.clarity * 0.2 +
    scores.technical * 0.25 +
    scores.confidence * 0.15 +
    scores.structure * 0.1
  )

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

  return feedback.trim()
}

/**
 * Batch evaluation for multiple answers
 */
export function evaluateMultipleAnswers(
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
    evaluateAnswer(question, answer, context)
  )
}
