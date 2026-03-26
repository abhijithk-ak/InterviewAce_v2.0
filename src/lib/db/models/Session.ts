import mongoose, { Schema, Document } from "mongoose"

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface IEvaluationBreakdown {
  conceptScore?: number
  semanticScore?: number
  clarityScore?: number
}

export interface IEvaluation {
  overallScore?: number
  /** Canonical nested breakdown — preferred for all new sessions */
  breakdown?: IEvaluationBreakdown
  feedback?: string
  explanation?: string
  errors?: string[]
  evaluationMethod?: string
  aiEvaluationUsed?: boolean
  semanticModel?: string
  conceptModel?: string
  strengths?: string[]
  improvements?: string[]
  /** @deprecated Legacy flat fields — preserved for backward compat with old sessions */
  score?: number
  deterministicScore?: number
  semanticScore?: number
  finalScore?: number
  conceptScore?: number
  clarityScore?: number
  confidence?: number
  clarity?: number
  technical_depth?: number
}

export interface IMetrics {
  overallScore?: number
  conceptScore?: number
  /** Rule-based NLP score (0-100) */
  deterministicScore: number
  /** Raw Sentence-BERT similarity (0-10) */
  semanticScore: number
  /** Blended hybrid score (0-100) — official interview score */
  finalScore: number
  clarityScore?: number
  /** Character count of the submitted answer */
  answerLength: number
  /** Time from answer submission to evaluation completion (ms) */
  responseTime: number
  /** ISO timestamp when the answer was submitted */
  timestamp: string
}

export interface IQuestion {
  text?: string
  answer?: string
  kind?: "main"
  researchLabel?: "correct" | "partial" | "incorrect"
  evaluation?: IEvaluation
  /** Experiment metrics — used for IEEE research graphs */
  metrics?: IMetrics
}

export interface ISessionConfig {
  role?: string
  type?: string
  difficulty?: string
  source?: string
}

export interface ISession extends Document {
  userEmail: string
  startedAt: Date
  endedAt?: Date
  config?: ISessionConfig
  questions?: IQuestion[]
  overallScore?: number
  coachSummary?: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
  evaluationMethod?: string
  createdAt?: Date
  updatedAt?: Date
}

// ─── Mongoose Schemas ─────────────────────────────────────────────────────────

const EvaluationSchema = new Schema({
  overallScore: { type: Number },
  /** Canonical nested breakdown — all new sessions use this */
  breakdown: {
    conceptScore: { type: Number },
    semanticScore: { type: Number },
    clarityScore: { type: Number },
  },
  feedback: { type: String },
  explanation: { type: String },
  errors: [String],
  evaluationMethod: { type: String },
  aiEvaluationUsed: { type: Boolean },
  semanticModel: { type: String },
  conceptModel: { type: String },
  strengths: [String],
  improvements: [String],
  /** @deprecated Legacy flat fields — kept for backward compat when reading old sessions */
  score: { type: Number },
  deterministicScore: { type: Number },
  semanticScore: { type: Number },
  finalScore: { type: Number },
  conceptScore: { type: Number },
  clarityScore: { type: Number },
  confidence: { type: Number },
  clarity: { type: Number },
  technical_depth: { type: Number },
})

const MetricsSchema = new Schema({
  overallScore:        { type: Number },
  conceptScore:        { type: Number },
  deterministicScore: { type: Number },
  semanticScore:      { type: Number },
  finalScore:         { type: Number },
  clarityScore:       { type: Number },
  answerLength:       { type: Number },
  responseTime:       { type: Number },
  timestamp:          { type: String },
}, { _id: false })

const QuestionSchema = new Schema({
  text: String,
  answer: String,
  kind: {
    type: String,
    enum: ["main"],
    default: "main",
  },
  researchLabel: {
    type: String,
    enum: ["correct", "partial", "incorrect"],
  },
  evaluation: EvaluationSchema,
  /** Experiment metrics for research and graph generation */
  metrics: MetricsSchema,
})

const ConfigSchema = new Schema({
  role: String,
  type: String,
  difficulty: String,
  source: String,
}, { _id: false })

const SessionSchema = new Schema(
  {
    userEmail: { type: String, required: true },

    startedAt: { type: Date, required: true },
    endedAt: { type: Date },

    config: ConfigSchema,

    questions: [QuestionSchema],

    overallScore: Number,
    coachSummary: {
      strengths: [String],
      improvements: [String],
      recommendations: [String],
    },
    evaluationMethod: String,
  },
  { timestamps: true }
)

export const SessionModel =
  mongoose.models.Session ||
  mongoose.model("Session", SessionSchema)
