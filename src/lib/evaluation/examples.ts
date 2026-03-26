import {
  evaluateAnswer,
  evaluateAnswerSync,
  SEMANTIC_ENHANCED_WEIGHTS,
} from "./engine"

export async function exampleBasicSemantic() {
  const result = await evaluateAnswer(
    "Explain dependency injection",
    "Dependency injection provides required dependencies from outside instead of creating them internally.",
    { role: "backend", type: "technical", difficulty: "medium" },
    {
      referenceAnswer:
        "Dependency injection is a design pattern where an object receives its dependencies from an external source.",
      weights: SEMANTIC_ENHANCED_WEIGHTS,
    }
  )

  console.log("Overall Score:", result.overallScore)
  console.log("Breakdown:", result.breakdown)
  console.log("Method:", result.evaluationMethod)
  console.log("Explanation:", result.explanation)
}

export function exampleSyncFallback() {
  const result = evaluateAnswerSync(
    "What is polymorphism?",
    "Polymorphism allows one interface to work with different underlying forms.",
    { role: "backend", type: "technical", difficulty: "easy" }
  )

  console.log("Sync Score:", result.overallScore)
  console.log("Sync Explanation:", result.explanation)
}
