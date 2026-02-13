import mongoose, { Schema } from "mongoose"

/**
 * Note Schema for InterviewAce v2
 * Stores user notes linked to authenticated users
 */

const NoteSchema = new Schema(
  {
    // User identification (links to authenticated user)
    userId: {
      type: String,
      required: true,
    },

    // Note content
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },

    content: {
      type: String,
      required: true,
      maxLength: 10000, // 10KB limit for notes
    },

    // Optional categorization
    category: {
      type: String,
      enum: ["general", "algorithm", "system-design", "behavioral", "interview-prep"],
      default: "general",
    },

    // Optional tags for organization
    tags: {
      type: [String],
      default: [],
      maxItems: 10,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatic timestamps
    timestamps: true,
  }
)

// Indexes for performance
NoteSchema.index({ userId: 1, createdAt: -1 }) // For user's notes ordered by date
NoteSchema.index({ userId: 1, category: 1 }) // For filtering by category
NoteSchema.index({ userId: 1, tags: 1 }) // For tag-based filtering

// Pre-save middleware to update timestamps
NoteSchema.pre("save", function () {
  this.updatedAt = new Date()
})

// Export model with Next.js safety check
export const NoteModel =
  mongoose.models.Note || mongoose.model("Note", NoteSchema)

// TypeScript types for frontend use
export interface INote {
  _id?: string
  userId: string
  title: string
  content: string
  category: "general" | "algorithm" | "system-design" | "behavioral" | "interview-prep"
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
}

export const NOTE_CATEGORIES = [
  { value: "general", label: "General", description: "General notes and thoughts" },
  { value: "algorithm", label: "Algorithms", description: "Algorithm concepts and solutions" },
  { value: "system-design", label: "System Design", description: "Architecture and design patterns" },
  { value: "behavioral", label: "Behavioral", description: "Behavioral interview preparation" },
  { value: "interview-prep", label: "Interview Prep", description: "Interview strategies and tips" },
] as const