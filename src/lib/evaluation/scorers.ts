/**
 * Individual Scoring Functions
 * Each function produces a score 0-100 based on specific criteria
 */

import { preprocess, avgSentenceLength, extractSentences, wordCount } from "./preprocessor"

/**
 * Relevance Score (30% weight)
 * Measures lexical similarity between question and answer
 * Uses Jaccard similarity coefficient
 */
export function relevanceScore(question: string, answer: string): number {
  const qTokens = new Set(preprocess(question))
  const aTokens = new Set(preprocess(answer))

  if (qTokens.size === 0) return 0

  // Calculate overlap
  const intersection = [...qTokens].filter(word => aTokens.has(word)).length
  const union = new Set([...qTokens, ...aTokens]).size

  // Jaccard similarity: intersection / union
  const similarity = intersection / union

  // Also consider coverage: how many question keywords are in answer
  const coverage = intersection / qTokens.size

  // Weighted average favoring coverage
  const score = (coverage * 0.7 + similarity * 0.3) * 100

  return Math.min(Math.round(score), 100)
}

/**
 * Clarity Score (20% weight)
 * Analyzes sentence structure and readability
 * Based on Flesch readability principles
 */
export function clarityScore(answer: string): number {
  const sentences = extractSentences(answer)
  if (sentences.length === 0) return 0

  const avgLength = avgSentenceLength(answer)
  const totalWords = wordCount(answer)

  let score = 50 // Base score

  // Optimal sentence length: 10-20 words
  if (avgLength >= 10 && avgLength <= 20) {
    score += 30
  } else if (avgLength >= 6 && avgLength <= 25) {
    score += 20
  } else if (avgLength < 6) {
    score += 10 // Too short, lacks detail
  } else {
    score += 5 // Too long, hard to follow
  }

  // Reward adequate answer length (not too short)
  if (totalWords >= 30 && totalWords <= 150) {
    score += 20
  } else if (totalWords >= 20 && totalWords <= 200) {
    score += 10
  }

  // Penalty for extremely short answers
  if (totalWords < 10) {
    score -= 30
  }

  return Math.max(0, Math.min(score, 100))
}

/**
 * Technical Depth Score (25% weight)
 * Measures domain-specific keyword usage
 * Proves knowledge of relevant concepts
 */
export function technicalScore(answer: string, domainKeywords: string[]): number {
  if (domainKeywords.length === 0) return 50 // Neutral if no keywords provided

  const tokens = preprocess(answer).join(" ")
  const answerLower = answer.toLowerCase()

  // Count keyword matches (handle multi-word keywords)
  let matches = 0
  const matchedKeywords = new Set<string>()

  for (const keyword of domainKeywords) {
    const keywordLower = keyword.toLowerCase()
    if (answerLower.includes(keywordLower) || tokens.includes(keywordLower)) {
      matches++
      matchedKeywords.add(keyword)
    }
  }

  // Calculate score based on coverage
  // Use logarithmic scale to avoid requiring too many keywords
  const coverage = matches / Math.sqrt(domainKeywords.length)
  let score = Math.min(coverage * 50, 100)

  // Bonus for diverse keyword usage (not just repeating one term)
  if (matchedKeywords.size >= 3) score += 10
  if (matchedKeywords.size >= 5) score += 10

  return Math.round(Math.min(score, 100))
}

/**
 * Confidence Score (15% weight)
 * Analyzes linguistic signals of certainty vs uncertainty
 */
export function confidenceScore(answer: string): number {
  const text = answer.toLowerCase()
  let score = 50 // Start neutral

  // Strong confidence indicators (action verbs, definite statements)
  const STRONG_SIGNALS = [
    "I implemented", "I designed", "I built", "I created", "I developed",
    "I solved", "I optimized", "I improved", "I achieved", "I delivered",
    "successfully", "effectively", "efficiently", "accomplished",
    "demonstrated", "proven", "resulted in", "led to", "ensured"
  ]

  // Weak confidence indicators (hedging, uncertainty)
  const WEAK_SIGNALS = [
    "maybe", "perhaps", "possibly", "might", "not sure", "I think",
    "I guess", "probably", "kind of", "sort of", "somewhat",
    "hopefully", "try to", "attempted", "didn't really", "not very"
  ]

  // Count strong signals
  let strongCount = 0
  for (const signal of STRONG_SIGNALS) {
    if (text.includes(signal.toLowerCase())) {
      strongCount++
    }
  }

  // Count weak signals
  let weakCount = 0
  for (const signal of WEAK_SIGNALS) {
    if (text.includes(signal.toLowerCase())) {
      weakCount++
    }
  }

  // Adjust score
  score += strongCount * 8
  score -= weakCount * 12

  // Bonus for first-person action statements
  const hasFirstPerson = /\bI\s+(implemented|designed|built|created|developed|solved)/i.test(answer)
  if (hasFirstPerson) score += 10

  return Math.max(0, Math.min(score, 100))
}

/**
 * Structure Score (10% weight)
 * Detects organized thinking: steps, STAR format, logical flow
 */
export function structureScore(answer: string): number {
  const text = answer.toLowerCase()
  let score = 40 // Base score

  // Sequential markers (indicates step-by-step thinking)
  const SEQUENTIAL_MARKERS = [
    "first", "second", "third", "next", "then", "after", "finally",
    "initially", "subsequently", "lastly", "step 1", "step 2"
  ]

  // STAR format markers (Situation, Task, Action, Result)
  const STAR_MARKERS = [
    "situation", "task", "action", "result", "outcome", "impact",
    "challenge", "approach", "solution", "achieved"
  ]

  // Logical connectors (shows reasoning)
  const LOGICAL_CONNECTORS = [
    "because", "therefore", "however", "consequently", "thus",
    "as a result", "due to", "leads to", "which means"
  ]

  // Count markers
  let sequentialCount = 0
  let starCount = 0
  let logicalCount = 0

  for (const marker of SEQUENTIAL_MARKERS) {
    if (text.includes(marker)) sequentialCount++
  }
  for (const marker of STAR_MARKERS) {
    if (text.includes(marker)) starCount++
  }
  for (const connector of LOGICAL_CONNECTORS) {
    if (text.includes(connector)) logicalCount++
  }

  // Add points for structure indicators
  if (sequentialCount >= 2) score += 20
  else if (sequentialCount === 1) score += 10

  if (starCount >= 2) score += 20
  else if (starCount === 1) score += 10

  if (logicalCount >= 2) score += 15
  else if (logicalCount === 1) score += 8

  // Check for paragraph/sentence organization
  const sentences = extractSentences(answer)
  if (sentences.length >= 3 && sentences.length <= 8) {
    score += 10 // Well-organized length
  }

  return Math.max(0, Math.min(score, 100))
}
