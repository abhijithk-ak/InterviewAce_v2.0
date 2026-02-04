// AI client for OpenRouter integration (100% FREE)
// Phase 3.3: Evaluation and follow-up generation
// Using Meta Llama 3.2 3B (free tier)

import { openrouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"

export type EvaluationResult = {
  score: number
  confidence: number
  clarity: number
  technical_depth: number
  strengths: string[]
  improvements: string[]
  should_follow_up: boolean
  follow_up_focus: string | null
}

// Validate environment on module load
if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY not configured")
}

if (!process.env.OPENROUTER_MODEL) {
  throw new Error("OPENROUTER_MODEL not configured")
}

const model = openrouter(process.env.OPENROUTER_MODEL)

export async function callAI(prompt: string): Promise<string> {
  const result = await generateText({
    model,
    prompt,
  })

  return result.text
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  role: string,
  difficulty: string
): Promise<EvaluationResult> {
  const { buildEvaluationPrompt } = await import("./prompts/evaluateAnswer")
  const prompt = buildEvaluationPrompt({ question, answer, role, difficulty })
  
  const rawResponse = await callAI(prompt)
  
  // Parse JSON response
  try {
    const parsed = JSON.parse(rawResponse)
    return parsed as EvaluationResult
  } catch (error) {
    console.error("Failed to parse evaluation:", error)
    // Fallback evaluation
    return {
      score: 5,
      confidence: 5,
      clarity: 5,
      technical_depth: 5,
      strengths: [],
      improvements: [],
      should_follow_up: false,
      follow_up_focus: null,
    }
  }
}

export async function generateFollowUp(
  question: string,
  answer: string,
  focus: string
): Promise<string> {
  const { buildFollowUpPrompt } = await import("./prompts/followUp")
  const prompt = buildFollowUpPrompt({ question, answer, focus })
  
  return await callAI(prompt)
}
