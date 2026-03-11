/**
 * Interview Respond API Route - Hybrid AI + Algorithmic
 * Handles answer processing with AI conversational flow and deterministic scoring
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { handleAnswer, validateRespondParams } from "@/lib/interview/respond"
import { UserSettingsModel } from "@/lib/db/models/UserSettings"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import { connectDB } from "@/lib/db/mongoose"
import { type UserProfile } from "@/lib/ai/prompts"

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

    // Load user settings from MongoDB
    await connectDB()
    const userSettings = await UserSettingsModel.getOrCreate(session.user.email)

    // Load user profile from MongoDB (optional - may not exist if onboarding skipped)
    let userProfile: UserProfile | undefined
    try {
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
      scoringMode: userSettings.scoringMode,
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
        deterministicScore: result.deterministicScore,
        semanticScore: result.semanticScore,
        finalScore: result.finalScore,
        breakdown: result.breakdown,
        subscores: result.subscores,
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
        breakdown: {
          technical: 6,
          clarity: 6,
          confidence: 6,
          relevance: 6,
          structure: 6
        },
        feedback: "Thank you for your response. Let's continue with the next question."
      },
      nextQuestion: null,
      done: true,
      source: "fallback"
    })
  }
}

