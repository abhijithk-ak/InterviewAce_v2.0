import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { connectDB } from "@/lib/db/mongoose"
import { SessionModel } from "@/lib/db/models/Session"
import { callAI } from "@/lib/ai/client"

type CoachSummary = {
  strengths: string[]
  improvements: string[]
  recommendations: string[]
}

type QuestionInput = {
  kind?: string
  text?: string
  evaluation?: {
    overallScore?: number
    breakdown?: {
      conceptScore?: number
      semanticScore?: number
      clarityScore?: number
    }
    conceptScore?: number
    semanticScore?: number
    clarityScore?: number
    errors?: string[]
    explanation?: string
    feedback?: string
  }
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeQuestionEvaluation(question: QuestionInput) {
  const evaluation = question.evaluation ?? {}
  const breakdown = evaluation.breakdown ?? {}

  const conceptScore = asFiniteNumber(
    breakdown.conceptScore ?? evaluation.conceptScore
  )
  const semanticScore = asFiniteNumber(
    breakdown.semanticScore ?? evaluation.semanticScore
  )
  const clarityScore = asFiniteNumber(
    breakdown.clarityScore ?? evaluation.clarityScore
  )
  const errors = Array.isArray(evaluation.errors)
    ? evaluation.errors.map((e) => String(e).trim()).filter(Boolean)
    : []

  return {
    conceptScore,
    semanticScore,
    clarityScore,
    errors,
    explanation: typeof evaluation.explanation === "string" ? evaluation.explanation.trim() : "",
    feedback: typeof evaluation.feedback === "string" ? evaluation.feedback.trim() : "",
  }
}

function fallbackCoachSummary(mainQuestions: QuestionInput[]): CoachSummary {
  const evals = mainQuestions.map(normalizeQuestionEvaluation)
  const avg = (values: Array<number | null>) => {
    const valid = values.filter((v): v is number => typeof v === "number")
    if (valid.length === 0) return 0
    return valid.reduce((sum, value) => sum + value, 0) / valid.length
  }

  const avgConcept = avg(evals.map((e) => e.conceptScore))
  const avgSemantic = avg(evals.map((e) => e.semanticScore))
  const avgClarity = avg(evals.map((e) => e.clarityScore))

  const errorCorpus = evals.flatMap((e) => e.errors).join(" ").toLowerCase()

  const strengths: string[] = []
  if (avgConcept >= 7) strengths.push("Strong conceptual understanding across most answers")
  if (avgSemantic >= 7) strengths.push("Good coverage of expected answer content")
  if (avgClarity >= 7) strengths.push("Clear and structured communication style")
  if (strengths.length === 0) strengths.push("Shows baseline understanding and willingness to explain reasoning")

  const improvements: string[] = []
  if (avgConcept < 6 || /incorrect|contradict|misunderstand/.test(errorCorpus)) {
    improvements.push("Improve conceptual accuracy and avoid contradictory claims")
  }
  if (avgSemantic < 6 || /missing|incomplete|detail/.test(errorCorpus)) {
    improvements.push("Add more complete technical detail in answers")
  }
  if (avgClarity < 6 || /clarity|unclear|structure|vague/.test(errorCorpus)) {
    improvements.push("Organize responses with clearer structure")
  }
  if (improvements.length === 0) improvements.push("Increase depth with concrete examples and trade-offs")

  const recommendations: string[] = [
    "Use a repeatable answer framework: definition, mechanism, example, and trade-off",
    "After each response, quickly self-check for factual contradictions",
    "Practice concise explanations with one practical example per concept",
  ]

  return {
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
  }
}

async function generateCoachSummary(mainQuestions: QuestionInput[]): Promise<CoachSummary> {
  const normalized = mainQuestions.map(normalizeQuestionEvaluation)

  const promptPayload = normalized.map((item, index) => ({
    index: index + 1,
    conceptScore: item.conceptScore,
    semanticScore: item.semanticScore,
    clarityScore: item.clarityScore,
    errors: item.errors,
    explanation: item.explanation,
    feedback: item.feedback,
  }))

  const prompt = [
    "Summarize the interview performance as an interview coach.",
    "Provide:",
    "1. Overall strengths",
    "2. Key areas to improve",
    "3. Practical recommendations for improvement",
    "",
    "Use concise bullet points.",
    "Do not repeat the questions.",
    "Focus on patterns across answers.",
    "",
    "Return JSON only with this schema:",
    JSON.stringify(
      {
        strengths: [""],
        improvements: [""],
        recommendations: [""],
      },
      null,
      2
    ),
    "",
    "Interview evaluation data:",
    JSON.stringify(promptPayload, null, 2),
  ].join("\n")

  const aiSummary = await callAI(prompt, {
    temperature: 0.2,
    maxTokens: 600,
    systemPrompt: "You are an interview coach. Return only valid JSON.",
  })

  if (!aiSummary || typeof aiSummary !== "object") {
    return fallbackCoachSummary(mainQuestions)
  }

  const parseList = (value: unknown) =>
    Array.isArray(value)
      ? value.map((item) => String(item).trim()).filter(Boolean).slice(0, 3)
      : []

  const strengths = parseList((aiSummary as any).strengths)
  const improvements = parseList((aiSummary as any).improvements)
  const recommendations = parseList((aiSummary as any).recommendations)

  if (strengths.length === 0 && improvements.length === 0 && recommendations.length === 0) {
    return fallbackCoachSummary(mainQuestions)
  }

  const fallback = fallbackCoachSummary(mainQuestions)
  return {
    strengths: strengths.length > 0 ? strengths : fallback.strengths,
    improvements: improvements.length > 0 ? improvements : fallback.improvements,
    recommendations: recommendations.length > 0 ? recommendations : fallback.recommendations,
  }
}

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

    const coachSummary = await generateCoachSummary(mainQuestions)

    await connectDB()

    const savedSession = await SessionModel.create({
      userEmail: session.user.email,
      startedAt: new Date(startedAt),
      endedAt: new Date(endedAt),
      config,
      questions: mainQuestions,
      overallScore,
      coachSummary,
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
