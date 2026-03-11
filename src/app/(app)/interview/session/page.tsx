"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui"
import { selectQuestions, MAX_QUESTIONS } from "@/lib/questions/bank"
import type { Question } from "@/lib/questions/bank"
import { Mic, MicOff, Video, VideoOff, Camera, Volume2 } from "lucide-react"
import { loadSettings } from "@/lib/settings/store"

type EvaluationResult = {
  score: number
  deterministicScore?: number
  semanticScore?: number
  finalScore?: number
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
    evaluation?: {
      overallScore: number
      breakdown: {
        technical: number
        clarity: number
        confidence: number
        relevance: number
        structure: number
      }
      strengths?: string[]
      improvements?: string[]
    }
  }
}

type Metrics = {
  deterministicScore: number
  semanticScore: number
  finalScore: number
  answerLength: number
  responseTime: number
  timestamp: string
}

type QuestionProgress = {
  questionId: string
  followUpUsed: boolean
  evaluation?: EvaluationResult
  metrics?: Metrics
}

type InterviewState = {
  status: "idle" | "active" | "ended"
  currentQuestionIndex: number
  totalQuestions: number
  questions: Question[]
  messages: InterviewMessage[]
  questionProgress: Map<string, QuestionProgress>
  interviewConfig?: {
    role: string
    type: string
    difficulty: string
  }
  scoringMode?: "deterministic" | "hybrid"
}

export default function InterviewSession() {
  const router = useRouter()
  const [state, setState] = useState<InterviewState>({
    status: "idle",
    currentQuestionIndex: 0,
    totalQuestions: 5, // Default, will be updated from user settings
    questions: [],
    messages: [],
    questionProgress: new Map(),
  })
  const [input, setInput] = useState("")
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [startedAt] = useState(new Date().toISOString())
  const [showCompletionScreen, setShowCompletionScreen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasSavedRef = useRef(false)
  const hasStartedRef = useRef(false)       // guards against double-start in React Strict Mode
  const interviewEndedRef = useRef(false)   // prevents speakText calls after session ends
  const [isListening, setIsListening] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const recognitionRef = useRef<any>(null)
  const isRecognitionActiveRef = useRef(false) // tracks actual SpeechRecognition running state
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)
  const speechQueueRef = useRef<string[]>([])

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis
    }
  }, [])

  // Function to speak AI responses with queueing
  const speakText = useCallback((text: string) => {
    if (!speechSynthesisRef.current || !isVoiceEnabled || interviewEndedRef.current) return
    
    // Add to queue
    speechQueueRef.current.push(text)
    
    // Process queue if not already speaking
    if (!isSpeaking) {
      processNextSpeech()
    }
  }, [isSpeaking, isVoiceEnabled])

  // Process next item in speech queue
  const processNextSpeech = useCallback(() => {
    if (!speechSynthesisRef.current || speechQueueRef.current.length === 0) return
    
    const text = speechQueueRef.current.shift()
    if (!text) return
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Prioritise natural-sounding voices
    const voices = speechSynthesisRef.current.getVoices()
    const preferredVoice =
      voices.find(v => v.name === 'Google UK English Female') ||
      voices.find(v => v.name.includes('Google UK English Female')) ||
      voices.find(v => v.name.includes('Microsoft Zira')) ||
      voices.find(v => v.name.includes('Samantha')) ||
      voices.find(v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang.startsWith('en-'))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      // Process next item in queue after a short pause
      setTimeout(() => {
        processNextSpeech()
      }, 500)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      processNextSpeech()
    }
    
    speechSynthesisRef.current.speak(utterance)
  }, [])

  // Function to stop speaking and clear queue
  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      speechQueueRef.current = []
      setIsSpeaking(false)
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { webkitSpeechRecognition, SpeechRecognition } = window as any
      if (webkitSpeechRecognition || SpeechRecognition) {
        const SpeechRecognitionConstructor = webkitSpeechRecognition || SpeechRecognition
        recognitionRef.current = new SpeechRecognitionConstructor()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('')
          setInput(transcript)
        }
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          isRecognitionActiveRef.current = false
          setIsListening(false)
        }
        
        recognitionRef.current.onend = () => {
          isRecognitionActiveRef.current = false
          setIsListening(false)
        }
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (isRecognitionActiveRef.current) {
      try { recognitionRef.current.stop() } catch {}
      isRecognitionActiveRef.current = false
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        isRecognitionActiveRef.current = true
        setIsListening(true)
      } catch (e: any) {
        if (e?.name === 'InvalidStateError') {
          // Recognition is already running — sync state to match
          isRecognitionActiveRef.current = true
          setIsListening(true)
        } else {
          console.error('Speech recognition start error:', e)
        }
      }
    }
  }, [])

  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => !prev)
  }, [])

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => {
      const newValue = !prev
      if (!newValue) {
        stopSpeaking() // Stop any ongoing speech when disabled
      }
      return newValue
    })
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
              evaluations.reduce((sum, e) => sum + (e.finalScore ?? e.score), 0) / evaluations.length
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
          deterministicScore?: number
          semanticScore?: number
          finalScore?: number
          confidence: number
          clarity: number
          technical_depth: number
          strengths: string[]
          improvements: string[]
        }
        metrics?: {
          deterministicScore: number
          semanticScore: number
          finalScore: number
          answerLength: number
          responseTime: number
          timestamp: string
        }
      }> = []

      // Find all question messages and their corresponding answers
      state.messages.forEach((message, index) => {
        if (message.role === "assistant" && message.meta?.type === "question") {
          // Find the next user message as the answer
          const nextUserMessage = state.messages
            .slice(index + 1)
            .find(m => m.role === "user")

          // Look up evaluation from questionProgress using the questionId stored on the message
          const questionId = message.meta?.questionId
          const progress = questionId ? state.questionProgress.get(questionId) : undefined

          questionsWithAnswers.push({
            text: message.content,
            answer: nextUserMessage?.content || "",
            kind: "main",
            evaluation: progress?.evaluation
              ? {
                  score: progress.evaluation.finalScore ?? progress.evaluation.score,
                  deterministicScore: progress.evaluation.deterministicScore,
                  semanticScore: progress.evaluation.semanticScore,
                  finalScore: progress.evaluation.finalScore ?? progress.evaluation.score,
                  confidence: progress.evaluation.confidence,
                  clarity: progress.evaluation.clarity,
                  technical_depth: progress.evaluation.technical_depth,
                  strengths: progress.evaluation.strengths ?? [],
                  improvements: progress.evaluation.improvements ?? [],
                }
              : undefined,
            metrics: progress?.metrics,
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
                score: progress.evaluation.finalScore ?? progress.evaluation.score,
                deterministicScore: progress.evaluation.deterministicScore,
                semanticScore: progress.evaluation.semanticScore,
                finalScore: progress.evaluation.finalScore ?? progress.evaluation.score,
                confidence: progress.evaluation.confidence,
                clarity: progress.evaluation.clarity,
                technical_depth: progress.evaluation.technical_depth,
                strengths: progress.evaluation.strengths,
                improvements: progress.evaluation.improvements,
              }
            : undefined,
          metrics: progress?.metrics,
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

  // Stop all speech + mic when interview ends; compute final score
  useEffect(() => {
    if (state.status === 'ended') {
      interviewEndedRef.current = true

      // Compute final score from question progress
      const evaluations = Array.from(state.questionProgress.values())
        .filter(p => p.evaluation)
        .map(p => p.evaluation!)
      const computed = evaluations.length > 0
        ? Math.round(evaluations.reduce((sum, e) => sum + (e.finalScore ?? e.score), 0) / evaluations.length)
        : null
      setFinalScore(computed)
    }
  }, [state.status, state.questionProgress])

  // Start interview with AI-first approach (prevent double initialization)
  useEffect(() => {
    async function startInterview() {
      if (hasStartedRef.current || state.status !== "idle") return
      hasStartedRef.current = true
      
      setIsAiThinking(true) // Show loading state immediately
      
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
            totalQuestions: result.userSettings?.interviewLength || 5,
            questions: [], // AI manages questions, not pre-loaded
            messages: [greetingMessage, questionMessage],
            questionProgress: initialProgress,
            interviewConfig: config,
            scoringMode: result.userSettings?.scoringMode || "deterministic",
          })
          
          setIsAiThinking(false)
          
          // Speak the greeting and first question (queued automatically)
          speakText(result.greeting)
          speakText(result.question)
        } else {
          throw new Error("Failed to start interview")
        }
        
      } catch (error) {
        console.error("Interview start failed:", error)
        setIsAiThinking(false)
        
        // Fallback to original logic only on complete failure
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
          totalQuestions: 5, // Fallback default
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
  }, [state.status, speakText])

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
      // Load user settings for scoring mode
      const settings = loadSettings()
      
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
          usedQuestions: [], // Managed by AI, not tracked client-side
          scoringMode: settings.scoringMode || "deterministic"
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add feedback message with score breakdown
        const feedbackMessage: InterviewMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.evaluation.feedback,
          kind: "main",
          meta: { 
            type: "feedback",
            evaluation: {
              overallScore: data.evaluation.overallScore || data.evaluation.finalScore || data.evaluation.score,
              breakdown: data.evaluation.breakdown,
              strengths: data.evaluation.strengths,
              improvements: data.evaluation.improvements,
            }
          }
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
                    score: data.evaluation.finalScore ?? data.evaluation.score,
                    deterministicScore: data.evaluation.deterministicScore,
                    semanticScore: data.evaluation.semanticScore,
                    finalScore: data.evaluation.finalScore ?? data.evaluation.score,
                    confidence: data.evaluation.breakdown.confidence,
                    clarity: data.evaluation.breakdown.clarity,
                    technical_depth: data.evaluation.breakdown.technical,
                    strengths: data.evaluation.strengths ?? [],
                    improvements: data.evaluation.improvements ?? [],
                    should_follow_up: false,
                    follow_up_focus: null
                  },
                  metrics: data.metrics
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
            // Speak the feedback then a closing message
            speakText(data.evaluation.feedback)
            speakText("Great work completing the interview! Your responses have been recorded. Keep practising and you'll do even better next time. Head to the dashboard to review your performance.")
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
                    score: data.evaluation.finalScore ?? data.evaluation.score,
                    deterministicScore: data.evaluation.deterministicScore,
                    semanticScore: data.evaluation.semanticScore,
                    finalScore: data.evaluation.finalScore ?? data.evaluation.score,
                    confidence: data.evaluation.breakdown.confidence,
                    clarity: data.evaluation.breakdown.clarity,
                    technical_depth: data.evaluation.breakdown.technical,
                    strengths: data.evaluation.strengths ?? [],
                    improvements: data.evaluation.improvements ?? [],
                    should_follow_up: false,
                    follow_up_focus: null
                  },
                  metrics: data.metrics
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
            // Speak the feedback and next question (queued automatically)
            speakText(data.evaluation.feedback)
            speakText(data.nextQuestion)
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
    const closingText = "Great work completing the interview today! Your answers showed real potential. Keep practising and refining your explanations — you'll perform even better in real interviews. Best of luck with your career journey!"
    const thankYouMessage: InterviewMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: closingText,
      kind: "main",
      meta: { type: "feedback" }
    }

    // Speak and add message to chat, but don't change status yet
    // User will see the message and click "View Score" when ready
    speakText(closingText)

    setState((prev) => ({
      ...prev,
      status: "ended",
      messages: [...prev.messages, thankYouMessage]
    }))
  }

  const viewScore = () => {
    // Stop speech and show completion screen
    stopSpeaking()
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      isRecognitionActiveRef.current = false
      setIsListening(false)
    }
    setShowCompletionScreen(true)
  }

  const handleSend = () => {
    handleUserAnswer(input)
  }

  if (!mounted) {
    return null
  }

  if (state.status === "idle") {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
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

  if (showCompletionScreen && state.status === "ended") {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-2xl font-bold text-white mb-3">
            Interview Complete!
          </div>
          {finalScore !== null && (
            <div className="mb-4">
              <div className="text-5xl font-bold text-blue-400 mb-1">{finalScore}</div>
              <div className="text-sm text-neutral-400">out of 100</div>
            </div>
          )}
          <p className="text-neutral-300 mb-2">
            Great work completing your session with Zen AI.
          </p>
          <p className="text-sm text-neutral-500 mb-6">
            Your responses have been saved and are ready for review.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b border-neutral-700 bg-neutral-800 px-6 py-4 z-10">
        <div className="flex items-center justify-between max-w-full">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-white truncate">Live Interview Session</h1>
            <p className="text-sm text-neutral-400">
              Question {state.currentQuestionIndex + 1} of {state.totalQuestions + 1} • Zen AI Interviewer
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={toggleVideo}
              className={`p-2 rounded-lg border transition-colors ${
                isVideoEnabled 
                  ? 'bg-green-600 hover:bg-green-700 border-green-500 text-white'
                  : 'bg-neutral-700 hover:bg-neutral-600 border-neutral-600 text-neutral-300'
              }`}
              title={isVideoEnabled ? 'Disable video' : 'Enable video'}
            >
              {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button
              onClick={endInterview}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              End Interview
            </button>
          </div>
        </div>
      </div>

      {/* Main Interview Area - Fixed Height */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Panel - Video & Controls (Fixed, Scrollable) */}
        <div className="w-80 border-r border-neutral-700 bg-neutral-800 flex-shrink-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Camera View */}
            <div className="aspect-[4/3] bg-neutral-900 rounded-lg border-2 border-dashed border-neutral-600 flex items-center justify-center flex-shrink-0">
              {isVideoEnabled ? (
                <div className="text-center">
                  <Camera className="w-12 h-12 text-neutral-500 mx-auto mb-2" />
                  <p className="text-sm text-neutral-400">Camera Preview</p>
                  <p className="text-xs text-neutral-500">Your video feed will appear here</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-neutral-500 mx-auto mb-2" />
                  <p className="text-sm text-neutral-400">Camera Off</p>
                </div>
              )}
            </div>
            
            {/* Interview Progress */}
            <div className="p-3 bg-neutral-900 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">Progress</h3>
              <div className="flex justify-between text-sm text-neutral-400 mb-1">
                <span>Question {state.currentQuestionIndex + 1}</span>
                <span>{state.totalQuestions + 1} Total</span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((state.currentQuestionIndex + 1) / (state.totalQuestions + 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Interview Tips */}
            <div className="p-3 bg-neutral-900 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">💡 Tips</h3>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Speak clearly and at a steady pace</li>
                <li>• Use the STAR method for behavioral questions</li>
                <li>• Think aloud to show your reasoning</li>
                <li>• Ask clarifying questions when needed</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Conversation (Independent Scroll) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {state.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start gap-3 max-w-[85%]">
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center border-2 border-blue-500 shadow-lg">
                          <span className="text-sm font-bold text-white">Zen</span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        {message.role === "assistant" && (
                          <span className="text-xs text-neutral-400 mb-1 ml-1">
                            {message.meta?.type === 'question' ? '🎯 Interview Question' : 
                             message.meta?.type === 'feedback' ? '📝 Feedback' : 'Zen AI'}
                          </span>
                        )}
                        <div
                          className={`rounded-2xl px-5 py-4 shadow-lg ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md"
                              : message.meta?.type === 'feedback'
                                ? "bg-gradient-to-br from-green-800 to-green-900 text-white border border-green-700 rounded-tl-md"
                                : "bg-neutral-800 text-white border border-neutral-700 rounded-tl-md"
                          }`}
                        >
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          
                          {/* Score Breakdown for Feedback Messages */}
                          {message.meta?.type === 'feedback' && message.meta.evaluation && (
                            <div className="mt-4 pt-4 border-t border-green-700">
                              <div className="mb-3">
                                <div className="text-sm font-semibold text-green-300 mb-1">
                                  Score: {message.meta.evaluation.overallScore}/100
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-green-200">Technical:</span>
                                    <span className="font-medium">{message.meta.evaluation.breakdown.technical}/10</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-200">Clarity:</span>
                                    <span className="font-medium">{message.meta.evaluation.breakdown.clarity}/10</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-200">Confidence:</span>
                                    <span className="font-medium">{message.meta.evaluation.breakdown.confidence}/10</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-200">Relevance:</span>
                                    <span className="font-medium">{message.meta.evaluation.breakdown.relevance}/10</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-green-200">Structure:</span>
                                    <span className="font-medium">{message.meta.evaluation.breakdown.structure}/10</span>
                                  </div>
                                </div>
                              </div>
                              
                              {message.meta.evaluation.strengths && message.meta.evaluation.strengths.length > 0 && (
                                <div className="mb-2">
                                  <div className="text-xs font-semibold text-green-300 mb-1">✓ Strengths:</div>
                                  <ul className="text-xs text-green-100 space-y-0.5 ml-3">
                                    {message.meta.evaluation.strengths.map((strength, idx) => (
                                      <li key={idx}>• {strength}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {message.meta.evaluation.improvements && message.meta.evaluation.improvements.length > 0 && (
                                <div>
                                  <div className="text-xs font-semibold text-yellow-300 mb-1">⚡ Improvements:</div>
                                  <ul className="text-xs text-green-100 space-y-0.5 ml-3">
                                    {message.meta.evaluation.improvements.map((improvement, idx) => (
                                      <li key={idx}>• {improvement}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border-2 border-gray-500">
                          <span className="text-sm font-bold text-white">You</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center border-2 border-neutral-600 animate-pulse">
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-3 px-5 py-4 bg-neutral-800 rounded-2xl rounded-tl-md border border-neutral-700">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                        <span className="text-sm text-neutral-300">Zen AI is analyzing your response...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={bottomRef} />
              </div>
            </div>

            {/* Fixed Input Area */}
            <div className="flex-shrink-0 border-t border-neutral-700 bg-neutral-800 px-6 py-4">
              <div className="max-w-4xl mx-auto">
                {state.status === "ended" ? (
                  <div className="text-center py-6">
                    <p className="text-neutral-300 mb-4 text-lg">
                      The interview has concluded. See your performance summary below.
                    </p>
                    <button
                      onClick={viewScore}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                    >
                      📊 View Score & Results
                    </button>
                  </div>
                ) : (
                  <>
                <div className="flex gap-3 mb-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="Type your answer here... or use the microphone to speak"
                    rows={3}
                    className="flex-1 px-5 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-neutral-400 resize-none"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={toggleVoice}
                      className={`p-3 rounded-xl border transition-colors ${
                        isVoiceEnabled
                          ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 text-white'
                          : 'bg-neutral-600 hover:bg-neutral-700 border-neutral-500 text-neutral-300'
                      }`}
                      title={isVoiceEnabled ? 'Disable AI Voice' : 'Enable AI Voice'}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={toggleListening}
                      disabled={!recognitionRef.current}
                      className={`p-3 rounded-xl border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isListening 
                          ? 'bg-red-600 hover:bg-red-700 border-red-500 text-white animate-pulse'
                          : 'bg-green-600 hover:bg-green-700 border-green-500 text-white'
                      }`}
                      title={isListening ? 'Stop recording' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors"
                      title="Send answer"
                    >
                      Send
                    </button>
                  </div>
                </div>
                
                {isListening && (
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    <span>Listening... Speak clearly into your microphone</span>
                  </div>
                )}
                
                {isSpeaking && (
                  <div className="flex items-center gap-2 text-sm text-purple-400">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                    <span>Zen AI is speaking...</span>
                  </div>
                )}
                
                {!recognitionRef.current && (
                  <div className="text-xs text-neutral-500">
                    💡 Voice input not supported in this browser. Try Chrome or Edge for the best experience.
                  </div>
                )}
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
