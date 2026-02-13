/**
 * Algorithmic Evaluation Engine - Test Cases
 * Demonstrates deterministic, explainable scoring
 * 
 * Run: npx tsx src/lib/evaluation/__tests__/demo.ts
 */

import { evaluateAnswer } from "../engine"
import { DOMAIN_KEYWORDS } from "../keywords"

console.log("=".repeat(80))
console.log("INTERVIEWACE - ALGORITHMIC EVALUATION ENGINE DEMO")
console.log("=".repeat(80))
console.log()

// Test Case 1: Strong Technical Answer
console.log("📊 TEST CASE 1: Strong Technical Answer (Frontend)")
console.log("-".repeat(80))

const question1 = "Explain how React's useEffect hook works and when you would use it"
const answer1 = `
I implemented useEffect extensively in my recent projects. It's used for side effects 
in React components. First, useEffect runs after the component renders. The hook takes 
two parameters: a callback function and a dependency array. When dependencies change, 
the effect runs again. I've used it for data fetching, subscriptions, and DOM manipulation. 
For optimization, I used cleanup functions to prevent memory leaks. In one project, 
I optimized performance by using useMemo alongside useEffect to avoid unnecessary re-renders.
`

const result1 = evaluateAnswer(question1, answer1, {
  role: "frontend",
  type: "technical",
  difficulty: "medium"
})

console.log(`Question: ${question1}`)
console.log(`Answer: ${answer1.trim()}`)
console.log()
console.log("📈 Evaluation Results:")
console.log(`   Overall Score: ${result1.overallScore}/100`)
console.log(`   
   Breakdown:
   - Relevance:        ${result1.breakdown.relevance}/10 (30% weight)
   - Clarity:          ${result1.breakdown.clarity}/10 (20% weight)
   - Technical Depth:  ${result1.breakdown.technical}/10 (25% weight)
   - Confidence:       ${result1.breakdown.confidence}/10 (15% weight)
   - Structure:        ${result1.breakdown.structure}/10 (10% weight)
`)
console.log(`✅ Strengths:`)
result1.strengths.forEach(s => console.log(`   - ${s}`))
console.log()
console.log(`🎯 Areas for Improvement:`)
result1.improvements.forEach(i => console.log(`   - ${i}`))
console.log()
console.log(`💬 Feedback: ${result1.feedback}`)
console.log()
console.log(`📊 Metadata:`)
console.log(`   - Evaluation Method: ${result1.metadata.evaluationMethod}`)
console.log(`   - Word Count: ${result1.metadata.wordCount}`)
console.log(`   - Version: ${result1.metadata.version}`)
console.log()
console.log()

// Test Case 2: Weak Answer with No Technical Details
console.log("📊 TEST CASE 2: Weak Answer with Low Technical Depth")
console.log("-".repeat(80))

const question2 = "What is the difference between SQL and NoSQL databases?"
const answer2 = `
I think SQL is like a database that uses tables and stuff. NoSQL is maybe different. 
I'm not sure exactly how they work but I guess SQL is older.
`

const result2 = evaluateAnswer(question2, answer2, {
  role: "backend",
  type: "technical",
  difficulty: "easy"
})

console.log(`Question: ${question2}`)
console.log(`Answer: ${answer2.trim()}`)
console.log()
console.log("📈 Evaluation Results:")
console.log(`   Overall Score: ${result2.overallScore}/100`)
console.log(`   
   Breakdown:
   - Relevance:        ${result2.breakdown.relevance}/10
   - Clarity:          ${result2.breakdown.clarity}/10
   - Technical Depth:  ${result2.breakdown.technical}/10
   - Confidence:       ${result2.breakdown.confidence}/10
   - Structure:        ${result2.breakdown.structure}/10
`)
console.log(`✅ Strengths:`)
result2.strengths.forEach(s => console.log(`   - ${s}`))
console.log()
console.log(`🎯 Areas for Improvement:`)
result2.improvements.forEach(i => console.log(`   - ${i}`))
console.log()
console.log(`💬 Feedback: ${result2.feedback}`)
console.log()
console.log()

// Test Case 3: Well-Structured Behavioral Answer (STAR format)
console.log("📊 TEST CASE 3: Well-Structured Behavioral Answer (STAR Format)")
console.log("-".repeat(80))

const question3 = "Tell me about a time you had to debug a critical production issue"
const answer3 = `
In my previous role, we faced a situation where our API response time suddenly increased 
by 500%. The task was to identify and resolve the issue quickly before it affected customers.

First, I checked our monitoring dashboard and noticed database query times had spiked. 
Then, I analyzed the slow query logs and found a missing index on a frequently accessed table. 
Next, I created the index in a staging environment and tested it thoroughly. 
Finally, I deployed the fix to production, which immediately reduced response times back to normal.

The result was that we prevented potential customer churn and I documented the incident 
in our runbook to prevent future occurrences. This experience taught me the importance 
of proactive monitoring and proper database indexing.
`

const result3 = evaluateAnswer(question3, answer3, {
  role: "fullstack",
  type: "behavioral",
  difficulty: "medium"
})

console.log(`Question: ${question3}`)
console.log(`Answer: ${answer3.trim()}`)
console.log()
console.log("📈 Evaluation Results:")
console.log(`   Overall Score: ${result3.overallScore}/100`)
console.log(`   
   Breakdown:
   - Relevance:        ${result3.breakdown.relevance}/10
   - Clarity:          ${result3.breakdown.clarity}/10
   - Technical Depth:  ${result3.breakdown.technical}/10
   - Confidence:       ${result3.breakdown.confidence}/10
   - Structure:        ${result3.breakdown.structure}/10
`)
console.log(`✅ Strengths:`)
result3.strengths.forEach(s => console.log(`   - ${s}`))
console.log()
console.log(`🎯 Areas for Improvement:`)
result3.improvements.forEach(i => console.log(`   - ${i}`))
console.log()
console.log(`💬 Feedback: ${result3.feedback}`)
console.log()
console.log()

// Domain Keywords Statistics
console.log("📚 DOMAIN KEYWORD LIBRARY STATISTICS")
console.log("-".repeat(80))
Object.entries(DOMAIN_KEYWORDS).forEach(([domain, keywords]) => {
  console.log(`${domain.padEnd(20)}: ${keywords.length.toString().padStart(3)} keywords`)
})
console.log()
console.log(`Total Keywords: ${Object.values(DOMAIN_KEYWORDS).flat().length}`)
console.log()
console.log("=".repeat(80))
console.log("✅ All test cases completed successfully!")
console.log("🎓 This demonstrates explainable, deterministic evaluation WITHOUT AI")
console.log("=".repeat(80))
