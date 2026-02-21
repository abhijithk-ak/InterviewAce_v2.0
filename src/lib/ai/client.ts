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
}

const DEFAULT_CONFIG: Required<AIConfig> = {
  model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free",
  temperature: 0.4,
  maxTokens: 1000,
  timeout: 15000
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
        messages: [{ role: "user", content: prompt }],
        max_tokens: finalConfig.maxTokens,
        temperature: finalConfig.temperature,
        stream: false
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
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
      const lastBrace = cleanContent.lastIndexOf("}")
      
      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        console.warn("⚠️ No valid JSON structure found in AI response")
        // Return as wrapped text for fallback
        return { message: content }
      }
      
      const jsonString = cleanContent.slice(firstBrace, lastBrace + 1)
      
      try {
        const parsed = JSON.parse(jsonString)
        console.log("✅ Successfully extracted JSON from AI response")
        return parsed
      } catch (finalParseError) {
        console.warn("❌ JSON parse failed even after extraction, returning raw text")
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
