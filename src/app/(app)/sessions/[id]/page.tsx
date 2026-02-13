"use client"

import { Card, CardHeader, CardContent } from "@/components/ui"
import { Button } from "@/components/ui"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Target, Award, CheckCircle, AlertCircle } from "lucide-react"

// Helper to normalize legacy scores (0-100) to new scale (0-10)
function normalizeScore(score: number): number {
  if (score <= 10) return score // Already normalized
  return Math.round(score / 10) // Convert from 0-100 to 0-10
}

type SessionData = {
  _id: string
  userEmail: string
  startedAt: string
  endedAt: string
  config: {
    type: string
    role: string
    difficulty: string
  }
  questions: Array<{
    kind: "main"
    text: string
    answer: string
    evaluation: {
      score: number
      technical_depth: number
      clarity: number
      confidence: number
      strengths: string[]
      improvements: string[]
      feedback: string
    }
  }>
  overallScore: number
}

export default function SessionDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    async function fetchSession() {
      try {
        const response = await fetch(`/api/sessions/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setSessionData(data)
        } else if (response.status === 404) {
          setError("Session not found")
        } else {
          setError("Failed to load session")
        }
      } catch (err) {
        console.error("Failed to fetch session:", err)
        setError("Failed to load session")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchSession()
    }
  }, [status, router, params.id])

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-600">Loading session...</p>
      </div>
    )
  }

  if (error || !sessionData) {
    return (
      <div>
        <Link href="/dashboard">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Card>
          <CardContent className="p-16 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              {error || "Session not found"}
            </h3>
            <p className="text-neutral-600 mb-6">
              This session may have been deleted or you don't have access to it
            </p>
            <Link href="/dashboard">
              <Button variant="primary">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const duration = Math.round(
    (new Date(sessionData.endedAt).getTime() - new Date(sessionData.startedAt).getTime()) / 60000
  )

  return (
    <div>
      <Link href="/dashboard">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Session Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {sessionData.config.role} Interview
              </h1>
              <p className="text-neutral-600 capitalize">
                {sessionData.config.type} • {sessionData.config.difficulty} difficulty
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-neutral-900">
                {sessionData.overallScore}
              </div>
              <div className="text-sm text-neutral-500">Overall Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Calendar className="w-5 h-5 text-neutral-600" />
              <div>
                <p className="text-xs text-neutral-500">Date</p>
                <p className="font-medium text-neutral-900">
                  {new Date(sessionData.startedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Clock className="w-5 h-5 text-neutral-600" />
              <div>
                <p className="text-xs text-neutral-500">Duration</p>
                <p className="font-medium text-neutral-900">{duration} minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Target className="w-5 h-5 text-neutral-600" />
              <div>
                <p className="text-xs text-neutral-500">Questions</p>
                <p className="font-medium text-neutral-900">{sessionData.questions.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions and Answers */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-neutral-900">Questions & Evaluations</h2>
        
        {sessionData.questions.map((question, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-neutral-500">
                      Question {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                      Score: {question.evaluation.score}/10
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900">
                    {question.text}
                  </h3>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Your Answer */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-neutral-700 mb-2">Your Answer</h4>
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-800 whitespace-pre-wrap">{question.answer}</p>
                </div>
              </div>

              {/* Evaluation Metrics */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Performance Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600">Technical Depth</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {normalizeScore(question.evaluation.technical_depth)}/10
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(normalizeScore(question.evaluation.technical_depth) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600">Clarity</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {normalizeScore(question.evaluation.clarity)}/10
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${(normalizeScore(question.evaluation.clarity) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600">Confidence</span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {normalizeScore(question.evaluation.confidence)}/10
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${(normalizeScore(question.evaluation.confidence) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-neutral-700 mb-2">AI Feedback</h4>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-neutral-800">{question.evaluation.feedback}</p>
                </div>
              </div>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {question.evaluation.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-600" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {question.evaluation.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="text-orange-600 mt-0.5">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action CTA */}
      <Card className="mt-8 bg-gradient-to-br from-blue-600 to-blue-700 border-blue-600">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Ready for another round?
          </h3>
          <p className="text-blue-100 mb-6">
            Practice makes perfect. Start a new session to keep improving
          </p>
          <Link href="/interview/setup">
            <Button variant="primary" className="bg-white text-blue-600 hover:bg-neutral-50">
              Start New Interview
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
