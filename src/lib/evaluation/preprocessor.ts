/**
 * Text Preprocessing Module
 * Pure NLP operations - no machine learning
 */

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "can", "of", "at", "by", "for", "with",
  "about", "against", "between", "into", "through", "during", "before",
  "after", "above", "below", "to", "from", "up", "down", "in", "out", "on",
  "off", "over", "under", "again", "further", "then", "once", "here", "there",
  "when", "where", "why", "how", "all", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "just", "but", "and", "or", "if", "because", "as",
  "until", "while", "what", "which", "who", "whom", "this", "that", "these",
  "those", "am", "it"
])

/**
 * Preprocesses text for analysis
 * Steps: lowercase → remove punctuation → tokenize → filter stopwords
 */
export function preprocess(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with space
    .split(/\s+/) // Split on whitespace
    .filter(word => word.length > 2 && !STOPWORDS.has(word))
}

/**
 * Extract sentences from text
 */
export function extractSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
}

/**
 * Calculate word count
 */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length
}

/**
 * Calculate average sentence length
 */
export function avgSentenceLength(text: string): number {
  const sentences = extractSentences(text)
  if (sentences.length === 0) return 0

  const totalWords = sentences.reduce(
    (sum, sentence) => sum + wordCount(sentence),
    0
  )
  return totalWords / sentences.length
}
