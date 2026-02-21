/**
 * Interview Start API Route - AI-First Architecture
 * Handles session initialization with AI greeting and first question
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { startInterview, validateConfig } from "@/lib/interview/start"

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

    // Start interview with AI-first approach
    const userName = session.user.name || session.user.email?.split('@')[0] || undefined
    const result = await startInterview(config, userName)

    return NextResponse.json({
      success: true,
      greeting: result.greeting,
      question: result.question,
      source: result.source,
      sessionId: `session_${Date.now()}`,
      config,
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
