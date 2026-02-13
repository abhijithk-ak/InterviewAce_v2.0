import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { SessionModel } from "@/lib/db/models/Session"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const {
      startedAt,
      endedAt,
      config,
      questions,
      overallScore,
    } = body

    if (!startedAt || !endedAt || !config || !questions) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      )
    }

    // Store ONLY main questions
    const mainQuestions = questions.filter(
      (q: any) => q.kind === "main"
    )

    await connectDB()

    const savedSession = await SessionModel.create({
      userEmail: session.user.email,
      startedAt: new Date(startedAt),
      endedAt: new Date(endedAt),
      config,
      questions: mainQuestions,
      overallScore,
    })

    return NextResponse.json({
      success: true,
      sessionId: savedSession._id,
    })
  } catch (err) {
    console.error("Save session error:", err)
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 }
    )
  }
}
