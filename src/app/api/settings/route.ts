/**
 * User Settings API - GET/PUT endpoints
 * Stores settings in MongoDB instead of localStorage
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { UserSettingsModel } from "@/lib/db/models/UserSettings"
import { SessionModel } from "@/lib/db/models/Session"

/**
 * GET /api/settings - Fetch user settings from MongoDB
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required", success: false },
        { status: 401 }
      )
    }

    await connectDB()

    // Get or create settings for this user
    const settings = await UserSettingsModel.getOrCreate(session.user.email)

    return NextResponse.json({
      success: true,
      data: {
        aiModel: settings.aiModel,
        aiTemperature: settings.aiTemperature,
        interviewLength: settings.interviewLength,
        voiceQuestionsEnabled: settings.voiceQuestionsEnabled,
        videoRecordingEnabled: settings.videoRecordingEnabled,
        scoringMode: settings.scoringMode,
        showScoreExplanation: settings.showScoreExplanation,
        theme: settings.theme,
      },
    })
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch settings",
      },
      { status: 500 }
    )
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

    // Track scoring mode changes for research
    const oldScoringMode = settings.scoringMode
    const newScoringMode = body.scoringMode

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
    if (body.scoringMode !== undefined) {
      if (["deterministic", "hybrid"].includes(body.scoringMode)) {
        settings.scoringMode = body.scoringMode
      }
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

    // Track scoring mode change for research
    if (oldScoringMode !== newScoringMode) {
      // Count how many sessions user has completed
      const sessionCount = await SessionModel.countDocuments({
        userEmail: session.user.email,
      })

      await settings.trackScoringModeChange(newScoringMode, sessionCount)

      console.log(
        `📊 Scoring mode changed: ${oldScoringMode} → ${newScoringMode} (after ${sessionCount} sessions)`
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        aiModel: settings.aiModel,
        aiTemperature: settings.aiTemperature,
        interviewLength: settings.interviewLength,
        voiceQuestionsEnabled: settings.voiceQuestionsEnabled,
        videoRecordingEnabled: settings.videoRecordingEnabled,
        scoringMode: settings.scoringMode,
        showScoreExplanation: settings.showScoreExplanation,
        theme: settings.theme,
      },
      message: oldScoringMode !== newScoringMode
        ? `Scoring mode changed to ${newScoringMode}. Run new interviews to collect comparative data.`
        : "Settings updated successfully",
    })
  } catch (error) {
    console.error("Settings PUT error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update settings",
      },
      { status: 500 }
    )
  }
}
