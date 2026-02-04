"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui"

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

type Question = {
  id: string
  text: string
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
    difficulty: string
  }
}

const FALLBACK_QUESTIONS: Question[] = [
  { id: "1", text: "Hello! I'll be conducting your interview today. Let's begin. Can you briefly introduce yourself and tell me about your background?" },
  { id: "2", text: "That's great! Can you tell me more about a challenging project you worked on?" },
  { id: "3", text: "Interesting! What technical skills do you consider your strongest?" },
  { id: "4", text: "Thank you for sharing. How do you approach problem-solving in your work?" },
  { id: "5", text: "I see. Can you describe a time when you had to work with a difficult team member?" },
  { id: "6", text: "Good answer. What are your career goals for the next few years?" },
]

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
  const bottomRef = useRef<HTMLDivElement>(null)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

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
        const config = configStr ? JSON.parse(configStr) : { role: "Software Engineer", difficulty: "Medium" }
        
        // Use fallback questions for Phase 3.3
        const questions = FALLBACK_QUESTIONS
        
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
        // Fallback on error
        const questions = FALLBACK_QUESTIONS
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
        })
      }
    }

    startInterview()
  }, [])

  const handleUserAnswer = async (text: string) => {
    if (!text.trim() || state.status !== "active") return

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

    // Call AI to evaluate answer and potentially generate follow-up
    try {
      const response = await fetch("/api/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.text,
          answer: text,
          role: state.interviewConfig?.role || "Software Engineer",
          difficulty: state.interviewConfig?.difficulty || "Medium",
          followUpUsed: currentProgress?.followUpUsed || false,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store evaluation
        const updatedProgress = new Map(state.questionProgress)
        const progress = updatedProgress.get(currentQuestion.id)
        if (progress) {
          progress.evaluation = data.evaluation
          if (data.hasFollowUp) {
            progress.followUpUsed = true
          }
        }

        // Add AI response
        setTimeout(() => {
          setState((prev) => {
            if (data.hasFollowUp && data.followUp) {
              // Add follow-up question
              return {
                ...prev,
                messages: [
                  ...prev.messages,
                  {
                    id: crypto.randomUUID(),
                    role: "assistant" as const,
                    content: data.followUp,
                    kind: "followup",
                    meta: { type: "follow-up", questionId: currentQuestion.id },
                  },
                ],
                questionProgress: updatedProgress,
              }
            } else {
              // Move to next question
              const nextIndex = prev.currentQuestionIndex + 1
              const nextQuestion = prev.questions[nextIndex]

              return {
                status: nextQuestion ? "active" : "ended",
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

            return {
              status: nextQuestion ? "active" : "ended",
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

          return {
            status: nextQuestion ? "active" : "ended",
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-lg font-medium text-neutral-900 mb-2">
            Preparing interview...
          </div>
          <div className="text-sm text-neutral-600">
            The interviewer will be with you shortly
          </div>
        </div>
      </div>
    )
  }

  if (state.status === "ended") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="text-2xl font-bold text-neutral-900 mb-4">
            Interview Complete! 🎉
          </div>
          <p className="text-neutral-600 mb-6">
            Thank you for completing the interview. You answered {state.currentQuestionIndex} questions.
          </p>
          <Button variant="primary" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Check if last AI message was a follow-up
  const lastAIMessage = [...state.messages].reverse().find(m => m.role === "assistant")
  const isInFollowUp = lastAIMessage?.kind === "followup"

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Live Interview</h1>
            <p className="text-sm text-neutral-600">
              Question {state.currentQuestionIndex + 1} of {state.questions.length}
              {isInFollowUp && <span className="text-blue-600 ml-1">(Follow-up)</span>}
            </p>
          </div>
          <Button variant="outline" onClick={endInterview}>
            End Interview
          </Button>
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
                  <div className="flex-shrink-0 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">AI</span>
                  </div>
                )}
                <div>
                  {message.kind === "followup" && (
                    <span className="text-xs text-neutral-500 mb-1 block px-1">
                      Follow-up Question
                    </span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-neutral-900 border border-neutral-200 rounded-tl-md"
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
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100 rounded-2xl rounded-tl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-xs text-neutral-500">Interviewer is thinking</span>
              </div>
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 bg-white px-6 py-4 shadow-lg">
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
            className="flex-1 px-5 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            variant="primary"
            className="px-8"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
