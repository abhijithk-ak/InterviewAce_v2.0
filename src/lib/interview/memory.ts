/**
 * Interview Memory - Conversation Context Builder
 * Creates intelligent context for AI evaluation
 */

export interface MemoryContext {
  question: string
  answer: string
  history: Array<{ role: "user" | "assistant"; content: string }>
  algorithmResult: {
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
  config: {
    role: string
    type: string
    difficulty: string
  }
}

export function buildInterviewContext({
  question,
  answer,
  history,
  algorithmResult,
  config
}: MemoryContext): string {
  
  // Build conversation history (last 4 exchanges to avoid token limits)
  const recentHistory = history.slice(-8) // Last 4 Q&A pairs
  const previousTurns = recentHistory
    .map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`)
    .join("\n")

  // Create contextual prompt
  const context = `You are conducting a professional mock interview. Be constructive, specific, and encouraging.

INTERVIEW CONTEXT:
Role: ${config.role}
Interview Type: ${config.type}
Difficulty Level: ${config.difficulty}

CONVERSATION HISTORY:
${previousTurns || "No previous conversation"}

CURRENT EXCHANGE:
Interviewer: ${question}
Candidate: ${answer}

ALGORITHMIC ANALYSIS:
Overall Score: ${algorithmResult.overallScore}/100
- Technical Depth: ${algorithmResult.breakdown.technical}/10
- Clarity: ${algorithmResult.breakdown.clarity}/10  
- Confidence: ${algorithmResult.breakdown.confidence}/10
- Relevance: ${algorithmResult.breakdown.relevance}/10

Algorithmic Feedback: ${algorithmResult.feedback}

INSTRUCTIONS:
1. Provide constructive feedback highlighting strengths and specific improvement areas
2. If the answer lacks depth (score < 70), ask a relevant follow-up question
3. If the answer is sufficient (score ≥ 70), indicate readiness to move on
4. Keep feedback professional, encouraging, and actionable
5. Tailor follow-ups to the specific weak points identified

Respond in this EXACT JSON format:
{
  "feedback": "Professional feedback incorporating algorithmic insights with specific suggestions",
  "followUp": "Relevant follow-up question or null if answer is sufficient"
}`

  return context
}

/**
 * Build memory for session summary
 */
export function buildSessionSummary(history: Array<{ role: string; content: string }>, scores: number[]) {
  const totalExchanges = Math.floor(history.length / 2)
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
  
  return {
    totalExchanges,
    averageScore: Math.round(averageScore),
    progression: scores,
    conversationLength: history.length
  }
}