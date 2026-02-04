export function buildFollowUpPrompt({
  question,
  answer,
  focus,
}: {
  question: string
  answer: string
  focus: string
}) {
  return `
You are conducting a mock interview.

Original Question:
"${question}"

Candidate Answer:
"${answer}"

Weak Area Identified:
"${focus}"

Ask ONE concise follow-up question to clarify or deepen understanding.

Rules:
- Ask only one question
- No feedback
- No hints
- No multiple questions
- Sound like a real interviewer
`
}
