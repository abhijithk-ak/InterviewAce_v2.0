/**
 * Interview Respond Logic - Hybrid AI + Deterministic Scoring
 * Always runs deterministic evaluation, AI enhances conversation flow
 * Optionally adds semantic similarity scoring with MiniLM
 */

import { evaluateAnswerSync } from "@/lib/evaluation"
import { callAI } from "@/lib/ai/client"
import { buildResponsePrompt, validateResponsePrompt, type UserProfile } from "@/lib/ai/prompts"
import { getNextQuestion } from "@/lib/questions"
import { getHybridScore } from "@/lib/ml/semantic"

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
  /** Scoring mode: deterministic (default) or hybrid (adds semantic similarity) */
  scoringMode?: "deterministic" | "hybrid"
  /** AI model from user settings */
  aiModel?: string
  /** AI temperature from user settings */
  aiTemperature?: number
  /** Total questions from user settings (default 5) */
  interviewLength?: number
  /** User profile data for personalized feedback */
  userProfile?: UserProfile
}

export interface RespondResult {
  /** finalScore — the official interview score used for display and storage */
  score: number
  /** deterministicScore — rule-based NLP score (0-100); same as finalScore when semantic is disabled */
  deterministicScore: number
  /** semanticScore — always 0 (semantic evaluation removed) */
  semanticScore: number
  /** finalScore mirrored at top-level for explicit access */
  finalScore: number
  breakdown: {
    technical: number
    clarity: number
    confidence: number
    relevance: number
    structure: number
  }
  /** Per-dimension subscores (0-10) from the deterministic pass */
  subscores: {
    relevance: number
    clarity: number
    technical: number
    confidence: number
    structure: number
    semantic?: number
  }
  strengths: string[]
  improvements: string[]
  feedback: string
  /** Experiment metrics for research logging */
  metrics: {
    deterministicScore: number
    semanticScore: number
    finalScore: number
    answerLength: number
    responseTime: number
    timestamp: string
  }
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

  // 1. ALWAYS run deterministic evaluation first (no ML/semantic scoring)
  console.log("📊 Running deterministic evaluation (pure NLP)...")

  const evaluationResult = evaluateAnswerSync(params.question, params.answer, {
    role: params.config.role,
    type: params.config.type,
    difficulty: params.config.difficulty
  })

  // 2. Optional: Add semantic similarity scoring if hybrid mode enabled
  let semanticScore = 0
  let finalScore = evaluationResult.overallScore
  const deterministicScore = evaluationResult.overallScore

  if (params.scoringMode === "hybrid") {
    console.log("🧠 Running hybrid evaluation (deterministic + semantic)...")
    try {
      const hybridResult = await getHybridScore(
        deterministicScore,
        params.question,
        params.answer
      )
      finalScore = hybridResult.finalScore
      semanticScore = hybridResult.semanticScore
      console.log(`✅ Hybrid score: ${finalScore} (det: ${deterministicScore}, sem: ${semanticScore})`)
    } catch (error) {
      console.warn("⚠️ Semantic scoring failed, falling back to deterministic:", error)
      // Graceful degradation: keep deterministic score
      semanticScore = 0
      finalScore = deterministicScore
    }
  }

  // Adapter: convert EvaluationResult to expected format
  const adaptedResult = {
    finalScore,
    deterministicScore,
    semanticScore,
    subscores: evaluationResult.breakdown,
    details: {
      strengths: evaluationResult.strengths,
      improvements: evaluationResult.improvements,
      feedback: evaluationResult.feedback
    }
  }

  // Format for buildResponsePrompt
  const evaluationForPrompt = {
    overallScore: adaptedResult.finalScore,
    breakdown: adaptedResult.subscores,
    feedback: adaptedResult.details.feedback,
  }

  let feedback = adaptedResult.details.feedback
  let nextQuestion: string | null = null
  let done = false
  let source: "ai" | "fallback" = "fallback"

  // 3. Try AI for conversational flow enhancement
  if (process.env.OPENROUTER_API_KEY) {
    debug.aiAttempted = true
    
    try {
      console.log("🤖 Attempting AI conversation flow...")
      console.log(`📋 Using model: ${params.aiModel || 'default'}, temperature: ${params.aiTemperature || 0.4}`)
      
      const prompt = buildResponsePrompt({
        question: params.question,
        answer: params.answer,
        evaluationResult: evaluationForPrompt,
        sessionHistory: params.sessionHistory,
        config: params.config,
        questionIndex: params.questionIndex,
        interviewLength: params.interviewLength,
        userProfile: params.userProfile
      })
      
      const aiResponse = await callAI(prompt, {
        model: params.aiModel,
        temperature: params.aiTemperature
      })
      
      if (aiResponse && validateResponsePrompt(aiResponse)) {
        console.log("✅ AI conversation flow successful")
        
        feedback = aiResponse.feedback
        nextQuestion = aiResponse.nextQuestion
        done = aiResponse.endInterview || (params.interviewLength ? params.questionIndex >= params.interviewLength : params.questionIndex >= 5)
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

  // 4. Fallback logic if AI failed or unavailable
  if (source === "fallback") {
    console.log("🔄 Using fallback conversation logic")
    
    // Determine if we should continue (use user's interviewLength or default 5)
    done = params.interviewLength ? params.questionIndex >= params.interviewLength : params.questionIndex >= 5
    
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
  const responseTime = debug.evaluationTime
  const answerLength = params.answer.length
  const timestamp = new Date(startTime).toISOString()

  return {
    score: adaptedResult.finalScore,
    deterministicScore: adaptedResult.deterministicScore,
    semanticScore: adaptedResult.semanticScore,
    finalScore: adaptedResult.finalScore,
    breakdown: adaptedResult.subscores,
    subscores: adaptedResult.subscores,
    strengths: adaptedResult.details.strengths,
    improvements: adaptedResult.details.improvements,
    feedback,
    metrics: {
      deterministicScore: adaptedResult.deterministicScore,
      semanticScore: adaptedResult.semanticScore,
      finalScore: adaptedResult.finalScore,
      answerLength,
      responseTime,
      timestamp,
    },
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