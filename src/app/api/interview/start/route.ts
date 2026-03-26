/**
 * Interview Start API Route - AI-First Architecture
 * Handles session initialization with AI greeting and first question
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { startInterview, validateConfig } from "@/lib/interview/start"
import { UserSettingsModel } from "@/lib/db/models/UserSettings"
import { connectDB } from "@/lib/db/mongoose"

const DEFAULT_USER_SETTINGS = {
  interviewLength: 5 as 3 | 5 | 6,
  aiModel: "meta-llama/llama-3.2-3b-instruct:free",
  aiTemperature: 0.7,
  voiceQuestionsEnabled: true,
  videoRecordingEnabled: true,
  showScoreExplanation: true,
  theme: "dark" as "dark" | "light",
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required", success: false },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { role, type, difficulty } = body

    // Validate configuration
    const config = { role, type, difficulty }
    if (!validateConfig(config)) {
      return NextResponse.json(
        { error: "Invalid interview configuration", success: false },
        { status: 400 }
      )
    }

    // Load user settings from MongoDB (fallback to defaults if DB unavailable)
    let userSettings = DEFAULT_USER_SETTINGS
    try {
      await connectDB()
      const dbSettings = await UserSettingsModel.getOrCreate(session.user.email)
      userSettings = {
        interviewLength: dbSettings.interviewLength,
        aiModel: dbSettings.aiModel,
        aiTemperature: dbSettings.aiTemperature,
        voiceQuestionsEnabled: dbSettings.voiceQuestionsEnabled,
        videoRecordingEnabled: dbSettings.videoRecordingEnabled,
        showScoreExplanation: dbSettings.showScoreExplanation,
        theme: dbSettings.theme,
      }
    } catch (dbError) {
      console.warn("Interview start: settings DB unavailable, using defaults", dbError)
    }
    
    // Start interview with AI-first approach using user settings
    const userName = session.user.name || session.user.email?.split('@')[0] || undefined
    const result = await startInterview(
      config, 
      userName, 
      userSettings.aiModel, 
      userSettings.aiTemperature
    )

    return NextResponse.json({
      success: true,
      greeting: result.greeting,
      question: result.question,
      source: result.source,
      sessionId: `session_${Date.now()}`,
      config,
      userSettings: {
        interviewLength: userSettings.interviewLength,
        aiModel: userSettings.aiModel,
        aiTemperature: userSettings.aiTemperature,
        voiceQuestionsEnabled: userSettings.voiceQuestionsEnabled,
        videoRecordingEnabled: userSettings.videoRecordingEnabled,
        showScoreExplanation: userSettings.showScoreExplanation,
        theme: userSettings.theme,
      },
      ...(process.env.NODE_ENV === 'development' && result.debug && {
        debug: result.debug
      })
    })

  } catch (error) {
    console.error("Interview start error:", error)
    
    // Return graceful fallback
    return NextResponse.json({
      success: true,
      greeting: "Welcome to InterviewAce. Let's begin your interview.",
      question: "Tell me about yourself and your experience in software development.",
      source: "fallback",
      sessionId: `session_${Date.now()}`,
      config: {
        role: "general",
        type: "behavioral", 
        difficulty: "medium"
      }
    })
  }
}
