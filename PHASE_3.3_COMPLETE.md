# Phase 3.3 - AI Follow-ups + Evaluation

## ✅ Implementation Complete

### What Was Added

1. **Evaluation Prompt** (`lib/ai/prompts/evaluateAnswer.ts`)
   - Structured JSON output with scoring metrics
   - Evaluates: score, confidence, clarity, technical_depth
   - Provides: strengths, improvements, follow-up recommendations

2. **Follow-up Prompt** (`lib/ai/prompts/followUp.ts`)
   - Generates contextual follow-up questions
   - Based on identified weak areas
   - Sounds like a real interviewer

3. **AI Client** (`lib/ai/client.ts`)
   - OpenRouter integration using Meta Llama 3.2 3B (100% FREE)
   - `evaluateAnswer()` - silent evaluation
   - `generateFollowUp()` - conditional follow-up generation
   - Graceful fallback if AI fails

4. **Response API** (`app/api/interview/respond/route.ts`)
   - Processes user answers
   - Calls evaluation AI
   - Conditionally generates follow-ups
   - Returns structured response

5. **Interview Session Updates** (`app/(app)/interview/session/page.tsx`)
   - Enhanced state with `questionProgress` tracking
   - Stores evaluations per question
   - Enforces max 1 follow-up per question
   - Maintains deterministic flow

### Flow

```
User answers
    ↓
Show thinking indicator
    ↓
Call evaluation AI (silent)
    ↓
IF should_follow_up && !followUpUsed:
    → Ask follow-up
    → Mark followUpUsed = true
ELSE:
    → Move to next main question
    ↓
Hide thinking indicator
```

### Key Constraints Enforced

✅ **Max 1 follow-up per question** - tracked via `followUpUsed` flag  
✅ **Deterministic flow** - AI never controls question order  
✅ **Silent evaluation** - scores stored, not displayed  
✅ **Graceful fallback** - interview continues if AI fails  
✅ **No UI blocking** - thinking indicator shows progress  

### State Structure

```typescript
type InterviewMessage = {
  id: string
  role: "assistant" | "user"
  content: string
  meta?: {
    type?: "question" | "follow-up"
    questionId?: string
  }
}

type QuestionProgress = {
  questionId: string
  followUpUsed: boolean
  evaluation?: EvaluationResult
}

type EvaluationResult = {
  score: number
  confidence: number
  clarity: number
  technical_depth: number
  strengths: string[]
  improvements: string[]
  should_follow_up: boolean
  follow_up_focus: string | null
}
```

### Setup Required

Add to `.env.local`:
```bash
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

Get your FREE API key from: https://openrouter.ai/keys

**Why OpenRouter + Free Models?**
- ✅ Completely FREE (no credits, no billing)
- ✅ Meta Llama 3.2 3B - fast and capable
- ✅ No rate limits on free models
- ✅ Multiple free model options available
- ✅ Simple SDK integration

**Alternative Free Models:**
- `meta-llama/llama-3.2-1b-instruct:free` - Faster, lighter
- `google/gemma-2-9b-it:free` - Larger, more capable
- `microsoft/phi-3-mini-128k-instruct:free` - Good for long context
- `qwen/qwen-2-7b-instruct:free` - Alternative 7B model

### What's NOT Implemented (By Design)

❌ Charts or live scoring display  
❌ Multiple follow-ups per question  
❌ AI deciding interview length  
❌ MongoDB persistence (coming in Phase 4)  
❌ Evaluation display in UI  

### Future Usage

The evaluation data is collected and stored in state. It will be used for:
- Session summaries
- Analytics dashboard
- Skills breakdown
- Learning recommendations
- Progress tracking

### Testing the Feature

1. Start an interview session
2. Answer a question (try a weak/short answer)
3. AI will evaluate silently
4. If evaluation suggests follow-up, AI asks one clarifying question
5. After follow-up answer, interview moves to next main question
6. Max 1 follow-up per question enforced

### Error Handling

- If OpenAI API fails, interview continues with next question
- If evaluation parsing fails, uses fallback scores
- If follow-up generation fails, skips to next question
- No user-facing errors for AI failures

## Exit Criteria Met

✅ AI sometimes asks follow-ups (when evaluation suggests)  
✅ Follow-ups are relevant (based on evaluation focus)  
✅ Never more than one follow-up per question (enforced in code)  
✅ Interview always progresses (fallback logic)  
✅ User never sees raw scores (stored silently)  
✅ No hydration or timing issues (async handling correct)  

**Phase 3.3 Complete** - Ready for Phase 4 (Persistence)
