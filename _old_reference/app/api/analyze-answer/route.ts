import { generateObject } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { z } from "zod"

export const maxDuration = 30

// Server-side API key for subscription-based access
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o"

const FeedbackSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scores: z.object({
    technical: z.number().min(0).max(40),
    communication: z.number().min(0).max(30),
    confidence: z.number().min(0).max(20),
    relevance: z.number().min(0).max(10),
  }),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  detailedFeedback: z.string(),
  suggestedResources: z.array(z.string()),
})

export async function POST(req: Request) {
  const {
    question,
    answer,
    context,
    settings,
  }: {
    question: string
    answer: string
    context: { role: string; type: string; difficulty: string }
    settings?: { model?: string }
  } = await req.json()

  if (!OPENROUTER_API_KEY) {
    return Response.json(
      { error: "Service not configured. Please contact support." },
      { status: 503 }
    )
  }

  const prompt = `Analyze this interview answer and provide detailed feedback.

Question: ${question}
Answer: ${answer}

Context:
- Role: ${context.role}
- Interview Type: ${context.type}
- Difficulty: ${context.difficulty}

Evaluate the answer across these dimensions:
1. Technical Accuracy (max 40 points) - correctness, depth, completeness
2. Communication Clarity (max 30 points) - structure, articulation, conciseness
3. Confidence & Delivery (max 20 points) - tone, certainty, professional presentation
4. Relevance & Structure (max 10 points) - answering what was asked, logical flow

Provide specific, actionable feedback.`

  try {
    const openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY })
    const result = await generateObject({
      model: openrouter(settings?.model || DEFAULT_MODEL),
      schema: FeedbackSchema,
      prompt,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Error analyzing answer:", error)
    return Response.json({ error: "Failed to analyze answer" }, { status: 500 })
  }
}
