/**
 * Test script for semantic scoring
 * Run with: npx tsx test-semantic.ts
 */

import { getHybridScore, warmupSemanticModel } from './src/lib/ml/semantic'

async function testSemanticScoring() {
  console.log('🧪 Testing semantic scoring system...\n')
  
  // Test case 1: Relevant answer
  console.log('Test 1: Relevant technical answer')
  const question1 = "What is your experience with React?"
  const answer1 = "I have three years of experience with React, building complex applications with hooks, context API, and performance optimization."
  const deterministicScore1 = 68
  
  try {
    const result1 = await getHybridScore(deterministicScore1, question1, answer1)
    console.log(`  Deterministic: ${result1.deterministicScore}`)
    console.log(`  Semantic: ${result1.semanticScore}`)
    console.log(`  Final (hybrid): ${result1.finalScore}`)
    console.log(`  Weight: ${result1.semanticWeight}`)
    console.log()
  } catch (error) {
    console.error('  ❌ Error:', error.message)
    console.error('  Stack:', error.stack)
  }
  
  // Test case 2: Irrelevant answer
  console.log('Test 2: Irrelevant answer')
  const question2 = "Explain your experience with databases"
  const answer2 = "I like to go hiking on weekends and enjoy reading books about history"
  const deterministicScore2 = 25
  
  try {
    const result2 = await getHybridScore(deterministicScore2, question2, answer2)
    console.log(`  Deterministic: ${result2.deterministicScore}`)
    console.log(`  Semantic: ${result2.semanticScore}`)
    console.log(`  Final (hybrid): ${result2.finalScore}`)
    console.log(`  Weight: ${result2.semanticWeight}`)
    console.log()
  } catch (error) {
    console.error('  ❌ Error:', error.message)
    console.error('  Stack:', error.stack)
  }
  
  // Test case 3: Warmup model
  console.log('Test 3: Warmup model (preload for faster inference)')
  try {
    await warmupSemanticModel()
    console.log('  ✅ Model warmed up successfully')
  } catch (error) {
    console.error('  ❌ Error:', error.message)
    console.error('  Stack:', error.stack)
  }
}

testSemanticScoring()
  .then(() => {
    console.log('\n✅ All tests completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })
