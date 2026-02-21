/**
 * Interview Respond Logic - Hybrid AI + Deterministic Scoring
 * Always runs deterministic evaluation, AI enhances conversation flow
 */

import { evaluateAnswer } from "@/lib/evaluation"
import { callAI } from "@/lib/ai/client"
import { buildResponsePrompt, validateResponsePrompt } from "@/lib/ai/prompts"
import { getNextQuestion } from "@/lib/questions"

export interface RespondParams {
  question: string
  answer: string
  sessionHistory: Array<{ role: "user" | "assistant"; content: string }>
  config: {
    role: string
    type: string
    difficulty: string
  }
  questionIndex: number
  usedQuestions?: string[]
}

export interface RespondResult {
  score: number
  breakdown: {
    technical: number
    clarity: number
    confidence: number
    relevance: number
    structure: number
  }
  feedback: string
  nextQuestion: string | null
  done: boolean
  source: "ai" | "fallback"
  debug?: {
    aiAttempted: boolean
    aiSuccess: boolean
    aiError?: string
    evaluationTime: number
  }
}

/**
 * Handle user answer with hybrid evaluation
 */
export async function handleAnswer(params: RespondParams): Promise<RespondResult> {
  const startTime = Date.now()
  
  const debug = {
    aiAttempted: false,
    aiSuccess: false,
    aiError: undefined as string | undefined,
    evaluationTime: 0
  }

  // 1. ALWAYS run deterministic evaluation first
  console.log("📊 Running deterministic evaluation...")
  
  const evaluationResult = evaluateAnswer(params.question, params.answer, {
    role: params.config.role,
    type: params.config.type,
    difficulty: params.config.difficulty
  })

  let feedback = evaluationResult.feedback
  let nextQuestion: string | null = null
  let done = false
  let source: "ai" | "fallback" = "fallback"

  // 2. Try AI for conversational flow enhancement
  if (process.env.OPENROUTER_API_KEY) {
    debug.aiAttempted = true
    
    try {
      console.log("🤖 Attempting AI conversation flow...")
      
      const prompt = buildResponsePrompt({
        question: params.question,
        answer: params.answer,
        evaluationResult,
        sessionHistory: params.sessionHistory,
        config: params.config,
        questionIndex: params.questionIndex
      })
      
      const aiResponse = await callAI(prompt)
      
      if (aiResponse && validateResponsePrompt(aiResponse)) {
        console.log("✅ AI conversation flow successful")
        
        feedback = aiResponse.feedback
        nextQuestion = aiResponse.nextQuestion
        done = aiResponse.endInterview || params.questionIndex >= 5
        source = "ai"
        debug.aiSuccess = true
        
      } else {
        debug.aiError = "Invalid AI response format"
        console.warn("❌ AI response validation failed:", aiResponse)
      }
      
    } catch (error) {
      debug.aiError = error instanceof Error ? error.message : "Unknown AI error"
      console.warn("❌ AI conversation flow failed:", error)
    }
  }

  // 3. Fallback logic if AI failed or unavailable
  if (source === "fallback") {
    console.log("🔄 Using fallback conversation logic")
    
    // Determine if we should continue
    done = params.questionIndex >= 5
    
    if (!done) {
      // Get next question from bank
      const questionResponse = getNextQuestion({
        role: params.config.role,
        type: params.config.type,
        difficulty: params.config.difficulty,
        usedQuestions: params.usedQuestions || []
      })
      
      nextQuestion = questionResponse.text
    }
  }

  debug.evaluationTime = Date.now() - startTime

  return {
    score: evaluationResult.overallScore,
    breakdown: evaluationResult.breakdown,
    feedback,
    nextQuestion: done ? null : nextQuestion,
    done,
    source,
    ...(process.env.NODE_ENV === 'development' && { debug })
  }
}

/**
 * Validate respond parameters
 */
export function validateRespondParams(params: any): params is RespondParams {
  return (
    typeof params === "object" &&
    typeof params.question === "string" &&
    typeof params.answer === "string" &&
    Array.isArray(params.sessionHistory) &&
    typeof params.config === "object" &&
    typeof params.questionIndex === "number" &&
    params.question.length > 0 &&
    params.answer.length > 0
  )
}