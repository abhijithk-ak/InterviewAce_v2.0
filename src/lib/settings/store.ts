/**
 * Settings Store - User preferences for interview configuration
 * Now uses MongoDB for persistence with localStorage cache
 */

export type InterviewLength = 3 | 5 | 6

export interface InterviewSettings {
  // AI Configuration
  aiModel: string
  aiTemperature: number

  // Interview Configuration
  interviewLength: InterviewLength
  voiceQuestionsEnabled: boolean
  videoRecordingEnabled: boolean

  // Scoring Configuration
  showScoreExplanation: boolean

  // UI Preferences
  theme: "dark" | "light"
}

export const DEFAULT_SETTINGS: InterviewSettings = {
  aiModel: "meta-llama/llama-3.2-3b-instruct:free",
  aiTemperature: 0.7,
  interviewLength: 5,
  voiceQuestionsEnabled: true,
  videoRecordingEnabled: true,
  showScoreExplanation: true,
  theme: "dark",
}

export interface ModelInfo {
  id: string
  name: string
  description: string
  category: "recommended" | "free" | "paid"
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  // Recommended
  {
    id: "meta-llama/llama-3.2-3b-instruct",
    name: "Llama 3.2 3B Instruct",
    description: "Fast, reliable, recommended",
    category: "recommended",
  },
  
  // Free Models
  {
    id: "meta-llama/llama-3.1-8b-instruct:free",
    name: "Llama 3.1 8B Instruct",
    description: "More capable, slightly slower",
    category: "free",
  },
  {
    id: "mistralai/mistral-small-3.1-24b-instruct:free",
    name: "Mistral Small 3.1 24B",
    description: "Large context, multilingual",
    category: "free",
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Gemma 3 27B IT",
    description: "Google's instruction-tuned model",
    category: "free",
  },
  {
    id: "deepseek/deepseek-r1-0528:free",
    name: "DeepSeek R1",
    description: "Reasoning-focused model",
    category: "free",
  },
  {
    id: "qwen/qwen3-coder:free",
    name: "Qwen 3 Coder",
    description: "Code-optimized model",
    category: "free",
  },
  
  // Paid Models
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's flagship model",
    category: "paid",
  },
  {
    id: "anthropic/claude-opus-4.5",
    name: "Claude Opus 4.5",
    description: "Most capable Claude model",
    category: "paid",
  },
  {
    id: "openai/gpt-5.4",
    name: "GPT-5.4",
    description: "Latest OpenAI model",
    category: "paid",
  },
]

/**
 * Load settings from localStorage (CACHE ONLY - for synchronous access)
 * Use loadSettingsFromAPI() to get fresh data from MongoDB
 */
export function loadSettings(): InterviewSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS
  }

  try {
    const stored = localStorage.getItem("interviewace-settings")
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error("Failed to load settings from cache:", error)
  }

  return DEFAULT_SETTINGS
}

/**
 * Load settings from MongoDB API (PRIMARY source of truth)
 * Updates localStorage cache automatically
 */
export async function loadSettingsFromAPI(): Promise<InterviewSettings> {
  try {
    const response = await fetch("/api/settings")
    const result = await response.json()

    if (result.success && result.data) {
      const settings = { ...DEFAULT_SETTINGS, ...result.data }
      
      // Update localStorage cache for faster subsequent loads
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("interviewace-settings", JSON.stringify(settings))
        } catch (error) {
          console.warn("Failed to cache settings:", error)
        }
      }
      
      return settings
    } else {
      throw new Error(result.error || "Failed to load settings")
    }
  } catch (error) {
    console.error("Failed to load settings from API:", error)
    
    // Fallback to localStorage cache
    return loadSettings()
  }
}

/**
 * Save settings to localStorage ONLY (DEPRECATED)
 * Use saveSettingsToAPI() instead to save to MongoDB
 */
export function saveSettings(settings: InterviewSettings): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem("interviewace-settings", JSON.stringify(settings))
  } catch (error) {
    console.error("Failed to save settings to cache:", error)
  }
}

/**
 * Save settings to MongoDB API (PRIMARY save method)
 * Updates localStorage cache automatically
 */
export async function saveSettingsToAPI(settings: Partial<InterviewSettings>): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  try {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })

    const result = await response.json()

    if (result.success && result.data) {
      const fullSettings = { ...DEFAULT_SETTINGS, ...result.data }
      
      // Update localStorage cache
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("interviewace-settings", JSON.stringify(fullSettings))
        } catch (error) {
          console.warn("Failed to cache settings:", error)
        }
      }
      
      return {
        success: true,
        message: result.message || "Settings saved successfully",
      }
    } else {
      throw new Error(result.error || "Failed to save settings")
    }
  } catch (error) {
    console.error("Failed to save settings to API:", error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Reset settings to defaults (localStorage only)
 */
export function resetSettings(): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.removeItem("interviewace-settings")
  } catch (error) {
    console.error("Failed to reset settings:", error)
  }
}

/**
 * Reset settings to defaults (API version - saves to MongoDB)
 */
export async function resetSettingsToAPI(): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  return saveSettingsToAPI(DEFAULT_SETTINGS)
}
