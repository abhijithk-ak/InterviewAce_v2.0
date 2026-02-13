import mongoose, { Schema } from "mongoose"
import {
  EXPERIENCE_LEVELS,
  AVAILABLE_DOMAINS,
  INTERVIEW_GOALS,
  WEAK_AREAS,
  type ExperienceLevel,
  type Domain,  
  type InterviewGoal,
  type WeakArea,
} from "@/lib/onboarding/constants"

/**
 * UserProfile Schema
 * Stores user onboarding data for personalized interview experiences
 * One-time setup per user with deterministic profiling logic
 */

const UserProfileSchema = new Schema(
  {
    // User identification (links to NextAuth user)
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    // Experience level for interview difficulty calibration
    experienceLevel: {
      type: String,
      enum: ["student", "fresher", "junior", "senior"],
      required: true,
    },

    // Technical domains of interest/expertise
    domains: {
      type: [String],
      required: true,
      validate: {
        validator: (domains: string[]) => domains.length > 0,
        message: "At least one domain must be selected",
      },
    },

    // Interview preparation goals
    interviewGoals: {
      type: [String],
      required: true,
      validate: {
        validator: (goals: string[]) => goals.length > 0,
        message: "At least one goal must be selected",
      },
    },

    // Self-assessed confidence (1-5 scale)
    confidenceLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Areas where user wants improvement (optional)
    weakAreas: {
      type: [String],
      default: [],
    },

    // Onboarding completion status
    onboardingCompleted: {
      type: Boolean,
      default: false,
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

// Indexes for performance (userId already indexed via unique: true)
UserProfileSchema.index({ experienceLevel: 1 })
UserProfileSchema.index({ domains: 1 })
UserProfileSchema.index({ onboardingCompleted: 1 })

// Pre-save middleware to update timestamps
UserProfileSchema.pre("save", function () {
  this.updatedAt = new Date()
})

// Export model with Next.js safety check
export const UserProfileModel =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema)

// TypeScript types for frontend use
export interface IUserProfile {
  _id?: string
  userId: string
  experienceLevel: ExperienceLevel
  domains: Domain[]
  interviewGoals: InterviewGoal[]
  confidenceLevel: number // 1-5
  weakAreas?: WeakArea[]
  onboardingCompleted: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Re-export constants for backward compatibility  
export {
  EXPERIENCE_LEVELS,
  AVAILABLE_DOMAINS,
  INTERVIEW_GOALS,
  WEAK_AREAS,
}