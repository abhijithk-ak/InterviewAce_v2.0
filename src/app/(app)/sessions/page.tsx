"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar, Clock, Trophy, Target, Filter, Search } from "lucide-react"
import Link from "next/link"

interface SessionData {
  _id: string
  config: {
    role: string
    type: string
    difficulty: string
  }
  startedAt: string
  endedAt?: string
  overallScore?: number
  duration?: number
  questions: Array<{
    evaluation?: {
      score?: number
      confidence?: number
      clarity?: number
      technical_depth?: number
    }
  }>
}

export default function SessionsPage() {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/sessions")
        if (response.ok) {
          const data = await response.json()
          setSessions(data)
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.email) {
      fetchSessions()
    }
  }, [session])

  const filteredSessions = sessions.filter(sessionData => {
    const matchesFilter = filter === "all" || sessionData.config.type === filter
    const matchesSearch = searchQuery === "" || 
      sessionData.config.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sessionData.config.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical': return '</>'
      case 'behavioral': return '💬'
      case 'system-design': return '🏗️'
      default: return '🎯'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatDuration = (startedAt: string, endedAt?: string) => {
    if (!endedAt) return "In progress"
    const start = new Date(startedAt)
    const end = new Date(endedAt)
    const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60)
    return `${duration} min`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 -m-8 flex items-center justify-center">
        <div className="text-neutral-400">Loading sessions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Interview Sessions
          </h1>
          <p className="text-neutral-400">
            Review your past interview sessions and track your progress
          </p>
        </div>

        {sessions.length === 0 ? (
          // New User Experience
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-4">No Sessions Yet</h3>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              Start your first interview session to begin tracking your progress and improving your skills.
            </p>
            <Link href="/interview/setup">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Start First Session
              </button>
            </Link>
          </div>
        ) : (
          // Existing User Experience
          <div>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex gap-2">
                {["all", "technical", "behavioral", "system-design"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === type
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                    }`}
                  >
                    {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by role or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{sessions.length}</p>
                    <p className="text-xs text-neutral-400">Total Sessions</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / sessions.length)}%
                    </p>
                    <p className="text-xs text-neutral-400">Average Score</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {Math.max(...sessions.map(s => s.overallScore || 0))}%
                    </p>
                    <p className="text-xs text-neutral-400">Best Score</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {sessions.filter(s => s.endedAt).length}
                    </p>
                    <p className="text-xs text-neutral-400">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              {filteredSessions.map((sessionData) => (
                <div
                  key={sessionData._id}
                  className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
                        <span className="text-neutral-300 text-lg">
                          {getTypeIcon(sessionData.config.type)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {sessionData.config.role} • {sessionData.config.type.charAt(0).toUpperCase() + sessionData.config.type.slice(1)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(sessionData.startedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "2-digit"
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(sessionData.startedAt, sessionData.endedAt)}
                          </span>  
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sessionData.config.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                            sessionData.config.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {sessionData.config.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(sessionData.overallScore || 0)}`}>
                        {sessionData.overallScore || 0}%
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        {sessionData.questions.length} questions
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSessions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-neutral-400">No sessions match your current filters.</p>
                  <button
                    onClick={() => {
                      setFilter("all")
                      setSearchQuery("")
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Start New Session CTA */}
            <div className="mt-12 text-center">
              <Link href="/interview/setup">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Start New Session
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}