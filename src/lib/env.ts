import { z } from "zod"

/**
 * Environment variable validation schema
 * 
 * REQUIRED: NextAuth, GitHub OAuth, MongoDB
 * OPTIONAL: OpenRouter (for AI feedback enhancement)
 * 
 * Note: InterviewAce uses algorithmic evaluation by default.
 * OpenRouter is only for optional feedback enhancement.
 */
const envSchema = z.object({
  // Required: Authentication
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string(),
  
  // Required: GitHub OAuth
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  
  // Required: Database
  MONGODB_URI: z.string(),
  
  // Optional: AI Enhancement
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().optional(),
})

export const env = envSchema.parse(process.env)
