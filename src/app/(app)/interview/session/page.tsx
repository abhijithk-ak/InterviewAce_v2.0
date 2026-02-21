"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui"
import { selectQuestions, MAX_QUESTIONS } from "@/lib/questions/bank"
import type { Question } from "@/lib/questions/bank"

type EvaluationResult = {
  score: number
  confidence: number
  clarity: number
  technical_depth: number
  strengths: string[]
  improvements: string[]
  should_follow_up: boolean
  follow_up_focus: string | null
}

type InterviewMessage = {
  id: string
  role: "assistant" | "user"
  content: string
  kind?: "main" | "followup"
  meta?: {
    type?: "question" | "follow-up" | "greeting" | "feedback"
    questionId?: string
  }
}

type QuestionProgress = {
  questionId: string
  followUpUsed: boolean
  evaluation?: EvaluationResult
}

type InterviewState = {
  status: "idle" | "active" | "ended"
  currentQuestionIndex: number
  questions: Question[]
  messages: InterviewMessage[]
  questionProgress: Map<string, QuestionProgress>
  interviewConfig?: {
    role: string
    type: string
    difficulty: string
  }
}

export default function InterviewSession() {
  const router = useRouter()
  const [state, setState] = useState<InterviewState>({
    status: "idle",
    currentQuestionIndex: 0,
    questions: [],
    messages: [],
    questionProgress: new Map(),
  })
  const [input, setInput] = useState("")
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [startedAt] = useState(new Date().toISOString())
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasSavedRef = useRef(false)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Save interview session when it ends
  useEffect(() => {
    async function saveInterviewSession() {
      if (hasSavedRef.current) return
      hasSavedRef.current = true

      // Calculate overall score from evaluations
      const evaluations = Array.from(state.questionProgress.values())
        .filter((p) => p.evaluation)
        .map((p) => p.evaluation!)

      const overallScore =
        evaluations.length > 0
          ? Math.round(
              evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
            )
          : 0

      // Build questions array from messages (AI-first architecture)
      // Extract questions and answers from message flow
      const questionsWithAnswers: Array<{
        text: string
        answer: string
        kind: "main"
        evaluation?: {
          score: number
          confidence: number
          clarity: number
          technical_depth: number
          strengths: string[]
          improvements: string[]
        }
      }> = []

      // Find all question messages and their corresponding answers
      state.messages.forEach((message, index) => {
        if (message.role === "assistant" && message.meta?.type === "question") {
          // Find the next user message as the answer
          const nextUserMessage = state.messages
            .slice(index + 1)
            .find(m => m.role === "user")

          questionsWithAnswers.push({
            text: message.content,
            answer: nextUserMessage?.content || "",
            kind: "main",
            evaluation: undefined // Evaluations handled by API, scores calculated below
          })
        }
      })

      // Use existing overallScore calculated above

      // If we still have questions in state.questions (fallback mode), use those too
      const fallbackQuestions = state.questions.map((question) => {
        // Find all messages for this question (AI asks, user responds)
        const questionMsgIndex = state.messages.findIndex(
          (m) => m.role === "assistant" && m.meta?.questionId === question.id && m.kind === "main"
        )
        
        // Find the user's answer (next user message after the question)
        const userAnswer = questionMsgIndex >= 0
          ? state.messages.slice(questionMsgIndex + 1).find((m) => m.role === "user")
          : null

        // Get evaluation for this question
        const progress = state.questionProgress.get(question.id)

        return {
          text: question.text,
          answer: userAnswer?.content || "",
          kind: "main" as const,
          evaluation: progress?.evaluation
            ? {
                score: progress.evaluation.score,
                confidence: progress.evaluation.confidence,
                clarity: progress.evaluation.clarity,
                technical_depth: progress.evaluation.technical_depth,
                strengths: progress.evaluation.strengths,
                improvements: progress.evaluation.improvements,
              }
            : undefined,
        }
      })

      // Combine AI questions with any fallback questions
      const allQuestions = [...questionsWithAnswers, ...fallbackQuestions]

      try {
        await fetch("/api/interview/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startedAt,
            endedAt: new Date().toISOString(),
            config: {
              role: state.interviewConfig?.role || "Software Engineer",
              type: state.interviewConfig?.type || "Technical",
              difficulty: state.interviewConfig?.difficulty || "Medium",
            },
            questions: allQuestions,
            overallScore,
          }),
        })
        console.log("Interview session saved successfully")
      } catch (err) {
        console.error("Failed to save interview:", err)
      }
    }

    if (state.status === "ended") {
      saveInterviewSession()
    }
  }, [state.status, state.questions, state.messages, state.questionProgress, state.interviewConfig, startedAt])

  // Auto-scroll to latest message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [state.messages.length, isAiThinking])

  // Start interview with AI-first approach (prevent double initialization)
  useEffect(() => {
    let hasInitialized = false
    
    async function startInterview() {
      if (hasInitialized || state.status !== "idle") return
      hasInitialized = true
      try {
        // Get interview configuration
        const configStr = sessionStorage.getItem("interviewConfig")
        const config = configStr 
          ? JSON.parse(configStr) 
          : { role: "Software Engineer", type: "Technical", difficulty: "Medium" }
        
        // Call AI-first start endpoint
        const response = await fetch("/api/interview/start", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config)
        })
        
        const result = await response.json()
        
        if (result.success) {
          // Initialize with AI greeting and first question
          const greetingMessage: InterviewMessage = {
            id: crypto.randomUUID(), 
            role: "assistant", 
            content: result.greeting,
            kind: "main",
            meta: { type: "greeting" }
          }
          
          const questionMessage: InterviewMessage = {
            id: crypto.randomUUID(), 
            role: "assistant", 
            content: result.question,
            kind: "main",
            meta: { type: "question", questionId: "q1" }
          }
          
          // Create initial question progress for AI-first mode
          const initialProgress = new Map<string, QuestionProgress>()
          initialProgress.set("q1", {
            questionId: "q1",
            followUpUsed: false,
          })
          
          setState({
            status: "active",
            currentQuestionIndex: 0,
            questions: [], // AI manages questions, not pre-loaded
            messages: [greetingMessage, questionMessage],
            questionProgress: initialProgress,
            interviewConfig: config,
          })
        } else {
          throw new Error("Failed to start interview")
        }
        
      } catch (error) {
        console.error("Interview start failed:", error)
        // Fallback to original logic
        const config = { role: "Software Engineer", type: "Technical", difficulty: "Medium" }
        const questions = selectQuestions(config)
        const progressMap = new Map<string, QuestionProgress>()
        questions.forEach(q => {
          progressMap.set(q.id, {
            questionId: q.id,
            followUpUsed: false,
          })
        })
        
        const firstQuestionMessage: InterviewMessage = {
          id: crypto.randomUUID(), 
          role: "assistant", 
          content: questions[0].text,
          kind: "main",
          meta: { type: "question", questionId: questions[0].id }
        }
        
        setState({
          status: "active",
          currentQuestionIndex: 0,
          questions,
          messages: [firstQuestionMessage],
          questionProgress: progressMap,
          interviewConfig: config,
        })
      }
    }

    if (state.status === "idle") {
      startInterview()
    }
  }, [state.status])

  const handleUserAnswer = async (text: string) => {
    if (!text.trim() || state.status !== "active") return

    // Add user message
    const userMessage: InterviewMessage = { 
      id: crypto.randomUUID(), 
      role: "user", 
      content: text 
    }
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))

    setInput("")
    setIsAiThinking(true)

    // Build session history for AI context
    const sessionHistory = state.messages.map(m => ({
      role: m.role,
      content: m.content
    }))

    // Get current question (last assistant message)
    const currentQuestionMessage = state.messages
      .slice()
      .reverse()
      .find(m => m.role === "assistant" && m.meta?.type === "question")
    
    const currentQuestion = currentQuestionMessage?.content || "Please introduce yourself"

    try {
      // Call hybrid AI + deterministic response endpoint
      const response = await fetch("/api/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion,
          answer: text,
          sessionHistory,
          config: state.interviewConfig || { role: "general", type: "technical", difficulty: "medium" },
          questionIndex: state.currentQuestionIndex,
          usedQuestions: [] // Managed by AI, not tracked client-side
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add feedback message
        const feedbackMessage: InterviewMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.evaluation.feedback,
          kind: "main",
          meta: { type: "feedback" }
        }

        // Store evaluation in question progress
        const currentQuestionId = currentQuestionMessage?.meta?.questionId || `q${state.currentQuestionIndex + 1}`

        setTimeout(() => {
          if (data.done || data.nextQuestion === null) {
            // Interview is complete, update progress with evaluation
            setState((prev) => {
              const newProgress = new Map(prev.questionProgress)
              if (newProgress.has(currentQuestionId)) {
                newProgress.set(currentQuestionId, {
                  ...newProgress.get(currentQuestionId)!,
                  evaluation: {
                    score: data.evaluation.score,
                    confidence: data.evaluation.breakdown.confidence,
                    clarity: data.evaluation.breakdown.clarity,
                    technical_depth: data.evaluation.breakdown.technical,
                    strengths: [],
                    improvements: [],
                    should_follow_up: false,
                    follow_up_focus: null
                  }
                })
              }
              
              return {
                ...prev,
                status: "ended",
                messages: [...prev.messages, feedbackMessage],
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                questionProgress: newProgress
              }
            })
          } else {
            // Continue with next question, update progress with evaluation
            const nextQuestionMessage: InterviewMessage = {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data.nextQuestion,
              kind: "main",
              meta: { type: "question", questionId: `q${state.currentQuestionIndex + 2}` }
            }

            setState((prev) => {
              const newProgress = new Map(prev.questionProgress)
              if (newProgress.has(currentQuestionId)) {
                newProgress.set(currentQuestionId, {
                  ...newProgress.get(currentQuestionId)!,
                  evaluation: {
                    score: data.evaluation.score,
                    confidence: data.evaluation.breakdown.confidence,
                    clarity: data.evaluation.breakdown.clarity,
                    technical_depth: data.evaluation.breakdown.technical,
                    strengths: [],
                    improvements: [],
                    should_follow_up: false,
                    follow_up_focus: null
                  }
                })
              }
              
              // Add progress entry for next question
              const nextQuestionId = `q${prev.currentQuestionIndex + 2}`
              newProgress.set(nextQuestionId, {
                questionId: nextQuestionId,
                followUpUsed: false,
              })
              
              return {
                ...prev,
                messages: [...prev.messages, feedbackMessage, nextQuestionMessage],
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                questionProgress: newProgress
              }
            })
          }
          setIsAiThinking(false)
        }, 800)

      } else {
        throw new Error(data.error || "Failed to process response")
      }

    } catch (error) {
      console.error("Answer processing error:", error)
      
      // Fallback response
      setTimeout(() => {
        const fallbackMessage: InterviewMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Thank you for your responses. The interview has been completed.",
          kind: "main",
          meta: { type: "feedback" }
        }
        
        setState((prev) => ({
          ...prev,
          status: "ended",
          messages: [...prev.messages, fallbackMessage],
        }))
        setIsAiThinking(false)
      }, 800)
    }
  }

  const endInterview = () => {
    // Add thank you message from Zen AI
    const thankYouMessage: InterviewMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Thank you for completing this interview session! I'm Zen AI, your InterviewAce assistant, and it was great working with you. Your responses have been recorded and you can view your performance in the dashboard. Best of luck with your career journey!",
      kind: "main",
      meta: { type: "feedback" }
    }
    
    setState((prev) => ({
      ...prev,
      status: "ended",
      messages: [...prev.messages, thankYouMessage]
    }))
  }

  const handleSend = () => {
    handleUserAnswer(input)
  }

  if (!mounted) {
    return null
  }

  if (state.status === "idle") {
    return (
      <div className="min-h-screen bg-neutral-900 -m-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-white mb-2">
            Preparing interview...
          </div>
          <div className="text-sm text-neutral-400">
            The interviewer will be with you shortly
          </div>
        </div>
      </div>
    )
  }

  if (state.status === "ended") {
    return (
      <div className="min-h-screen bg-neutral-900 -m-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-2xl font-bold text-white mb-4">
            Interview Complete! 🎉
          </div>
          <p className="text-neutral-400 mb-2">
            Thank you for completing your interview session with Zen AI!
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            Your responses have been saved and you can review your performance analytics in the dashboard.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-neutral-700 bg-neutral-800 px-4 py-3">
          <div className="flex items-center justify-between max-w-full">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-white truncate">Live Interview with Zen AI</h1>
              <p className="text-xs text-neutral-400">
                Question {state.currentQuestionIndex + 1} of {MAX_QUESTIONS}
              </p>
            </div>
            <button
              onClick={endInterview}
              className="flex-shrink-0 ml-4 bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1.5 rounded-lg border border-neutral-600 transition-colors text-sm"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {state.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-start gap-3 max-w-[80%]">
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border border-blue-500">
                      <span className="text-xs font-semibold text-white">Zen</span>
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-neutral-800 text-white border border-neutral-700 rounded-tl-md"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">You</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isAiThinking && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center border border-neutral-600">
                    <span className="text-xs font-semibold text-white">AI</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-neutral-800 rounded-2xl rounded-tl-md border border-neutral-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    <span className="text-xs text-neutral-400">Interviewer is thinking</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-neutral-700 bg-neutral-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your answer..."
              className="flex-1 px-5 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
