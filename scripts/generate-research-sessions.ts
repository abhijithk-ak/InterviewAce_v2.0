/**
 * Research Dataset Generator
 * Generates a balanced synthetic interview dataset for the IEEE research dashboard.
 *
 * Usage:
 *   pnpm tsx scripts/generate-research-sessions.ts
 *   pnpm tsx scripts/generate-research-sessions.ts --force
 */

import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import mongoose from "mongoose"
import { connectDB } from "../src/lib/db/mongoose"
import { SessionModel } from "../src/lib/db/models/Session"
import { evaluateAnswer } from "../src/lib/evaluation"
import { User } from "../src/models/User"

const TARGET_EMAIL = "ak.abhijithk@gmail.com"
const HYBRID_METHOD = "AI + MiniLM Hybrid"
const SEMANTIC_MODEL = "MiniLM-L6-v2"
const CONCEPT_MODEL = "Llama-3.2-3B"

type AnswerLabel = "correct" | "partial" | "incorrect"
type InterviewType = "technical" | "system design" | "behavioural" | "hr"
type Difficulty = "easy" | "medium" | "hard"

type AnswerSet = Record<AnswerLabel, string>

type QuestionEntry = {
  interviewType: InterviewType
  difficulty: Difficulty
  question: string
  referenceAnswer: string
  answers: AnswerSet
}

type SessionPlan = {
  interviewType: InterviewType
  difficulty: Difficulty
  labels: [AnswerLabel, AnswerLabel, AnswerLabel]
}

const RESEARCH_DELETE_QUERY = {
  userEmail: TARGET_EMAIL,
  $or: [
    { "config.source": "research" },
    { "config.difficulty": "research-synthetic" },
  ],
}

const dataset: QuestionEntry[] = [
  {
    interviewType: "technical",
    difficulty: "easy",
    question: "What is gradient descent?",
    referenceAnswer:
      "Gradient descent is an optimization algorithm that minimizes a loss function by iteratively updating model parameters in the opposite direction of the gradient. The learning rate controls the step size.",
    answers: {
      correct:
        "Gradient descent is an iterative optimization method that minimizes the loss function by computing the gradient with respect to model parameters and moving the parameters opposite to that gradient. The learning rate controls how large each update is.",
      partial:
        "Gradient descent updates model weights during training to reduce error. It uses the slope of the loss function to decide which way to move, although I am not completely sure how the learning rate affects convergence speed and stability.",
      incorrect:
        "Gradient descent increases the loss function so the model can explore more of the search space before settling on the final answer.",
    },
  },
  {
    interviewType: "technical",
    difficulty: "medium",
    question: "What is overfitting?",
    referenceAnswer:
      "Overfitting occurs when a model learns noise and training-specific details instead of the underlying pattern, producing low training error but poor generalization to unseen data.",
    answers: {
      correct:
        "Overfitting is when a model memorizes the training set, including noise, instead of learning generalizable structure. Training performance becomes very strong while validation or test performance degrades. Common mitigations include regularization, early stopping, dropout, and more data.",
      partial:
        "Overfitting means the model is too tailored to the training data and then does worse on new data. It usually happens when the model is too complex. Simpler models or more data can help, though I cannot fully explain the bias-variance tradeoff.",
      incorrect:
        "Overfitting means the model has not trained long enough yet, so the fix is usually to add more epochs until the training loss stops decreasing.",
    },
  },
  {
    interviewType: "technical",
    difficulty: "hard",
    question: "What is regularization?",
    referenceAnswer:
      "Regularization reduces overfitting by adding a complexity penalty to the objective. L1 encourages sparsity, L2 shrinks weights, and dropout regularizes neural networks by randomly masking activations during training.",
    answers: {
      correct:
        "Regularization adds a penalty term to the training objective to discourage overly complex models. L1 regularization uses the absolute value of weights and can drive some coefficients to zero, while L2 penalizes squared magnitude and keeps weights small. Dropout is another regularization technique for neural networks.",
      partial:
        "Regularization helps prevent overfitting by penalizing large weights. L1 and L2 are the common forms, and dropout is used in deep learning. I know they reduce model complexity, but I am not fully confident about the exact mathematical distinction between L1 and L2.",
      incorrect:
        "Regularization is the same as feature normalization. It rescales all input features so they have the same numeric range before training.",
    },
  },
  {
    interviewType: "system design",
    difficulty: "hard",
    question: "Design a scalable URL shortener.",
    referenceAnswer:
      "A scalable URL shortener needs an API layer, key generation strategy, persistent storage mapping short codes to long URLs, caching, rate limiting, analytics, and replication for high availability. It should address collisions, read-heavy traffic, and redirect latency.",
    answers: {
      correct:
        "I would design a URL shortener with a stateless API tier, a key-generation service for unique short codes, and a primary datastore that maps short codes to canonical URLs. Because reads dominate, I would place Redis in front of the datastore, replicate data for availability, and use rate limiting plus abuse detection at the edge. Analytics writes can be asynchronous through a queue so redirect latency stays low.",
      partial:
        "I would create an API that stores a long URL and returns a short code. A database table could keep the mapping, and a cache would help with redirects. We should also think about duplicate URLs and scaling the database, although I have not fully worked through the collision strategy or analytics pipeline.",
      incorrect:
        "A scalable URL shortener can be implemented by storing all URLs in browser local storage and returning the array index as the short code. Since the browser handles the redirects, we would not need a backend system.",
    },
  },
  {
    interviewType: "system design",
    difficulty: "hard",
    question: "Design a distributed cache.",
    referenceAnswer:
      "A distributed cache uses multiple nodes to store key-value data in memory with partitioning, replication, eviction policies, consistency tradeoffs, failure detection, and client routing. It should support horizontal scaling and low latency.",
    answers: {
      correct:
        "A distributed cache should partition keys across nodes using consistent hashing so it can scale horizontally while minimizing key movement during resharding. Popular items can be replicated for resilience, and each node should enforce eviction policies such as LRU or LFU. Clients or a routing layer need to know which node owns a key, and failures should trigger rebalancing with clear consistency guarantees.",
      partial:
        "I would use multiple cache servers and spread keys across them. Replication helps if a node fails, and an eviction policy like LRU can prevent memory exhaustion. The main areas I would need to think through more are rebalancing and how strong the consistency should be after a node outage.",
      incorrect:
        "A distributed cache is just a very large SQL database. The best design is to store all cached values on one server and call it distributed because many applications can connect to it.",
    },
  },
  {
    interviewType: "system design",
    difficulty: "hard",
    question: "Design a recommendation service for millions of users.",
    referenceAnswer:
      "A recommendation service at scale needs candidate generation, ranking, feature pipelines, online serving, batch and streaming updates, feedback loops, caching, experimentation, and monitoring. It must balance latency, relevance, and freshness.",
    answers: {
      correct:
        "I would separate recommendation into candidate generation and ranking. Offline pipelines would build embeddings or collaborative filtering features, while streaming events would refresh recent interactions. An online serving layer would retrieve a manageable candidate set, score it with a ranking model, and cache popular recommendations. Monitoring, A/B testing, and feature freshness are critical because relevance degrades quickly when user behavior shifts.",
      partial:
        "I would collect user interactions, train a model, and then use a service to return recommended items. A ranking stage and caching layer would improve latency. I understand the high-level flow, but I would need to think more about online feature freshness and how to keep recommendations current as new events arrive.",
      incorrect:
        "The simplest recommendation service is to sort products alphabetically and return the first ten entries to every user. That guarantees consistency and avoids the need for machine learning or user data.",
    },
  },
  {
    interviewType: "behavioural",
    difficulty: "medium",
    question: "Describe a challenging project you worked on.",
    referenceAnswer:
      "A strong behavioural answer should clearly describe the situation, task, actions, and results. It should show ownership, collaboration, problem solving, measurable outcomes, and lessons learned.",
    answers: {
      correct:
        "On one project our model training pipeline routinely failed because data contracts between upstream teams kept changing. I took ownership of defining schema validation at ingestion, added automated alerts, and set up a weekly sync with the data producers. Within a month, pipeline failures dropped significantly and we cut model delivery delays from days to hours. The experience taught me that technical fixes need process alignment to stay effective.",
      partial:
        "A challenging project for me was a model deployment where requirements changed several times. I coordinated with teammates, fixed a few bugs, and helped us deliver. It was stressful but we completed it, although I could explain the measurable business outcome better.",
      incorrect:
        "I have not really faced challenging projects. Usually I wait for my manager to tell me what to do and then I finish my individual task without needing help from anyone else.",
    },
  },
  {
    interviewType: "behavioural",
    difficulty: "easy",
    question: "How do you handle tight deadlines?",
    referenceAnswer:
      "A good answer should mention prioritization, communication, tradeoff management, realistic scoping, risk escalation, and maintaining quality under time pressure.",
    answers: {
      correct:
        "When deadlines are tight, I first separate must-have outcomes from nice-to-have scope, then align those priorities with stakeholders. I break the work into small milestones, surface risks early, and communicate any tradeoffs explicitly so nobody is surprised. That approach helps me move quickly without sacrificing critical quality checks.",
      partial:
        "I usually make a task list, work longer hours if needed, and try to finish the most important items first. I also keep the team updated. I know prioritization matters, but I could be more explicit about how I negotiate scope when the deadline is unrealistic.",
      incorrect:
        "I handle tight deadlines by skipping testing and documentation so I can push code faster. If problems appear later, we can fix them after release.",
    },
  },
  {
    interviewType: "behavioural",
    difficulty: "medium",
    question: "Tell me about a time you disagreed with feedback from a teammate or manager.",
    referenceAnswer:
      "A strong answer should show professionalism, active listening, evidence-based discussion, openness to feedback, conflict resolution, and a constructive outcome.",
    answers: {
      correct:
        "A teammate once suggested removing feature monitoring from a launch to simplify delivery. I disagreed because we were releasing a model with limited production history, so I gathered incident data from a previous launch and explained the operational risk. We discussed the tradeoff, agreed on a lighter monitoring scope, and launched on time with enough coverage to catch issues. The key lesson was to disagree with evidence, not ego.",
      partial:
        "I have disagreed with feedback before, usually around implementation details. I try to explain my reasoning calmly and listen to the other person's view. In one case we reached a compromise, although I did not document the outcome as clearly as I should have.",
      incorrect:
        "If I disagree with feedback, I usually ignore it and continue with my original approach because I know my code better than anyone else.",
    },
  },
  {
    interviewType: "hr",
    difficulty: "easy",
    question: "Why do you want to work here?",
    referenceAnswer:
      "A good HR answer connects the company's mission, product, or culture with the candidate's skills and goals. It should be specific, authentic, and role-relevant.",
    answers: {
      correct:
        "I want to work here because your team is applying machine learning to a product with clear user impact rather than building models in isolation. The role matches my interest in taking systems from experimentation to reliable production, and your emphasis on cross-functional collaboration fits how I like to work. I am especially drawn to the chance to contribute to both model quality and platform reliability.",
      partial:
        "I want to work here because the company seems reputable and the role aligns with my background in machine learning. I am interested in growth and I think I could learn a lot here, although I would like to understand more about the product roadmap.",
      incorrect:
        "I mainly want to work here because the office looks nice and I heard the interview process is easier than at other companies.",
    },
  },
  {
    interviewType: "hr",
    difficulty: "easy",
    question: "Where do you see yourself in five years?",
    referenceAnswer:
      "A strong answer should show ambition, realism, learning orientation, and alignment with the role. It should describe growth without sounding detached from the company.",
    answers: {
      correct:
        "In five years I want to be a strong senior engineer who can lead complex ML systems from design through production and mentor others along the way. I want depth in model evaluation and platform reliability, and I would like that growth to happen while contributing meaningfully to a team with a strong product and engineering culture.",
      partial:
        "In five years I hope to have progressed into a more senior position and built deeper expertise in machine learning. I want to keep learning and take on more ownership, although I am still figuring out whether I want that to be primarily technical leadership or people management.",
      incorrect:
        "In five years I probably will not be in this field anymore. I mostly see this job as a temporary step until I decide what I actually want to do.",
    },
  },
  {
    interviewType: "hr",
    difficulty: "medium",
    question: "What is one of your strengths and one area you are improving?",
    referenceAnswer:
      "A good answer presents a relevant strength with evidence and a genuine growth area with a concrete plan for improvement. It should show self-awareness and accountability.",
    answers: {
      correct:
        "One of my strengths is turning ambiguous technical problems into structured execution plans. On recent projects I have been the person who clarifies requirements, defines milestones, and keeps stakeholders aligned. An area I am improving is delegating earlier instead of trying to solve too much myself, so I now share design docs sooner and ask for feedback before implementation gets too far ahead.",
      partial:
        "A strength of mine is being dependable and analytical. An area I am working on is public speaking because I can become too detailed in presentations. I have started practicing shorter updates, but I could give a more concrete example of the impact that change has had.",
      incorrect:
        "My strength is that I do not really have weaknesses. If something goes wrong, it is usually because the team around me was not strong enough.",
    },
  },
]

const LABEL_PATTERNS: Array<[AnswerLabel, AnswerLabel, AnswerLabel]> = [
  ["correct", "partial", "incorrect"],
  ["partial", "incorrect", "correct"],
  ["incorrect", "correct", "partial"],
]

const SESSION_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"]

const sessionPlans: SessionPlan[] = (["technical", "system design", "behavioural", "hr"] as const).flatMap(
  (interviewType) => SESSION_DIFFICULTIES.map((difficulty, index) => ({
    interviewType,
    difficulty,
    labels: LABEL_PATTERNS[index],
  }))
)

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local")
  if (!existsSync(envPath)) return

  const content = readFileSync(envPath, "utf8")
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue

    const separator = line.indexOf("=")
    if (separator <= 0) continue

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1).trim().replace(/^"|"$/g, "")
    if (!process.env[key]) process.env[key] = value
  }
}

function randomPastDate(days = 14): Date {
  return new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000)
}

function mean(values: number[]): number {
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

function getQuestionsForType(interviewType: InterviewType): QuestionEntry[] {
  const questions = dataset.filter((entry) => entry.interviewType === interviewType)
  if (questions.length !== 3) {
    throw new Error(`Expected exactly 3 questions for ${interviewType}, found ${questions.length}`)
  }
  return questions
}

async function main(): Promise<void> {
  loadEnvLocal()

  const force = process.argv.includes("--force")

  console.log("Connecting to MongoDB...")
  await connectDB()

  const user = await User.findOne({ email: TARGET_EMAIL }).lean()
  if (user) {
    console.log(`User found: ${user.email}`)
  } else {
    console.log(`User document not found for ${TARGET_EMAIL}; continuing with email-based session linkage.`)
  }

  const existingResearchSessions = await SessionModel.countDocuments(RESEARCH_DELETE_QUERY)
  if (existingResearchSessions > 0 && !force) {
    console.log(
      `Skipping generation: found ${existingResearchSessions} existing research session(s). Pass --force to replace them.`
    )
    await mongoose.disconnect()
    return
  }

  if (force) {
    const deleteResult = await SessionModel.deleteMany(RESEARCH_DELETE_QUERY)
    console.log(`Cleared existing research sessions: ${deleteResult.deletedCount ?? 0}`)
  }

  console.log("Generating research dataset...")

  const qualityScores: Record<AnswerLabel, number[]> = {
    correct: [],
    partial: [],
    incorrect: [],
  }
  const typeCounts: Record<InterviewType, number> = {
    technical: 0,
    "system design": 0,
    behavioural: 0,
    hr: 0,
  }
  const difficultyCounts: Record<Difficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  }

  let createdSessions = 0
  let evaluatedQuestions = 0

  for (const plan of sessionPlans) {
    const questionsForType = getQuestionsForType(plan.interviewType)
    const createdAt = randomPastDate(14)
    const startedAt = new Date(createdAt.getTime() - (90_000 + Math.random() * 120_000))
    const endedAt = new Date(createdAt.getTime() + (120_000 + Math.random() * 180_000))
    const questions = []

    for (const [index, entry] of questionsForType.entries()) {
      const label = plan.labels[index]
      const answer = entry.answers[label]
      const questionTimestamp = new Date(createdAt.getTime() + index * 20_000)
      const evaluation = await evaluateAnswer(
        entry.question,
        answer,
        {
          role: "ml-engineer",
          type: plan.interviewType,
          difficulty: plan.difficulty,
        },
        {
          referenceAnswer: entry.referenceAnswer,
          aiModel: process.env.OPENROUTER_MODEL,
          aiTemperature: 0.1,
        }
      )

      questions.push({
        text: entry.question,
        answer,
        kind: "main" as const,
        researchLabel: label,
        evaluation: {
          overallScore: evaluation.overallScore,
          breakdown: {
            conceptScore: evaluation.breakdown.conceptScore,
            semanticScore: evaluation.breakdown.semanticScore,
            clarityScore: evaluation.breakdown.clarityScore,
          },
          explanation: evaluation.explanation,
          errors: evaluation.errors ?? [],
          evaluationMethod: HYBRID_METHOD,
          aiEvaluationUsed: true,
          semanticModel: SEMANTIC_MODEL,
          conceptModel: CONCEPT_MODEL,
        },
        metrics: {
          overallScore: evaluation.overallScore,
          conceptScore: evaluation.breakdown.conceptScore,
          deterministicScore: (evaluation.breakdown.conceptScore ?? 0) * 10,
          semanticScore: evaluation.breakdown.semanticScore,
          finalScore: evaluation.overallScore,
          clarityScore: evaluation.breakdown.clarityScore,
          answerLength: answer.length,
          responseTime: 3000 + Math.round(Math.random() * 9000),
          timestamp: questionTimestamp.toISOString(),
        },
      })

      qualityScores[label].push(evaluation.overallScore)
      evaluatedQuestions++
    }

    const overallScore = Math.round(
      questions.reduce((sum, question) => sum + (question.evaluation?.overallScore ?? 0), 0) /
        questions.length
    )

    await SessionModel.create({
      userEmail: TARGET_EMAIL,
      startedAt,
      endedAt,
      config: {
        role: "ml-engineer",
        type: plan.interviewType,
        difficulty: plan.difficulty,
        source: "research",
      },
      questions,
      overallScore,
      evaluationMethod: HYBRID_METHOD,
      createdAt,
    })

    typeCounts[plan.interviewType]++
    difficultyCounts[plan.difficulty]++
    createdSessions++
  }

  console.log("")
  console.log(`Sessions created: ${createdSessions}`)
  console.log(`Questions evaluated: ${evaluatedQuestions}`)
  console.log("")
  console.log("Interview Types")
  console.log(`Technical: ${typeCounts.technical} sessions`)
  console.log(`System Design: ${typeCounts["system design"]} sessions`)
  console.log(`Behavioural: ${typeCounts.behavioural} sessions`)
  console.log(`HR: ${typeCounts.hr} sessions`)
  console.log("")
  console.log("Difficulty")
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    console.log(`${titleCase(difficulty)}: ${difficultyCounts[difficulty]}`)
  }
  console.log("")
  console.log(`Correct mean score: ${mean(qualityScores.correct)}`)
  console.log(`Partial mean score: ${mean(qualityScores.partial)}`)
  console.log(`Incorrect mean score: ${mean(qualityScores.incorrect)}`)

  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error("Fatal error:", error)
  await mongoose.disconnect()
  process.exit(1)
})
