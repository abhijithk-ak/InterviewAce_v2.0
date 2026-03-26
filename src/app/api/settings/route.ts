/**
 * User Settings API - GET/PUT endpoints
 * Stores settings in MongoDB instead of localStorage
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { UserSettingsModel } from "@/lib/db/models/UserSettings"

const DEFAULT_SETTINGS = {
  aiModel: "meta-llama/llama-3.2-3b-instruct:free",
  aiTemperature: 0.7,
  interviewLength: 5,
  voiceQuestionsEnabled: true,
  videoRecordingEnabled: true,
  showScoreExplanation: true,
  theme: "dark" as const,
}

function mapSettings(settings: {
  aiModel: string
  aiTemperature: number
  interviewLength: number
  voiceQuestionsEnabled: boolean
  videoRecordingEnabled: boolean
  showScoreExplanation: boolean
  theme: "dark" | "light"
}) {
  return {
    aiModel: settings.aiModel,
    aiTemperature: settings.aiTemperature,
    interviewLength: settings.interviewLength,
    voiceQuestionsEnabled: settings.voiceQuestionsEnabled,
    videoRecordingEnabled: settings.videoRecordingEnabled,
    showScoreExplanation: settings.showScoreExplanation,
    theme: settings.theme,
  }
}

/**
 * GET /api/settings - Fetch user settings from MongoDB
 */
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Authentication required", success: false },
      { status: 401 }
    )
  }

  try {
    await connectDB()

    // Get or create settings for this user
    const settings = await UserSettingsModel.getOrCreate(session.user.email)

    return NextResponse.json({
      success: true,
      data: mapSettings(settings),
      source: "database",
    })
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json({
      success: true,
      data: DEFAULT_SETTINGS,
      source: "fallback-defaults",
      warning: "Database unavailable. Showing default settings.",
    })
  }
}

/**
 * PUT /api/settings - Update user settings in MongoDB
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required", success: false },
        { status: 401 }
      )
    }

    const body = await req.json()

    await connectDB()

    // Get or create settings
    const settings = await UserSettingsModel.getOrCreate(session.user.email)

    // Update fields (validate before saving)
    if (body.aiModel !== undefined) settings.aiModel = body.aiModel
    if (body.aiTemperature !== undefined) {
      const temp = parseFloat(body.aiTemperature)
      if (temp >= 0 && temp <= 2) settings.aiTemperature = temp
    }
    if (body.interviewLength !== undefined) {
      const length = parseInt(body.interviewLength)
      if ([3, 5, 6].includes(length)) settings.interviewLength = length as 3 | 5 | 6
    }
    if (body.voiceQuestionsEnabled !== undefined) {
      settings.voiceQuestionsEnabled = Boolean(body.voiceQuestionsEnabled)
    }
    if (body.videoRecordingEnabled !== undefined) {
      settings.videoRecordingEnabled = Boolean(body.videoRecordingEnabled)
    }
    if (body.showScoreExplanation !== undefined) {
      settings.showScoreExplanation = Boolean(body.showScoreExplanation)
    }
    if (body.theme !== undefined) {
      if (["dark", "light"].includes(body.theme)) {
        settings.theme = body.theme
      }
    }

    await settings.save()

    return NextResponse.json({
      success: true,
      data: mapSettings(settings),
      message: "Settings updated successfully",
    })
  } catch (error) {
    console.error("Settings PUT error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database unavailable. Could not save settings right now.",
      },
      { status: 503 }
    )
  }
}
