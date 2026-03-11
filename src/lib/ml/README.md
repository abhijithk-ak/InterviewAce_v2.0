# ML Module - Semantic Evaluation

This module provides lightweight machine learning-based semantic evaluation for interview answers using Sentence-BERT embeddings.

## Overview

The semantic evaluator uses the `all-MiniLM-L6-v2` model to compute semantic similarity between questions and answers. This provides a more nuanced understanding of answer relevance compared to pure keyword matching.

## Features

- ✅ **Lightweight**: ~80MB model size
- ✅ **Fast**: Inference in ~100-300ms
- ✅ **Cached**: Model loaded once and reused
- ✅ **Reliable**: Graceful fallback to deterministic scoring
- ✅ **Integration Ready**: Works seamlessly with existing evaluation engine

## Installation

The required package is already installed:

```bash
pnpm add @xenova/transformers
```

## Usage

### Basic Usage

```typescript
import { semanticScore } from '@/lib/ml/semanticEvaluator'

const question = "Explain React hooks"
const answer = "React hooks are functions that let you use state in functional components"

const score = await semanticScore(question, answer)
console.log(score) // 0-10 score
```

### Integration with Evaluation Engine

```typescript
import { evaluateAnswer, SEMANTIC_ENHANCED_WEIGHTS } from '@/lib/evaluation/engine'

const result = await evaluateAnswer(
  question,
  answer,
  {
    role: "Frontend Developer",
    type: "technical",
    difficulty: "medium"
  },
  {
    enableSemantic: true,
    weights: SEMANTIC_ENHANCED_WEIGHTS
  }
)

console.log(result.breakdown.semantic) // Semantic score
console.log(result.metadata.evaluationMethod) // "hybrid"
```

### Enhanced Evaluation

```typescript
import { evaluateSemanticSimilarity } from '@/lib/ml/semanticEvaluator'

const evaluation = await evaluateSemanticSimilarity(question, answer)
// {
//   score: 8.5,
//   similarity: 0.85,
//   confidence: 'high'
// }
```

## API Reference

### `loadModel(): Promise<Pipeline>`

Loads and caches the embedding model. Called automatically by `semanticScore()`.

### `cosineSimilarity(a: number[], b: number[]): number`

Computes cosine similarity between two embedding vectors.

**Parameters:**
- `a`: First embedding vector
- `b`: Second embedding vector

**Returns:** Similarity score (0-1 range)

### `semanticScore(question: string, answer: string): Promise<number>`

Calculates semantic similarity between question and answer.

**Parameters:**
- `question`: Interview question text
- `answer`: Candidate's answer text

**Returns:** Semantic similarity score (0-10 scale)

**Example:**
```typescript
const score = await semanticScore(
  "What is dependency injection?",
  "DI is a pattern where dependencies are provided externally"
)
// Returns: ~7.5
```

### `evaluateSemanticSimilarity(question: string, answer: string): Promise<SemanticEvaluation>`

Enhanced evaluation with confidence levels.

**Returns:**
```typescript
{
  score: number,          // 0-10
  similarity: number,     // 0-1 (raw cosine similarity)
  confidence: 'high' | 'medium' | 'low'
}
```

### `preloadModel(): Promise<void>`

Preloads the model during application startup to avoid cold start latency.

**Usage:**
```typescript
// In server initialization
import { preloadModel } from '@/lib/ml/semanticEvaluator'

await preloadModel()
```

## Integration with Evaluation Engine

### Default Weights (Deterministic Only)

```typescript
{
  relevance: 0.30,   // 30%
  clarity: 0.20,     // 20%
  technical: 0.25,   // 25%
  confidence: 0.15,  // 15%
  structure: 0.10    // 10%
}
```

### Semantic-Enhanced Weights

```typescript
{
  relevance: 0.25,   // 25%
  clarity: 0.15,     // 15%
  technical: 0.25,   // 25%
  confidence: 0.10,  // 10%
  structure: 0.10,   // 10%
  semantic: 0.15     // 15% (NEW)
}
```

## Performance

### Benchmark Results

| Operation | Time | Memory |
|-----------|------|--------|
| Model Load (first) | ~2-3s | +80MB |
| Model Load (cached) | <1ms | 0MB |
| Single Evaluation | ~100-300ms | +10MB |
| Batch (10 answers) | ~1-2s | +10MB |

### Optimization Tips

1. **Preload during startup**: Avoid cold start latency
   ```typescript
   await preloadModel()
   ```

2. **Batch evaluations**: More efficient than serial
   ```typescript
   await evaluateMultipleAnswers(pairs, context, { enableSemantic: true })
   ```

3. **Use sync version when semantic not needed**: Much faster
   ```typescript
   evaluateAnswerSync(question, answer, context)
   ```

## Error Handling

The semantic evaluator gracefully handles errors:

```typescript
try {
  const score = await semanticScore(question, answer)
  console.log('Semantic score:', score)
} catch (error) {
  console.error('Semantic evaluation failed:', error)
  // Falls back to deterministic only
}
```

In the integrated evaluation engine, errors are handled automatically:

```typescript
const result = await evaluateAnswer(question, answer, context, {
  enableSemantic: true
})

// Check if semantic was used
if (result.metadata.semanticEnabled) {
  console.log('Semantic score:', result.breakdown.semantic)
} else {
  console.log('Used deterministic only')
}
```

## When to Use Semantic Evaluation

### ✅ Good Use Cases

- Technical questions with conceptual answers
- Questions where paraphrasing is common
- System design discussions
- Behavioral answers (STAR method)
- Explanations of principles/patterns

### ❌ Not Recommended

- Code snippet evaluation (use AST parsing)
- Math/formula verification (use symbolic eval)
- Fact-checking (use knowledge base)
- Real-time streaming (too slow)

## Migration Guide

### From Deterministic Only

**Before:**
```typescript
const result = evaluateAnswer(question, answer, context)
```

**After:**
```typescript
const result = await evaluateAnswer(
  question,
  answer,
  context,
  { enableSemantic: true, weights: SEMANTIC_ENHANCED_WEIGHTS }
)
```

### Maintaining Backward Compatibility

Use the synchronous version for existing code:

```typescript
import { evaluateAnswerSync } from '@/lib/evaluation/engine'

const result = evaluateAnswerSync(question, answer, context)
// Works exactly like before
```

## Troubleshooting

### Model fails to load

**Issue:** "Failed to load semantic evaluation model"

**Solution:** Check network connectivity or try preloading:
```typescript
await preloadModel()
```

### Slow first evaluation

**Issue:** First evaluation takes 2-3 seconds

**Solution:** This is expected (model loading). Preload during startup.

### High memory usage

**Issue:** Application uses 100MB+ more memory

**Solution:** This is expected for the model. Monitor with:
```typescript
console.log(process.memoryUsage())
```

## Examples

See `src/lib/evaluation/examples.ts` for complete usage examples:

- Basic semantic evaluation
- Deterministic vs semantic comparison
- Error handling
- Batch evaluation
- Direct semantic scoring

## Architecture

```
┌─────────────────────────────────────────┐
│     Interview Answer Evaluation         │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   ┌────▼────┐        ┌────▼────┐
   │ Determi-│        │ Semantic│
   │ nistic  │        │   ML    │
   │ Scoring │        │ Scoring │
   └────┬────┘        └────┬────┘
        │                   │
        │   ┌───────────┐   │
        └───►  Weights  ◄───┘
            │ Combiner  │
            └─────┬─────┘
                  │
            ┌─────▼─────┐
            │  Overall  │
            │   Score   │
            └───────────┘
```

## License

Same as parent project (InterviewAce v2)
