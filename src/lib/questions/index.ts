/**
 * Questions Module - Interview Question Management
 * Handles question selection, progression, and greetings
 */

export { QUESTION_BANK, MAX_QUESTIONS, type Question } from "./bank"

export interface QuestionRequest {
  role: string
  type: string
  difficulty: string
  usedQuestions?: string[]
}

export interface QuestionResponse {
  id: string
  text: string
  isGreeting?: boolean
  metadata: {
    category: string
    role: string
    difficulty: string
  }
}

/**
 * Get next question from the bank (deterministic, no AI)
 * Used for initial questions and follow-up questions
 */
export function getNextQuestion(request: QuestionRequest): QuestionResponse {
  const { QUESTION_BANK } = require("./bank")
  
  // Filter questions based on criteria
  let candidates = QUESTION_BANK.filter((q: any) => {
    const roleMatch = q.role === request.role || q.role === "general" || request.role === "general"
    const typeMatch = q.category === request.type || request.type === "general"
    const difficultyMatch = q.difficulty === request.difficulty
    
    // Avoid already used questions
    const notUsed = !request.usedQuestions?.includes(q.id)
    
    return roleMatch && typeMatch && difficultyMatch && notUsed
  })
  
  // Fallback: if no exact matches, relax criteria
  if (candidates.length === 0) {
    candidates = QUESTION_BANK.filter((q: any) => {
      const notUsed = !request.usedQuestions?.includes(q.id)
      const difficultyMatch = q.difficulty === request.difficulty
      return notUsed && difficultyMatch
    })
  }
  
  // Final fallback: any unused question
  if (candidates.length === 0) {
    candidates = QUESTION_BANK.filter((q: any) => {
      return !request.usedQuestions?.includes(q.id)
    })
  }
  
  // Select random question from candidates
  const selected = candidates[Math.floor(Math.random() * candidates.length)]
  
  if (!selected) {
    // Emergency fallback
    return {
      id: "fallback-1",
      text: "Tell me about yourself and your experience with software development.",
      metadata: {
        category: "behavioral",
        role: "general", 
        difficulty: "easy"
      }
    }
  }
  
  return {
    id: selected.id,
    text: selected.text,
    metadata: {
      category: selected.category,
      role: selected.role,
      difficulty: selected.difficulty
    }
  }
}

/**
 * Generate greeting message for interview start
 */
export function getGreeting(config: { role: string; type: string; difficulty: string }, userName?: string): QuestionResponse {
  const namePrefix = userName ? `Hello ${userName}! ` : "Hello! "
  const greetings = {
    "technical": [
      `${namePrefix}I'm Zen AI, your InterviewAce assistant. Welcome to your ${config.difficulty} technical interview for a ${config.role} position. I'll be asking you questions to evaluate your technical knowledge and problem-solving skills.`,
      `${namePrefix.replace('Hello', 'Hi')} I'm Zen AI from InterviewAce. Ready for your ${config.role} technical interview? We'll cover ${config.difficulty} level questions to assess your technical expertise.`,
      `${namePrefix.replace('Hello', 'Welcome')}I'm Zen AI, and let's begin your technical interview. I'll be evaluating your ${config.role} skills with some ${config.difficulty} questions.`
    ],
    "behavioral": [
      `${namePrefix}I'm Zen AI, your InterviewAce assistant. Welcome to your behavioral interview for a ${config.role} position. I'll be asking questions about your experience, teamwork, and problem-solving approach.`,
      `${namePrefix.replace('Hello', 'Hi')} I'm Zen AI from InterviewAce. Ready to discuss your experience and working style? This behavioral interview will help us understand how you approach challenges.`,
      `${namePrefix.replace('Hello', 'Welcome')}I'm Zen AI, and let's talk about your professional experience and how you handle various workplace situations.`
    ],
    "system-design": [
      `${namePrefix}I'm Zen AI, your InterviewAce assistant. Welcome to your system design interview. We'll discuss how you approach designing scalable systems and architecture decisions.`,
      `${namePrefix.replace('Hello', 'Hi')} I'm Zen AI from InterviewAce. Ready to design some systems? I'll be asking you to walk through architecture decisions and trade-offs.`,
      `${namePrefix.replace('Hello', 'Welcome')}I'm Zen AI, and let's explore your system design thinking and how you approach building large-scale applications.`
    ]
  }
  
  const categoryGreetings = greetings[config.type as keyof typeof greetings] || greetings.technical
  const greeting = categoryGreetings[Math.floor(Math.random() * categoryGreetings.length)]
  
  return {
    id: "greeting",
    text: greeting + " Let's start with our first question.",
    isGreeting: true,
    metadata: {
      category: config.type,
      role: config.role,
      difficulty: config.difficulty
    }
  }
}

/**
 * Check if this is the first interaction (should show greeting)
 */
export function shouldShowGreeting(history: Array<{ role: string; content: string }>): boolean {
  return history.length === 0
}