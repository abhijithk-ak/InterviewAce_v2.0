import { evaluateAnswer } from "../engine"

async function runDemo() {
  const question = "Explain React useEffect and when to use cleanup."
  const referenceAnswer =
    "useEffect runs side effects after render and cleanup should cancel subscriptions/timers to prevent leaks."
  const goodAnswer =
    "useEffect runs after render for side effects like data fetching or subscriptions. Cleanup returns a function that removes listeners or clears timers to avoid memory leaks."
  const badAnswer =
    "useEffect only runs once and you should not use cleanup because React handles everything automatically."

  const good = await evaluateAnswer(
    question,
    goodAnswer,
    { role: "frontend", type: "technical", difficulty: "medium" },
    { referenceAnswer }
  )

  const bad = await evaluateAnswer(
    question,
    badAnswer,
    { role: "frontend", type: "technical", difficulty: "medium" },
    { referenceAnswer }
  )

  console.log("Good overall:", good.overallScore)
  console.log("Good breakdown:", good.breakdown)
  console.log("Good errors:", good.errors)

  console.log("Bad overall:", bad.overallScore)
  console.log("Bad breakdown:", bad.breakdown)
  console.log("Bad errors:", bad.errors)
}

runDemo().catch((error) => {
  console.error("Demo failed:", error)
  process.exit(1)
})
