import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { evaluateAnswer } from "@/lib/evaluation"

type TestCase = {
  id: number
  label: string
  answer: string
  expected: string
}

const question = "What does gradient descent do?"
const referenceAnswer =
  "Gradient descent is an optimization algorithm that minimizes the loss function by iteratively updating model weights in the direction opposite to the gradient."

const testCases: TestCase[] = [
  {
    id: 1,
    label: "Clearly incorrect concept",
    answer:
      "Gradient descent increases the loss function to help the model learn faster.",
    expected: "conceptScore ≤2, finalScore ≤40",
  },
  {
    id: 2,
    label: "Correct concept",
    answer:
      "Gradient descent minimizes the loss function by updating model weights opposite to the gradient.",
    expected: "conceptScore ≥7, finalScore ≥70",
  },
  {
    id: 3,
    label: "Partially correct answer",
    answer:
      "Gradient descent updates model weights during training but sometimes increases the loss to explore better solutions.",
    expected: "conceptScore 3–5, finalScore 40–60",
  },
  {
    id: 4,
    label: "Very short answer",
    answer: "It trains the model.",
    expected: "low clarity score, finalScore ≤40",
  },
  {
    id: 5,
    label: "Terminology but wrong logic",
    answer:
      "Gradient descent is an optimization algorithm that increases the loss until the model converges.",
    expected: "conceptScore ≤2, finalScore ≤40",
  },
  {
    id: 6,
    label: "Good technical explanation",
    answer:
      "Gradient descent is an optimization algorithm used in machine learning to minimize the loss function by iteratively updating weights in the opposite direction of the gradient.",
    expected: "conceptScore ≥8, finalScore ≥75",
  },
]

function checkExpectation(id: number, concept: number, clarity: number, finalScore: number): string {
  switch (id) {
    case 1:
      return concept <= 2 && finalScore <= 40 ? "PASS" : "FAIL"
    case 2:
      return concept >= 7 && finalScore >= 70 ? "PASS" : "FAIL"
    case 3:
      return concept >= 3 && concept <= 5 && finalScore >= 40 && finalScore <= 60 ? "PASS" : "FAIL"
    case 4:
      return clarity <= 4 && finalScore <= 40 ? "PASS" : "FAIL"
    case 5:
      return concept <= 2 && finalScore <= 40 ? "PASS" : "FAIL"
    case 6:
      return concept >= 8 && finalScore >= 75 ? "PASS" : "FAIL"
    default:
      return "N/A"
  }
}

async function run() {
  loadEnvLocal()

  const rows: Array<Record<string, string | number>> = []

  for (const test of testCases) {
    const result = await evaluateAnswer(
      question,
      test.answer,
      {
        role: "ml-engineer",
        type: "technical",
        difficulty: "medium",
      },
      {
        referenceAnswer,
        aiModel: process.env.OPENROUTER_MODEL,
        aiTemperature: 0.1,
      }
    )

    const conceptScore = result.breakdown.conceptScore
    const semanticScore = result.breakdown.semanticScore
    const clarityScore = result.breakdown.clarityScore
    const finalScore = result.overallScore
    const expectation = checkExpectation(test.id, conceptScore, clarityScore, finalScore)

    rows.push({
      id: test.id,
      case: test.label,
      conceptScore,
      semanticScore,
      clarityScore,
      finalScore,
      expected: test.expected,
      status: expectation,
      explanation: result.explanation,
    })
  }

  console.log("\n=== E2E Production Pipeline Sanity Check (AI + MiniLM Hybrid) ===\n")
  console.table(
    rows.map(({ explanation, ...rest }) => rest)
  )

  console.log("\n=== Explanations ===\n")
  for (const row of rows) {
    console.log(`#${row.id} ${row.case}`)
    console.log(`- explanation: ${row.explanation}`)
    console.log("")
  }
}

run().catch((error) => {
  console.error("Sanity check failed:", error)
  process.exit(1)
})

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local")
  if (!existsSync(envPath)) {
    return
  }

  const content = readFileSync(envPath, "utf8")
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) {
      continue
    }

    const separator = line.indexOf("=")
    if (separator <= 0) {
      continue
    }

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^"|"$/g, "")
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}
