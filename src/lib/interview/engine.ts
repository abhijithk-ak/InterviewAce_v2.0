/**
 * Interview Engine - Main Orchestrator (PHASE 4.5)
 * Coordinates evaluation, AI, and question flow with greetings
 */

import { evaluateAnswer } from "@/lib/evaluation"
import { callAI } from "@/lib/ai/client"
import { selectQuestions } from "@/lib/questions/bank"

export interface InterviewConfig {
  role: string
  type: string
  difficulty: string
}

export interface ProcessAnswerInput {
  question: string
  answer: string
  history: Array<{ role: "user" | "assistant"; content: string }>
  config: InterviewConfig
  followUpCount: number
  maxFollowUps: number
}

export interface InterviewResult {
  evaluation: {
    overall: number
    breakdown: {
      technical: number
      clarity: number
      confidence: number
      relevance: number
      structure: number
    }
  }
  feedback: string
  followUp: string | null
  hasFollowUp: boolean
  method: "hybrid" | "algorithmic" | "fallback"
  confidence: number
  debug: {
    aiUsed: boolean
    aiError?: string
    decisionReason: string
    processingTime: number
  }
}

/**
 * Main interview processing function
 * Handles greetings, evaluations, and follow-ups
 */
export async function processAnswer({
  question,
  answer,
  history,
  config,
  followUpCount,
  maxFollowUps
}: ProcessAnswerInput): Promise<InterviewResult> {
  const startTime = Date.now()
  
  // Check if this is first interaction (greeting needed)
  // Greeting logic removed - handled by AI-first architecture
  const questions = selectQuestions(config)
  if (questions.length > 0) {
    const firstQuestion = questions[0]
    
    return {
      evaluation: {
        overall: 100, // Greeting is always perfect
        breakdown: { technical: 10, clarity: 10, confidence: 10, relevance: 10, structure: 10 }
      },
      feedback: "Welcome! Let's begin with your first question.",
      followUp: firstQuestion.text,
      hasFollowUp: true,
      method: "hybrid",
      confidence: 1.0,
      debug: {
        aiUsed: false,
        decisionReason: "Initial greeting and first question",
        processingTime: Date.now() - startTime
      }
    }
  }

  // Normal answer processing
  console.log("🎯 Processing answer:", { 
    answerLength: answer.length,
    followUpCount,
    historyLength: history.length 
  })

  // 1. Always run algorithmic evaluation first (deterministic baseline)
  const algorithmResult = evaluateAnswer(question, answer, {
    role: config.role,
    type: config.type,
    difficulty: config.difficulty
  })

  let aiUsed = false
  let aiError: string | undefined
  let feedback = algorithmResult.feedback
  
  // 2. Try AI enhancement if available
  if (process.env.OPENROUTER_API_KEY) {
    try {
      console.log("🤖 Attempting AI enhancement...")
      
      // Context building simplified for legacy compatibility
      const context = `Question: ${question}\nAnswer: ${answer}\nFeedback needed.`

      const aiResult = await callAI(
        `Please provide feedback on this interview response:\n\nQuestion: ${question}\nAnswer: ${answer}\n\nProvide constructive feedback.`
      )
      if (aiResult) {
        feedback = typeof aiResult === 'string' ? aiResult : aiResult.feedback || aiResult.message
        aiUsed = true
      }
      
      console.log("✅ AI enhancement successful")
    } catch (error: any) {
      console.warn("❌ AI enhancement failed:", error)
      aiError = error.message || "AI service unavailable"
      // Continue with algorithmic feedback
    }
  }

  // 3. Make decision about follow-up vs next question  
  const decision = {
    action: "next_question",
    nextQuestionId: "next",
    feedback: feedback || "Good answer",
    confidence: 0.8,
    reason: "Interview flow"
  }

  let followUp: string | null = null
  if (decision.action === "follow_up") {
    // Generate follow-up question targeting weak areas
    const weakArea = decision.reason.includes(":") ? 
      decision.reason.split(":")[1].trim() : "understanding"
    
    followUp = `Let me ask a follow-up question about ${weakArea}. Can you elaborate on that aspect or provide a more detailed explanation?`
  }

  return {
    evaluation: {
      overall: algorithmResult.overallScore,
      breakdown: algorithmResult.breakdown
    },
    feedback,
    followUp,
    hasFollowUp: decision.action === "follow_up",
    method: aiUsed ? "hybrid" : "algorithmic",
    confidence: decision.confidence,
    debug: {
      aiUsed,
      aiError,
      decisionReason: decision.reason,
      processingTime: Date.now() - startTime
    }
  }
}

/**
 * Get next main question (not follow-up)
 */
export function getInterviewQuestion(config: InterviewConfig, usedQuestions: string[] = []) {
  const questions = selectQuestions(config)
  return questions[0] || { id: "fallback", text: "Tell me about your experience.", category: "general", role: "general", difficulty: "easy" }
}

/**
 * Debug function to check system health
 */
export function debugInterviewSystem() {
  const checks = {
    aiKeyLoaded: !!process.env.OPENROUTER_API_KEY,
    aiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + "...",
    evaluationAvailable: typeof evaluateAnswer === 'function',
    questionsAvailable: true
  }
  
  console.log("🔍 Interview System Debug:", checks)
  return checks
}