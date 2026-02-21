/**
 * Interview Respond API Route - Hybrid AI + Algorithmic
 * Handles answer processing with AI conversational flow and deterministic scoring
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { handleAnswer, validateRespondParams } from "@/lib/interview/respond"

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

    // Process answer through hybrid engine
    const result = await handleAnswer(body)

    return NextResponse.json({
      success: true,
      evaluation: {
        score: result.score,
        breakdown: result.breakdown,
        feedback: result.feedback
      },
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

