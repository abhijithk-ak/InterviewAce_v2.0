# Annexure I - Representative Source Code Excerpts (InterviewAce)

Purpose: This annexure includes representative excerpts from core modules instead of full file dumps, so the report remains readable while still showing key implementation evidence.

Note: File paths below point to the actual project sources used in implementation.

---

## 1) Authentication Route (NextAuth)
Source: `src/app/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
```

---

## 2) Hybrid Evaluation Engine (Weights + Safety Cap)
Source: `src/lib/evaluation/engine.ts`

```ts
export const DEFAULT_WEIGHTS: EvaluationWeights = {
  concept: 0.55,
  semantic: 0.3,
  clarity: 0.15,
}

let finalScore = (
  weights.concept * conceptScore +
  weights.semantic * semanticScore +
  weights.clarity * clarityScore
) * 10

if (conceptScore <= 2) {
  finalScore = Math.min(finalScore, 40)
}

finalScore = Math.round(finalScore)
```

---

## 3) AI Concept Evaluator (Schema-Constrained Prompt)
Source: `src/lib/evaluation/aiEvaluator.ts`

```ts
export type AIEvaluationResult = {
  conceptScore: number
  clarityScore: number
  errors: string[]
  explanation: string
  modelUsed?: string
}

const basePrompt = [
  "You are a strict technical interviewer evaluating a candidate answer.",
  "Grade reasoning, not terminology density.",
  "Return JSON only.",
  "Rules:",
  "- conceptScore and clarityScore must be numbers from 0 to 10.",
  "- If the answer is incorrect or contradicts core concepts, conceptScore must be 3 or lower.",
].join("\n")

const response = await callAI(prompt, {
  model: options.model,
  temperature: options.temperature ?? 0.1,
  maxTokens: 500,
  systemPrompt: "You are a strict evaluator. Return only valid JSON.",
})
```

---

## 4) Semantic Similarity Module (MiniLM)
Source: `src/lib/ml/semanticEvaluator.ts`

```ts
import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers'

export async function loadModel(): Promise<FeatureExtractionPipeline> {
  if (modelInstance) return modelInstance
  if (modelLoading) return modelLoading

  modelLoading = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  return modelLoading
}

export async function semanticCorrectnessScore(
  referenceAnswer: string,
  candidateAnswer: string
): Promise<number> {
  const model = await loadModel()
  const [refEmbedding, candEmbedding] = await Promise.all([
    model(referenceAnswer, { pooling: 'mean', normalize: true }),
    model(candidateAnswer, { pooling: 'mean', normalize: true })
  ])

  const similarity = cosineSimilarity(
    Array.from(refEmbedding.data) as number[],
    Array.from(candEmbedding.data) as number[]
  )

  return Math.round(Math.max(0, Math.min(1, similarity)) * 100) / 10
}
```

---

## 5) Interview Response Orchestration
Source: `src/lib/interview/respond.ts`

```ts
const evaluationResult = await evaluateAnswer(
  params.question,
  params.answer,
  {
    role: params.config.role,
    type: params.config.type,
    difficulty: params.config.difficulty,
  },
  {
    referenceAnswer,
    aiModel: params.aiModel,
    aiTemperature: params.aiTemperature,
  }
)

return {
  overallScore: evaluationResult.overallScore,
  breakdown: evaluationResult.breakdown,
  explanation: evaluationResult.explanation,
  errors: evaluationResult.errors,
  evaluationMethod: evaluationResult.evaluationMethod,
  // ... next-question and session flow fields
}
```

---

## 6) OpenRouter Client (Timeout + Retry)
Source: `src/lib/ai/client.ts`

```ts
const DEFAULT_CONFIG = {
  model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
  temperature: 0.4,
  maxTokens: 800,
  timeout: 15000,
  retryCount: 0
}

if (response.status === 429) {
  const currentRetries = config.retryCount || 0
  if (currentRetries < 2) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return callAI(prompt, { ...config, retryCount: currentRetries + 1 })
  }
  return null
}
```

---

## 7) Research Metrics API (Admin + Aggregation)
Source: `src/app/api/research/metrics/route.ts`

```ts
const session = await auth()
if (!session?.user?.email) {
  return NextResponse.json({ error: "Authentication required", success: false }, { status: 401 })
}

if (!isAdmin(session.user.email)) {
  return NextResponse.json({ error: "Unauthorized - Admin access required", success: false }, { status: 403 })
}

const avgDet = allQuestionMetrics.reduce((s, m) => s + m.det, 0) / totalQuestions
const avgSem = allQuestionMetrics.reduce((s, m) => s + m.sem, 0) / totalQuestions
const avgHyb = allQuestionMetrics.reduce((s, m) => s + m.hyb, 0) / totalQuestions
```

---

## 8) Recommendation Engine (Deterministic Ranking)
Source: `src/lib/recommendation-engine.ts`

```ts
export function calculateDynamicDifficulty(context: RecommendationContext): 'easy' | 'medium' | 'hard' {
  if (!context.analytics || context.totalSessions === 0) {
    if (context.profile.experienceLevel === 'student' || context.profile.confidenceLevel <= 2) return 'easy'
    if (context.profile.experienceLevel === 'senior' && context.profile.confidenceLevel >= 4) return 'hard'
    return 'medium'
  }

  const { averageScore, skillBreakdown } = context.analytics
  const avgSkillScore = Object.values(skillBreakdown).reduce((a, b) => a + b, 0) / 4

  if (averageScore < 40 || avgSkillScore < 4) return 'easy'
  if (averageScore > 70 && avgSkillScore > 7) return 'hard'
  return 'medium'
}
```

---

## 9) Chart Label Consistency Note
The research dashboard label has been aligned to production weights:
- Concept: 0.55
- Semantic: 0.30
- Clarity: 0.15

Source: `src/app/(app)/research/ImprovedDashboard.tsx`

