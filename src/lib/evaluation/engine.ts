/**
 * Hybrid Evaluation Engine
 *
 * Pipeline:
 * Candidate Answer -> MiniLM Semantic Similarity -> Llama Concept Evaluation
 * -> Deterministic Score Fusion -> Final Score + Feedback
 */

import { evaluateSemanticSimilarity } from "../ml/semanticEvaluator"
import { evaluateWithAI } from "@/lib/evaluation/aiEvaluator"

export type EvaluationWeights = {
  concept: number
  semantic: number
  clarity: number
}

export const DEFAULT_WEIGHTS: EvaluationWeights = {
  concept: 0.55,
  semantic: 0.3,
  clarity: 0.15,
}

export const SEMANTIC_ENHANCED_WEIGHTS: EvaluationWeights = DEFAULT_WEIGHTS

export type ScoreBreakdown = {
  conceptScore: number
  semanticScore: number
  clarityScore: number
}

export type EvaluationResult = {
  overallScore: number
  breakdown: ScoreBreakdown
  explanation: string
  errors: string[]
  evaluationMethod: "AI + MiniLM Hybrid"
}

export type EvaluationOptions = {
  weights?: EvaluationWeights
  referenceAnswer?: string
  aiModel?: string
  aiTemperature?: number
}

export type HybridEvaluationResult = EvaluationResult

type EvaluationContext = {
  role: string
  type: string
  difficulty?: string
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  _context: EvaluationContext,
  options: EvaluationOptions = {}
): Promise<EvaluationResult> {
  const {
    weights = DEFAULT_WEIGHTS,
    referenceAnswer = "",
    aiModel,
    aiTemperature,
  } = options

  const aiResult = await evaluateWithAI(question, referenceAnswer, answer, {
    model: aiModel,
    temperature: aiTemperature,
  })

  const hasReferenceAnswer = Boolean(referenceAnswer.trim())
  const semanticResult = hasReferenceAnswer
    ? await evaluateSemanticSimilarity(referenceAnswer, answer)
    : { similarity: 0, semanticScore: aiResult.conceptScore }

  const conceptScore = clampToTen(aiResult.conceptScore)
  const semanticScore = clampToTen(semanticResult.semanticScore)
  const clarityScore = clampToTen(aiResult.clarityScore)

  let finalScore = (
    weights.concept * conceptScore +
    weights.semantic * semanticScore +
    weights.clarity * clarityScore
  ) * 10

  if (conceptScore <= 2) {
    finalScore = Math.min(finalScore, 40)
  }

  finalScore = Math.round(finalScore)

  console.log("AI concept score:", conceptScore)
  console.log("MiniLM similarity:", semanticResult.similarity)
  console.log("Final score:", finalScore)

  return {
    overallScore: finalScore,
    breakdown: {
      conceptScore,
      semanticScore,
      clarityScore,
    },
    explanation: aiResult.explanation,
    errors: normalizeErrors(aiResult.errors),
    evaluationMethod: "AI + MiniLM Hybrid",
  }
}

export function evaluateAnswerSync(
  _question: string,
  _answer: string,
  _context: EvaluationContext,
  _weights?: EvaluationWeights
): EvaluationResult {
  return {
    overallScore: 0,
    breakdown: {
      conceptScore: 0,
      semanticScore: 0,
      clarityScore: 0,
    },
    explanation: "Synchronous evaluation is disabled. Use async hybrid evaluation.",
    errors: ["Synchronous evaluator disabled"],
    evaluationMethod: "AI + MiniLM Hybrid",
  }
}

export async function evaluateMultipleAnswers(
  questionAnswerPairs: Array<{
    question: string
    answer: string
    referenceAnswer?: string
  }>,
  context: EvaluationContext,
  options: EvaluationOptions = {}
): Promise<EvaluationResult[]> {
  return Promise.all(
    questionAnswerPairs.map(({ question, answer, referenceAnswer }) =>
      evaluateAnswer(question, answer, context, {
        ...options,
        referenceAnswer: referenceAnswer ?? options.referenceAnswer,
      })
    )
  )
}

export function evaluateMultipleAnswersSync(
  questionAnswerPairs: Array<{
    question: string
    answer: string
  }>,
  context: EvaluationContext
): EvaluationResult[] {
  return questionAnswerPairs.map(({ question, answer }) =>
    evaluateAnswerSync(question, answer, context)
  )
}

export async function evaluateAnswerHybrid(
  question: string,
  answer: string,
  context: EvaluationContext,
  options: EvaluationOptions = {}
): Promise<HybridEvaluationResult> {
  return evaluateAnswer(question, answer, context, options)
}

function normalizeErrors(errors: string[] | undefined): string[] {
  if (!errors || errors.length === 0) {
    return []
  }

  return errors.map((error) => error.trim()).filter(Boolean)
}

function clampToTen(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.min(10, Math.round(value * 10) / 10))
}
