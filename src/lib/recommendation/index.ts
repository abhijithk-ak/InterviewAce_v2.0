// Recommendation System Index
// Main exports for the intelligent learning recommendation engine

export {
  generateRecommendations,
  type RecommendationOutput,
  type UserProfile,
  type AnalyticsData,
  type DifficultyLevel,
  type UserDomain
} from "./engine"

export {
  calculateAdaptiveDifficulty,
  getNextDifficultyProgression,
  type DifficultyInput,
  type DifficultyRecommendation
} from "./difficulty"

export {
  mapDomainsToQuestions,
  recommendSessionConfig,
  getDomainResourceMapping,
  type DomainMapping
} from "./domain-mapper"

export {
  generateLearningPath,
  type LearningPath,
  type LearningStep,
  type LearningPriority
} from "./learning-path"