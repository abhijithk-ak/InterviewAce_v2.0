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
    type?: "question" | "follow-up"
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

      // Build questions array - ONLY main questions from state.questions array
      // Match them with user answers from messages
      const questionsWithAnswers = state.questions.map((question) => {
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
            questions: questionsWithAnswers,
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

  // AI starts the interview - load questions and push first one
  useEffect(() => {
    async function startInterview() {
      try {
        await fetch("/api/interview/start", { method: "POST" })
        
        // Load interview config from sessionStorage
        const configStr = sessionStorage.getItem("interviewConfig")
        const config = configStr 
          ? JSON.parse(configStr) 
          : { role: "Software Engineer", type: "Technical", difficulty: "Medium" }
        
        // Select exactly MAX_QUESTIONS questions from the bank
        const questions = selectQuestions(config)
        
        // Initialize progress tracking
        const progressMap = new Map<string, QuestionProgress>()
        questions.forEach(q => {
          progressMap.set(q.id, {
            questionId: q.id,
            followUpUsed: false,
          })
        })
        
        setState({
          status: "active",
          currentQuestionIndex: 0,
          questions,
          messages: [
            { 
              id: crypto.randomUUID(), 
              role: "assistant", 
              content: questions[0].text,
              kind: "main",
              meta: { type: "question", questionId: questions[0].id }
            }
          ],
          questionProgress: progressMap,
          interviewConfig: config,
        })
      } catch {
        // Fallback on error - use default config
        const defaultConfig = { role: "Software Engineer", type: "Technical", difficulty: "Medium" }
        const questions = selectQuestions(defaultConfig)
        const progressMap = new Map<string, QuestionProgress>()
        questions.forEach(q => {
          progressMap.set(q.id, {
            questionId: q.id,
            followUpUsed: false,
          })
        })
        
        setState({
          status: "active",
          currentQuestionIndex: 0,
          questions,
          messages: [
            { 
              id: crypto.randomUUID(), 
              role: "assistant", 
              content: questions[0].text,
              kind: "main",
              meta: { type: "question", questionId: questions[0].id }
            }
          ],
          questionProgress: progressMap,
          interviewConfig: defaultConfig,
        })
      }
    }

    startInterview()
  }, [])

  const handleUserAnswer = async (text: string) => {
    if (!text.trim() || state.status !== "active") return

    // Enforce MAX_QUESTIONS limit
    if (state.currentQuestionIndex >= MAX_QUESTIONS) {
      setState((prev) => ({ ...prev, status: "ended" }))
      return
    }

    const currentQuestion = state.questions[state.currentQuestionIndex]
    const currentProgress = state.questionProgress.get(currentQuestion.id)

    // Add user message first
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { id: crypto.randomUUID(), role: "user" as const, content: text },
      ],
    }))

    setInput("")
    setIsAiThinking(true)

    // Call evaluation API (Algorithmic evaluation - no AI required)
    try {
      const response = await fetch("/api/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.text,
          answer: text,
          role: state.interviewConfig?.role || "general",
          type: state.interviewConfig?.type || "technical",
          difficulty: state.interviewConfig?.difficulty || "medium",
          followUpUsed: true, // Always true to prevent follow-ups
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store evaluation
        const updatedProgress = new Map(state.questionProgress)
        const progress = updatedProgress.get(currentQuestion.id)
        if (progress) {
          progress.evaluation = data.evaluation
        }

        // Always move to next question (NO follow-ups)
        setTimeout(() => {
          setState((prev) => {
            const nextIndex = prev.currentQuestionIndex + 1
            const nextQuestion = prev.questions[nextIndex]

            // Check if we've reached the end
            const shouldEnd = nextIndex >= MAX_QUESTIONS || !nextQuestion

            return {
              status: shouldEnd ? "ended" : "active",
              currentQuestionIndex: nextIndex,
              questions: prev.questions,
              messages: nextQuestion
                ? [
                    ...prev.messages,
                    {
                      id: crypto.randomUUID(),
                      role: "assistant" as const,
                      content: nextQuestion.text,
                      kind: "main",
                      meta: { type: "question", questionId: nextQuestion.id },
                    },
                  ]
                : prev.messages,
              questionProgress: updatedProgress,
              interviewConfig: prev.interviewConfig,
            }
          })
          setIsAiThinking(false)
        }, 800)
      } else {
        // Fallback: just move to next question
        setTimeout(() => {
          setState((prev) => {
            const nextIndex = prev.currentQuestionIndex + 1
            const nextQuestion = prev.questions[nextIndex]
            const shouldEnd = nextIndex >= MAX_QUESTIONS || !nextQuestion

            return {
              status: shouldEnd ? "ended" : "active",
              currentQuestionIndex: nextIndex,
              questions: prev.questions,
              messages: nextQuestion
                ? [...prev.messages, { id: crypto.randomUUID(), role: "assistant" as const, content: nextQuestion.text, kind: "main" }]
                : prev.messages,
              questionProgress: prev.questionProgress,
              interviewConfig: prev.interviewConfig,
            }
          })
          setIsAiThinking(false)
        }, 800)
      }
    } catch (error) {
      console.error("Error processing answer:", error)
      // Fallback: move to next question
      setTimeout(() => {
        setState((prev) => {
          const nextIndex = prev.currentQuestionIndex + 1
          const nextQuestion = prev.questions[nextIndex]
          const shouldEnd = nextIndex >= MAX_QUESTIONS || !nextQuestion

          return {
            status: shouldEnd ? "ended" : "active",
            currentQuestionIndex: nextIndex,
            questions: prev.questions,
            messages: nextQuestion
              ? [...prev.messages, { id: crypto.randomUUID(), role: "assistant" as const, content: nextQuestion.text, kind: "main" }]
              : prev.messages,
            questionProgress: prev.questionProgress,
            interviewConfig: prev.interviewConfig,
          }
        })
        setIsAiThinking(false)
      }, 800)
    }
  }

  const endInterview = () => {
    setState((prev) => ({
      ...prev,
      status: "ended",
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
          <p className="text-neutral-400 mb-6">
            Thank you for completing the interview. You answered {MAX_QUESTIONS} questions.
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
        <div className="border-b border-neutral-700 bg-neutral-800 px-6 py-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div>
              <h1 className="text-xl font-bold text-white">Live Interview</h1>
              <p className="text-sm text-neutral-400">
                Question {state.currentQuestionIndex + 1} of {MAX_QUESTIONS}
              </p>
            </div>
            <button
              onClick={endInterview}
              className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg border border-neutral-600 transition-colors"
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
                    <div className="flex-shrink-0 w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center border border-neutral-600">
                      <span className="text-xs font-semibold text-white">AI</span>
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
