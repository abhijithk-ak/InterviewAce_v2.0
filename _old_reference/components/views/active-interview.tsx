"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  User,
  Loader2,
  StopCircle,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { VIEW_TRANSITION, type InterviewConfig, type Session, type TranscriptItem } from "@/lib/data"
import { getAISettings, saveSession, saveActiveSession, getActiveSession, clearActiveSession } from "@/lib/storage"
import { Progress } from "@/components/ui/progress"
import type { SpeechRecognition } from "web-speech-api" // Declare SpeechRecognition

interface ActiveInterviewProps {
  onEnd: (session: Session) => void
  config?: InterviewConfig
}

export function ActiveInterview({ onEnd, config }: ActiveInterviewProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showFeedback, setShowFeedback] = useState(true)
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const [currentScores, setCurrentScores] = useState({
    technical: 0,
    communication: 0,
    confidence: 0,
    relevance: 0,
    overall: 0,
  })
  const [realtimeFeedback, setRealtimeFeedback] = useState({
    pace: "Analyzing...",
    paceValue: 50,
    length: "Analyzing...",
    lengthValue: 50,
    confidence: "Analyzing...",
    confidenceValue: 50,
    tip: "Start speaking to receive feedback.",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [transcript, setTranscript] = useState("")

  const aiSettings = typeof window !== "undefined" ? getAISettings() : null

  useEffect(() => {
    const activeSession = getActiveSession()
    if (activeSession && activeSession.sessionId === sessionId) {
      setElapsedTime(activeSession.elapsedTime)
    }
  }, [sessionId])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { settings: aiSettings, config },
    }),
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: `Hello! I'm your AI interviewer today. I'll be conducting a ${config?.type || "Technical"} interview for a ${config?.role || "Software Engineer"} position at the ${config?.difficulty || "Mid-Level"} level.${config?.focusArea ? ` We'll focus on ${config.focusArea}.` : ""}${config?.company ? ` This is for a position at ${config.company}.` : ""}\n\nLet's begin. Can you start by telling me about yourself and your relevant experience?`,
      },
    ],
  })

  // Timer
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => setElapsedTime((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [isPaused])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === "assistant" && lastMessage.content) {
      const feedbackMatch = lastMessage.content.match(/\[FEEDBACK\]([\s\S]*?)\[\/FEEDBACK\]/)
      if (feedbackMatch) {
        const feedbackText = feedbackMatch[1]
        const scoreMatch = feedbackText.match(/Score:\s*(\d+)\/100/)
        const technicalMatch = feedbackText.match(/Technical Accuracy:\s*(\d+)\/40/)
        const commMatch = feedbackText.match(/Communication Clarity:\s*(\d+)\/30/)
        const confMatch = feedbackText.match(/Confidence & Delivery:\s*(\d+)\/20/)
        const relMatch = feedbackText.match(/Relevance & Structure:\s*(\d+)\/10/)

        if (scoreMatch) {
          setCurrentScores({
            overall: Number.parseInt(scoreMatch[1]),
            technical: technicalMatch ? Number.parseInt(technicalMatch[1]) * 2.5 : currentScores.technical,
            communication: commMatch ? Number.parseInt(commMatch[1]) * 3.33 : currentScores.communication,
            confidence: confMatch ? Number.parseInt(confMatch[1]) * 5 : currentScores.confidence,
            relevance: relMatch ? Number.parseInt(relMatch[1]) * 10 : currentScores.relevance,
          })
        }

        // Extract tip
        const tipMatch = feedbackText.match(/Brief Tip:\s*(.+)/)
        if (tipMatch) {
          setRealtimeFeedback((prev) => ({ ...prev, tip: tipMatch[1] }))
        }
      }
    }
  }, [
    messages,
    currentScores.communication,
    currentScores.confidence,
    currentScores.relevance,
    currentScores.technical,
  ])

  const startSpeechRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setInput((prev) => prev + finalTranscript + " ")
        setTranscript("")
        // Update realtime feedback based on speech
        const words = finalTranscript.split(" ").length
        setRealtimeFeedback((prev) => ({
          ...prev,
          pace: words < 10 ? "Too slow" : words > 30 ? "Too fast" : "Good pace",
          paceValue: words < 10 ? 30 : words > 30 ? 80 : 65,
          length: finalTranscript.length < 50 ? "Short" : finalTranscript.length > 200 ? "Detailed" : "Good length",
          lengthValue: Math.min(100, (finalTranscript.length / 200) * 100),
        }))
      } else {
        setTranscript(interimTranscript)
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      if (isRecording) {
        recognition.start()
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [isRecording])

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
    setTranscript("")
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition()
    } else {
      startSpeechRecognition()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSend = () => {
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
    setTranscript("")
  }

  const handlePause = () => {
    setIsPaused(true)
    stopSpeechRecognition()
    saveActiveSession({
      config: config!,
      messages: messages.map((m) => ({ id: m.id, role: m.role as "assistant" | "user", content: m.content || "" })),
      elapsedTime,
      sessionId,
    })
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleEndSession = () => {
    stopSpeechRecognition()
    clearActiveSession()

    const transcript: TranscriptItem[] = messages.map((m, i) => ({
      id: m.id,
      role: m.role as "assistant" | "user",
      content: m.content || "",
      timestamp: i * 30,
    }))

    const session: Session = {
      id: sessionId,
      type: config?.type || "Technical",
      role: config?.role || "Software Engineer",
      difficulty: config?.difficulty || "Mid-Level",
      date: new Date().toLocaleString(),
      duration: Math.floor(elapsedTime / 60),
      score: currentScores.overall > 0 ? currentScores.overall : 0, // Use actual score or 0
      status: "completed",
      feedback: realtimeFeedback.tip,
      transcript,
      scores: {
        technical: currentScores.technical > 0 ? currentScores.technical : 0,
        communication: currentScores.communication > 0 ? currentScores.communication : 0,
        confidence: currentScores.confidence > 0 ? currentScores.confidence : 0,
        relevance: currentScores.relevance > 0 ? currentScores.relevance : 0,
      },
    }

    saveSession(session)
    onEnd(session)
  }

  const isLoading = status === "streaming" || status === "submitted"

  const cleanMessage = (content: string) => {
    return content.replace(/\[FEEDBACK\][\s\S]*?\[\/FEEDBACK\]/g, "").trim()
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">
      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-4">{formatTime(elapsedTime)}</div>
              <p className="text-white/60 mb-8">Session Paused</p>
              <div className="flex gap-4">
                <ButtonCustom onClick={handleResume} className="px-8 py-4">
                  <Play className="w-5 h-5 mr-2" /> Resume
                </ButtonCustom>
                <ButtonCustom onClick={handleEndSession} variant="danger" className="px-8 py-4">
                  <StopCircle className="w-5 h-5 mr-2" /> End Session
                </ButtonCustom>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column: AI & Transcript */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Live: {config?.type || "Technical"} Interview
            </span>
            {currentScores.overall > 0 && (
              <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                Score: {currentScores.overall}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={isPaused ? handleResume : handlePause}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <div className="text-sm font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white rounded-tr-sm"
                    : "bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="text-xs font-bold mb-2 text-neutral-400 uppercase tracking-wider">AI Interviewer</div>
                )}
                <div className="whitespace-pre-wrap">
                  {msg.parts?.map((part, i) => (
                    <span key={i}>{part.type === "text" ? cleanMessage(part.text) : null}</span>
                  )) || cleanMessage(msg.content || "")}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-transparent border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm p-5">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          {transcript && (
            <div className="mb-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm text-neutral-500 italic">
              {transcript}...
            </div>
          )}
          <div className="flex gap-3">
            <button
              className={`p-3.5 rounded-xl transition-all ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              }`}
              onClick={toggleRecording}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={isRecording ? "Listening..." : "Type your answer..."}
              disabled={isLoading}
              className="flex-1 bg-neutral-50 dark:bg-neutral-800 border-0 rounded-xl px-5 py-3 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white disabled:opacity-50"
            />
            <ButtonCustom onClick={handleSend} disabled={isLoading || !input.trim()} className="px-5">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </ButtonCustom>
          </div>
        </div>
      </div>

      {/* Right Column: User Media & Controls */}
      <div className="w-full lg:w-96 flex flex-col gap-5 shrink-0">
        {/* Webcam View */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden relative group border border-neutral-200 dark:border-neutral-800">
          {cameraOn ? (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <User className="w-20 h-20 text-neutral-700" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                <span className="text-xs text-white/80 font-medium">{isRecording ? "Recording" : "You"}</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
              <VideoOff className="w-10 h-10 text-neutral-400" />
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className="p-2 bg-black/50 backdrop-blur text-white rounded-lg hover:bg-black/70"
            >
              {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Real-time Analysis */}
        <CardCustom className="flex-1 min-h-0 flex flex-col p-6 overflow-y-auto">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Real-time Feedback</h3>
            {showFeedback ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-5 overflow-hidden"
              >
                <div>
                  <div className="flex justify-between text-xs mb-2 text-neutral-500">
                    <span>Speaking Pace</span>
                    <span
                      className={`font-medium ${realtimeFeedback.paceValue > 60 ? "text-green-600" : "text-neutral-400"}`}
                    >
                      {realtimeFeedback.pace}
                    </span>
                  </div>
                  <Progress value={realtimeFeedback.paceValue} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2 text-neutral-500">
                    <span>Response Length</span>
                    <span className="text-neutral-400 font-medium">{realtimeFeedback.length}</span>
                  </div>
                  <Progress value={realtimeFeedback.lengthValue} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2 text-neutral-500">
                    <span>Overall Score</span>
                    <span className="text-neutral-400 font-medium">
                      {currentScores.overall > 0 ? `${currentScores.overall}%` : "Analyzing..."}
                    </span>
                  </div>
                  <Progress value={currentScores.overall > 0 ? currentScores.overall : 0} className="h-2" />
                </div>

                {currentScores.overall > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">Technical</div>
                      <div className="text-lg font-bold">{Math.round(currentScores.technical)}%</div>
                    </div>
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">Communication</div>
                      <div className="text-lg font-bold">{Math.round(currentScores.communication)}%</div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 italic leading-relaxed">
                    {`"${realtimeFeedback.tip}"`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto pt-6 space-y-3">
            <ButtonCustom onClick={handlePause} variant="secondary" className="w-full py-3">
              <Pause className="w-4 h-4 mr-2" />
              Pause Session
            </ButtonCustom>
            <ButtonCustom variant="danger" onClick={handleEndSession} className="w-full py-3">
              <StopCircle className="w-4 h-4 mr-2" />
              End Session
            </ButtonCustom>
          </div>
        </CardCustom>
      </div>
    </motion.div>
  )
}
