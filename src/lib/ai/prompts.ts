/**
 * AI Prompts - Conversational Flow Generation
 * AI handles conversation, not evaluation scoring
 */

export interface InterviewConfig {
  role: string
  type: string
  difficulty: string
}

export interface ResponseData {
  question: string
  answer: string
  evaluationResult: {
    overallScore: number
    breakdown: {
      technical: number
      clarity: number
      confidence: number
      relevance: number
      structure: number
    }
    feedback: string
  }
  sessionHistory: Array<{ role: "user" | "assistant"; content: string }>
  config: InterviewConfig
  questionIndex: number
}

/**
 * Build prompt for session start (greeting + first question)
 */
export function buildStartPrompt(config: InterviewConfig, userName?: string): string {
  const namePrefix = userName ? `Hello ${userName}! ` : "Hello! "
  
  return `You are Zen AI, the InterviewAce interview assistant. You conduct professional ${config.type} interviews for ${config.role} positions at ${config.difficulty} difficulty level.

TASK: Generate a personalized greeting and first interview question.

CRITICAL JSON FORMAT REQUIREMENTS:
- Your response MUST be ONLY valid JSON
- NO markdown formatting, NO backticks, NO extra text
- ONLY the JSON object with greeting and question
- Start greeting with exactly: "${namePrefix}"

INSTRUCTIONS:
- Create a warm, professional greeting that sets the candidate at ease
- Ask an appropriate first question for this role and interview type
- Match the difficulty level appropriately
- Respond ONLY in valid JSON format

REQUIRED JSON RESPONSE (NO OTHER TEXT):
{
  "greeting": "${namePrefix}I'm Zen AI, your InterviewAce assistant. Welcome to your ${config.type} interview for the ${config.role} position. Let's begin!",
  "question": "Your first interview question here"
}

Role: ${config.role}
Interview Type: ${config.type}  
Difficulty: ${config.difficulty}

Respond with ONLY the JSON object:`
}

/**
 * Build prompt for follow-up response (feedback + next question)
 */
export function buildResponsePrompt(data: ResponseData): string {
  const historyText = data.sessionHistory
    .slice(-4)
    .map(h => (h.role === "assistant" ? "Interviewer: " : "Candidate: ") + h.content)
    .join("\n")

  return `You are Zen AI conducting a ${data.config.type} interview.

CRITICAL: Respond ONLY with valid JSON - NO OTHER TEXT

Context:
${historyText || "First question"}

Question: ${data.question}
Answer: ${data.answer}

Evaluation Score: ${data.evaluationResult.overallScore}/100

Provide brief feedback and next question:

{
  "feedback": "Brief encouraging feedback here",
  "nextQuestion": "Next question or null to end",
  "endInterview": ${data.questionIndex >= 5 ? 'true' : 'false'}
}`
}

/**
 * Validate AI response structure
 */
export function validateStartResponse(response: any): response is { greeting: string; question: string } {
  return (
    typeof response === "object" &&
    typeof response.greeting === "string" &&
    typeof response.question === "string" &&
    response.greeting.length > 10 &&
    response.question.length > 10
  )
}

/**
 * Validate AI response structure
 */
export function validateResponsePrompt(response: any): response is { 
  feedback: string; 
  nextQuestion: string | null; 
  endInterview: boolean 
} {
  return (
    typeof response === "object" &&
    typeof response.feedback === "string" &&
    (response.nextQuestion === null || typeof response.nextQuestion === "string") &&
    typeof response.endInterview === "boolean" &&
    response.feedback.length > 10
  )
}