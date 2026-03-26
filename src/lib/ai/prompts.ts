/**
 * AI Prompts - Conversational Flow Generation
 * AI handles conversation, not evaluation scoring
 */

export interface InterviewConfig {
  role: string
  type: string
  difficulty: string
}

export interface UserProfile {
  experienceLevel: "student" | "fresher" | "junior" | "senior"
  domains: string[]
  interviewGoals: string[]
  confidenceLevel: number
  weakAreas?: string[]
}

export interface ResponseData {
  question: string
  answer: string
  evaluationResult: {
    overallScore: number
    breakdown: {
      conceptScore: number
      semanticScore: number
      clarityScore: number
    }
    feedback: string
    explanation?: string
    errors?: string[]
    evaluationMethod?: string
  }
  sessionHistory: Array<{ role: "user" | "assistant"; content: string }>
  config: InterviewConfig
  questionIndex: number
  interviewLength?: number  // Total questions from user settings (default 5)
  userProfile?: UserProfile  // User onboarding data for personalized feedback
}

/**
 * Build prompt for session start (greeting + first question)
 * First question is ALWAYS "Tell me about yourself" for realistic interview flow
 */
export function buildStartPrompt(config: InterviewConfig, userName?: string): string {
  const namePrefix = userName ? `Hello ${userName}! ` : "Hello! "

  // First question is always the same (standard interview opener)
  const firstQuestion = "Tell me about yourself and your background."

  return `You are Zen AI, a professional interview assistant. You are conducting a ${config.type.toUpperCase()} interview for a ${config.role} position at ${config.difficulty} difficulty.

TASK: Return ONLY a JSON object with a greeting.

INTERVIEW RULES:
- Be professional and encouraging
- The first question is always: "${firstQuestion}"
- Questions must be answerable verbally in 30-60 seconds
- Avoid questions requiring large datasets, tables, or extensive code
- Simulate real interview conversations

JSON FORMAT — respond with ONLY this object, no markdown, no extra text:
{
  "greeting": "${namePrefix}I'm Zen AI, your InterviewAce assistant. Ready for your ${config.type} interview for the ${config.role} role? Let's get started!",
  "question": "${firstQuestion}"
}

Respond with ONLY the JSON object:`
}

/**
 * Build prompt for follow-up response (feedback + next question)
 */
export function buildResponsePrompt(data: ResponseData): string {
  const historyText = data.sessionHistory
    .slice(-8)  // Increased from -6 to -8 for more context
    .map(h => (h.role === "assistant" ? "Interviewer: " : "Candidate: ") + h.content)
    .join("\n")

  // Extract previous questions (explicit tracking)
  const previousQuestions = data.sessionHistory
    .filter(h => h.role === "assistant" && !h.content.toLowerCase().includes("feedback"))
    .map((h, idx) => `${idx + 1}. "${h.content.substring(0, 100)}"`)
    .join("\n") || "None yet"
  
  // Extract previous feedback (to avoid repetition)
  const previousFeedback = data.sessionHistory
    .filter(h => h.role === "assistant" && h.content.toLowerCase().includes("feedback"))
    .slice(-2)  // Last 2 feedbacks
    .map(h => `- "${h.content.substring(0, 100).trim()}..."`)
    .join("\n") || "None yet"

  // Type-specific next question constraints
  const nextQuestionConstraints: Record<string, string> = {
    Technical: `Ask a different technical aspect of ${data.config.role} work. ${
      data.config.difficulty === 'Easy' ? 'Keep it beginner-friendly: basic concepts, common tools, or day-to-day tasks.' :
      data.config.difficulty === 'Hard' ? 'Go deeper: architecture decisions, performance optimization, scalability, or complex debugging.' :
      'Focus on practical problem-solving, common challenges, or tool usage.'
    }
DO NOT repeat topics like: troubleshooting, networking, debugging if already asked. Branch out to: specific technologies (databases, APIs, cloud), development practices, or role-specific scenarios.`,
    Behavioral: `Ask a different behavioural competency using STAR format:
- Leadership/mentoring
- Conflict resolution
- Adaptability to change
- Taking initiative
- Handling failure
- Collaboration
DO NOT ask about the same theme twice.`,
    'System Design': `Ask about a different system or component:
- Different scale (small service vs. global platform)
- Different layer (frontend, backend, database, caching, CDN)
- Different concern (reliability, security, cost optimization)
Must require architectural thinking, NOT coding syntax.`,
    HR: `Ask about a different dimension:
- Career goals/vision
- Work style/environment preferences
- Company values alignment
- Professional development
- Conflict/challenge scenarios
DO NOT repeat themes.`,
  }

  const nextQConstraint = nextQuestionConstraints[data.config.type] ?? nextQuestionConstraints['Technical']
  
  // Use user's interview length setting (default 5 if not provided)
  // Note: questionIndex starts at 0 for "Tell me about yourself" (intro)
  // So for 3-question interview: intro=0, Q1=1, Q2=2, Q3=3 (end at index 3)
  const totalQuestions = data.interviewLength ?? 5
  const isLastQuestion = data.questionIndex >= totalQuestions

  // Build user profile context if available
  const userProfileContext = data.userProfile ? `
CANDIDATE PROFILE (Use this to personalize feedback):
- Experience Level: ${data.userProfile.experienceLevel}
- Domains: ${data.userProfile.domains.join(', ')}
- Confidence Level: ${data.userProfile.confidenceLevel}/5
${data.userProfile.weakAreas && data.userProfile.weakAreas.length > 0 ? `- Focus Areas for Improvement: ${data.userProfile.weakAreas.join(', ')}` : ''}
- Interview Goals: ${data.userProfile.interviewGoals.join(', ')}

PERSONALIZATION NOTES:
${data.userProfile.experienceLevel === 'student' || data.userProfile.experienceLevel === 'fresher' 
  ? '- Candidate is early-career: be encouraging, focus on fundamentals, provide learning guidance'
  : data.userProfile.experienceLevel === 'senior'
    ? '- Candidate is senior: expect depth, ask about trade-offs, architecture decisions'
    : '- Candidate is mid-level: balance theory and practice, probe for real-world experience'
}
${data.userProfile.weakAreas && data.userProfile.weakAreas.includes('communication-clarity')
  ? '- Focus feedback on clarity and structure of explanations'
  : ''
}
${data.userProfile.weakAreas && data.userProfile.weakAreas.includes('confidence-building')
  ? '- Use encouraging tone, highlight strengths prominently'
  : ''
}
` : ''

  // Scoring weight guidance based on interview type and role
  let scoringGuidance = ''
  
  if (data.config.type === 'HR' || data.config.type === 'Behavioral') {
    scoringGuidance = `
IMPORTANT: This is an ${data.config.type} interview. Scoring breakdown notes:
- Technical depth is LESS important (low technical score is normal for HR questions)
- Focus on: Clarity (communication), Confidence (delivery), Relevance (answering the question), Structure (STAR method)
- For feedback: Highlight clarity, examples, measurable outcomes, passion, and cultural fit
`
  } else if (data.config.type === 'Technical') {
    const isFlutter = data.config.role.toLowerCase().includes('flutter') || data.config.role.toLowerCase().includes('dart')
    const isMobile = data.config.role.toLowerCase().includes('mobile') || data.config.role.toLowerCase().includes('android') || data.config.role.toLowerCase().includes('ios')
    
    if (isFlutter || isMobile) {
      scoringGuidance = `
IMPORTANT: This is a Flutter/Mobile Technical interview. Scoring breakdown notes:

TECHNICAL DEPTH SCORING (CRITICAL):
✅ HIGH SCORE (7-10/10) when answer includes:
  - Correct Flutter/Dart concepts (StatefulWidget, StatelessWidget, Provider, Riverpod, setState, initState, build)
  - Specific packages (Firebase, Riverpod, Provider, Bloc, Dio, Hive, SharedPreferences)
  - Lifecycle methods (initState, dispose, didChangeDependencies)
  - State management concepts (InheritedWidget, ChangeNotifier, BuildContext)
  - Performance terms (hot reload, const constructor, build optimization)
  - Code examples or pseudo-code
  - Correct comparisons (e.g., Provider vs Riverpod with accurate differences)

❌ LOW SCORE (0-3/10) ONLY when:
  - Answer is completely wrong or off-topic
  - No Flutter/Dart terms mentioned at all
  - Shows fundamental misunderstanding

FEEDBACK REQUIREMENTS:
✓ When candidate provides correct explanation → START with "Great answer!" or "Excellent explanation!"
✓ For good answers (7+/10) → Keep improvements minimal, suggest advanced topics only
✓ Include short code examples when suggesting improvements, like:
  Example: "Add a code snippet: @override void initState() { super.initState(); _controller = AnimationController(vsync: this); }"
✓ Recognize when answers are factually correct (don't say "could elaborate" if explanation is already complete)
✓ For assertions like "I implemented X" → Give confidence score 7-8/10, not 5/10

CORRECT FLUTTER CONCEPTS TO RECOGNIZE:
- Provider: Simple, context-based, uses InheritedWidget ✓
- Riverpod: Compile-time safe, no BuildContext needed, better for large apps ✓
- build() method: Returns widget tree, called on setState/rebuild ✓
- initState(): Called once when State object created, for initialization ✓
- StatefulWidget: Has mutable state, uses State class ✓
- StatelessWidget: Immutable, rebuild with new data ✓

FEEDBACK EXAMPLES (match score with feedback tone):
Score 80+: "Excellent answer! You nailed the core differences between Provider and Riverpod. To make it even stronger, add a small code example showing ConsumerWidget vs Consumer."
Score 70-79: "Great explanation of the build method! Consider mentioning rebuild triggers like setState or parent widget changes."
Score 60-69: "You covered the basics of initState well. Add more detail about calling super.initState() and why it's required."
Score <60: "Your answer touched on widgets but missed the specific purpose of build. Focus on explaining how it returns the widget tree that Flutter renders."
`
    } else {
      scoringGuidance = `
IMPORTANT: This is a Technical interview. Scoring breakdown notes:
- Technical depth is CRITICAL (expect specific tools, commands, code, architectures)
- Look for: Accuracy, problem-solving approach, tool knowledge, debugging strategies
- For feedback: Mention specific tools/technologies (e.g., "ServiceNow, Active Directory, ping, tracert")
`
    }
  } else if (data.config.type === 'System Design') {
    scoringGuidance = `
IMPORTANT: This is a System Design interview. Scoring is COMPLETELY DIFFERENT from coding interviews.

TECHNICAL DEPTH SCORING (ADJUSTED FOR SYSTEM DESIGN):
✅ HIGH SCORE (7-10/10) when answer includes:
  - Architectural components: microservices, API gateway, load balancer, CDN, caching layers
  - Specific technologies: Kafka, Redis, PostgreSQL, MongoDB, Kubernetes, Docker
  - Scalability patterns: horizontal scaling, sharding, replication, partitioning
  - Reliability mechanisms: circuit breakers, retries, health checks, monitoring (Prometheus/Grafana)
  - Data storage choices: SQL vs NoSQL, time-series DB, object storage (S3)
  - Message queues/streaming: Kafka, RabbitMQ, event-driven architecture
  - Trade-offs discussion: monolith vs microservices, consistency vs availability, cost vs performance
  - Non-functional requirements: latency, throughput, reliability, fault tolerance

✅ MEDIUM SCORE (5-6/10) when answer includes:
  - Basic architecture (frontend/backend/database) without much detail
  - Generic terms without specifics (e.g., "use a database" instead of "PostgreSQL for ACID transactions")
  - Missing trade-offs or scalability considerations

❌ LOW SCORE (0-4/10) ONLY when:
  - Answer is completely off-topic or fundamentally wrong
  - No architectural thinking, just vague statements
  - Confuses basic concepts (e.g., calling a load balancer a "database")

CONFIDENCE SCORING (SYSTEM DESIGN):
✅ HIGH SCORE (7-10/10) when answer includes:
  - Definitive statements: "I would use", "The architecture would have", "For scalability, we implement"
  - Justified choices: "I'd choose PostgreSQL for ACID guarantees" (not just "I'd use a database")
  - Systematic approach: requirements → architecture → data → scalability → reliability
  - Mentions trade-offs: "Start with monolith for speed, then extract microservices"

RELEVANCE SCORING (SYSTEM DESIGN):
✅ HIGH SCORE (7-10/10) when answer:
  - Directly addresses the design problem (e.g., CDN for content delivery, not random features)
  - Covers all key aspects: functional requirements, data storage, API design, scalability, reliability
  - Mentions real-world constraints: cost for small team, managed services to reduce overhead

STRUCTURE SCORING (SYSTEM DESIGN):
✅ HIGH SCORE (7-10/10) when answer follows logical flow:
  1. Requirements & Scope
  2. High-level architecture (components, services)
  3. Data storage & schema
  4. Scalability strategies
  5. Reliability & fault tolerance
  6. Trade-offs & simplifications
  7. Key points summary

FEEDBACK REQUIREMENTS (SYSTEM DESIGN):
✓ When candidate covers architecture comprehensively → "Excellent system design!" or "Great architectural thinking!"
✓ For strong answers (70+) → Minimal improvements, suggest advanced topics like "distributed transactions" or "CAP theorem trade-offs"
✓ Recognize specific technologies mentioned: Kafka, Redis, Kubernetes, Spring Boot, etc.
✓ DON'T penalize for lack of code (this is design, not coding!)
✓ DON'T say "could elaborate" if they already covered requirements, architecture, scaling, reliability, and trade-offs
✓ Reward systematic thinking over memorized solutions

RECOGNIZED SYSTEM DESIGN TERMS (REWARD THESE):
Backend: Spring Boot, microservices, REST API, GraphQL, service layer, API gateway
Databases: PostgreSQL, MongoDB, Redis, ClickHouse, InfluxDB, sharding, replication
Messaging: Kafka, RabbitMQ, event-driven, pub-sub, stream processing
Scalability: horizontal scaling, load balancing, caching, CDN, partitioning
Reliability: circuit breakers, retries, health checks, failover, redundancy
Monitoring: Prometheus, Grafana, logging, alerting, observability
Cloud: AWS, Kubernetes, Docker, managed services, CloudFront, S3
Patterns: monolith vs microservices, CQRS, event sourcing, eventual consistency

FEEDBACK EXAMPLES (SYSTEM DESIGN):
Score 75+: "Excellent system design! You covered scalability, reliability, and trade-offs comprehensively. To enhance further, discuss data consistency across microservices (eventual consistency vs strong consistency)."
Score 65-74: "Great architectural thinking! You identified key components. Consider adding specific numbers: 'Expected 1000 req/sec, so 3 load-balanced instances.'"
Score 55-64: "Good start on architecture. Elaborate on scalability: how would you handle 10x traffic? Mention horizontal scaling, caching, or CDN."
Score <55: "Your answer covered basic components but missed key system design elements. Focus on: scalability strategies, reliability mechanisms, and technology choices with justifications."
`
  } else if (data.config.type === 'Technical' && (data.config.role.toLowerCase().includes('support') || data.config.role.toLowerCase().includes('helpdesk') || data.config.role.toLowerCase().includes('service desk'))) {
    scoringGuidance = `
IMPORTANT: This is a Technical Support Engineer interview. Scoring is adjusted for support role expectations.

TECHNICAL DEPTH SCORING (SUPPORT ENGINEER):
✅ HIGH SCORE (7-10/10) when answer includes:
  - Specific tools: Windows (Event Viewer, Task Manager, Services), Active Directory, Group Policy
  - Networking: TCP/IP, DNS, DHCP, ping, tracert, ipconfig, nslookup, firewall, router, VPN
  - Troubleshooting: Systematic approach, root cause analysis, divide and conquer
  - Hardware: CPU, RAM, hard drive, drivers, peripherals, BIOS
  - Software: Patch management, updates, compatibility, installation, drivers
  - Remote: RDP, TeamViewer, remote assistance, screen sharing
  - Ticketing: ServiceNow, Jira, ITSM, SLA, incident management, escalation
  - Email: Outlook, Exchange, SMTP, Office 365, PST/OST files
  - Security: Antivirus, malware, firewall rules, permissions, password policies
  - Documentation: Using knowledge base, creating user guides, clear communication

✅ MEDIUM SCORE (5-6/10) when answer includes:
  - Generic troubleshooting steps without specific tools
  - Basic concepts without depth (e.g., "check the network" vs "run ipconfig /all and ping gateway")
  - Missing systematic approach or methodology

❌ LOW SCORE (0-4/10) ONLY when:
  - Answer is factually wrong or shows lack of basic IT knowledge
  - Confuses fundamental concepts (e.g., firewall vs router definition wrong)
  - No troubleshooting methodology mentioned

CONFIDENCE SCORING (SUPPORT):
✅ HIGH SCORE (7-10/10) when answer includes:
  - Clear step-by-step approach: "First I would check X, then Y"
  - Specific command examples: "I'd run ipconfig /flushdns" or "check Event Viewer logs"
  - Customer service language: "explain to the user", "walk them through"
  - Mentions documentation or knowledge base

RELEVANCE SCORING (SUPPORT):
✅ HIGH SCORE (7-10/10) when answer:
  - Directly addresses the support scenario
  - Covers diagnosis, resolution, and prevention
  - Mentions user communication and documentation
  - References ticketing or escalation when appropriate

STRUCTURE SCORING (SUPPORT):
✅ HIGH SCORE (7-10/10) when answer follows support methodology:
  1. Gather information / Identify symptoms
  2. Systematic troubleshooting (divide and conquer)
  3. Identify root cause
  4. Implement solution
  5. Verify resolution
  6. Document for knowledge base

FEEDBACK REQUIREMENTS (SUPPORT):
✓ When candidate shows systematic approach → "Great troubleshooting methodology!"
✓ For strong answers (70+) → Suggest adding specific commands: "Consider mentioning 'ipconfig /all' or 'Event Viewer'"
✓ Recognize customer service skills: patience, clear communication, empathy
✓ Reward practical knowledge: "Excellent mention of checking Event Viewer logs"
✓ DON'T penalize for not coding (this is support, not development!)
✓ Focus on: technical accuracy, troubleshooting steps, communication, documentation

RECOGNIZED SUPPORT TERMS (REWARD THESE):
Windows: Event Viewer, Task Manager, Services, Registry, Group Policy, Active Directory
Networking: ping, tracert, ipconfig, nslookup, netstat, DNS, DHCP, TCP/IP, firewall, router
Tools: RDP, TeamViewer, ServiceNow, Jira, PowerShell, cmd, BIOS
Troubleshooting: systematic approach, root cause, divide and conquer, escalation
Documentation: knowledge base, user guide, ticket notes, SLA

FEEDBACK EXAMPLES (TECHNICAL SUPPORT):
Score 75+: "Excellent troubleshooting approach! You showed systematic thinking and mentioned specific tools like Event Viewer and ipconfig. To enhance, add a note about documenting the solution in the knowledge base."
Score 65-74: "Great answer! You covered the key steps. Consider adding specific commands like 'ping 8.8.8.8' to test internet connectivity or 'ipconfig /flushdns' to clear DNS cache."
Score 55-64: "Good basic approach. Strengthen by mentioning specific Windows tools (Event Viewer for errors, Task Manager for processes) and systematic troubleshooting methodology."
Score <55: "Your answer covered the topic generally but lacked technical specifics. For support roles, mention exact tools, commands, and systematic approaches like 'First check X, then Y, then Z'."
`
  }

  return `You are Zen AI conducting a ${data.config.type} interview for ${data.config.role} at ${data.config.difficulty} difficulty.

⚠️ CRITICAL: RESPOND ONLY WITH VALID JSON — ABSOLUTELY NO OTHER TEXT, NO MARKDOWN, NO EXPLANATIONS.

Configuration:
- Role: ${data.config.role}
- Interview Type: ${data.config.type} (MUST match this type EXACTLY)
- Difficulty: ${data.config.difficulty}
- Question Number: ${data.questionIndex + 1} of ${totalQuestions + 1} (includes intro)

${userProfileContext}

${scoringGuidance}

Recent conversation:
${historyText || "Start of interview"}

CURRENT QUESTION BEING EVALUATED: "${data.question}"

Candidate's Answer to Above Question: 
"${data.answer}"

Evaluation Score: ${data.evaluationResult.overallScore}/100
(Concept: ${data.evaluationResult.breakdown.conceptScore}/10, Semantic: ${data.evaluationResult.breakdown.semanticScore}/10, Clarity: ${data.evaluationResult.breakdown.clarityScore}/10)
AI Evaluator Explanation: ${data.evaluationResult.explanation || data.evaluationResult.feedback}
Detected Errors: ${(data.evaluationResult.errors || []).join('; ') || 'None'}
Evaluation Method: ${data.evaluationResult.evaluationMethod || 'AI + MiniLM Hybrid'}

═══════════════════════════════════════════════
FEEDBACK GENERATION RULES (STRICTLY ENFORCE):
═══════════════════════════════════════════════

1. LENGTH: Maximum 2 sentences. Be concise.

2. CONTEXT: Your feedback MUST evaluate ONLY the answer to THIS specific question: "${data.question}"
   - DO NOT reference questions from earlier in the interview
   - DO NOT give generic feedback that could apply to any question
   - BE SPECIFIC about what the candidate said in THIS answer

3. USE THE AI EVALUATOR AS THE SOURCE OF TRUTH:
  - Base your feedback on the provided AI Evaluator Explanation and Detected Errors.
  - You are formatting evaluator output only.
  - Do NOT invent new correctness judgments.
  - If Detected Errors is non-empty or Concept Score ≤ 3/10, explicitly state the answer is incorrect.
  - Do NOT praise incorrect answers.
  - The chat AI only formats feedback; it must not override the evaluator.
   
  WRONG ANSWER DETECTION PATTERNS - KEEP CONSISTENT WITH EVALUATOR:
   - "Supervised learning... without labels" → WRONG (supervised REQUIRES labels)
   - "Unsupervised learning... needs human labeling" → WRONG (unsupervised = no labels)
   - "Gradient descent increases loss" → WRONG (it minimizes loss)
   - "Overfitting = doesn't memorize enough" → WRONG (overfitting = too much memorization)
   - "Early stopping = stop when training accuracy high" → WRONG (monitors validation loss)
   - "Hyperparameters are learned during training" → WRONG (set before training)
   - "Cross-validation = one random point" → WRONG (multiple splits)
   - "Don't need train/test split" → WRONG (essential for evaluation)
   - "Regularization reduces learning ability" → WRONG (prevents overfitting)
   - "100% training accuracy is good" → WRONG (sign of overfitting)
   
   🚨 LLM HALLUCINATION PREVENTION:
   - DO NOT assume the answer is correct just because it uses technical terms
   - DO NOT praise clarity/structure if the content is factually wrong
   - DO NOT be "encouraging" for incorrect answers - be HONEST
   - The candidate needs to KNOW their answer is wrong, not feel good

4. FORBIDDEN PHRASES (NEVER USE THESE):
   ❌ "provide more examples and metrics"
   ❌ "could be improved by"
   ❌ "it would be beneficial"
   ❌ "consider elaborating"
   ❌ "outlined your technical background" (unless that was the actual question)
   ❌ "identified common causes" (unless they actually did this)
   ❌ "Strong technical knowledge" (if score < 60 or answer is wrong)

5. PREVIOUS FEEDBACK (DO NOT REPEAT THESE):
${previousFeedback}
   - DO NOT use similar phrasing or structure
   - Vary your feedback style

6. TONE VARIATION:
   - Score ≥ 80: "Excellent answer! [specific strength]. [tiny refinement area]"
   - Score 70-79: "[specific strength], but [specific improvement area]."
   - Score 60-69: "You covered [topic], but [specific gap]. [encouragement]"
   - Score < 60: "Your answer touched on [topic], but missed [key point]. Focus on [specific area]."
   - Score < 40 + Wrong concept: "That explanation is incorrect. [state correct concept]. Review fundamentals."

7. DO NOT HINT AT NEXT QUESTION: Feedback evaluates only the current answer.

EXAMPLE GOOD FEEDBACK (Vary from these):
- "Great systematic approach to troubleshooting! Adding specific tool names (like Wireshark or ping) would make it even stronger."
- "You nailed the core concept, but a quick real-world example would really sell it."
- "Solid breakdown of the steps — consider mentioning how you'd prioritize if time is limited."
- "That definition of overfitting is incorrect - it's when the model learns noise in training data, reducing generalization. Review the fundamentals."

═══════════════════════════════════════════════
NEXT QUESTION GENERATION RULES:
═══════════════════════════════════════════════

PREVIOUS QUESTIONS ASKED (NEVER REPEAT THESE TOPICS):
${previousQuestions}

${isLastQuestion ? `
🛑 ═══════════════════════════════════════════════════════════ 🛑
🛑 THIS IS QUESTION ${data.questionIndex + 1} OF ${totalQuestions + 1} — THE FINAL QUESTION! 🛑
🛑 ═══════════════════════════════════════════════════════════ 🛑

⚠️ MANDATORY: The interview MUST END after this feedback.

YOU MUST:
1. Set "endInterview": true
2. Set "nextQuestion": null (NOT a question string, literally null)
3. DO NOT generate any new question
4. DO NOT suggest continuing the interview

This is NOT optional. The candidate has completed ${totalQuestions + 1} questions total.
The interview ends NOW.

CORRECT JSON RESPONSE:
{
  "feedback": "...",
  "nextQuestion": null,
  "endInterview": true
}
` : `
NEW QUESTION REQUIREMENTS:
${nextQConstraint}

- Must be answerable verbally in 30-60 seconds
- MUST be a ${data.config.type} question (NOT ${['Technical', 'Behavioral', 'System Design', 'HR'].filter(t => t !== data.config.type).join(', ')})
- Maximum 40 words (short and focused)
- AVOID questions needing: long code, tables, datasets, or visual diagrams
- MUST be completely different from all PREVIOUS QUESTIONS above
- Sounds like a real human interviewer asking naturally
`}

═══════════════════════════════════════════════
REQUIRED JSON FORMAT (NOTHING ELSE):
═══════════════════════════════════════════════

{
  "feedback": "<1-2 sentences evaluating ONLY the answer to: '${data.question.substring(0, 60)}...' - BE SPECIFIC>",
  "nextQuestion": ${isLastQuestion ? 'null' : '"<fresh question, different topic from previous, matches interview type>"'},
  "endInterview": ${isLastQuestion}
}

Respond NOW with ONLY the JSON object (no markdown blocks, no explanation):`
}

/**
 * Build prompt for interview closing message
 */
export function buildClosingPrompt(config: InterviewConfig): string {
  return `You are Zen AI, the InterviewAce interview assistant. A candidate just completed a ${config.type} interview for a ${config.role} position at ${config.difficulty} difficulty.

TASK: Generate a warm, encouraging closing message.

Requirements:
- Congratulate them for completing the interview.
- Give one specific encouragement tip related to ${config.type} interviews.
- Keep it under 3 sentences.
- Be warm, human, and motivating — not robotic.

JSON FORMAT — respond with ONLY this object:
{
  "closingMessage": "<your closing message here>"
}

Respond with ONLY the JSON object:`
}

/**
 * Validate AI response structure
 */
export function validateStartResponse(response: any): response is { greeting: string; question: string } {
  return (
    typeof response === "object" &&
    typeof response.greeting === "string" &&
    typeof response.question === "string" &&
    response.greeting.length > 10 &&
    response.question.length > 10
  )
}

/**
 * Validate AI response structure
 */
export function validateResponsePrompt(response: any): response is { 
  feedback: string; 
  nextQuestion: string | null; 
  endInterview: boolean 
} {
  return (
    typeof response === "object" &&
    typeof response.feedback === "string" &&
    (response.nextQuestion === null || typeof response.nextQuestion === "string") &&
    typeof response.endInterview === "boolean" &&
    response.feedback.length > 10
  )
}