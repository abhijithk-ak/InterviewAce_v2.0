import { z } from "zod"
import {
  EXPERIENCE_LEVELS,
  AVAILABLE_DOMAINS,
  INTERVIEW_GOALS,
  WEAK_AREAS,
  type OnboardingPayload as OnboardingPayloadType,
} from "./constants"

/**
 * Onboarding Payload Validation
 * Ensures clean, deterministic data enters the system
 * Faculty-friendly with readable error messages
 */

// Extract enum values for validation
const experienceLevelValues = EXPERIENCE_LEVELS.map((level) => level.value) as [
  string,
  ...string[]
]
const domainValues = [...AVAILABLE_DOMAINS] as [string, ...string[]]
const goalValues = [...INTERVIEW_GOALS] as [string, ...string[]]
const weakAreaValues = [...WEAK_AREAS] as [string, ...string[]]

// Zod schema for onboarding payload
export const OnboardingPayloadSchema = z.object({
  experienceLevel: z
    .enum(experienceLevelValues, {
      message: `Experience level must be one of: ${experienceLevelValues.join(", ")}`,
    })
    .describe("User's professional experience level"),

  domains: z
    .array(z.enum(domainValues))
    .min(1, "At least one domain must be selected")
    .max(5, "Maximum 5 domains allowed")
    .describe("Technical domains of interest"),

  interviewGoals: z
    .array(z.enum(goalValues))
    .min(1, "At least one interview goal must be selected")
    .max(5, "Maximum 5 goals allowed")
    .describe("Interview preparation objectives"),

  confidenceLevel: z
    .number()
    .int("Confidence level must be a whole number")
    .min(1, "Confidence level must be at least 1")
    .max(5, "Confidence level cannot exceed 5")
    .describe("Self-assessed confidence level (1-5)"),

  weakAreas: z
    .array(z.enum(weakAreaValues))
    .optional()
    .default([])
    .describe("Areas for improvement (optional)"),
})

// TypeScript type inference
export type OnboardingPayload = z.infer<typeof OnboardingPayloadSchema>

/**
 * Validates onboarding payload with detailed error messages
 * @param payload - Raw form data to validate
 * @returns Validated and sanitized payload
 * @throws ZodError with readable messages for invalid data
 */
export function validateOnboardingPayload(payload: unknown): OnboardingPayload {
  try {
    return OnboardingPayloadSchema.parse(payload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Transform Zod errors into readable messages
      const errorMessages = error.issues.map((err: any) => {
        const field = err.path.join(".")
        return `${field}: ${err.message}`
      })
      
      throw new Error(
        `Validation failed:\n${errorMessages.join("\n")}`
      )
    }
    throw error
  }
}

/**
 * Validates a partial update (for future settings updates)
 * @param payload - Partial profile data
 * @returns Validated partial payload
 */
export function validateProfileUpdate(payload: unknown): Partial<OnboardingPayload> {
  const PartialSchema = OnboardingPayloadSchema.partial()
  
  try {
    return PartialSchema.parse(payload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: any) => {
        const field = err.path.join(".")
        return `${field}: ${err.message}`
      })
      
      throw new Error(
        `Update validation failed:\n${errorMessages.join("\n")}`
      )
    }
    throw error
  }
}

// Export constants for frontend use (re-export from constants)
export {
  EXPERIENCE_LEVELS,
  AVAILABLE_DOMAINS,
  INTERVIEW_GOALS,
  WEAK_AREAS,
} from "./constants"