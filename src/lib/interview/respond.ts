/**
 * Interview Respond Logic - AI + MiniLM Hybrid Evaluation
 */

import { evaluateAnswer } from "@/lib/evaluation"
import { callAI } from "@/lib/ai/client"
import { buildResponsePrompt, validateResponsePrompt, type UserProfile } from "@/lib/ai/prompts"
import { getNextQuestion, getReferenceAnswer } from "@/lib/questions"

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
  aiModel?: string
  aiTemperature?: number
  interviewLength?: number
  userProfile?: UserProfile
}

export interface RespondResult {
  score: number
  overallScore: number
  finalScore: number
  breakdown: {
    conceptScore: number
    semanticScore: number
    clarityScore: number
  }
  explanation: string
  errors: string[]
  evaluationMethod: "AI + MiniLM Hybrid"
  feedback: string
  strengths: string[]
  improvements: string[]
  metrics: {
    overallScore: number
    conceptScore: number
    semanticScore: number
    clarityScore: number
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
    referenceAnswerFound: boolean
  }
}

export async function handleAnswer(params: RespondParams): Promise<RespondResult> {
  const startTime = Date.now()

  const debug = {
    aiAttempted: false,
    aiSuccess: false,
    aiError: undefined as string | undefined,
    evaluationTime: 0,
    referenceAnswerFound: false,
  }

  const referenceAnswer = getReferenceAnswer(params.question)
  debug.referenceAnswerFound = Boolean(referenceAnswer)

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

  const evaluationForPrompt = {
    overallScore: evaluationResult.overallScore,
    breakdown: evaluationResult.breakdown,
    feedback: evaluationResult.explanation,
    explanation: evaluationResult.explanation,
    errors: evaluationResult.errors,
    evaluationMethod: evaluationResult.evaluationMethod,
  }

  let feedback = evaluationResult.explanation
  let nextQuestion: string | null = null
  let done = false
  let source: "ai" | "fallback" = "fallback"

  if (process.env.OPENROUTER_API_KEY) {
    debug.aiAttempted = true

    try {
      const prompt = buildResponsePrompt({
        question: params.question,
        answer: params.answer,
        evaluationResult: evaluationForPrompt,
        sessionHistory: params.sessionHistory,
        config: params.config,
        questionIndex: params.questionIndex,
        interviewLength: params.interviewLength,
        userProfile: params.userProfile,
      })

      const aiResponse = await callAI(prompt, {
        model: params.aiModel,
        temperature: params.aiTemperature,
      })

      if (aiResponse && validateResponsePrompt(aiResponse)) {
        feedback = aiResponse.feedback
        nextQuestion = aiResponse.nextQuestion
        done = aiResponse.endInterview || (params.interviewLength ? params.questionIndex >= params.interviewLength : params.questionIndex >= 5)
        source = "ai"
        debug.aiSuccess = true
      } else {
        debug.aiError = "Invalid AI response format"
      }
    } catch (error) {
      debug.aiError = error instanceof Error ? error.message : "Unknown AI error"
    }
  }

  if (source === "fallback") {
    done = params.interviewLength ? params.questionIndex >= params.interviewLength : params.questionIndex >= 5

    if (!done) {
      const questionResponse = getNextQuestion({
        role: params.config.role,
        type: params.config.type,
        difficulty: params.config.difficulty,
        usedQuestions: params.usedQuestions || [],
      })
      nextQuestion = questionResponse.text
    }
  }

  debug.evaluationTime = Date.now() - startTime

  return {
    score: evaluationResult.overallScore,
    overallScore: evaluationResult.overallScore,
    finalScore: evaluationResult.overallScore,
    breakdown: evaluationResult.breakdown,
    explanation: evaluationResult.explanation,
    errors: evaluationResult.errors,
    evaluationMethod: evaluationResult.evaluationMethod,
    feedback,
    strengths: evaluationResult.errors.length === 0 ? ["Conceptually aligned with reference answer"] : [],
    improvements: evaluationResult.errors,
    metrics: {
      overallScore: evaluationResult.overallScore,
      conceptScore: evaluationResult.breakdown.conceptScore,
      semanticScore: evaluationResult.breakdown.semanticScore,
      clarityScore: evaluationResult.breakdown.clarityScore,
      answerLength: params.answer.length,
      responseTime: debug.evaluationTime,
      timestamp: new Date(startTime).toISOString(),
    },
    nextQuestion: done ? null : nextQuestion,
    done,
    source,
    ...(process.env.NODE_ENV === "development" && { debug }),
  }
}

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