/**
 * Interview Start Logic - AI-First with Fallback
 * AI generates greeting and first question, fallback to question bank
 */

import { callAI } from "@/lib/ai/client"
import { buildStartPrompt, validateStartResponse } from "@/lib/ai/prompts"
import { getGreeting, getNextQuestion } from "@/lib/questions"

export interface InterviewConfig {
  role: string
  type: string
  difficulty: string
}

export interface StartResult {
  greeting: string
  question: string
  source: "ai" | "fallback"
  debug?: {
    aiAttempted: boolean
    aiSuccess: boolean
    aiError?: string
  }
}

/**
 * Start interview session (AI-first approach)
 */
export async function startInterview(config: InterviewConfig, userName?: string): Promise<StartResult> {
  const debug = {
    aiAttempted: false,
    aiSuccess: false,
    aiError: undefined as string | undefined
  }

  // 1. Try AI first if available
  if (process.env.OPENROUTER_API_KEY) {
    debug.aiAttempted = true
    
    try {
      console.log("🤖 Attempting AI session start...")
      
      const prompt = buildStartPrompt(config, userName)
      const aiResponse = await callAI(prompt)
      
      if (aiResponse && validateStartResponse(aiResponse)) {
        console.log("✅ AI session start successful")
        debug.aiSuccess = true
        
        return {
          greeting: aiResponse.greeting,
          question: aiResponse.question,
          source: "ai",
          ...(process.env.NODE_ENV === 'development' && { debug })
        }
      } else {
        debug.aiError = "Invalid AI response format"
        console.warn("❌ AI response validation failed:", aiResponse)
      }
      
    } catch (error) {
      debug.aiError = error instanceof Error ? error.message : "Unknown AI error"
      console.warn("❌ AI session start failed:", error)
    }
  } else {
    console.log("⚠️ No OPENROUTER_API_KEY found - using fallback")
  }

  // 2. Fallback to question bank
  console.log("🔄 Using fallback question bank")
  
  const greeting = getFallbackGreeting(config, userName)
  const firstQuestion = getNextQuestion({
    role: config.role,
    type: config.type,
    difficulty: config.difficulty,
    usedQuestions: []
  })

  return {
    greeting,
    question: firstQuestion.text,
    source: "fallback",
    ...(process.env.NODE_ENV === 'development' && { debug })
  }
}

/**
 * Generate fallback greeting when AI fails
 */
function getFallbackGreeting(config: InterviewConfig, userName?: string): string {
  // Use existing greeting system as fallback
  const greetingResponse = getGreeting(config, userName)
  return greetingResponse.text
}

/**
 * Validate interview configuration
 */
export function validateConfig(config: any): config is InterviewConfig {
  return (
    typeof config === "object" &&
    typeof config.role === "string" &&
    typeof config.type === "string" &&
    typeof config.difficulty === "string" &&
    config.role.length > 0 &&
    config.type.length > 0 &&
    config.difficulty.length > 0
  )
}