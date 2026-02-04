import mongoose, { Schema } from "mongoose"

const EvaluationSchema = new Schema({
  score: Number,
  confidence: Number,
  clarity: Number,
  technical_depth: Number,
  strengths: [String],
  improvements: [String],
})

const QuestionSchema = new Schema({
  text: String,
  answer: String,
  kind: {
    type: String,
    enum: ["main"],
    default: "main",
  },
  evaluation: EvaluationSchema,
})

const SessionSchema = new Schema(
  {
    userEmail: { type: String, required: true },

    startedAt: { type: Date, required: true },
    endedAt: { type: Date },

    config: {
      role: String,
      type: String,
      difficulty: String,
    },

    questions: [QuestionSchema],

    overallScore: Number,
  },
  { timestamps: true }
)

export const SessionModel =
  mongoose.models.Session ||
  mongoose.model("Session", SessionSchema)
