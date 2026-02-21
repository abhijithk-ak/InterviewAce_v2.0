/**
 * Interview State Machine - Voice/Video Ready
 * Manages session states and transitions for future voice integration
 */

export type InterviewState = "idle" | "speaking" | "listening" | "evaluating" | "finished"

export type InterviewEvent = 
  | "session_started"
  | "tts_finished" 
  | "answer_submitted"
  | "evaluation_complete"
  | "interview_ended"

export interface StateContext {
  questionIndex: number
  totalQuestions: number
  currentQuestion?: string
  lastAnswer?: string
  sessionId?: string
}

/**
 * State transition reducer
 * Controls valid state changes and prevents invalid transitions
 */
export function transition(
  currentState: InterviewState,
  event: InterviewEvent,
  context: StateContext
): InterviewState {
  
  switch (currentState) {
    case "idle":
      if (event === "session_started") return "speaking"
      break
      
    case "speaking":
      if (event === "tts_finished") return "listening"
      break
      
    case "listening": 
      if (event === "answer_submitted") return "evaluating"
      break
      
    case "evaluating":
      if (event === "evaluation_complete") {
        // Check if interview should end
        if (context.questionIndex >= context.totalQuestions) {
          return "finished"
        }
        return "speaking" // Next question
      }
      if (event === "interview_ended") {
        return "finished"
      }
      break
      
    case "finished":
      // Terminal state - no transitions allowed
      break
  }
  
  // Invalid transition - log warning but don't crash
  console.warn(`Invalid transition: ${currentState} + ${event}`)
  return currentState
}

/**
 * Check if user input should be disabled
 */
export function isInputDisabled(state: InterviewState): boolean {
  return state === "speaking" || state === "evaluating" || state === "finished"
}

/**
 * Check if TTS should be active
 */
export function shouldSpeak(state: InterviewState): boolean {
  return state === "speaking"
}

/**
 * Get user-facing state message
 */
export function getStateMessage(state: InterviewState): string {
  switch (state) {
    case "idle": return "Preparing interview..."
    case "speaking": return "🔊 Listen to the question"
    case "listening": return "🎤 Your turn to respond"
    case "evaluating": return "⏳ Analyzing your answer..."
    case "finished": return "✅ Interview complete"
    default: return "Unknown state"
  }
}

/**
 * Initialize state context
 */
export function createStateContext(totalQuestions = 6): StateContext {
  return {
    questionIndex: 0,
    totalQuestions,
    sessionId: `session_${Date.now()}`
  }
}