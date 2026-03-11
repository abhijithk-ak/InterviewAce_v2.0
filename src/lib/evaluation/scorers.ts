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
 * Measures domain-specific keyword usage + code snippet detection
 * Proves knowledge of relevant concepts
 * 
 * SCORING PHILOSOPHY:
 * - Rewards accurate domain knowledge, not just keyword stuffing
 * - More forgiving to encourage learning
 * - Balances keyword count with diversity and practical demonstration
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

  // NEW SCORING APPROACH: More forgiving and reward-based
  // Base score for showing any technical knowledge
  let score = 30
  
  // Award points per keyword matched (up to 10 keywords for max points)
  const keywordPoints = Math.min(matches * 5, 50) // 5 points per keyword, max 50
  score += keywordPoints

  // Bonus for diversity of keywords (not just repeating one term)
  if (matchedKeywords.size >= 3) score += 10  // Shows breadth of knowledge
  if (matchedKeywords.size >= 5) score += 10  // Shows depth and variety
  if (matchedKeywords.size >= 7) score += 5   // Expert-level coverage

  // Bonus for code snippets (shows practical knowledge)
  const hasCodeSnippet = detectCodeSnippet(answer)
  if (hasCodeSnippet.detected) {
    score += 10 // Bonus for including code/commands
    if (hasCodeSnippet.isFunctional) score += 5 // Extra for complete examples
  }

  return Math.round(Math.min(score, 100))
}

/**
 * Detect code snippets in answer
 * Returns: { detected: boolean, isFunctional: boolean }
 */
function detectCodeSnippet(answer: string): { detected: boolean; isFunctional: boolean } {
  const codeIndicators = {
    // Code structure indicators
    braces: /\{[^}]*\}/g,
    parentheses: /[a-zA-Z_]\w*\s*\([^)]*\)/g, // function calls
    annotations: /@override|@deprecated|@required/gi,
    arrows: /=>/g,
    keywords: /\b(class|function|const|let|var|void|async|await|return|if|else|for|while|switch|case|override|build|setState|initState|dispose)\b/gi,
    // Flutter/Dart specific
    dartTypes: /\b(Widget|BuildContext|State|StatelessWidget|StatefulWidget|Provider|String|int|double|bool|List|Map)\b/g,
    // Common code patterns
    assignments: /\w+\s*[:=]\s*[^;,\s]+/g,
    chaining: /\.\w+\([^)]*\)/g, // method chaining
  }

  let indicatorCount = 0
  let hasStructure = false

  // Count occurrences of code indicators
  if ((answer.match(codeIndicators.braces) || []).length > 0) {
    indicatorCount += 2
    hasStructure = true
  }
  if ((answer.match(codeIndicators.parentheses) || []).length >= 2) indicatorCount++
  if ((answer.match(codeIndicators.annotations) || []).length > 0) indicatorCount += 2
  if ((answer.match(codeIndicators.arrows) || []).length > 0) indicatorCount++
  if ((answer.match(codeIndicators.keywords) || []).length >= 3) indicatorCount += 2
  if ((answer.match(codeIndicators.dartTypes) || []).length >= 2) indicatorCount++
  if ((answer.match(codeIndicators.assignments) || []).length >= 2) indicatorCount++
  if ((answer.match(codeIndicators.chaining) || []).length >= 2) indicatorCount++

  return {
    detected: indicatorCount >= 3, // Has code-like patterns
    isFunctional: indicatorCount >= 5 && hasStructure // Has complete code structure
  }
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
    // Development
    "I implemented", "I designed", "I built", "I created", "I developed",
    "I solved", "I optimized", "I improved", "I achieved", "I delivered",
    "I integrated", "I configured", "I deployed", "I refactored", "I migrated",
    "I maintained", "I architected", "I established", "I initiated",
    // Support & Troubleshooting
    "I diagnosed", "I troubleshot", "I resolved", "I fixed", "I debugged",
    "I identified", "I analyzed", "I investigated", "I verified",
    "I documented", "I escalated", "I guided", "I assisted",
    // General
    "successfully", "effectively", "efficiently", "accomplished",
    "demonstrated", "proven", "resulted in", "led to", "ensured",
    "will", "can", "would", "is", "are", "does", "ensures", "provides",
    "clearly", "definitely", "certainly", "absolutely", "specifically",
    // Systematic approaches
    "first", "then", "next", "finally", "step by step", "systematically"
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
