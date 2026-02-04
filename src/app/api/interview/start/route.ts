import { NextResponse } from "next/server"

const fallbackQuestions = [
  "Hello! I'll be conducting your interview today. Let's begin. Can you briefly introduce yourself and tell me about your background?",
  "Welcome! I'm excited to learn more about you. To start, could you walk me through your professional experience?",
  "Hi there! Let's get started with your interview. First, I'd like to hear about your career journey so far.",
]

export async function POST() {
  try {
    // Phase 2: Simple fallback to Question Bank
    // Later phases will integrate actual AI providers
    const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)]
    
    return NextResponse.json({
      message: randomQuestion,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start interview", success: false },
      { status: 500 }
    )
  }
}
