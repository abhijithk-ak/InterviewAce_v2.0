"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Activity, AlertTriangle, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  Cell,
  Brush,
} from "recharts"

type ResearchMetrics = {
  totalEvaluations: number
  totalQuestions: number
  deterministicAverage: number
  semanticAverage: number
  hybridAverage: number
  deterministicStdDev: number
  semanticStdDev: number
  hybridStdDev: number
  correlation: number | null
  aiSuccessRate: number
  avgLatency: number
  scoreDistribution: Array<{
    range: string
    deterministic: number
    semantic: number
    hybrid: number
  }>
  methodComparison: Array<{
    method: string
    avgScore: number
    stdDev: number
    sampleCount: number
  }>
  timeSeriesData: Array<{
    date: string
    deterministic: number
    semantic: number
    hybrid: number
  }>
  sessionTimelineData: Array<{
    sessionNumber: number
    sessionId: string
    timestamp: Date
    date: string
    deterministic: number
    semantic: number
    hybrid: number
    questionCount: number
    role: string
    difficulty: string
  }>
  difficultyBreakdown: Record<string, { count: number; avgScore: number }>
  typeBreakdown: Record<string, { count: number; avgScore: number }>
}

const COLORS = {
  deterministic: "#6366f1", // Indigo
  semantic: "#8b5cf6",      // Purple
  hybrid: "#10b981",        // Green
}

export default function ImprovedResearchDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null)
  const [timelineMode, setTimelineMode] = useState<"session" | "day">("session")

  // Detect if hybrid mode has been used
  const isHybridModeActive = metrics ? metrics.semanticAverage > 0.1 : false
  const isDeterministicOnly = metrics ? metrics.semanticAverage < 0.1 && metrics.totalQuestions > 0 : false

  useEffect(() => {
    async function fetchResearchMetrics() {
      try {
        const response = await fetch("/api/research/metrics")
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch research metrics")
        }

        setMetrics(result.data)
        setLoading(false)
      } catch (err) {
        console.error("Research metrics error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        setLoading(false)
      }
    }

    fetchResearchMetrics()
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-neutral-400 text-xs mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-bold">
            {entry.name}: {entry.value?.toFixed(1)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <div className="border-b border-neutral-700 bg-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold">Research Analytics - Method Comparison</h1>
              <p className="text-sm text-neutral-400">
                IEEE-Standard Evaluation Metrics Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-neutral-400">Loading research data...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400">Error: {error}</div>
          </div>
        ) : !metrics ? (
          <div className="text-center py-12">
            <div className="text-neutral-400">No data available</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Settings Storage Info Panel */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-300 mb-1">
                    ✅ Database Storage Information
                  </h3>
                  <p className="text-xs text-blue-200">
                    <strong>Interview settings are now stored in MongoDB</strong> for cross-device synchronization and research tracking. 
                    Your preferences (AI model, scoring mode, interview length) persist across all devices and browsers. 
                    Session data (scores, evaluations, metrics) is also stored in MongoDB for comprehensive research analysis.
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-blue-300">Current Scoring Mode:</span>
                    <span className="px-2 py-0.5 bg-blue-950 rounded text-blue-100 font-mono">
                      {isDeterministicOnly ? "Deterministic" : isHybridModeActive ? "Hybrid" : "Unknown"}
                    </span>
                    {isDeterministicOnly && (
                      <a 
                        href="/settings" 
                        className="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium transition-colors"
                      >
                        Enable Hybrid →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Banner if Hybrid Mode Not Active */}
            {isDeterministicOnly && (
              <div className="bg-amber-900/20 border-2 border-amber-600 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-amber-300 mb-2">
                      ⚠️ Hybrid Mode NOT Enabled
                    </h3>
                    <p className="text-amber-100 mb-3">
                      You are currently using <strong>Deterministic Scoring Only</strong>. All semantic scores are 0.
                      To collect comparative data for your IEEE research paper, you need to enable Hybrid Mode.
                    </p>
                    <div className="bg-amber-950/50 rounded-lg p-4 border border-amber-700">
                      <p className="text-sm text-amber-200 font-semibold mb-2">How to Enable Hybrid Mode:</p>
                      <ol className="text-sm text-amber-100 space-y-1 list-decimal list-inside">
                        <li>Navigate to <a href="/settings" className="underline font-bold hover:text-white">Settings</a></li>
                        <li>Under "Scoring Configuration", select <strong>"Hybrid (Experimental)"</strong></li>
                        <li>Click "Save Settings"</li>
                        <li>Run new interview sessions to collect hybrid data</li>
                      </ol>
                    </div>
                    <div className="mt-3 text-xs text-amber-300">
                      📊 Current Data: {metrics.totalQuestions} questions using <strong>determinist only</strong>. 
                      Semantic and Hybrid charts will show meaningful data once hybrid mode is activated.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Banner if Hybrid Mode Active */}
            {isHybridModeActive && (
              <div className="bg-green-900/20 border-2 border-green-600 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-300 font-semibold">
                      ✅ Hybrid Mode Active - Collecting Complete Research Data
                    </p>
                    <p className="text-xs text-green-200 mt-1">
                      {metrics.totalQuestions} questions analyzed | Semantic avg: {metrics.semanticAverage.toFixed(1)} | 
                      Correlation: {metrics.correlation?.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dataset Overview */}
            <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h2 className="text-lg font-semibold mb-4 text-neutral-200">📊 Dataset Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-xs text-neutral-400 mb-1">Total Sessions</div>
                  <div className="text-3xl font-bold text-blue-400">{metrics.totalEvaluations}</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-xs text-neutral-400 mb-1">Total Questions</div>
                  <div className="text-3xl font-bold text-purple-400">{metrics.totalQuestions}</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-xs text-neutral-400 mb-1">AI Success Rate</div>
                  <div className="text-3xl font-bold text-green-400">{metrics.aiSuccessRate}%</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-xs text-neutral-400 mb-1">Correlation</div>
                  <div className="text-3xl font-bold text-indigo-400">
                    {metrics.correlation?.toFixed(3) || "N/A"}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 1: Individual Method Performance */}
            <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
                Individual Method Performance
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Deterministic Method */}
                <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 rounded-lg p-5 border-2 border-indigo-600">
                  <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    Deterministic (NLP)
                  </h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-indigo-400 mb-1">
                      {metrics.deterministicAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-indigo-200">Average Score (0-100)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Std Dev:</span>
                      <span className="font-bold text-white">{metrics.deterministicStdDev.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Sample Size:</span>
                      <span className="font-bold text-white">n={metrics.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Method:</span>
                      <span className="font-medium text-indigo-300">Rule-Based</span>
                    </div>
                  </div>
                  {/* Score Distribution for Deterministic */}
                  <div className="mt-4 pt-4 border-t border-indigo-700">
                    <div className="text-xs text-indigo-200 mb-2 font-semibold">Score Distribution:</div>
                    {metrics.scoreDistribution.map((range) => (
                      <div key={range.range} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-400 w-16">{range.range}</span>
                        <div className="flex-1 bg-neutral-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-indigo-500"
                            style={{
                              width: `${(range.deterministic / metrics.totalQuestions) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-300 w-8 text-right">
                          {range.deterministic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic Method */}
                <div className={`bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-5 border-2 ${
                  isDeterministicOnly ? 'border-neutral-600 opacity-50' : 'border-purple-600'
                }`}>
                  <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    Semantic (MiniLM)
                    {isDeterministicOnly && (
                      <span className="text-xs text-amber-400 ml-auto">⚠️ Not Active</span>
                    )}
                  </h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-purple-400 mb-1">
                      {metrics.semanticAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-purple-200">Average Score (0-100)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Std Dev:</span>
                      <span className="font-bold text-white">{metrics.semanticStdDev.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Sample Size:</span>
                      <span className="font-bold text-white">n={metrics.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Method:</span>
                      <span className="font-medium text-purple-300">Transformer</span>
                    </div>
                  </div>
                  {/* Score Distribution for Semantic */}
                  <div className="mt-4 pt-4 border-t border-purple-700">
                    <div className="text-xs text-purple-200 mb-2 font-semibold">Score Distribution:</div>
                    {metrics.scoreDistribution.map((range) => (
                      <div key={range.range} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-400 w-16">{range.range}</span>
                        <div className="flex-1 bg-neutral-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-purple-500"
                            style={{
                              width: `${(range.semantic / Math.max(metrics.totalQuestions, 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-300 w-8 text-right">
                          {range.semantic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hybrid Method */}
                <div className={`bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-5 border-2 ${
                  isDeterministicOnly ? 'border-neutral-600 opacity-50' : 'border-green-600'
                }`}>
                  <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Hybrid (70/30)
                    {isDeterministicOnly && (
                      <span className="text-xs text-amber-400 ml-auto">⚠️ Not Active</span>
                    )}
                  </h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-green-400 mb-1">
                      {metrics.hybridAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-green-200">Average Score (0-100)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Std Dev:</span>
                      <span className="font-bold text-white">{metrics.hybridStdDev.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Sample Size:</span>
                      <span className="font-bold text-white">n={metrics.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Formula:</span>
                      <span className="font-medium text-green-300">0.7D + 0.3S</span>
                    </div>
                  </div>
                  {/* Score Distribution for Hybrid */}
                  <div className="mt-4 pt-4 border-t border-green-700">
                    <div className="text-xs text-green-200 mb-2 font-semibold">Score Distribution:</div>
                    {metrics.scoreDistribution.map((range) => (
                      <div key={range.range} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-400 w-16">{range.range}</span>
                        <div className="flex-1 bg-neutral-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width: `${(range.hybrid / Math.max(metrics.totalQuestions, 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-300 w-8 text-right">
                          {range.hybrid}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* NEW SECTION: Individual Method Trend Lines */}
            {(metrics.sessionTimelineData.length > 1 || metrics.timeSeriesData.length > 1) && (
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  Individual Method Trends
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Deterministic Trend */}
                  <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 rounded-lg p-4 border border-indigo-700">
                    <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      Deterministic Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={timelineMode === "session" ? metrics.sessionTimelineData : metrics.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis
                          dataKey={timelineMode === "session" ? "sessionNumber" : "date"}
                          stroke="#9ca3af"
                          fontSize={10}
                          tickFormatter={(value) =>
                            timelineMode === "session"
                              ? `#${value}`
                              : new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }
                        />
                        <YAxis stroke="#9ca3af" domain={[0, 100]} fontSize={10} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const data = payload[0].payload
                            return (
                              <div className="bg-neutral-800 border border-indigo-600 rounded-lg px-3 py-2 shadow-xl">
                                <p className="text-xs text-neutral-400 mb-1">
                                  {timelineMode === "session" 
                                    ? `Session #${data.sessionNumber}` 
                                    : new Date(data.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm font-bold text-indigo-400">
                                  Score: {data.deterministic.toFixed(1)}
                                </p>
                                {timelineMode === "session" && (
                                  <>
                                    <p className="text-xs text-neutral-500">{data.role}</p>
                                    <p className="text-xs text-neutral-500 capitalize">{data.difficulty}</p>
                                  </>
                                )}
                              </div>
                            )
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="deterministic"
                          stroke={COLORS.deterministic}
                          strokeWidth={2}
                          dot={{ fill: COLORS.deterministic, r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Brush 
                          dataKey="sessionNumber" 
                          height={20} 
                          stroke="#6366f1" 
                          fill="#1e1b4b"
                          travellerWidth={8}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Semantic Trend */}
                  <div className={`bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-lg p-4 border ${
                    isDeterministicOnly ? 'border-neutral-600 opacity-50' : 'border-purple-700'
                  }`}>
                    <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      Semantic Trend
                      {isDeterministicOnly && (
                        <span className="text-xs text-amber-400 ml-auto">⚠️ Not Active</span>
                      )}
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={timelineMode === "session" ? metrics.sessionTimelineData : metrics.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis
                          dataKey={timelineMode === "session" ? "sessionNumber" : "date"}
                          stroke="#9ca3af"
                          fontSize={10}
                          tickFormatter={(value) =>
                            timelineMode === "session"
                              ? `#${value}`
                              : new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }
                        />
                        <YAxis stroke="#9ca3af" domain={[0, 100]} fontSize={10} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const data = payload[0].payload
                            return (
                              <div className="bg-neutral-800 border border-purple-600 rounded-lg px-3 py-2 shadow-xl">
                                <p className="text-xs text-neutral-400 mb-1">
                                  {timelineMode === "session" 
                                    ? `Session #${data.sessionNumber}` 
                                    : new Date(data.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm font-bold text-purple-400">
                                  Score: {data.semantic.toFixed(1)}
                                </p>
                                {timelineMode === "session" && (
                                  <>
                                    <p className="text-xs text-neutral-500">{data.role}</p>
                                    <p className="text-xs text-neutral-500 capitalize">{data.difficulty}</p>
                                  </>
                                )}
                              </div>
                            )
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="semantic"
                          stroke={COLORS.semantic}
                          strokeWidth={2}
                          dot={{ fill: COLORS.semantic, r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Brush 
                          dataKey="sessionNumber" 
                          height={20} 
                          stroke="#a855f7" 
                          fill="#4c1d95"
                          travellerWidth={8}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Hybrid Trend */}
                  <div className={`bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-lg p-4 border ${
                    isDeterministicOnly ? 'border-neutral-600 opacity-50' : 'border-green-700'
                  }`}>
                    <h3 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Hybrid Trend
                      {isDeterministicOnly && (
                        <span className="text-xs text-amber-400 ml-auto">⚠️ Not Active</span>
                      )}
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={timelineMode === "session" ? metrics.sessionTimelineData : metrics.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis
                          dataKey={timelineMode === "session" ? "sessionNumber" : "date"}
                          stroke="#9ca3af"
                          fontSize={10}
                          tickFormatter={(value) =>
                            timelineMode === "session"
                              ? `#${value}`
                              : new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          }
                        />
                        <YAxis stroke="#9ca3af" domain={[0, 100]} fontSize={10} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const data = payload[0].payload
                            return (
                              <div className="bg-neutral-800 border border-green-600 rounded-lg px-3 py-2 shadow-xl">
                                <p className="text-xs text-neutral-400 mb-1">
                                  {timelineMode === "session" ? `Session #${data.sessionNumber}` 
                                    : new Date(data.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm font-bold text-green-400">
                                  Score: {data.hybrid.toFixed(1)}
                                </p>
                                {timelineMode === "session" && (
                                  <>
                                    <p className="text-xs text-neutral-500">{data.role}</p>
                                    <p className="text-xs text-neutral-500 capitalize">{data.difficulty}</p>
                                  </>
                                )}
                              </div>
                            )
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="hybrid"
                          stroke={COLORS.hybrid}
                          strokeWidth={2}
                          dot={{ fill: COLORS.hybrid, r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Brush 
                          dataKey="sessionNumber" 
                          height={20} 
                          stroke="#10b981" 
                          fill="#064e3b"
                          travellerWidth={8}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-neutral-700 rounded-lg flex items-center justify-center gap-4">
                  <span className="text-xs text-neutral-400">View Mode:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimelineMode("session")}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                        timelineMode === "session"
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500"
                      }`}
                    >
                      Per Session ({metrics.sessionTimelineData.length})
                    </button>
                    <button
                      onClick={() => setTimelineMode("day")}
                      className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                        timelineMode === "day"
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500"
                      }`}
                    >
                      By Day ({metrics.timeSeriesData.length} days)
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 2: Method Comparison */}
            <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Direct Method Comparison
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={metrics.methodComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="method" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="avgScore" name="Average Score" radius={[8, 8, 0, 0]}>
                    {metrics.methodComparison.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.method === "Deterministic"
                            ? COLORS.deterministic
                            : entry.method === "Semantic"
                            ? COLORS.semantic
                            : COLORS.hybrid
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <h3 className="font-semibold text-blue-300 mb-3">📊 Statistical Analysis:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-100">Hybrid Improvement:</span>
                    <div className="text-2xl font-bold text-green-400 mt-1">
                      +{(metrics.hybridAverage - metrics.deterministicAverage).toFixed(1)} points
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      ({(((metrics.hybridAverage - metrics.deterministicAverage) / metrics.deterministicAverage) * 100).toFixed(1)}% increase)
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-100">Consistency Gain:</span>
                    <div className="text-2xl font-bold text-green-400 mt-1">
                      -{(metrics.deterministicStdDev - metrics.hybridStdDev).toFixed(2)} σ
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      (Lower variance = more consistent)
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-100">Correlation Strength:</span>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">
                      {metrics.correlation?.toFixed(3) || "N/A"}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {metrics.correlation && metrics.correlation > 0.5
                        ? "(Moderate-Strong agreement)"
                        : "(Weak-Moderate agreement)"}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: Time Series (if data available) */}
            {metrics.timeSeriesData.length > 0 && (
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h2 className="text-xl font-semibold mb-4">📈 Performance Trends Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={metrics.timeSeriesData}>
                    <defs>
                      <linearGradient id="colorDet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.deterministic} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.deterministic} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorSem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.semantic} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.semantic} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorHyb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.hybrid} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.hybrid} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="deterministic"
                      stroke={COLORS.deterministic}
                      fillOpacity={1}
                      fill="url(#colorDet)"
                      name="Deterministic"
                    />
                    <Area
                      type="monotone"
                      dataKey="semantic"
                      stroke={COLORS.semantic}
                      fillOpacity={1}
                      fill="url(#colorSem)"
                      name="Semantic"
                    />
                    <Area
                      type="monotone"
                      dataKey="hybrid"
                      stroke={COLORS.hybrid}
                      fillOpacity={1}
                      fill="url(#colorHyb)"
                      name="Hybrid"
                    />
                    <Brush 
                      dataKey="date" 
                      height={25} 
                      stroke="#6366f1" 
                      fill="#1e1b4b"
                      travellerWidth={10}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </section>
            )}

            {/* SECTION 4: Breakdown by Difficulty & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h3 className="text-lg font-semibold mb-4 text-neutral-200">📚 By Difficulty Level</h3>
                <div className="space-y-3">
                  {Object.entries(metrics.difficultyBreakdown)
                    .sort(([, a], [, b]) => b.avgScore - a.avgScore)
                    .map(([diff, data]) => (
                      <div key={diff} className="bg-neutral-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white capitalize">{diff}</span>
                          <span className="text-2xl font-bold text-purple-400">{data.avgScore}</span>
                        </div>
                        <div className="text-xs text-neutral-400 mb-2">n = {data.count} questions</div>
                        <div className="w-full bg-neutral-600 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${data.avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h3 className="text-lg font-semibold mb-4 text-neutral-200">🎯 By Interview Type</h3>
                <div className="space-y-3">
                  {Object.entries(metrics.typeBreakdown)
                    .sort(([, a], [, b]) => b.avgScore - a.avgScore)
                    .map(([type, data]) => (
                      <div key={type} className="bg-neutral-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-white capitalize">
                            {type.replace("-", " ")}
                          </span>
                          <span className="text-2xl font-bold text-green-400">{data.avgScore}</span>
                        </div>
                        <div className="text-xs text-neutral-400 mb-2">n = {data.count} questions</div>
                        <div className="w-full bg-neutral-600 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${data.avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            </div>

            {/* Research Summary */}
            <section className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700">
              <h2 className="text-xl font-semibold mb-3 text-purple-300">
                📝 Research Summary for IEEE Paper
              </h2>
              <div className="space-y-2 text-sm text-purple-100">
                <p>
                  <strong>Framework:</strong> Hybrid evaluation combining deterministic NLP (70%) + semantic similarity (MiniLM, 30%)
                </p>
                <p>
                  <strong>Dataset:</strong> {metrics.totalQuestions} Q&A pairs from {metrics.totalEvaluations} sessions
                </p>
                <p>
                  <strong>Results:</strong> Hybrid achieves {metrics.hybridAverage.toFixed(1)} avg (vs {metrics.deterministicAverage.toFixed(1)} deterministic) — 
                  <span className="text-green-300 font-bold">
                    {" "}+{(((metrics.hybridAverage - metrics.deterministicAverage) / metrics.deterministicAverage) * 100).toFixed(1)}% improvement
                  </span>
                </p>
                <p>
                  <strong>Reliability:</strong> {metrics.aiSuccessRate}% AI success with deterministic fallback ensuring 100% availability
                </p>
                <p>
                  <strong>Correlation:</strong> {metrics.correlation?.toFixed(3)} (Pearson) between deterministic and semantic methods
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
