/**
 * AI Client - OpenRouter Integration (AI-First Architecture)
 * Handles conversational flow: greetings, questions, follow-ups
 * Evaluation scoring remains deterministic
 */

export interface AIConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  timeout?: number
  systemPrompt?: string  // Optional system message for better instruction adherence
  retryCount?: number     // Internal: tracks retry attempts (max 2)
}

const DEFAULT_CONFIG = {
  model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
  temperature: 0.4,
  maxTokens: 800,
  timeout: 15000,
  systemPrompt: undefined as string | undefined,
  retryCount: 0
}

/**
 * Core AI client for interview conversations
 */
export async function callAI(prompt: string, config: AIConfig = {}): Promise<any | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.warn("No OPENROUTER_API_KEY found - using fallbacks")
    return null
  }
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout)
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://interviewace.dev",
        "X-Title": "InterviewAce"
      },
      body: JSON.stringify({
        model: finalConfig.model,
        messages: finalConfig.systemPrompt 
          ? [
              { role: "system", content: finalConfig.systemPrompt },
              { role: "user", content: prompt }
            ]
          : [{ role: "user", content: prompt }],
        max_tokens: finalConfig.maxTokens,
        temperature: finalConfig.temperature,
        response_format: { type: "json_object" },  // Force valid JSON responses
        stream: false
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    // Handle 429 rate limit with retry (max 2 attempts)
    if (response.status === 429) {
      const currentRetries = config.retryCount || 0
      if (currentRetries < 2) {
        console.warn(`⚠️ Rate limit hit (429), retry ${currentRetries + 1}/2 in 1s...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return callAI(prompt, { ...config, retryCount: currentRetries + 1 })
      } else {
        console.warn("❌ Rate limit persists after 2 retries, using fallback")
        return null  // Give up after 2 retries
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.choices?.length) {
      throw new Error("No response choices returned")
    }
    
    const content = data.choices[0].message?.content
    if (!content) {
      throw new Error("Empty response content")
    }
    
    // Log raw content in development
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 Raw AI content:", content)
    }
    
    // Enhanced JSON extraction for better parsing
    try {
      // First try direct parsing (for clean responses)
      return JSON.parse(content)
    } catch (parseError) {
      // Try to remove markdown code blocks if present
      let cleanContent = content
      if (content.includes('```')) {
        cleanContent = content.replace(/```[\s\S]*?```/g, '')
      }

      // Extract JSON safely using first { and last }
      const firstBrace = cleanContent.indexOf("{")
      let lastBrace = cleanContent.lastIndexOf("}")

      // === Repair: if the response is truncated with no closing }, try to complete it ===
      if (firstBrace !== -1 && lastBrace === -1) {
        // Append closing brace and retry — handles models that cut off before the final }
        const repaired = cleanContent.slice(firstBrace).trimEnd() + '\n}'
        try {
          return JSON.parse(repaired)
        } catch {
          // Repair via brace failed; fall through to regex extraction
        }
        // Also try double-close in case a string value was also left open
        try {
          return JSON.parse(cleanContent.slice(firstBrace).trimEnd() + '"}')
        } catch {
          // Continue to regex fallback below
        }
      }

      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        // === Regex fallback: extract individual string fields from partial content ===
        const extract = (field: string): string | undefined => {
          const m = content.match(new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*?)"`))
          return m ? m[1] : undefined
        }
        const greeting  = extract('greeting')
        const question  = extract('question')
        const feedback  = extract('feedback')
        const nextQ     = extract('nextQuestion')
        if (greeting && question) return { greeting, question }
        if (feedback)              return { feedback, nextQuestion: nextQ ?? null, endInterview: false }
        console.warn("\u26a0\ufe0f No valid JSON structure found in AI response")
        return { message: content }
      }

      const jsonString = cleanContent.slice(firstBrace, lastBrace + 1)

      try {
        const parsed = JSON.parse(jsonString)
        console.log("\u2705 Successfully extracted JSON from AI response")
        return parsed
      } catch (finalParseError) {
        // Last resort: attempt a brute-force repair on the extracted substring
        try {
          return JSON.parse(jsonString.trimEnd() + '}')
        } catch {
          // intentionally ignored
        }
        console.warn("\u274c JSON parse failed even after extraction, returning raw text")
        if (process.env.NODE_ENV === 'development') {
          console.warn("Extracted JSON string:", jsonString)
        }
        // Return raw content wrapped for compatibility
        return { message: content }
      }
    }
    
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn("AI request timeout")
    } else {
      console.warn("AI request failed:", error.message)
    }
    return null
  }
}

/**
 * Check if AI is available
 */
export function isAIAvailable(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}

/**
 * Get AI model info for debugging
 */
export function getAIInfo() {
  return {
    available: isAIAvailable(),
    model: DEFAULT_CONFIG.model,
    keyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + "..."
  }
}
