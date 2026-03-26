"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Activity, AlertTriangle, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"

type ResearchMetrics = {
  totalEvaluations: number
  totalQuestions: number
  deterministicAverage: number
  semanticAverage: number
  clarityAverage: number
  hybridAverage: number
  deterministicStdDev: number
  semanticStdDev: number
  clarityStdDev: number
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
  sessionTimelineData: Array<{
    sessionNumber: number
    sessionId: string
    date: string
    timestamp: string
    deterministic: number
    semantic: number
    hybrid: number
    questionCount: number
  }>
  scatterPlotData: Array<{
    deterministic: number
    semantic: number
    hybrid: number
    answerQuality?: "correct" | "partial" | "incorrect" | "unknown"
  }>
  errorDetectionEffectiveness: Array<{
    label: string
    avgConcept: number
    avgSemantic: number
    avgClarity: number
    avgHybrid: number
    count: number
  }>
  hybridContributionAnalysis: Array<{
    label: string
    conceptContribution: number
    semanticContribution: number
    clarityContribution: number
    totalHybrid: number
    count: number
  }>
  boxPlotData: Array<{
    method: string
    min: number
    q1: number
    median: number
    q3: number
    max: number
  }>
  difficultyBreakdown: Record<string, { count: number; avgScore: number }>
  typeBreakdown: Record<string, { count: number; avgScore: number }>
}

const COLORS = {
  deterministic: "#3B82F6", // Blue
  semantic: "#8B5CF6",      // Purple
  clarity: "#f59e0b",       // Amber
  hybrid: "#10B981",        // Green
}

const CHART_GRID = "rgba(0,0,0,0.15)"
const CHART_AXIS = "#374151"
const CHART_LABEL = "#4b5563"
const AXIS_TICK_FONT_SIZE = 12
const AXIS_LABEL_FONT_SIZE = 14
const AXIS_LABEL_STYLE = { fill: CHART_LABEL, fontSize: AXIS_LABEL_FONT_SIZE, fontWeight: 600 }
const CHART_EXPORT_WRAPPER = "bg-white rounded-[10px] p-6"

const DIFFICULTY_ORDER = ["easy", "medium", "hard"]
const TYPE_ORDER = ["technical", "system-design", "behavioural", "hr"]

function formatCategoryLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function ImprovedResearchDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null)
  // Detect if hybrid mode has been used
  const isHybridModeActive = metrics ? metrics.semanticAverage > 1 : false
  const isDeterministicOnly = metrics ? metrics.semanticAverage <= 1 && metrics.totalQuestions > 0 : false

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
      <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-neutral-500 text-xs mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-bold">
            {entry.name}: {entry.value?.toFixed(1)}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold">Research Analytics - Hybrid Evaluation</h1>
              <p className="text-sm text-neutral-600">
                Hybrid Score Component Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-neutral-500">Loading research data...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400">Error: {error}</div>
          </div>
        ) : !metrics ? (
          <div className="text-center py-12">
            <div className="text-neutral-500">No data available</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Settings Storage Info Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">
                    ✅ Database Storage Information
                  </h3>
                  <p className="text-xs text-blue-700">
                    <strong>Interview settings are now stored in MongoDB</strong> for cross-device synchronization and research tracking. 
                    Your preferences (AI model, scoring mode, interview length) persist across all devices and browsers. 
                    Session data (scores, evaluations, metrics) is also stored in MongoDB for comprehensive research analysis.
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-blue-700">Current Scoring Mode:</span>
                    <span className="px-2 py-0.5 bg-blue-100 rounded text-blue-900 font-mono">
                      {isDeterministicOnly ? "Concept + Final Only" : isHybridModeActive ? "AI + MiniLM Hybrid" : "Unknown"}
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
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-amber-800 mb-2">
                      ⚠️ Hybrid Mode NOT Enabled
                    </h3>
                    <p className="text-amber-800 mb-3">
                      You are currently using <strong>Deterministic Scoring Only</strong>. All semantic scores are 0.
                      To collect comparative data for your IEEE research paper, you need to enable Hybrid Mode.
                    </p>
                    <div className="bg-amber-100 rounded-lg p-4 border border-amber-300">
                      <p className="text-sm text-amber-900 font-semibold mb-2">How to Enable Hybrid Mode:</p>
                      <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                        <li>Navigate to <a href="/settings" className="underline font-bold hover:text-amber-950">Settings</a></li>
                        <li>Under "Scoring Configuration", select <strong>"Hybrid (Experimental)"</strong></li>
                        <li>Click "Save Settings"</li>
                        <li>Run new interview sessions to collect hybrid data</li>
                      </ol>
                    </div>
                    <div className="mt-3 text-xs text-amber-700">
                      📊 Current Data: {metrics.totalQuestions} questions with limited hybrid metadata. 
                      Semantic and final-score comparisons become more informative as more evaluated sessions are stored.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Banner if Hybrid Mode Active */}
            {isHybridModeActive && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-800 font-semibold">
                      ✅ Hybrid Mode Active - Collecting Complete Research Data
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {metrics.totalQuestions} questions analyzed | Semantic avg: {metrics.semanticAverage.toFixed(1)} | 
                      Correlation: {metrics.correlation?.toFixed(3)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dataset Overview */}
            <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-neutral-900">📊 Dataset Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-xs text-neutral-500 mb-1">Total Sessions</div>
                  <div className="text-3xl font-bold text-blue-400">{metrics.totalEvaluations}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-xs text-neutral-500 mb-1">Total Questions</div>
                  <div className="text-3xl font-bold text-purple-400">{metrics.totalQuestions}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-xs text-neutral-500 mb-1">AI Success Rate</div>
                  <div className="text-3xl font-bold text-green-400">{metrics.aiSuccessRate}%</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-xs text-neutral-500 mb-1">Correlation</div>
                  <div className="text-3xl font-bold text-indigo-400">
                    {metrics.correlation?.toFixed(3) || "N/A"}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 1: Individual Method Performance */}
            <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
                Hybrid Score Components
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Deterministic Method */}
                <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300">
                  <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    AI Concept Score
                  </h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-indigo-400 mb-1">
                      {metrics.deterministicAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-blue-700">Average Score (0-100)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Std Dev:</span>
                      <span className="font-bold text-neutral-900">{metrics.deterministicStdDev.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Sample Size:</span>
                      <span className="font-bold text-neutral-900">n={metrics.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Component:</span>
                      <span className="font-medium text-blue-700">Reasoning Accuracy</span>
                    </div>
                  </div>
                  {/* Score Distribution for Deterministic */}
                  <div className="mt-4 pt-4 border-t border-blue-300">
                    <div className="text-xs text-blue-700 mb-2 font-semibold">Score Distribution:</div>
                    {metrics.scoreDistribution.map((range) => (
                      <div key={range.range} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-500 w-16">{range.range}</span>
                        <div className="flex-1 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-indigo-500"
                            style={{
                              width: `${(range.deterministic / metrics.totalQuestions) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-600 w-8 text-right">
                          {range.deterministic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic Method */}
                <div className={`bg-purple-50 rounded-lg p-5 border-2 ${
                  isDeterministicOnly ? 'border-neutral-300 opacity-70' : 'border-purple-300'
                }`}>
                  <h3 className="text-sm font-semibold text-purple-700 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    Semantic Similarity
                    {isDeterministicOnly && (
                      <span className="text-xs text-amber-400 ml-auto">⚠️ Not Active</span>
                    )}
                  </h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-purple-400 mb-1">
                      {metrics.semanticAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-purple-700">Average Score (0-100)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Std Dev:</span>
                      <span className="font-bold text-neutral-900">{metrics.semanticStdDev.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Sample Size:</span>
                      <span className="font-bold text-neutral-900">n={metrics.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Component:</span>
                      <span className="font-medium text-purple-700">Reference Similarity</span>
                    </div>
                  </div>
                  {/* Score Distribution for Semantic */}
                  <div className="mt-4 pt-4 border-t border-purple-300">
                    <div className="text-xs text-purple-700 mb-2 font-semibold">Score Distribution:</div>
                    {metrics.scoreDistribution.map((range) => (
                      <div key={range.range} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-500 w-16">{range.range}</span>
                        <div className="flex-1 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-purple-500"
                            style={{
                              width: `${(range.semantic / Math.max(metrics.totalQuestions, 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-600 w-8 text-right">
                          {range.semantic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hybrid Method */}
                <div className={`bg-green-50 rounded-lg p-5 border-2 ${
                  isDeterministicOnly ? 'border-neutral-300 opacity-70' : 'border-green-300'
                }`}>
                  <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Final Hybrid Score
                    {isDeterministicOnly && (
                      <span className="text-xs text-amber-400 ml-auto">⚠️ Not Active</span>
                    )}
                  </h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-green-400 mb-1">
                      {metrics.hybridAverage.toFixed(1)}
                    </div>
                    <div className="text-xs text-green-700">Average Score (0-100)</div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Std Dev:</span>
                      <span className="font-bold text-neutral-900">{metrics.hybridStdDev.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Sample Size:</span>
                      <span className="font-bold text-neutral-900">n={metrics.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Formula:</span>
                      <span className="font-medium text-green-700">0.55C + 0.30S + 0.15Cl</span>
                    </div>
                  </div>
                  {/* Score Distribution for Hybrid */}
                  <div className="mt-4 pt-4 border-t border-green-300">
                    <div className="text-xs text-green-700 mb-2 font-semibold">Score Distribution:</div>
                    {metrics.scoreDistribution.map((range) => (
                      <div key={range.range} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-500 w-16">{range.range}</span>
                        <div className="flex-1 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width: `${(range.hybrid / Math.max(metrics.totalQuestions, 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-neutral-600 w-8 text-right">
                          {range.hybrid}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {metrics.sessionTimelineData.length > 0 && (
              <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Method Performance Over Sessions
                </h2>
                <p className="text-sm text-neutral-600 mb-5">
                  Session-wise trend lines for Concept Score, Semantic Similarity, and Final Hybrid Score.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <div className={CHART_EXPORT_WRAPPER}>
                    <h3 className="text-sm font-semibold text-blue-700 mb-3">Concept Score by Session</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={metrics.sessionTimelineData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                        <XAxis dataKey="sessionNumber" stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} />
                        <YAxis stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} domain={[0, 100]} label={{ value: "Score", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="deterministic" name="Concept Score" stroke={COLORS.deterministic} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={CHART_EXPORT_WRAPPER}>
                    <h3 className="text-sm font-semibold text-purple-700 mb-3">Semantic Similarity by Session</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={metrics.sessionTimelineData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                        <XAxis dataKey="sessionNumber" stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} />
                        <YAxis stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} domain={[0, 100]} label={{ value: "Score", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="semantic" name="Semantic Similarity" stroke={COLORS.semantic} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className={CHART_EXPORT_WRAPPER}>
                    <h3 className="text-sm font-semibold text-green-700 mb-3">Final Hybrid Score by Session</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={metrics.sessionTimelineData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                        <XAxis dataKey="sessionNumber" stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} />
                        <YAxis stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} domain={[0, 100]} label={{ value: "Score", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="hybrid" name="Final Hybrid Score" stroke={COLORS.hybrid} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={CHART_EXPORT_WRAPPER}>
                  <h3 className="text-base font-semibold text-neutral-800 mb-3">Session-wise Comparison of All Methods</h3>
                  <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={metrics.sessionTimelineData} margin={{ top: 20, right: 20, bottom: 44, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis
                        dataKey="sessionNumber"
                        stroke={CHART_AXIS}
                        tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                      />
                      <YAxis
                        stroke={CHART_AXIS}
                        tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                        domain={[0, 100]}
                        label={{ value: "Score", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null
                          const row = payload[0]?.payload
                          return (
                            <div className="bg-white border border-neutral-200 rounded-lg px-3 py-2 shadow-xl">
                              <p className="text-xs text-neutral-500 mb-1">Session {label} • {row?.date}</p>
                              {payload.map((entry: any, idx: number) => (
                                <p key={idx} style={{ color: entry.color }} className="text-sm font-semibold">
                                  {entry.name}: {entry.value?.toFixed(1)}
                                </p>
                              ))}
                            </div>
                          )
                        }}
                      />
                      <Legend verticalAlign="bottom" align="center" iconType="circle" height={42} wrapperStyle={{ paddingTop: 12 }} />
                      <Line type="monotone" dataKey="deterministic" name="Concept Score" stroke={COLORS.deterministic} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="semantic" name="Semantic Similarity" stroke={COLORS.semantic} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="hybrid" name="Final Hybrid Score" stroke={COLORS.hybrid} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {metrics.errorDetectionEffectiveness.length > 0 && (
                <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-rose-400" />
                    Error Detection Effectiveness
                  </h2>
                  <p className="text-sm text-neutral-400 mb-4">
                    Average hybrid score by answer quality. This chart shows whether the evaluator separates correct, partial, and incorrect responses.
                  </p>
                  <div className={CHART_EXPORT_WRAPPER}>
                    <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={metrics.errorDetectionEffectiveness} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} opacity={0.8} />
                      <XAxis dataKey="label" stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} />
                      <YAxis
                        stroke={CHART_AXIS}
                        tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                        domain={[0, 100]}
                        label={{ value: "Hybrid Score", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const data = payload[0].payload
                          return (
                            <div className="bg-white border border-rose-200 rounded-lg px-4 py-3 shadow-xl">
                              <p className="text-sm font-bold text-rose-300 mb-2">{data.label} Answers</p>
                              <p className="text-sm text-green-400">Hybrid: {data.avgHybrid.toFixed(1)}</p>
                              <p className="text-xs text-indigo-400">Concept: {data.avgConcept.toFixed(1)}</p>
                              <p className="text-xs text-purple-400">Semantic: {data.avgSemantic.toFixed(1)}</p>
                              <p className="text-xs text-amber-400">Clarity: {data.avgClarity.toFixed(1)}</p>
                              <p className="text-xs text-neutral-500 mt-2">n = {data.count}</p>
                            </div>
                          )
                        }}
                      />
                      <Bar dataKey="avgHybrid" name="Average Hybrid Score" radius={[8, 8, 0, 0]}>
                        {metrics.errorDetectionEffectiveness.map((entry, index) => (
                          <Cell
                            key={`quality-${index}`}
                            fill={
                              entry.label === "Correct"
                                ? COLORS.hybrid
                                : entry.label === "Partial"
                                ? COLORS.semantic
                                : "#ef4444"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

              {metrics.hybridContributionAnalysis.length > 0 && (
                <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    Weighted Contribution of Evaluation Components
                  </h2>
                  <p className="text-sm text-neutral-400 mb-4">
                    Weighted component contributions using the production formula: 0.60 concept, 0.25 semantic, 0.15 clarity.
                  </p>
                  <div className={CHART_EXPORT_WRAPPER}>
                    <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={metrics.hybridContributionAnalysis} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} opacity={0.8} />
                      <XAxis dataKey="label" stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} />
                      <YAxis
                        stroke={CHART_AXIS}
                        tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                        domain={[0, 100]}
                        label={{ value: "Weighted Contribution", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          const data = payload[0].payload
                          return (
                            <div className="bg-white border border-amber-200 rounded-lg px-4 py-3 shadow-xl">
                              <p className="text-sm font-bold text-amber-300 mb-2">{data.label} Answers</p>
                              <p className="text-xs text-indigo-400">Concept contribution: {data.conceptContribution.toFixed(1)}</p>
                              <p className="text-xs text-purple-400">Semantic contribution: {data.semanticContribution.toFixed(1)}</p>
                              <p className="text-xs text-amber-400">Clarity contribution: {data.clarityContribution.toFixed(1)}</p>
                              <p className="text-sm text-green-400 mt-2">Hybrid average: {data.totalHybrid.toFixed(1)}</p>
                              <p className="text-xs text-neutral-500">n = {data.count}</p>
                            </div>
                          )
                        }}
                      />
                      <Legend />
                      <Bar dataKey="conceptContribution" stackId="hybrid" fill={COLORS.deterministic} name="Concept Score" />
                      <Bar dataKey="semanticContribution" stackId="hybrid" fill={COLORS.semantic} name="Semantic Similarity" />
                      <Bar dataKey="clarityContribution" stackId="hybrid" fill={COLORS.clarity} name="Clarity Score" />
                    </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}
            </div>

            {/* SECTION 2: Method Comparison */}
            <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Component Average Comparison
              </h2>
              <div className={CHART_EXPORT_WRAPPER}>
                <ResponsiveContainer width="100%" height={350}>
                <BarChart data={metrics.methodComparison} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis dataKey="method" stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} />
                  <YAxis stroke={CHART_AXIS} tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }} domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft', ...AXIS_LABEL_STYLE }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="avgScore" name="Average Score" radius={[8, 8, 0, 0]}>
                    {metrics.methodComparison.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.method === "Concept Score"
                            ? COLORS.deterministic
                            : entry.method === "Semantic Similarity"
                            ? COLORS.semantic
                            : COLORS.hybrid
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">📊 Statistical Analysis:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-800">Final vs Concept:</span>
                    <div className="text-2xl font-bold text-green-400 mt-1">
                      +{(metrics.hybridAverage - metrics.deterministicAverage).toFixed(1)} points
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      ({metrics.deterministicAverage > 0 ? (((metrics.hybridAverage - metrics.deterministicAverage) / metrics.deterministicAverage) * 100).toFixed(1) : '0.0'}% delta)
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-800">Variance Change:</span>
                    <div className="text-2xl font-bold text-green-400 mt-1">
                      -{(metrics.deterministicStdDev - metrics.hybridStdDev).toFixed(2)} σ
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      (Lower variance indicates more stable scoring)
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-800">Concept/Semantic Correlation:</span>
                    <div className="text-2xl font-bold text-indigo-400 mt-1">
                      {metrics.correlation?.toFixed(3) || "N/A"}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {metrics.correlation && metrics.correlation > 0.5
                        ? "(Moderate-Strong agreement)"
                        : "Low correlation indicates that semantic similarity alone does not capture conceptual correctness. This supports the need for hybrid evaluation combining reasoning-based AI scoring with semantic similarity."}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: Scatter Correlation */}
            {metrics.scatterPlotData.length > 0 && (
              <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">📉 Concept vs Semantic Correlation</h2>
                <div className={CHART_EXPORT_WRAPPER}>
                  <ResponsiveContainer width="100%" height={420}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} strokeWidth={1} opacity={0.8} />
                    <XAxis
                      type="number"
                      dataKey="deterministic"
                      name="Concept Score"
                      stroke={CHART_AXIS}
                      domain={[0, 100]}
                      tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                      label={{ value: 'Concept Score', position: 'insideBottom', offset: -10, ...AXIS_LABEL_STYLE }}
                    />
                    <YAxis 
                      type="number"
                      dataKey="semantic"
                      name="Semantic Score"
                      stroke={CHART_AXIS} 
                      domain={[0, 100]} 
                      tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                      label={{ value: 'Semantic Score', angle: -90, position: 'insideLeft', ...AXIS_LABEL_STYLE }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const data = payload[0].payload
                        return (
                          <div className="bg-white border-2 border-purple-200 rounded-lg px-4 py-3 shadow-2xl">
                            <p className="text-sm font-bold text-purple-300 mb-2">Question Score Pair</p>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-indigo-400 flex justify-between gap-4">
                                <span>Concept:</span>
                                <span>{data.deterministic.toFixed(1)}</span>
                              </p>
                              <p className="text-sm font-bold text-purple-400 flex justify-between gap-4">
                                <span>Semantic:</span>
                                <span>{data.semantic.toFixed(1)}</span>
                              </p>
                              <p className="text-sm font-bold text-green-400 flex justify-between gap-4">
                                <span>Final:</span>
                                <span>{data.hybrid.toFixed(1)}</span>
                              </p>
                            </div>
                          </div>
                        )
                      }}
                    />
                    <Scatter
                      name="Score Pairs"
                      data={metrics.scatterPlotData}
                      opacity={0.8}
                      shape={(props: any) => {
                        const { cx, cy, payload } = props
                        const pointColor =
                          payload?.answerQuality === "correct"
                            ? "#10B981"
                            : payload?.answerQuality === "partial"
                            ? "#F59E0B"
                            : "#EF4444"
                        return <circle cx={cx} cy={cy} r={6} fill={pointColor} fillOpacity={0.8} />
                      }}
                      activeShape={(props: any) => {
                        const { cx, cy, payload } = props
                        const pointColor =
                          payload?.answerQuality === "correct"
                            ? "#10B981"
                            : payload?.answerQuality === "partial"
                            ? "#F59E0B"
                            : "#EF4444"
                        return <circle cx={cx} cy={cy} r={8} fill={pointColor} fillOpacity={0.9} />
                      }}
                    />
                  </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-800">
                    <strong>Research note:</strong> This scatter plot is more useful than day-based trends for sparse datasets because it shows how closely concept accuracy and semantic similarity agree on individual scored answers.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-700">
                    <span className="font-semibold text-neutral-800">Point legend:</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                      Correct
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      Partial
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                      Incorrect
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 4: IEEE-Relevant Statistical Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score Distribution Analysis */}
              <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-neutral-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Distribution of Evaluation Scores
                </h3>
                <div className={CHART_EXPORT_WRAPPER}>
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.scoreDistribution} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} barGap={6} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} opacity={0.8} />
                    <XAxis 
                      dataKey="range" 
                      stroke={CHART_AXIS} 
                      tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke={CHART_AXIS} 
                      tick={{ fontSize: AXIS_TICK_FONT_SIZE, fill: CHART_AXIS }}
                      label={{ value: 'Count', angle: -90, position: 'insideLeft', ...AXIS_LABEL_STYLE }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const data = payload[0].payload
                        return (
                          <div className="bg-white border-2 border-cyan-200 rounded-lg px-3 py-2 shadow-xl">
                            <p className="text-xs font-bold text-cyan-300 mb-1">{data.range}</p>
                            <div className="space-y-0.5">
                              <p className="text-xs text-indigo-400">Concept: {data.deterministic}</p>
                              <p className="text-xs text-purple-400">Semantic: {data.semantic}</p>
                              <p className="text-xs text-green-400">Final: {data.hybrid}</p>
                            </div>
                          </div>
                        )
                      }}
                    />
                    <Legend iconType="square" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="deterministic" fill={COLORS.deterministic} name="Concept Score" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="semantic" fill={COLORS.semantic} name="Semantic Similarity" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="hybrid" fill={COLORS.hybrid} name="Final Hybrid Score" radius={[4, 4, 0, 0]} />
                  </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <p className="text-xs text-cyan-800">
                      <strong>Distribution Pattern:</strong> Shows the score spread for concept, semantic, and final hybrid outputs without implying a temporal trend in the synthetic dataset.
                  </p>
                </div>
              </section>

              {/* Statistical Summary & Correlation */}
              <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-neutral-900">
                  📊 Statistical Summary & Correlation
                </h3>
                
                {/* Statistical Table */}
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-2 px-2 text-neutral-600 font-medium">Method</th>
                        <th className="text-right py-2 px-2 text-neutral-600 font-medium">Mean</th>
                        <th className="text-right py-2 px-2 text-neutral-600 font-medium">σ</th>
                        <th className="text-right py-2 px-2 text-neutral-600 font-medium">n</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr className="hover:bg-neutral-50">
                        <td className="py-2 px-2 text-indigo-400 font-medium">Concept Score</td>
                        <td className="text-right py-2 px-2 text-neutral-900 font-bold">
                          {metrics.deterministicAverage.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2 text-neutral-600">
                          {metrics.deterministicStdDev.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2 text-neutral-500">
                          {metrics.totalQuestions}
                        </td>
                      </tr>
                      <tr className="hover:bg-neutral-50">
                        <td className="py-2 px-2 text-purple-400 font-medium">Semantic Similarity</td>
                        <td className="text-right py-2 px-2 text-neutral-900 font-bold">
                          {metrics.semanticAverage.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2 text-neutral-600">
                          {metrics.semanticStdDev.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2 text-neutral-500">
                          {metrics.totalQuestions}
                        </td>
                      </tr>
                      <tr className="hover:bg-neutral-50">
                        <td className="py-2 px-2 text-green-400 font-medium">Final Hybrid Score</td>
                        <td className="text-right py-2 px-2 text-neutral-900 font-bold">
                          {metrics.hybridAverage.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2 text-neutral-600">
                          {metrics.hybridStdDev.toFixed(2)}
                        </td>
                        <td className="text-right py-2 px-2 text-neutral-500">
                          {metrics.totalQuestions}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Correlation Matrix */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-800 mb-3">
                    Correlation Analysis (Pearson)
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-700">Concept ↔ Semantic:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-neutral-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{
                              width: `${Math.abs((metrics.correlation || 0) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-neutral-900 w-12 text-right">
                          {metrics.correlation?.toFixed(3) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3 border border-purple-100">
                      <p className="text-xs text-neutral-700 mb-2">
                        <strong className="text-neutral-900">Interpretation:</strong>
                      </p>
                      <ul className="text-xs text-neutral-600 space-y-1 list-disc list-inside">
                        <li>r &gt; 0.7: Strong positive correlation</li>
                        <li>0.5 &lt; r ≤ 0.7: Moderate correlation</li>
                        <li>r ≤ 0.5: Weak correlation</li>
                      </ul>
                      {metrics.correlation && (
                        <p className="text-xs text-purple-300 mt-2 font-semibold">
                          Current: {
                            metrics.correlation > 0.7 
                              ? "✅ Strong agreement between methods"
                              : metrics.correlation > 0.5
                              ? "⚠️ Moderate agreement"
                              : "Low correlation indicates that semantic similarity alone does not capture conceptual correctness. This supports the need for hybrid evaluation combining reasoning-based AI scoring with semantic similarity."
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Method Variance Comparison */}
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="text-xs font-semibold text-amber-800 mb-2">Consistency Analysis:</h4>
                  <p className="text-xs text-amber-800">
                    {metrics.hybridStdDev < metrics.deterministicStdDev
                      ? `✅ Hybrid shows ${((1 - metrics.hybridStdDev / metrics.deterministicStdDev) * 100).toFixed(1)}% less variance than the concept component (more consistent)`
                      : `⚠️ Hybrid variance is ${((metrics.hybridStdDev / metrics.deterministicStdDev - 1) * 100).toFixed(1)}% higher than the concept component`
                    }
                  </p>
                </div>
              </section>
            </div>

            {/* Additional Context Sections (kept for reference) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-neutral-900">📚 By Difficulty Level</h3>
                <div className="space-y-2">
                  {Object.entries(metrics.difficultyBreakdown)
                    .sort(([left], [right]) => DIFFICULTY_ORDER.indexOf(left) - DIFFICULTY_ORDER.indexOf(right))
                    .map(([diff, data]) => (
                      <div key={diff} className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-neutral-700">{formatCategoryLabel(diff)}</span>
                          <span className="text-lg font-bold text-purple-400">{data.avgScore}</span>
                        </div>
                        <div className="text-xs text-neutral-500">n = {data.count}</div>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${data.avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-neutral-500 mt-3 italic">
                  Reference: Average hybrid scores by question difficulty
                </p>
              </section>

              <section className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-neutral-900">🎯 By Interview Type</h3>
                <div className="space-y-2">
                  {Object.entries(metrics.typeBreakdown)
                    .sort(([left], [right]) => TYPE_ORDER.indexOf(left) - TYPE_ORDER.indexOf(right))
                    .map(([type, data]) => (
                      <div key={type} className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-neutral-700">
                            {formatCategoryLabel(type)}
                          </span>
                          <span className="text-lg font-bold text-green-400">{data.avgScore}</span>
                        </div>
                        <div className="text-xs text-neutral-500">n = {data.count}</div>
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2">
                          <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${data.avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-neutral-500 mt-3 italic">
                  Reference: Average hybrid scores by interview category
                </p>
              </section>
            </div>

            {/* Research Summary */}
            <section className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-3 text-purple-800">
                📝 Research Summary for IEEE Paper
              </h2>
              <div className="space-y-2 text-sm text-neutral-700">
                <p>
                  <strong>Framework:</strong> AI + MiniLM hybrid evaluation using weighted concept, semantic, and clarity signals (0.55 / 0.30 / 0.15)
                </p>
                <p>
                  <strong>Dataset:</strong> {metrics.totalQuestions} evaluated answers across {metrics.totalEvaluations} interview sessions, 4 interview types, and 3 difficulty levels
                </p>
                <p>
                  <strong>Results:</strong> Hybrid achieves {metrics.hybridAverage.toFixed(1)} avg (vs {metrics.deterministicAverage.toFixed(1)} concept) - 
                  <span className="text-green-300 font-bold">
                    {" "}+{(((metrics.hybridAverage - metrics.deterministicAverage) / metrics.deterministicAverage) * 100).toFixed(1)}% improvement
                  </span>
                </p>
                <p>
                  <strong>Reliability:</strong> {metrics.aiSuccessRate}% of sessions were successfully scored with the AI + MiniLM hybrid evaluator
                </p>
                <p>
                  <strong>Correlation:</strong> {metrics.correlation?.toFixed(3)} (Pearson) between concept and semantic components
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
