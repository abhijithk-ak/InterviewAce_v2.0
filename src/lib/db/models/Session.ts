import mongoose, { Schema, Document } from "mongoose"

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface IEvaluation {
  /** Legacy score — kept for backward compatibility with old sessions */
  score?: number
  /** Rule-based NLP score (0-100); kept for research and analytics */
  deterministicScore?: number
  /** Raw Sentence-BERT similarity score (0-10); kept for research and analytics */
  semanticScore?: number
  /** Official hybrid score: deterministicScore * 0.6 + semanticScore * 10 * 0.4 (0-100) */
  finalScore?: number
  confidence?: number
  clarity?: number
  technical_depth?: number
  strengths?: string[]
  improvements?: string[]
}

export interface IMetrics {
  /** Rule-based NLP score (0-100) */
  deterministicScore: number
  /** Raw Sentence-BERT similarity (0-10) */
  semanticScore: number
  /** Blended hybrid score (0-100) — official interview score */
  finalScore: number
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
  evaluation?: IEvaluation
  /** Experiment metrics — used for IEEE research graphs */
  metrics?: IMetrics
}

export interface ISessionConfig {
  role?: string
  type?: string
  difficulty?: string
}

export interface ISession extends Document {
  userEmail: string
  startedAt: Date
  endedAt?: Date
  config?: ISessionConfig
  questions?: IQuestion[]
  overallScore?: number
  createdAt?: Date
  updatedAt?: Date
}

// ─── Mongoose Schemas ─────────────────────────────────────────────────────────

const EvaluationSchema = new Schema({
  /** Legacy — kept for backward compatibility; new sessions use finalScore */
  score: { type: Number },
  /** Rule-based NLP score (0-100, for research comparisons) */
  deterministicScore: { type: Number },
  /** Raw ML semantic similarity (0-10, for research comparisons) */
  semanticScore: { type: Number },
  /** Official interview score used for display and analytics (0-100) */
  finalScore: { type: Number },
  confidence: { type: Number },
  clarity: { type: Number },
  technical_depth: { type: Number },
  strengths: [String],
  improvements: [String],
})

const MetricsSchema = new Schema({
  deterministicScore: { type: Number },
  semanticScore:      { type: Number },
  finalScore:         { type: Number },
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
  evaluation: EvaluationSchema,
  /** Experiment metrics for research and graph generation */
  metrics: MetricsSchema,
})

const ConfigSchema = new Schema({
  role: String,
  type: String,
  difficulty: String,
}, { _id: false })

const SessionSchema = new Schema(
  {
    userEmail: { type: String, required: true },

    startedAt: { type: Date, required: true },
    endedAt: { type: Date },

    config: ConfigSchema,

    questions: [QuestionSchema],

    overallScore: Number,
  },
  { timestamps: true }
)

export const SessionModel =
  mongoose.models.Session ||
  mongoose.model("Session", SessionSchema)
