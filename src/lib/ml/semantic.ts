/**
 * Semantic Scoring with MiniLM
 * Lightweight transformer-based semantic similarity using @xenova/transformers
 * 
 * Model: all-MiniLM-L6-v2 (80MB, ONNX runtime)
 * Purpose: Enhance deterministic scoring with semantic understanding
 */

import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers"

// Singleton instance for feature extraction
let extractor: FeatureExtractionPipeline | null = null

/**
 * Initialize the MiniLM model (lazy loaded on first use)
 */
async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractor) {
    try {
      extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      )
    } catch (error) {
      console.error("Failed to load MiniLM model:", error)
      throw new Error("Semantic similarity model unavailable")
    }
  }
  return extractor
}

/**
 * Generate embedding vector for text using MiniLM
 * @param text - Input text to embed
 * @returns Float32Array embedding (384 dimensions)
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getExtractor()
    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    })

    // Convert tensor to array
    return Array.from(output.data as Float32Array)
  } catch (error) {
    console.error("Failed to generate embedding:", error)
    throw error
  }
}

/**
 * Calculate cosine similarity between two embedding vectors
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Similarity score (0-1, where 1 is identical)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Embedding vectors must have same length")
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)

  if (magnitude === 0) {
    return 0
  }

  return dotProduct / magnitude
}

/**
 * Calculate semantic similarity score between question and answer
 * @param question - Interview question
 * @param answer - Candidate's answer
 * @returns Similarity score (0-10 scale)
 */
export async function getSemanticScore(
  question: string,
  answer: string
): Promise<number> {
  try {
    const [questionEmbed, answerEmbed] = await Promise.all([
      getEmbedding(question),
      getEmbedding(answer),
    ])

    const similarity = cosineSimilarity(questionEmbed, answerEmbed)

    // Convert 0-1 similarity to 0-10 score
    return Math.max(0, Math.min(10, similarity * 10))
  } catch (error) {
    console.error("Semantic scoring failed:", error)
    // Return neutral score if semantic analysis fails
    return 5
  }
}

/**
 * Calculate hybrid evaluation score
 * Combines deterministic (rule-based) and semantic (ML) scores
 * 
 * @param deterministicScore - Rule-based NLP score (0-100)
 * @param question - Interview question
 * @param answer - Candidate's answer
 * @returns Hybrid score (0-100) with metadata
 */
export async function getHybridScore(
  deterministicScore: number,
  question: string,
  answer: string
): Promise<{
  finalScore: number
  deterministicScore: number
  semanticScore: number
  semanticWeight: number
}> {
  try {
    // Get semantic similarity (0-10 scale)
    const semanticRaw = await getSemanticScore(question, answer)

    // Convert semantic score to 0-100 scale
    const semanticScore = semanticRaw * 10

    // Weighted combination: 70% deterministic + 30% semantic
    const deterministicWeight = 0.7
    const semanticWeight = 0.3

    const finalScore = Math.round(
      deterministicScore * deterministicWeight +
        semanticScore * semanticWeight
    )

    return {
      finalScore: Math.max(0, Math.min(100, finalScore)),
      deterministicScore,
      semanticScore,
      semanticWeight,
    }
  } catch (error) {
    console.error("Hybrid scoring failed, using deterministic only:", error)
    // Graceful degradation: return deterministic score if ML fails
    return {
      finalScore: deterministicScore,
      deterministicScore,
      semanticScore: 0,
      semanticWeight: 0,
    }
  }
}

/**
 * Warmup function - preload model for faster first inference
 * Call this on server startup or during idle time
 */
export async function warmupSemanticModel(): Promise<void> {
  try {
    console.log("Warming up semantic model...")
    await getEmbedding("test warmup text")
    console.log("Semantic model ready")
  } catch (error) {
    console.error("Failed to warmup semantic model:", error)
  }
}
