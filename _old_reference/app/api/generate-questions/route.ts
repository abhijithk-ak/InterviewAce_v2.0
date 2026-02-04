import { generateText } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import type { InterviewConfig } from "@/lib/data"

export const maxDuration = 30

// Server-side API key for subscription-based access
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free"

export async function POST(req: Request) {
  const {
    config,
    settings,
  }: {
    config: InterviewConfig
    settings?: { model?: string }
  } = await req.json()

  if (!OPENROUTER_API_KEY) {
    return Response.json(
      { error: "Service not configured. Please contact support." },
      { status: 503 }
    )
  }

  const prompt = `Generate ${config.questionCount || 5} interview questions for a ${config.type} interview.
Role: ${config.role}
Difficulty: ${config.difficulty}
${config.focusArea ? `Focus Area: ${config.focusArea}` : ""}
${config.jobDescription ? `Job Description: ${config.jobDescription}` : ""}
${config.company ? `Company: ${config.company}` : ""}

Return a JSON array of questions with this format:
[
  {
    "question": "The interview question",
    "category": "${config.type}",
    "difficulty": "${config.difficulty}",
    "followUps": ["follow up 1", "follow up 2"],
    "evaluationCriteria": ["criteria 1", "criteria 2"]
  }
]

Only return the JSON array, no other text.`

  try {
    const openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY })
    const result = await generateText({
      model: openrouter(settings?.model || DEFAULT_MODEL),
      prompt,
    })

    const cleanedText = result.text.replace(/```json\n?|```/g, "").trim()
    const questions = JSON.parse(cleanedText)
    return Response.json({ questions })
  } catch (error) {
    console.error("Error generating questions:", error)
    return Response.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
