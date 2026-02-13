import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { SessionModel } from "@/lib/db/models/Session"

export async function GET() {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  await connectDB()

  const sessions = await SessionModel.find({
    userEmail: session.user.email,
  })
    .sort({ startedAt: -1 })
    .lean()

  // Convert MongoDB ObjectIds to strings and format dates
  const formattedSessions = sessions.map(sessionData => ({
    _id: sessionData._id.toString(),
    config: sessionData.config,
    startedAt: sessionData.startedAt.toISOString(),
    endedAt: sessionData.endedAt?.toISOString(),
    overallScore: sessionData.overallScore,
    questions: sessionData.questions || []
  }))

  return NextResponse.json(formattedSessions)
}
