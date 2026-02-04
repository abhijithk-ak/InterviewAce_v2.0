export function buildEvaluationPrompt({
  question,
  answer,
  role,
  difficulty,
}: {
  question: string
  answer: string
  role: string
  difficulty: string
}) {
  return `
You are a senior technical interviewer.

Evaluate the candidate's answer strictly.

Question:
"${question}"

Candidate Answer:
"${answer}"

Role: ${role}
Difficulty: ${difficulty}

Respond ONLY in valid JSON with this exact schema:

{
  "score": number (0-10),
  "confidence": number (0-10),
  "clarity": number (0-10),
  "technical_depth": number (0-10),
  "strengths": string[],
  "improvements": string[],
  "should_follow_up": boolean,
  "follow_up_focus": string | null
}

Rules:
- Be strict
- No explanations outside JSON
- No markdown
`
}
