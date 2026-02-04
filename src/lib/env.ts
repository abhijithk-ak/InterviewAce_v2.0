import { z } from "zod"

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  MONGODB_URI: z.string(),
})

export const env = envSchema.parse(process.env)
