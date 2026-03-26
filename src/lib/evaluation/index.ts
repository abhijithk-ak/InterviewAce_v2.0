/**
 * Algorithmic Evaluation Engine (Enhanced v3.0)
 * Export all evaluation components including misconception detection
 */

export { 
  evaluateAnswer, 
  evaluateAnswerSync, 
  evaluateMultipleAnswers, 
  evaluateMultipleAnswersSync,
  evaluateAnswerHybrid,
  DEFAULT_WEIGHTS,
  SEMANTIC_ENHANCED_WEIGHTS
} from "./engine"
export type { 
  EvaluationResult, 
  ScoreBreakdown, 
  EvaluationWeights, 
  EvaluationOptions,
  HybridEvaluationResult
} from "./engine"

export { 
  relevanceScore,
  clarityScore, 
  confidenceScore,
  structureScore 
} from "./scorers"

export { preprocess, extractSentences, wordCount, avgSentenceLength } from "./preprocessor"
export { getRelevantKeywords, DOMAIN_KEYWORDS } from "./keywords"
export { normalizeSubscore, normalizeOverall, clamp, migrateSubscore } from "./normalize"

// NEW: Misconception detection (v3.0)
export { 
  detectMisconceptions, 
  inferDomain, 
  calculateMisconceptionPenalty,
  MISCONCEPTION_PATTERNS
} from "./misconceptions"
export type { MisconceptionPenalty } from "./misconceptions"

// NEW: Concept validation (v3.0 - Critical correctness layer)
export {
  validateConcepts,
  detectNegationMisconceptions,
  hasCriticalError,
  calculateConceptPenalty
} from "./concepts"
export type { ConceptValidation } from "./concepts"

export { evaluateWithAI } from "./aiEvaluator"
export type { AIEvaluationResult } from "./aiEvaluator"
