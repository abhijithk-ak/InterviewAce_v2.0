"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Activity, BarChart2, Clock, Zap, TrendingUp, Database, AlertTriangle, CheckCircle2 } from "lucide-react"
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
  ScatterChart,
  Scatter,
  ZAxis,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
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
  fallbackRate: number
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
    count: number
  }>
  difficultyBreakdown: Record<string, { count: number; avgScore: number }>
  typeBreakdown: Record<string, { count: number; avgScore: number }>
  scatterPlotData: Array<{
    deterministic: number
    semantic: number
    hybrid: number
  }>
  boxPlotData: Array<{
    method: string
    min: number
    q1: number
    median: number
    q3: number
    max: number
  }>
}

const COLORS = {
  deterministic: "#6366f1", // Indigo
  semantic: "#8b5cf6", // Purple
  hybrid: "#10b981", // Green
  ai: "#3b82f6", // Blue
  fallback: "#f59e0b", // Amber
}

export default function ResearchDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null)

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
              <h1 className="text-2xl font-bold">Research Analytics Dashboard</h1>
              <p className="text-sm text-neutral-400">
                Comprehensive evaluation method comparison for IEEE paper analysis
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-900/20 border border-purple-700 rounded-lg">
            <p className="text-xs text-purple-300">
              🔬 Admin-Only Research Mode - Real data from production database
            </p>
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
            <div className="text-neutral-400">No  data available</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-400" />
                Dataset Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-sm text-neutral-400 mb-1">Total Sessions</div>
                  <div className="text-3xl font-bold text-blue-400">{metrics.totalEvaluations}</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-sm text-neutral-400 mb-1">Total Questions</div>
                  <div className="text-3xl font-bold text-purple-400">{metrics.totalQuestions}</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-sm text-neutral-400 mb-1">AI Success Rate</div>
                  <div className="text-3xl font-bold text-green-400">{metrics.aiSuccessRate}%</div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-sm text-neutral-400 mb-1">Avg Latency</div>
                  <div className="text-3xl font-bold text-amber-400">
                    {metrics.avgLatency.toFixed(2)}s
                  </div>
                </div>
                <div className="bg-neutral-700 rounded-lg p-4">
                  <div className="text-sm text-neutral-400 mb-1">Correlation</div>
                  <div className="text-3xl font-bold text-indigo-400">
                    {metrics.correlation?.toFixed(3) || "N/A"}
                  </div>
                </div>
              </div>
            </section>

            {/* Method Comparison Bar Chart */}
            <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-purple-400" />
                Component Average Comparison
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.methodComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="method" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgScore" fill="#8884d8" radius={[8, 8, 0, 0]}>
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
              <div className="mt-4 grid grid-cols-3 gap-4">
                {metrics.methodComparison.map((method, idx) => (
                  <div key={idx} className="bg-neutral-700 rounded-lg p-3">
                    <div className="text-xs text-neutral-400">{method.method}</div>
                    <div className="text-2xl font-bold text-white">{method.avgScore}</div>
                    <div className="text-xs text-neutral-500">σ = {method.stdDev}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <h3 className="font-semibold text-blue-300 mb-2">Key Findings:</h3>
                <ul className="text-sm text-blue-100 space-y-1">
                  <li>
                    • Final hybrid scoring shows{" "}
                    {(metrics.hybridAverage - metrics.deterministicAverage).toFixed(1)} point
                    delta over concept score
                  </li>
                  <li>
                    • Standard deviation decreased from {metrics.deterministicStdDev.toFixed(1)} to{" "}
                    {metrics.hybridStdDev.toFixed(1)} (more consistent scoring)
                  </li>
                  <li>
                    • Correlation: {metrics.correlation?.toFixed(3)} between concept and semantic
                  </li>
                  <li>• Sample size: {metrics.totalQuestions} question-answer pairs</li>
                </ul>
              </div>
            </section>

            {/* Score Distribution */}
            <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Score Distribution by Component
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="deterministic" fill={COLORS.deterministic} name="Concept Score" />
                  <Bar dataKey="semantic" fill={COLORS.semantic} name="Semantic Similarity" />
                  <Bar dataKey="hybrid" fill={COLORS.hybrid} name="Final Hybrid Score" />
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* Time Series */}
            {metrics.timeSeriesData.length > 0 && (
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-amber-400" />
                  Performance Over Time (Last 30 Days)
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="deterministic"
                      stroke={COLORS.deterministic}
                      strokeWidth={2}
                      name="Concept Score"
                    />
                    <Line
                      type="monotone"
                      dataKey="semantic"
                      stroke={COLORS.semantic}
                      strokeWidth={2}
                      name="Semantic Similarity"
                    />
                    <Line
                      type="monotone"
                      dataKey="hybrid"
                      stroke={COLORS.hybrid}
                      strokeWidth={2}
                      name="Final Hybrid Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </section>
            )}

            {/* Scatter Plot - Correlation Visualization */}
            {metrics.scatterPlotData.length > 0 && (
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-400" />
                  Correlation Analysis: Concept vs Semantic Scores
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      dataKey="deterministic"
                      name="Concept Score"
                      stroke="#9ca3af"
                      domain={[0, 100]}
                      label={{ value: 'Concept Score', position: 'insideBottom', offset: -10, fill: '#9ca3af' }}
                    />
                    <YAxis
                      type="number"
                      dataKey="semantic"
                      name="Semantic Similarity"
                      stroke="#9ca3af"
                      domain={[0, 100]}
                      label={{ value: 'Semantic Similarity', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="bg-neutral-800  border border-neutral-600 rounded-lg px-3 py-2 shadow-xl">
                            <p className="text-xs text-neutral-400 mb-1">Score Pair</p>
                            <p className="text-sm font-bold text-indigo-400">
                              Concept: {payload[0]?.value}
                            </p>
                            <p className="text-sm font-bold text-purple-400">
                              Semantic: {payload[1]?.value}
                            </p>
                          </div>
                        )
                      }}
                    />
                    <Scatter
                      name="Q&A Pairs"
                      data={metrics.scatterPlotData}
                      fill={COLORS.semantic}
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-700 rounded-lg">
                  <p className="text-sm text-indigo-100">
                    <strong className="text-indigo-300">Pearson Correlation:</strong>{" "}
                    {metrics.correlation?.toFixed(3) ?? "N/A"}
                    {metrics.correlation !== null && (
                      <>
                        {" "}
                        ({metrics.correlation > 0.7
                          ? "Strong positive"
                          : metrics.correlation > 0.3
                          ? "Moderate positive"
                          : "Weak"}{" "}
                        relationship)
                      </>
                    )}
                  </p>
                  <p className="text-xs text-indigo-200 mt-2">
                    Each point represents a question-answer pair. Clustering near the diagonal
                    indicates agreement between scoring components.
                  </p>
                </div>
              </section>
            )}

            {/* Box Plot - Statistical Distribution */}
            {metrics.boxPlotData.length > 0 && (
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart2 className="w-6 h-6 text-emerald-400" />
                  Statistical Distribution Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {metrics.boxPlotData.map((data, idx) => {
                    const color =
                      data.method === "Concept Score"
                        ? COLORS.deterministic
                        : data.method === "Semantic Similarity"
                        ? COLORS.semantic
                        : COLORS.hybrid
                    return (
                      <div key={idx} className="bg-neutral-700 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">{data.method}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-400">Max:</span>
                            <span className="font-bold" style={{ color }}>
                              {data.max.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-400">Q3 (75%):</span>
                            <span className="font-medium text-neutral-200">
                              {data.q3.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs bg-neutral-600 p-1.5 rounded">
                            <span className="text-neutral-300 font-semibold">Median:</span>
                            <span className="font-bold" style={{ color }}>
                              {data.median.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-400">Q1 (25%):</span>
                            <span className="font-medium text-neutral-200">
                              {data.q1.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-400">Min:</span>
                            <span className="font-bold" style={{ color }}>
                              {data.min.toFixed(1)}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-neutral-600">
                            <div className="text-xs text-neutral-400">IQR (Spread):</div>
                            <div className="text-sm font-bold text-white">
                              {(data.q3 - data.q1).toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-700 rounded-lg">
                  <p className="text-sm text-emerald-100">
                    <strong className="text-emerald-300">Interpretation:</strong> Box plots show
                    the five-number summary (min, Q1, median, Q3, max). A smaller IQR indicates
                    more consistent scoring. The median represents the typical score.
                  </p>
                </div>
              </section>
            )}

            {/* Difficulty & Type Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty Breakdown */}
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h2 className="text-xl font-semibold mb-4">Performance by Difficulty</h2>
                <div className="space-y-3">
                  {Object.entries(metrics.difficultyBreakdown).map(([diff, data]) => (
                    <div key={diff} className="bg-neutral-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white capitalize">{diff}</span>
                        <span className="text-2xl font-bold text-purple-400">
                          {data.avgScore}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        n = {data.count} questions
                      </div>
                      <div className="w-full bg-neutral-600 rounded-full h-2 mt-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{ width: `${data.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Type Breakdown */}
              <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
                <h2 className="text-xl font-semibold mb-4">Performance by Interview Type</h2>
                <div className="space-y-3">
                  {Object.entries(metrics.typeBreakdown).map(([type, data]) => (
                    <div key={type} className="bg-neutral-700 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white capitalize">
                          {type.replace("-", " ")}
                        </span>
                        <span className="text-2xl font-bold text-green-400">{data.avgScore}</span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        n = {data.count} questions
                      </div>
                      <div className="w-full bg-neutral-600 rounded-full h-2 mt-2">
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

            {/* System Reliability */}
            <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                System Reliability Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-300">AI Response Success</span>
                    <span className="font-medium text-green-400">{metrics.aiSuccessRate}%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-green-500"
                      style={{ width: `${metrics.aiSuccessRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-300">Deterministic Fallback</span>
                    <span className="font-medium text-amber-400">{metrics.fallbackRate}%</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-amber-500"
                      style={{ width: `${metrics.fallbackRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-400">
                Hybrid approach ensures 100% evaluation coverage with graceful degradation
              </div>
            </section>

            {/* Research Summary */}
            <section className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700">
              <h2 className="text-xl font-semibold mb-3 text-purple-300">
                📝 IEEE Paper Research Summary
              </h2>
              <div className="space-y-3 text-sm text-purple-100">
                <p>
                  <strong className="text-purple-200">Framework:</strong> Hybrid interview
                  evaluation combining deterministic linguistic analysis (70%) with semantic
                  similarity using MiniLM transformer (30%).
                </p>
                <p>
                  <strong className="text-purple-200">Dataset:</strong> {metrics.totalQuestions}{" "}
                  question-answer pairs from {metrics.totalEvaluations} interview sessions.
                </p>
                <p>
                  <strong className="text-purple-200">Results:</strong> Hybrid method achieves{" "}
                  {metrics.hybridAverage} average score vs {metrics.deterministicAverage}{" "}
                  (deterministic) —{" "}
                  {(
                    ((metrics.hybridAverage - metrics.deterministicAverage) /
                      metrics.deterministicAverage) *
                    100
                  ).toFixed(1)}
                  % improvement with {metrics.hybridStdDev} standard deviation.
                </p>
                <p>
                  <strong className="text-purple-200">Reliability:</strong> {metrics.aiSuccessRate}%
                  AI success rate with deterministic fallback ensuring 100% system availability.
                </p>
                <p>
                  <strong className="text-purple-200">Correlation:</strong>{" "}
                  {metrics.correlation?.toFixed(3)} between deterministic and semantic methods
                  indicates complementary evaluation approaches.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
