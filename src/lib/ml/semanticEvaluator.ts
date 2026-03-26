/**
 * Semantic Evaluation Module (Enhanced with Reference Answer Similarity)
 * 
 * Uses Sentence-BERT embeddings to measure semantic similarity.
 * 
 * TWO MODES:
 * 1. Question-Answer similarity (legacy) - measures topic relevance
 * 2. Reference-Answer similarity (NEW) - measures conceptual correctness
 * 
 * Features:
 * - Lightweight transformer model (~80MB)
 * - Lazy loading with model caching
 * - Cosine similarity scoring
 * - 0-10 score range for consistency with deterministic evaluation
 */

import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers'

// Cached model instance for reuse
let modelInstance: FeatureExtractionPipeline | null = null
let modelLoading: Promise<FeatureExtractionPipeline> | null = null

/**
 * Load the sentence embedding model
 * Uses lazy loading and caching to avoid reloading on every call
 * 
 * @returns Promise<FeatureExtractionPipeline> The loaded embedding pipeline
 */
export async function loadModel(): Promise<FeatureExtractionPipeline> {
  // Return cached instance if available
  if (modelInstance) {
    return modelInstance
  }
  
  // If model is currently loading, wait for it
  if (modelLoading) {
    return modelLoading
  }
  
  // Start loading the model
  modelLoading = (async () => {
    try {
      console.log('🤖 Loading semantic evaluation model (Xenova/all-MiniLM-L6-v2)...')
      
      const model = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      )
      
      console.log('✅ Semantic evaluation model loaded successfully')
      
      modelInstance = model
      modelLoading = null
      
      return model
    } catch (error) {
      console.error('❌ Failed to load semantic evaluation model:', error)
      modelLoading = null
      throw error
    }
  })()
  
  return modelLoading
}

/**
 * Compute cosine similarity between two embedding vectors
 * 
 * Formula: similarity = (A · B) / (||A|| * ||B||)
 * 
 * @param a First embedding vector
 * @param b Second embedding vector
 * @returns Cosine similarity score (typically 0-1 for semantic embeddings)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }
  
  // Compute dot product
  let dotProduct = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
  }
  
  // Compute magnitudes (L2 norms)
  let magnitudeA = 0
  let magnitudeB = 0
  
  for (let i = 0; i < a.length; i++) {
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }
  
  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)
  
  // Handle edge case: zero magnitude
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }
  
  // Compute cosine similarity
  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Calculate semantic similarity score between question and answer
 * 
 * Process:
 * 1. Generate embeddings for both question and answer
 * 2. Compute cosine similarity between embeddings
 * 3. Convert to 0-10 scale for consistency with other evaluation metrics
 * 
 * @param question The interview question text
 * @param answer The candidate's answer text
 * @returns Promise<number> Semantic similarity score (0-10)
 */
export async function semanticScore(
  question: string,
  answer: string
): Promise<number> {
  try {
    // Handle empty inputs
    if (!question.trim() || !answer.trim()) {
      return 0
    }
    
    // Load model (uses cache if already loaded)
    const model = await loadModel()
    
    // Generate embeddings for question and answer
    const [questionEmbedding, answerEmbedding] = await Promise.all([
      model(question, { pooling: 'mean', normalize: true }),
      model(answer, { pooling: 'mean', normalize: true })
    ])
    
    // Extract embedding arrays from tensor output
    const questionVector = Array.from(questionEmbedding.data) as number[]
    const answerVector = Array.from(answerEmbedding.data) as number[]
    
    // Compute cosine similarity
    const similarity = cosineSimilarity(questionVector, answerVector)
    
    // Convert to 0-10 scale
    // Cosine similarity ranges from -1 to 1, but semantic embeddings are typically 0-1
    // We clamp to [0, 1] and scale to [0, 10]
    const clampedSimilarity = Math.max(0, Math.min(1, similarity))
    const score = clampedSimilarity * 10
    
    // Round to 1 decimal place
    return Math.round(score * 10) / 10
  } catch (error) {
    console.error('Error computing semantic score:', error)
    
    // Return 0 on error to avoid breaking evaluation
    return 0
  }
}

/**
 * Calculate semantic correctness by comparing answer to reference answer
 * 
 * THIS IS THE KEY IMPROVEMENT for detecting correctness vs just topic similarity.
 * 
 * Instead of comparing question ↔ answer (which measures topic relevance),
 * we compare referenceAnswer ↔ userAnswer (which measures conceptual correctness).
 * 
 * Example:
 * Question: "Explain overfitting"
 * Reference: "Overfitting occurs when a model learns noise in training data..."
 * Wrong Answer: "Overfitting is when the model doesn't memorize enough"
 * 
 * Question-Answer similarity would be HIGH (same topic)
 * Reference-Answer similarity would be LOW (opposite meaning)
 * 
 * @param referenceAnswer Correct/expected answer from question bank
 * @param candidateAnswer User's actual answer
 * @returns Promise<number> Semantic correctness score (0-10)
 */
export async function semanticCorrectnessScore(
  referenceAnswer: string,
  candidateAnswer: string
): Promise<number> {
  try {
    // Handle empty inputs
    if (!referenceAnswer.trim() || !candidateAnswer.trim()) {
      return 0
    }
    
    // Load model (uses cache if already loaded)
    const model = await loadModel()
    
    // Generate embeddings for reference and candidate answers
    const [refEmbedding, candEmbedding] = await Promise.all([
      model(referenceAnswer, { pooling: 'mean', normalize: true }),
      model(candidateAnswer, { pooling: 'mean', normalize: true })
    ])
    
    // Extract embedding arrays from tensor output
    const refVector = Array.from(refEmbedding.data) as number[]
    const candVector = Array.from(candEmbedding.data) as number[]
    
    // Compute cosine similarity
    const similarity = cosineSimilarity(refVector, candVector)
    
    // Convert to 0-10 scale
    const clampedSimilarity = Math.max(0, Math.min(1, similarity))
    const score = clampedSimilarity * 10
    
    // Round to 1 decimal place
    return Math.round(score * 10) / 10
  } catch (error) {
    console.error('Error computing semantic correctness score:', error)
    
    // Return 0 on error to avoid breaking evaluation
    return 0
  }
}

/**
 * Calculate mean pooling from transformer output
 * Helper function for extracting meaningful embeddings
 * 
 * @param embeddings Raw transformer output
 * @param attentionMask Attention mask for valid tokens
 * @returns Pooled embedding vector
 */
function meanPooling(embeddings: number[][], attentionMask: number[]): number[] {
  const [seqLength, hiddenSize] = [embeddings.length, embeddings[0].length]
  const pooled = new Array(hiddenSize).fill(0)
  
  let validTokenCount = 0
  
  for (let i = 0; i < seqLength; i++) {
    if (attentionMask[i] === 1) {
      validTokenCount++
      for (let j = 0; j < hiddenSize; j++) {
        pooled[j] += embeddings[i][j]
      }
    }
  }
  
  // Divide by number of valid tokens
  if (validTokenCount > 0) {
    for (let j = 0; j < hiddenSize; j++) {
      pooled[j] /= validTokenCount
    }
  }
  
  return pooled
}

/**
 * Preload the model during application startup (optional)
 * Call this in server initialization to avoid cold start latency
 * 
 * @returns Promise<void>
 */
export async function preloadModel(): Promise<void> {
  await loadModel()
}

// Export types for TypeScript
export interface SemanticEvaluation {
  semanticScore: number
  similarity: number
}

/**
 * Enhanced semantic evaluation with confidence levels
 * 
 * @param question The interview question
 * @param answer The candidate's answer
 * @returns Promise<SemanticEvaluation> Detailed semantic evaluation
 */
export async function evaluateSemanticSimilarity(
  referenceAnswer: string,
  candidateAnswer: string
): Promise<SemanticEvaluation> {
  try {
    if (!referenceAnswer.trim() || !candidateAnswer.trim()) {
      return {
        similarity: 0,
        semanticScore: 0,
      }
    }

    const model = await loadModel()
    const [refEmbedding, candEmbedding] = await Promise.all([
      model(referenceAnswer, { pooling: 'mean', normalize: true }),
      model(candidateAnswer, { pooling: 'mean', normalize: true })
    ])

    const refVector = Array.from(refEmbedding.data) as number[]
    const candVector = Array.from(candEmbedding.data) as number[]

    const rawSimilarity = cosineSimilarity(refVector, candVector)
    const similarity = Math.max(0, Math.min(1, rawSimilarity))
    const semanticScore = Math.max(0, Math.min(10, similarity * 10))

    return {
      similarity: Math.round(similarity * 1000) / 1000,
      semanticScore: Math.round(semanticScore * 10) / 10,
    }
  } catch (error) {
    console.error('Error computing semantic similarity:', error)
    return {
      similarity: 0,
      semanticScore: 0,
    }
  }
}
