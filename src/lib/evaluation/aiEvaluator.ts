import { callAI } from "../ai/client"

export type AIEvaluationResult = {
  conceptScore: number
  clarityScore: number
  errors: string[]
  explanation: string
  modelUsed?: string
}

export type AIEvaluatorOptions = {
  model?: string
  temperature?: number
}

export async function evaluateWithAI(
  question: string,
  referenceAnswer: string,
  candidateAnswer: string,
  options: AIEvaluatorOptions = {}
): Promise<AIEvaluationResult> {
  const basePrompt = [
    "You are a strict technical interviewer evaluating a candidate answer.",
    "Grade reasoning, not terminology density.",
    "Return JSON only.",
    "",
    "Question:",
    question,
    "",
    "Reference Answer:",
    referenceAnswer || "No reference answer provided.",
    "",
    "Candidate Answer:",
    candidateAnswer,
    "",
    "Return JSON only in this shape:",
    JSON.stringify(
      {
        conceptScore: 0,
        clarityScore: 0,
        errors: [""],
        explanation: "",
      },
      null,
      2
    ),
    "",
    "Rules:",
    "- conceptScore and clarityScore must be numbers from 0 to 10.",
    "- Evaluate conceptual correctness of the candidate answer.",
    "- Use the reference answer as guidance, not as an exhaustive checklist.",
    "- Do NOT penalize additional relevant information that is not present in the reference answer.",
    "- Only include items in errors when factual statements are incorrect, concepts are misunderstood, or reasoning contradicts known facts.",
    "- If the answer is correct but incomplete, conceptScore should be between 5 and 7.",
    "- If the answer is correct and well explained, conceptScore should be between 7 and 9.",
    "- If the answer is incorrect or contradicts core concepts, conceptScore must be 3 or lower.",
    "- Clarity score reflects structure and readability only, not correctness.",
    "- Explanations must be concise, factual, and interview-style.",
    "- Do not invent additional errors.",
    "",
    "Concept scoring rubric:",
    "- 0-3: Incorrect explanation, major misunderstanding, or contradiction of core facts.",
    "- 5-7: Conceptually correct but incomplete explanation.",
    "- 7-9: Conceptually correct and well explained.",
    "- 10: Reserved for exceptional depth, precision, and completeness.",
    "",
    "Contradiction rule:",
    "- If the candidate includes both correct and incorrect statements about the same concept, conceptScore must not exceed 4.",
    "- If the candidate contains factual errors, conceptScore must be 3 or lower when the overall explanation is fundamentally wrong.",
    "- If the candidate directly contradicts the reference answer, conceptScore must be 3 or lower when that contradiction makes the explanation fundamentally wrong.",
    "",
    "Strict grading instruction:",
    "- Do not reward answers that contain incorrect claims even if some terminology is correct.",
    "- A concise but correct technical answer can still score 7-8 on conceptScore.",
    "- Additional relevant correct context should not reduce conceptScore.",
    "",
    "Explanation format:",
    "- Sentence 1: state whether the answer is correct, partially correct, or incorrect.",
    "- Sentence 2: briefly explain the correct concept in plain interview language.",
    "- Sentence 3 only if needed: briefly explain the candidate's mistake.",
    "- Keep explanations to 1-3 sentences.",
    "- Avoid unnecessary mathematical phrasing.",
    "",
    "Examples:",
    "- Correct: 'gradient descent minimizes the loss function by updating model weights opposite to the gradient' -> conceptScore 7-9.",
    "- If an answer says both 'gradient descent updates weights' and 'gradient descent increases loss', this is a contradiction and should score 3-4.",
    "- A partially correct answer with one correct statement and one incorrect statement about the same concept belongs in 3-4, not 6-8.",
    "- Some correct wording does not cancel out incorrect reasoning.",
    "- Correct explanation example: 'The explanation is mostly correct. Gradient descent minimizes the loss function by updating model weights in the direction opposite to the gradient.'",
    "- Partial explanation example: 'The answer shows partial understanding. Gradient descent does update model weights, but it always moves in a direction that reduces the loss function.'",
    "- Incorrect explanation example: 'The explanation is incorrect. Gradient descent minimizes the loss function, but the answer claims it increases the loss.'",
  ].join("\n")

  try {
    return await evaluateOnce(basePrompt, referenceAnswer, candidateAnswer, options)
  } catch (error) {
    if (!(error instanceof EvaluatorParseError)) {
      throw error
    }

    const retryPrompt = `${basePrompt}\n\nIMPORTANT: Output MUST be valid JSON and include all required keys with numeric scores.`

    try {
      return await evaluateOnce(retryPrompt, referenceAnswer, candidateAnswer, options)
    } catch (retryError) {
      if (!(retryError instanceof EvaluatorParseError)) {
        throw retryError
      }

      return buildFallbackEvaluation(referenceAnswer, candidateAnswer, options.model)
    }
  }
}

class EvaluatorParseError extends Error {}

async function evaluateOnce(
  prompt: string,
  referenceAnswer: string,
  candidateAnswer: string,
  options: AIEvaluatorOptions
): Promise<AIEvaluationResult> {
  const response = await callAI(prompt, {
    model: options.model,
    temperature: options.temperature ?? 0.1,
    maxTokens: 500,
    systemPrompt: "You are a strict evaluator. Return only valid JSON.",
  })

  if (!response || typeof response !== "object") {
    throw new EvaluatorParseError("AI evaluator returned no JSON payload")
  }

  const parsed = parseAndValidateResponse(response)

  const conceptGuard = applyConceptGuards(
    candidateAnswer,
    referenceAnswer,
    parsed.conceptScore
  )

  return {
    conceptScore: conceptGuard.score,
    clarityScore: applyClarityGuards(candidateAnswer, parsed.clarityScore),
    errors: parsed.errors,
    explanation: normalizeExplanation(
      parsed.explanation,
      conceptGuard.score,
      referenceAnswer,
      parsed.errors
    ),
    modelUsed: options.model,
  }
}

function clampScore(value: unknown, fallback = 0): number {
  const numericValue = typeof value === "number" ? value : Number(value)

  if (!Number.isFinite(numericValue)) {
    return fallback
  }

  return Math.round(Math.max(0, Math.min(10, numericValue)) * 10) / 10
}

function parseAndValidateResponse(response: Record<string, unknown>): {
  conceptScore: number
  clarityScore: number
  errors: string[]
  explanation: string
} {
  if (response.conceptScore === undefined || response.explanation === undefined) {
    throw new EvaluatorParseError("AI evaluator response is missing required fields")
  }

  const conceptScore = clampScore(response.conceptScore, Number.NaN)
  if (!Number.isFinite(conceptScore)) {
    throw new EvaluatorParseError("AI evaluator response has invalid conceptScore")
  }

  const explanation =
    typeof response.explanation === "string" ? response.explanation.trim() : ""
  if (!explanation) {
    throw new EvaluatorParseError("AI evaluator response has empty explanation")
  }

  const clarityScore = clampScore(response.clarityScore, 5)
  const errors = Array.isArray(response.errors)
    ? response.errors.map((value: unknown) => String(value).trim()).filter(Boolean)
    : []

  return {
    conceptScore,
    clarityScore,
    errors,
    explanation,
  }
}

function buildFallbackEvaluation(
  referenceAnswer: string,
  candidateAnswer: string,
  modelUsed?: string
): AIEvaluationResult {
  const words = candidateAnswer.trim().split(/\s+/).filter(Boolean).length
  const conceptScore = words >= 6 ? 5 : 3

  return {
    conceptScore,
    clarityScore: applyClarityGuards(candidateAnswer, 5),
    errors: [],
    explanation: normalizeExplanation("", conceptScore, referenceAnswer, []),
    modelUsed,
  }
}

function applyConceptGuards(
  candidateAnswer: string,
  referenceAnswer: string,
  conceptScore: number
): { score: number; contradictionDetected: boolean; clearlyCorrectCore: boolean } {
  const candidate = candidateAnswer.toLowerCase()
  const reference = referenceAnswer.toLowerCase()
  const wordCount = candidateAnswer.trim().split(/\s+/).filter(Boolean).length

  const mentionsWeightUpdates = /update(?:s|d|ing)?\s+(?:model\s+)?weights?/.test(candidate)
  const saysMinimizesLoss = /(minimi[sz]e|reduc|decreas|lower)\w*\s+(?:the\s+)?(loss|error)/.test(candidate)
  const saysIncreasesLoss = /(increas|maximi[sz]|rais)\w*\s+(?:the\s+)?(loss|error)/.test(candidate)
  const saysOppositeGradient = /(opposite|negative)\s+(?:to|of)?\s*(?:the\s+)?gradient/.test(candidate)
  const saysSameDirectionGradient = /(same|along|with)\s+(?:the\s+)?gradient/.test(candidate)
  const saysPreventsOverfitting = /(prevent|reduce|avoid)\w*\s+overfitting/.test(candidate)
  const saysCausesOverfitting = /(cause|creates?|increase)\w*\s+overfitting/.test(candidate)
  const saysUsesLabels = /(uses?|with|requires?)\s+(?:labeled|labelled)\s+data/.test(candidate)
  const saysNoLabels = /(without|doesn'?t\s+need|no)\s+(?:labeled|labelled|labels?)\s+data/.test(candidate)

  const referenceMinimizesLoss = /(minimi[sz]e|reduc|decreas|lower)\w*\s+(?:the\s+)?(loss|error)/.test(reference)
  const referenceOppositeGradient = /(opposite|negative)\s+(?:to|of)?\s*(?:the\s+)?gradient/.test(reference)
  const referenceRegularization = /regularization/.test(reference)
  const referenceSupervised = /supervised learning/.test(reference)

  const contradictionDetected =
    (mentionsWeightUpdates && saysIncreasesLoss) ||
    (saysMinimizesLoss && saysIncreasesLoss) ||
    (referenceOppositeGradient && saysOppositeGradient && saysSameDirectionGradient) ||
    (referenceRegularization && saysPreventsOverfitting && saysCausesOverfitting) ||
    (referenceSupervised && saysUsesLabels && saysNoLabels)

  const clearlyCorrectCore =
    (referenceMinimizesLoss && saysMinimizesLoss) ||
    (referenceOppositeGradient && saysOppositeGradient) ||
    (referenceRegularization && saysPreventsOverfitting) ||
    (referenceSupervised && saysUsesLabels)

  if (contradictionDetected) {
    return {
      score: Math.min(conceptScore, clearlyCorrectCore ? 3 : 2),
      contradictionDetected,
      clearlyCorrectCore,
    }
  }

  if (clearlyCorrectCore) {
    return {
      score: Math.max(conceptScore, wordCount >= 18 ? 8 : 7),
      contradictionDetected,
      clearlyCorrectCore,
    }
  }

  return {
    score: conceptScore,
    contradictionDetected,
    clearlyCorrectCore,
  }
}

function applyClarityGuards(candidateAnswer: string, clarityScore: number): number {
  const words = candidateAnswer.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const sentences = candidateAnswer
    .split(/[.!?]+/)
    .map((value) => value.trim())
    .filter(Boolean)

  if (wordCount < 4) {
    return Math.min(clarityScore, 3)
  }

  if (wordCount < 8) {
    return Math.min(clarityScore, 5)
  }

  if (sentences.length <= 1 && wordCount < 14) {
    return Math.min(clarityScore, 6)
  }

  if (clarityScore >= 6) {
    return clarityScore
  }

  if (wordCount >= 8 && sentences.length <= 3) {
    return Math.max(clarityScore, wordCount >= 16 ? 9 : 8)
  }

  if (wordCount >= 5) {
    return Math.max(clarityScore, 6)
  }

  return clarityScore
}

function normalizeExplanation(
  rawExplanation: string,
  conceptScore: number,
  referenceAnswer: string,
  errors: string[]
): string {
  const conceptSentence = firstSentence(referenceAnswer) || "The reference answer explains the correct concept clearly."
  const errorSentence = summarizeError(errors[0])

  if (conceptScore >= 7) {
    return `The explanation is mostly correct. ${conceptSentence}`
  }

  if (conceptScore >= 3) {
    return errorSentence
      ? `The answer shows partial understanding. ${conceptSentence} ${errorSentence}`
      : `The answer shows partial understanding. ${conceptSentence}`
  }

  if (errorSentence) {
    return `The explanation is incorrect. ${conceptSentence} ${errorSentence}`
  }

  if (rawExplanation) {
    return clampExplanationSentences(rawExplanation)
  }

  return `The explanation is incorrect. ${conceptSentence}`
}

function firstSentence(text: string): string {
  const sentence = text
    .split(/(?<=[.!?])\s+/)
    .map((value) => value.trim())
    .find(Boolean)

  return sentence ? clampExplanationSentences(sentence) : ""
}

function summarizeError(error: string | undefined): string {
  if (!error) {
    return ""
  }

  const trimmed = error.trim().replace(/^[-•\s]+/, "")
  const lower = trimmed.toLowerCase()

  if (lower.includes("increase") && (lower.includes("loss") || lower.includes("error"))) {
    return "The answer incorrectly says it increases the loss."
  }

  if (lower.includes("contradict")) {
    return "The answer contains a contradiction about how the concept works."
  }

  if (lower.includes("incorrect")) {
    return clampExplanationSentences(trimmed)
  }

  return `The answer's mistake is: ${trimmed.replace(/[.]+$/, "")}.`
}

function clampExplanationSentences(text: string): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 3)

  return sentences.join(" ")
}