import { generateText } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

// Server-side API key for subscription-based access
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free"

export async function POST() {
  if (!OPENROUTER_API_KEY) {
    return Response.json(
      { success: false, error: "Service not configured" },
      { status: 503 }
    )
  }

  try {
    const openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY })
    await generateText({
      model: openrouter(DEFAULT_MODEL),
      prompt: "Say 'Connection successful' in exactly 2 words.",
      maxOutputTokens: 10,
    })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
