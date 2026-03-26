/**
 * ML Module Exports (Enhanced v3.0)
 * 
 * Centralized exports for machine learning functionality
 * Now includes reference answer correctness scoring
 */

export {
  loadModel,
  cosineSimilarity,
  semanticScore,
  semanticCorrectnessScore,  // NEW: Reference answer similarity
  evaluateSemanticSimilarity,
  preloadModel,
  type SemanticEvaluation
} from './semanticEvaluator'
