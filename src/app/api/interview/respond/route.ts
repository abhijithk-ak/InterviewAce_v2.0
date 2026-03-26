/**
 * Interview Respond API Route - AI + MiniLM Hybrid
 * Handles answer processing with hybrid evaluation and conversational flow.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { handleAnswer, validateRespondParams } from "@/lib/interview/respond"
import { UserSettingsModel } from "@/lib/db/models/UserSettings"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { connectDB } from "@/lib/db/mongoose"
import { type UserProfile } from "@/lib/ai/prompts"

const DEFAULT_USER_SETTINGS = {
  aiModel: "meta-llama/llama-3.2-3b-instruct:free",
  aiTemperature: 0.7,
  interviewLength: 5 as 3 | 5 | 6,
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
    
    // Validate parameters
    if (!validateRespondParams(body)) {
      return NextResponse.json(
        { error: "Invalid request parameters", success: false },
        { status: 400 }
      )
    }

    // Load user settings from MongoDB (fallback to defaults if DB unavailable)
    let userSettings = DEFAULT_USER_SETTINGS
    try {
      await connectDB()
      const dbSettings = await UserSettingsModel.getOrCreate(session.user.email)
      userSettings = {
        aiModel: dbSettings.aiModel,
        aiTemperature: dbSettings.aiTemperature,
        interviewLength: dbSettings.interviewLength,
      }
    } catch (dbError) {
      console.warn("Interview respond: settings DB unavailable, using defaults", dbError)
    }

    // Load user profile from MongoDB (optional - may not exist if onboarding skipped)
    let userProfile: UserProfile | undefined
    try {
      await connectDB()
      const profile = await UserProfileModel.findOne({ userId: session.user.email })
      if (profile) {
        userProfile = {
          experienceLevel: profile.experienceLevel,
          domains: profile.domains,
          interviewGoals: profile.interviewGoals,
          confidenceLevel: profile.confidenceLevel,
          weakAreas: profile.weakAreas || []
        }
      }
    } catch (error) {
      console.warn("Could not load user profile:", error)
      // Continue without profile - not critical
    }

    // Add user settings and profile to params
    const params = {
      ...body,
      aiModel: userSettings.aiModel,
      aiTemperature: userSettings.aiTemperature,
      interviewLength: userSettings.interviewLength,
      userProfile
    }

    // Process answer through hybrid engine
    const result = await handleAnswer(params)

    return NextResponse.json({
      success: true,
      evaluation: {
        score: result.score,
        overallScore: result.overallScore,
        finalScore: result.finalScore,
        breakdown: result.breakdown,
        explanation: result.explanation,
        errors: result.errors,
        evaluationMethod: result.evaluationMethod,
        strengths: result.strengths,
        improvements: result.improvements,
        feedback: result.feedback
      },
      metrics: result.metrics,
      nextQuestion: result.nextQuestion,
      done: result.done,
      source: result.source,
      ...(process.env.NODE_ENV === 'development' && result.debug && {
        debug: result.debug
      })
    })

  } catch (error) {
    console.error("Interview respond error:", error)
    
    // Return graceful fallback
    return NextResponse.json({
      success: true,
      evaluation: {
        score: 60,
        overallScore: 60,
        breakdown: {
          conceptScore: 0,
          semanticScore: 0,
          clarityScore: 5,
        },
        explanation: "Evaluation service unavailable.",
        errors: ["Evaluation service unavailable"],
        evaluationMethod: "AI + MiniLM Hybrid",
        feedback: "Thank you for your response. Let's continue with the next question."
      },
      nextQuestion: null,
      done: true,
      source: "fallback"
    })
  }
}

