/**
 * Algorithmic Evaluation Engine
 * Export all evaluation components
 */

export { evaluateAnswer, evaluateMultipleAnswers } from "./engine"
export type { EvaluationResult, ScoreBreakdown, EvaluationWeights } from "./engine"

export { 
  relevanceScore,
  clarityScore, 
  technicalScore,
  confidenceScore,
  structureScore 
} from "./scorers"

export { preprocess, extractSentences, wordCount, avgSentenceLength } from "./preprocessor"
export { getRelevantKeywords, DOMAIN_KEYWORDS } from "./keywords"
export { normalizeSubscore, normalizeOverall, clamp, migrateSubscore } from "./normalize"
