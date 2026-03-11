/**
 * Example Usage: Semantic Evaluation Module
 * 
 * This file demonstrates how to use the lightweight ML-based
 * semantic evaluation in InterviewAce.
 */

import { 
  evaluateAnswer, 
  evaluateAnswerSync,
  SEMANTIC_ENHANCED_WEIGHTS 
} from './engine'

// Example 1: Basic semantic evaluation
export async function exampleBasicSemantic() {
  const question = "Explain how React hooks work and their benefits"
  const answer = "React hooks are functions that let you use state and lifecycle features in functional components. The most common hooks are useState for managing state and useEffect for side effects."
  
  const result = await evaluateAnswer(
    question,
    answer,
    {
      role: "Frontend Developer",
      type: "technical",
      difficulty: "medium"
    },
    {
      enableSemantic: true,
      weights: SEMANTIC_ENHANCED_WEIGHTS
    }
  )
  
  console.log('Evaluation with semantic scoring:')
  console.log('Overall Score:', result.overallScore)
  console.log('Breakdown:', result.breakdown)
  console.log('Semantic Score:', result.breakdown.semantic)
  console.log('Method:', result.metadata.evaluationMethod) // "hybrid"
  console.log('Feedback:', result.feedback)
}

// Example 2: Compare deterministic vs semantic evaluation
export async function exampleComparison() {
  const question = "What is dependency injection?"
  const answer = "Dependency injection is a design pattern where objects receive their dependencies from external sources rather than creating them internally."
  
  const context = {
    role: "Backend Engineer",
    type: "technical",
    difficulty: "medium"
  }
  
  // Deterministic only
  const deterministicResult = evaluateAnswerSync(question, answer, context)
  
  // With semantic scoring
  const semanticResult = await evaluateAnswer(question, answer, context, {
    enableSemantic: true,
    weights: SEMANTIC_ENHANCED_WEIGHTS
  })
  
  console.log('\n=== Comparison ===')
  console.log('Deterministic Score:', deterministicResult.overallScore)
  console.log('Hybrid Score:', semanticResult.overallScore)
  console.log('Semantic Component:', semanticResult.breakdown.semantic)
}

// Example 3: Handling semantic evaluation failures
export async function exampleErrorHandling() {
  const question = "Describe microservices architecture"
  const answer = "Microservices break down applications into small, independent services."
  
  try {
    const result = await evaluateAnswer(
      question,
      answer,
      {
        role: "Software Architect",
        type: "system-design",
        difficulty: "hard"
      },
      {
        enableSemantic: true,
        weights: SEMANTIC_ENHANCED_WEIGHTS
      }
    )
    
    // Check if semantic evaluation succeeded
    if (result.metadata.semanticEnabled) {
      console.log('✅ Semantic evaluation succeeded')
      console.log('Semantic score:', result.breakdown.semantic)
    } else {
      console.log('⚠️ Semantic evaluation failed, used deterministic only')
    }
    
    console.log('Overall score:', result.overallScore)
  } catch (error) {
    console.error('Evaluation failed:', error)
  }
}

// Example 4: Batch evaluation with semantic scoring
export async function exampleBatchEvaluation() {
  const { evaluateMultipleAnswers } = await import('./engine')
  
  const pairs = [
    {
      question: "What is polymorphism?",
      answer: "Polymorphism allows objects of different types to be treated uniformly."
    },
    {
      question: "Explain async/await in JavaScript",
      answer: "Async/await provides a cleaner syntax for working with promises."
    }
  ]
  
  const results = await evaluateMultipleAnswers(
    pairs,
    {
      role: "Full Stack Developer",
      type: "technical",
      difficulty: "medium"
    },
    {
      enableSemantic: true,
      weights: SEMANTIC_ENHANCED_WEIGHTS
    }
  )
  
  results.forEach((result, index) => {
    console.log(`\n=== Answer ${index + 1} ===`)
    console.log('Score:', result.overallScore)
    console.log('Semantic:', result.breakdown.semantic)
  })
}

// Example 5: Using the semantic evaluator directly
export async function exampleDirectSemanticScore() {
  const { semanticScore, evaluateSemanticSimilarity } = await import('../ml/semanticEvaluator')
  
  const question = "What are the SOLID principles?"
  const goodAnswer = "SOLID principles are five design principles for object-oriented programming: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion."
  const poorAnswer = "Programming is about writing code to solve problems."
  
  const goodScore = await semanticScore(question, goodAnswer)
  const poorScore = await semanticScore(question, poorAnswer)
  
  console.log('\n=== Direct Semantic Scoring ===')
  console.log('Good answer score:', goodScore) // Expected: ~8-9/10
  console.log('Poor answer score:', poorScore) // Expected: ~2-3/10
  
  // Using enhanced evaluation
  const detailed = await evaluateSemanticSimilarity(question, goodAnswer)
  console.log('\nDetailed evaluation:', detailed)
  // { score: 8.5, similarity: 0.85, confidence: 'high' }
}

// Run examples (uncomment to test)
// exampleBasicSemantic()
// exampleComparison()
// exampleErrorHandling()
// exampleBatchEvaluation()
// exampleDirectSemanticScore()
