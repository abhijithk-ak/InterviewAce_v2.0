/**
 * UserSettings MongoDB Model
 * Stores user preferences and configuration in database
 */

import mongoose, { Document, Model } from "mongoose"

// TypeScript interface for the document
export interface IUserSettings extends Document {
  userEmail: string
  aiModel: string
  aiTemperature: number
  interviewLength: 3 | 5 | 6
  voiceQuestionsEnabled: boolean
  videoRecordingEnabled: boolean
  scoringMode: "deterministic" | "hybrid"
  showScoreExplanation: boolean
  theme: "dark" | "light"
  scoringModeHistory: Array<{
    mode: string
    changedAt: Date
    sessionCount: number
  }>
  createdAt: Date
  updatedAt: Date
  trackScoringModeChange(newMode: string, sessionCount?: number): Promise<IUserSettings>
}

// TypeScript interface for static methods
export interface IUserSettingsModel extends Model<IUserSettings> {
  getOrCreate(userEmail: string): Promise<IUserSettings>
}

const userSettingsSchema = new mongoose.Schema<IUserSettings, IUserSettingsModel>(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    // AI Configuration
    aiModel: {
      type: String,
      default: "meta-llama/llama-3.2-3b-instruct:free",
    },
    aiTemperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2,
    },
    
    // Interview Configuration
    interviewLength: {
      type: Number,
      enum: [3, 5, 6],
      default: 5,
    },
    voiceQuestionsEnabled: {
      type: Boolean,
      default: true,
    },
    videoRecordingEnabled: {
      type: Boolean,
      default: true,
    },
    
    // Scoring Configuration
    scoringMode: {
      type: String,
      enum: ["deterministic", "hybrid"],
      default: "deterministic",
    },
    showScoreExplanation: {
      type: Boolean,
      default: true,
    },
    
    // UI Preferences
    theme: {
      type: String,
      enum: ["dark", "light"],
      default: "dark",
    },
    
    // Research Tracking (for IEEE paper)
    scoringModeHistory: [
      {
        mode: {
          type: String,
          enum: ["deterministic", "hybrid"],
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        sessionCount: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
)

// Index for fast lookups by email
userSettingsSchema.index({ userEmail: 1 })

// Method to track scoring mode changes
userSettingsSchema.methods.trackScoringModeChange = function (newMode: string, sessionCount: number = 0) {
  this.scoringModeHistory.push({
    mode: newMode,
    changedAt: new Date(),
    sessionCount,
  })
  return this.save()
}

// Static method to get or create settings for a user
userSettingsSchema.statics.getOrCreate = async function (userEmail: string) {
  let settings = await this.findOne({ userEmail })
  
  if (!settings) {
    settings = await this.create({ userEmail })
  }
  
  return settings
}

export const UserSettingsModel =
  (mongoose.models.UserSettings as IUserSettingsModel) ||
  mongoose.model<IUserSettings, IUserSettingsModel>("UserSettings", userSettingsSchema)
