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
  
  // Create context-specific instructions based on interview type
  const typeInstructions = {
    'Technical': `Ask a ${config.difficulty}-level technical question directly related to ${config.role}'s core technical skills. 
    For easy: basic concepts and fundamentals
    For medium: practical application and problem-solving
    For hard: advanced system design or optimization challenges`,
    
    'Behavioral': `Ask a ${config.difficulty}-level behavioral question using STAR method relevant to ${config.role}.
    For easy: basic teamwork or communication scenarios
    For medium: conflict resolution or leadership moments
    For hard: complex decision-making or ethical dilemmas`,
    
    'System Design': `Ask a ${config.difficulty}-level system design question relevant to ${config.role}.
    For easy: simple architecture components
    For medium: scalable system design with trade-offs
    For hard: complex distributed systems with multiple constraints`,
    
    'HR': `Ask a ${config.difficulty}-level HR/cultural fit question for ${config.role}.
    For easy: career goals and work style
    For medium: handling feedback and growth mindset
    For hard: strategic career planning and values alignment`
  }
  
  const specificInstructions = typeInstructions[config.type as keyof typeof typeInstructions] || typeInstructions['Technical']
  
  return `You are Zen AI, the InterviewAce interview assistant. You conduct professional ${config.type} interviews for ${config.role} positions at ${config.difficulty} difficulty level.

TASK: Generate a personalized greeting and FIRST interview question that DIRECTLY RELATES to the role and type specified.

INTERVIEW CONFIGURATION:
- Role: ${config.role}
- Interview Type: ${config.type}
- Difficulty Level: ${config.difficulty}

CRITICAL REQUIREMENTS:
1. The question MUST be specific to ${config.type} interview type
2. The question MUST be relevant to ${config.role} role
3. The question MUST match ${config.difficulty} difficulty level
4. ${specificInstructions}

JSON FORMAT REQUIREMENTS:
- Your response MUST be ONLY valid JSON
- NO markdown formatting, NO backticks, NO extra text
- ONLY the JSON object with greeting and question
- Start greeting with exactly: "${namePrefix}"

EXAMPLE RESPONSE FORMAT (adapt to the actual config):
{
  "greeting": "${namePrefix}I'm Zen AI, your InterviewAce assistant. Welcome to your ${config.type} interview for the ${config.role} position. Let's begin!",
  "question": "Your role-specific, type-appropriate, difficulty-matched question here"
}

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

  const typeSpecificGuidance = {
    'Technical': `Next question should probe deeper into technical understanding or move to a different technical area relevant to ${data.config.role}`,
    'Behavioral': `Next question should explore different behavioral competencies using STAR method`,
    'System Design': `Next question should either dive deeper into the current design or explore a new system design challenge`,
    'HR': `Next question should assess cultural fit, values, or career alignment from a different angle`
  }

  const guidance = typeSpecificGuidance[data.config.type as keyof typeof typeSpecificGuidance] || typeSpecificGuidance['Technical']

  return `You are Zen AI conducting a ${data.config.type} interview for ${data.config.role} at ${data.config.difficulty} difficulty.

CRITICAL: Respond ONLY with valid JSON - NO OTHER TEXT

Interview Configuration:
- Role: ${data.config.role}
- Type: ${data.config.type}
- Difficulty: ${data.config.difficulty}
- Question Number: ${data.questionIndex + 1}

Conversation History:
${historyText || "First question"}

Latest Question: ${data.question}
Candidate's Answer: ${data.answer}

Evaluation Score: ${data.evaluationResult.overallScore}/100
Breakdown:
- Technical: ${data.evaluationResult.breakdown.technical}/20
- Clarity: ${data.evaluationResult.breakdown.clarity}/20
- Confidence: ${data.evaluationResult.breakdown.confidence}/20

INSTRUCTIONS:
1. Provide brief, encouraging feedback (2-3 sentences max) acknowledging their response
2. ${guidance}
3. If this is question 6 or later, set endInterview to true and nextQuestion to null
4. Keep questions directly relevant to ${data.config.role} and ${data.config.type}

REQUIRED JSON FORMAT (NO OTHER TEXT):
{
  "feedback": "Brief encouraging feedback based on their score and answer quality",
  "nextQuestion": "${data.questionIndex >= 5 ? 'null' : 'Next contextual question here'}",
  "endInterview": ${data.questionIndex >= 5 ? 'true' : 'false'}
}

Respond with ONLY the JSON object:`
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