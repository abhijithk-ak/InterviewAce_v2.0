import { NextRequest, NextResponse } from "next/server"
import { evaluateAnswer, generateFollowUp, type EvaluationResult } from "@/lib/ai/client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      question, 
      answer, 
      role, 
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

    // Step 1: Evaluate the answer (silent AI)
    let evaluation: EvaluationResult
    try {
      evaluation = await evaluateAnswer(
        question,
        answer,
        role || "Software Engineer",
        difficulty || "Medium"
      )
    } catch (error) {
      console.error("Evaluation failed:", error)
      // Fallback evaluation if AI fails
      evaluation = {
        score: 5,
        confidence: 5,
        clarity: 5,
        technical_depth: 5,
        strengths: [],
        improvements: [],
        should_follow_up: false,
        follow_up_focus: null,
      }
    }

    // Step 2: Determine if follow-up is needed
    const shouldGenerateFollowUp = 
      evaluation.should_follow_up && 
      !followUpUsed && 
      evaluation.follow_up_focus

    let followUpQuestion: string | null = null

    if (shouldGenerateFollowUp && evaluation.follow_up_focus) {
      try {
        followUpQuestion = await generateFollowUp(
          question,
          answer,
          evaluation.follow_up_focus
        )
      } catch (error) {
        console.error("Follow-up generation failed:", error)
        // Continue without follow-up
        followUpQuestion = null
      }
    }

    return NextResponse.json({
      success: true,
      evaluation,
      followUp: followUpQuestion,
      hasFollowUp: !!followUpQuestion,
    })
  } catch (error) {
    console.error("Response processing error:", error)
    return NextResponse.json(
      { error: "Failed to process response", success: false },
      { status: 500 }
    )
  }
}
