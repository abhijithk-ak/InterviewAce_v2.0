/**
 * Interview Fallback System
 * Provides reliable backup when AI services are unavailable
 */

import { getNextQuestion, getGreeting, type QuestionResponse } from "@/lib/questions"

export interface FallbackConfig {
  role: string
  type: string
  difficulty: string
}

/**
 * Generate fallback greeting when AI is unavailable
 */
export function getFallbackGreeting(config: FallbackConfig): string {
  const baseGreetings = {
    technical: [
      `Welcome to InterviewAce! I'll be conducting your ${config.difficulty} technical interview for the ${config.role} position. Let's begin with some questions to assess your technical skills.`,
      `Hello! Ready for your technical interview? We'll be covering ${config.difficulty} level questions focused on ${config.role} development.`,
      `Hi there! Let's start your technical assessment. I'll ask you some ${config.difficulty} questions relevant to ${config.role} work.`
    ],
    behavioral: [
      `Welcome to InterviewAce! Today we'll discuss your experience and working style through some behavioral questions.`,
      `Hello! I'm excited to learn about your professional experiences and how you approach challenges in your work.`,
      `Hi! Let's talk about your background and how you handle various workplace situations.`
    ],
    "system-design": [
      `Welcome! Today we'll explore your system design thinking and architecture skills.`,
      `Hello! Ready to dive into some system design challenges? We'll discuss scalability and architecture decisions.`,
      `Hi there! Let's work through some system design problems together.`
    ]
  }

  const categoryGreetings = baseGreetings[config.type as keyof typeof baseGreetings] || baseGreetings.technical
  return categoryGreetings[Math.floor(Math.random() * categoryGreetings.length)]
}

/**
 * Generate fallback next question
 */
export function getFallbackNextQuestion(
  config: FallbackConfig, 
  usedQuestions: string[] = [],
  questionIndex: number = 0
): QuestionResponse {
  
  // For fallback, use the question bank
  return getNextQuestion({
    role: config.role,
    type: config.type,
    difficulty: config.difficulty,
    usedQuestions
  })
}

/**
 * Generate fallback feedback based on evaluation scores
 */
export function getFallbackFeedback(evaluationResult: {
  overallScore: number
  breakdown: {
    technical: number
    clarity: number
    confidence: number
    relevance: number
    structure: number
  }
  strengths: string[]
  improvements: string[]
}): string {
  
  const { overallScore, strengths, improvements } = evaluationResult
  
  let feedback = ""
  
  // Start with overall assessment
  if (overallScore >= 80) {
    feedback = "Excellent response! "
  } else if (overallScore >= 70) {
    feedback = "Good answer! "
  } else if (overallScore >= 60) {
    feedback = "Decent response. "
  } else {
    feedback = "Thanks for your answer. "
  }
  
  // Add top strength if available
  if (strengths.length > 0) {
    feedback += `${strengths[0]} `
  }
  
  // Add improvement area if needed
  if (improvements.length > 0 && overallScore < 75) {
    feedback += `For improvement, consider: ${improvements[0].toLowerCase()}`
  }
  
  // Add encouragement
  if (overallScore < 70) {
    feedback += " Let's continue to explore this topic further."
  } else {
    feedback += " Let's move on to the next question."
  }
  
  return feedback
}

/**
 * Determine if interview should end (fallback logic)
 */
export function shouldEndInterview(
  questionIndex: number,
  maxQuestions: number = 6,
  averageScore?: number
): boolean {
  
  // End after max questions
  if (questionIndex >= maxQuestions - 1) {
    return true
  }
  
  // End early if performance is consistently very low
  if (averageScore && averageScore < 40 && questionIndex >= 3) {
    return true
  }
  
  // End early if performance is consistently excellent
  if (averageScore && averageScore >= 90 && questionIndex >= 4) {
    return true
  }
  
  return false
}

/**
 * Generate fallback interview summary
 */
export function getFallbackSummary(scores: number[]): string {
  const average = scores.reduce((a, b) => a + b, 0) / scores.length
  const total = scores.length
  
  let summary = `Thank you for completing the interview! You answered ${total} questions with an average score of ${Math.round(average)}/100. `
  
  if (average >= 80) {
    summary += "Excellent performance! You demonstrated strong knowledge and communication skills."
  } else if (average >= 70) {
    summary += "Good work! You showed solid understanding with room for some improvement."
  } else if (average >= 60) {
    summary += "Decent effort. Focus on strengthening your technical knowledge and communication clarity."
  } else {
    summary += "Keep practicing! Consider reviewing fundamental concepts and practicing your explanation skills."
  }
  
  return summary
}