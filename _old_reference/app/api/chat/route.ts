import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import type { InterviewConfig } from "@/lib/data"

export const maxDuration = 60

// Server-side API key for subscription-based access
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free"

export async function POST(req: Request) {
  const {
    messages,
    settings,
    config,
  }: {
    messages: UIMessage[]
    settings?: { model?: string }
    config?: InterviewConfig
  } = await req.json()

  // Check for server-side API key
  if (!OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Service not configured. Please contact support." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  }

  const prompt = await convertToModelMessages(messages)

  const systemPrompt = `You are an expert technical interviewer conducting a mock ${config?.type || "Technical"} interview for a ${config?.role || "Software Engineer"} position at the ${config?.difficulty || "Mid-Level"} level.${config?.focusArea ? ` Focus area: ${config.focusArea}.` : ""}${config?.company ? ` The candidate is interviewing for ${config.company}.` : ""}

Your role is to:
1. Ask challenging but fair questions appropriate for the candidate's target role and difficulty level
2. Follow up on answers to probe deeper understanding
3. Provide hints if the candidate is stuck, but don't give away answers
4. Be encouraging but maintain professional standards

After each candidate response, provide feedback in this format:
[FEEDBACK]
Score: X/100
Technical Accuracy: X/40
Communication Clarity: X/30  
Confidence & Delivery: X/20
Relevance & Structure: X/10

Strengths:
- (list 1-2 specific strengths)

Areas for Improvement:
- (list 1-2 specific areas to improve)

Brief Tip: (one actionable suggestion)
[/FEEDBACK]

Then ask your next question or follow-up. Keep your main responses concise (2-3 paragraphs max). Ask one question at a time.

For ${config?.type || "Technical"} interviews:
${config?.type === "Behavioral" ? "- Focus on STAR method (Situation, Task, Action, Result)\n- Probe for specific examples and outcomes\n- Assess leadership, teamwork, and problem-solving" : ""}
${config?.type === "Technical" ? "- Ask about implementation details and trade-offs\n- Probe for edge cases and error handling\n- Assess depth of knowledge and practical experience" : ""}
${config?.type === "System Design" ? "- Start with requirements clarification\n- Discuss scalability, reliability, and trade-offs\n- Assess architectural thinking and communication" : ""}
${config?.type === "HR Screen" ? "- Assess culture fit and motivation\n- Discuss career goals and expectations\n- Keep it conversational but informative" : ""}
    
${config?.questions ? `\nIMPORTANT: You have a specific list of questions to ask. You MUST ask these questions in order, one by one. Do not skip any.
Questions to ask:
${config.questions.map((q: any, i: number) => `${i + 1}. ${q.question}`).join('\n')}
` : ""}`

  const openrouter = createOpenRouter({ apiKey: OPENROUTER_API_KEY })
  const result = streamText({
    model: openrouter(settings?.model || DEFAULT_MODEL),
    system: systemPrompt,
    messages: prompt,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
  })
}

