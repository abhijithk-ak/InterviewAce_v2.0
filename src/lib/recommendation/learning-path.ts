// Learning Path Generation Engine
// Creates personalized learning sequences based on user data

import { getResourcesForWeakAreas } from "@/lib/resources"
import type { Resource } from "@/lib/resources"

export type LearningPriority = "critical" | "high" | "medium" | "low"
export type LearningTimeframe = "immediate" | "short-term" | "long-term"

export interface LearningStep {
  id: string
  title: string
  description: string
  priority: LearningPriority
  timeframe: LearningTimeframe
  estimatedDuration: string
  resources: Resource[]
  completionCriteria: string
  nextSteps: string[]
}

export interface LearningPath {
  pathId: string
  title: string
  description: string
  totalDuration: string
  primaryWeakness: string
  steps: LearningStep[]
  milestones: string[]
  successMetrics: string[]
}

/**
 * Generate a personalized learning path based on weaknesses and performance
 */
export function generateLearningPath(
  weakAreas: string[],
  skillBreakdown: Record<string, number>,
  experienceLevel: string,
  domains: string[]
): LearningPath {
  // Identify the most critical weakness
  const primaryWeakness = identifyPrimaryWeakness(weakAreas, skillBreakdown)
  
  // Generate learning steps sequence
  const steps = generateLearningSteps(primaryWeakness, skillBreakdown, experienceLevel, domains)
  
  // Calculate total duration
  const totalDuration = calculateTotalDuration(steps)
  
  // Define path metadata
  const pathId = generatePathId(primaryWeakness, experienceLevel)
  const pathTitle = generatePathTitle(primaryWeakness, experienceLevel)
  const pathDescription = generatePathDescription(primaryWeakness, skillBreakdown)
  
  return {
    pathId,
    title: pathTitle,
    description: pathDescription,
    totalDuration,
    primaryWeakness,
    steps,
    milestones: generateMilestones(steps),
    successMetrics: generateSuccessMetrics(primaryWeakness)
  }
}

/**
 * Identify the most critical skill weakness requiring immediate attention
 */
function identifyPrimaryWeakness(
  weakAreas: string[], 
  skillBreakdown: Record<string, number>
): string {
  // If user explicitly identified weak areas, prioritize the most critical one
  if (weakAreas.length > 0) {
    const criticalAreas = ["algorithm-design", "system-architecture", "communication-clarity"]
    const criticalWeakness = weakAreas.find(area => criticalAreas.includes(area))
    if (criticalWeakness) return criticalWeakness
    return weakAreas[0] // Return first weakness if none are critical
  }
  
  // Otherwise, infer from skill breakdown
  const skillEntries = Object.entries(skillBreakdown)
  const lowestSkill = skillEntries.reduce((min, current) => 
    current[1] < min[1] ? current : min
  )
  
  // Map skill breakdown keys to learning areas
  const skillToAreaMap: Record<string, string> = {
    "technical": "algorithm-design",
    "communication": "communication-clarity", 
    "clarity": "communication-clarity",
    "confidence": "confidence-building"
  }
  
  return skillToAreaMap[lowestSkill[0]] || "algorithm-design"
}

/**
 * Generate sequential learning steps for the identified weakness
 */
function generateLearningSteps(
  primaryWeakness: string,
  skillBreakdown: Record<string, number>,
  experienceLevel: string,
  domains: string[]
): LearningStep[] {
  const steps: LearningStep[] = []
  const resources = getResourcesForWeakAreas([primaryWeakness])
  
  // Step 1: Foundation (always first)
  steps.push({
    id: "foundation",
    title: `${primaryWeakness.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} Fundamentals`,
    description: `Build core understanding of ${primaryWeakness.replace("-", " ")} concepts`,
    priority: "critical",
    timeframe: "immediate", 
    estimatedDuration: experienceLevel === "student" ? "2-3 hours" : "1-2 hours",
    resources: resources.filter(r => r.difficulty === "beginner").slice(0, 2),
    completionCriteria: "Complete foundational resources and demonstrate basic understanding",
    nextSteps: ["practice", "application"]
  })
  
  // Step 2: Practice (hands-on application)
  steps.push({
    id: "practice",
    title: "Guided Practice",
    description: `Apply ${primaryWeakness.replace("-", " ")} concepts through structured exercises`,
    priority: "high",
    timeframe: "short-term",
    estimatedDuration: "3-5 hours",
    resources: resources.filter(r => r.type === "practice").slice(0, 2),
    completionCriteria: "Complete practice exercises with 70% accuracy",
    nextSteps: ["application", "mastery"]
  })
  
  // Step 3: Real-world Application
  steps.push({
    id: "application", 
    title: "Real-world Application",
    description: `Use ${primaryWeakness.replace("-", " ")} skills in interview-style scenarios`,
    priority: "high",
    timeframe: "short-term",
    estimatedDuration: "2-4 hours",
    resources: resources.filter(r => r.difficulty === "intermediate").slice(0, 2),
    completionCriteria: "Successfully complete interview simulation with improved performance",
    nextSteps: ["mastery"]
  })
  
  // Step 4: Mastery (advanced level)
  if (experienceLevel !== "student") {
    steps.push({
      id: "mastery",
      title: "Advanced Mastery",
      description: `Achieve expert-level proficiency in ${primaryWeakness.replace("-", " ")}`,
      priority: "medium",
      timeframe: "long-term", 
      estimatedDuration: "5-8 hours",
      resources: resources.filter(r => r.difficulty === "advanced").slice(0, 2),
      completionCriteria: "Demonstrate advanced concepts and teach others",
      nextSteps: []
    })
  }
  
  return steps
}

/**
 * Calculate total estimated duration for the learning path
 */
function calculateTotalDuration(steps: LearningStep[]): string {
  let totalHours = 0
  
  steps.forEach(step => {
    const duration = step.estimatedDuration
    const hours = parseInt(duration.match(/(\d+)/)?.[1] || "0")
    totalHours += hours
  })
  
  if (totalHours <= 8) {
    return `${totalHours} hours`
  } else if (totalHours <= 40) {
    return `${Math.round(totalHours/8)} days`
  } else {
    return `${Math.round(totalHours/40)} weeks`
  }
}

/**
 * Generate learning path ID for tracking
 */
function generatePathId(weakness: string, experienceLevel: string): string {
  return `${weakness}-${experienceLevel}-${Date.now().toString(36)}`
}

/**
 * Generate human-readable path title
 */
function generatePathTitle(weakness: string, experienceLevel: string): string {
  const weaknessTitle = weakness
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  
  const levelTitle = experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)
  
  return `${weaknessTitle} Mastery Path (${levelTitle})`
}

/**
 * Generate path description
 */
function generatePathDescription(weakness: string, skillBreakdown: Record<string, number>): string {
  const currentScore = Object.values(skillBreakdown).reduce((sum, val) => sum + val, 0) / Object.keys(skillBreakdown).length
  const targetScore = Math.min(currentScore + 3, 10)
  
  return `Structured learning path to improve ${weakness.replace("-", " ")} skills from ${Math.round(currentScore)}/10 to ${Math.round(targetScore)}/10 through progressive exercises and real-world application.`
}

/**
 * Generate learning milestones
 */
function generateMilestones(steps: LearningStep[]): string[] {
  return steps.map(step => 
    `Complete ${step.title} with ${step.completionCriteria}`
  )
}

/**
 * Generate success metrics for tracking progress
 */
function generateSuccessMetrics(weakness: string): string[] {
  const metricMap: Record<string, string[]> = {
    "algorithm-design": [
      "Solve 80% of easy algorithmic problems correctly",
      "Explain time/space complexity accurately", 
      "Design efficient algorithms for new problems"
    ],
    "system-architecture": [
      "Design scalable system architectures",
      "Identify bottlenecks and optimization opportunities",
      "Explain trade-offs in system design decisions"
    ],
    "communication-clarity": [
      "Explain technical concepts in simple terms",
      "Structure responses using clear frameworks (STAR method)",
      "Maintain clarity under interview pressure"
    ],
    "confidence-building": [
      "Complete interviews without freezing or panic",
      "Maintain steady performance across multiple sessions", 
      "Ask clarifying questions confidently"
    ]
  }
  
  return metricMap[weakness] || [
    "Improve performance scores by 3+ points",
    "Complete practice sessions consistently",
    "Demonstrate mastery in interview simulations"
  ]
}