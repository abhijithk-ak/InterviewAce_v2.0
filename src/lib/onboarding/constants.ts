// Shared constants for onboarding UI and validation
// Separated from models to prevent server imports in client components

export const EXPERIENCE_LEVELS = [
  { value: "student", label: "Student", description: "Currently studying or recent graduate" },
  { value: "fresher", label: "Fresher", description: "0-1 years of experience" },
  { value: "junior", label: "Junior", description: "1-3 years of experience" },
  { value: "senior", label: "Senior", description: "3+ years of experience" },
] as const

export const AVAILABLE_DOMAINS = [
  "frontend",
  "backend", 
  "fullstack",
  "data-science",
  "devops",
  "mobile",
  "machine-learning",
  "system-design",
  "cybersecurity",
  "cloud",
] as const

export const INTERVIEW_GOALS = [
  "practice-technical-skills",
  "improve-communication",
  "prepare-for-job-interviews",
  "build-confidence",
  "learn-new-concepts",
  "benchmark-skills",
  "get-feedback",
  "mock-interview-practice",
] as const

export const WEAK_AREAS = [
  "algorithm-design",
  "system-architecture",
  "code-optimization",
  "database-design",
  "api-design",
  "testing-strategies", 
  "debugging-skills",
  "communication-clarity",
  "confidence-building",
  "time-management",
] as const

// TypeScript types
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["value"]
export type Domain = (typeof AVAILABLE_DOMAINS)[number]
export type InterviewGoal = (typeof INTERVIEW_GOALS)[number]
export type WeakArea = (typeof WEAK_AREAS)[number]

export interface OnboardingPayload {
  experienceLevel: ExperienceLevel
  domains: Domain[]
  interviewGoals: InterviewGoal[]
  confidenceLevel: number // 1-5
  weakAreas?: WeakArea[]
}