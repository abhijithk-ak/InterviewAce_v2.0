import { NextRequest, NextResponse } from "next/server"
import { evaluateAnswer as algorithmicEvaluate } from "@/lib/evaluation/engine"

/**
 * Interview Response API
 * Uses deterministic algorithmic evaluation (no AI required)
 * Evaluation is explainable, auditable, and works offline
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      question, 
      answer, 
      role, 
      type,
      difficulty, 
      followUpUsed 
    } = body

    // Validate inputs
    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing question or answer", success: false },
        { status: 400 }
      )
    }

    // Algorithmic Evaluation (Core Intelligence)
    // This is deterministic, explainable, and requires no external API
    const evaluation = algorithmicEvaluate(
      question,
      answer,
      {
        role: role || "general",
        type: type || "technical",
        difficulty: difficulty || "medium"
      }
    )

    // Map to expected format for backward compatibility
    const response = {
      score: evaluation.overallScore,
      confidence: evaluation.breakdown.confidence,
      clarity: evaluation.breakdown.clarity,
      technical_depth: evaluation.breakdown.technical,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      feedback: evaluation.feedback,
      // Metadata for transparency
      evaluation_method: evaluation.metadata.evaluationMethod,
      breakdown: evaluation.breakdown,
    }

    return NextResponse.json({
      success: true,
      evaluation: response,
      followUp: null, // Follow-ups disabled as per architecture decision
      hasFollowUp: false,
    })
  } catch (error) {
    console.error("Response processing error:", error)
    return NextResponse.json(
      { error: "Failed to process response", success: false },
      { status: 500 }
    )
  }
}

