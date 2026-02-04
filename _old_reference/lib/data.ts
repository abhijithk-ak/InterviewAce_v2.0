

export type Session = {
  id: string
  type: string
  role: string
  difficulty: string
  date: string
  duration: number
  score: number
  status: "completed" | "in-progress" | "paused"
  feedback: string
  transcript: TranscriptItem[]
  scores: {
    technical: number
    communication: number
    confidence: number
    relevance: number
  }
}

export type TranscriptItem = {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: number
  feedback?: {
    score: number
    strengths: string[]
    improvements: string[]
  }
}

export type Question = {
  id: string
  text: string
  category: "Technical" | "Behavioral" | "HR" | "System Design" | "Problem-Solving"
  role: string
  difficulty: "Easy" | "Medium" | "Hard"
  expectedDuration: number
  followUps: string[]
  evaluationCriteria: string[]
}

export const QUESTION_BANK: Question[] = [
  // Technical - Frontend
  {
    id: "t1",
    text: "Explain the React component lifecycle and how hooks have changed the way we think about it.",
    category: "Technical",
    role: "Frontend",
    difficulty: "Medium",
    expectedDuration: 5,
    followUps: ["How does useEffect cleanup work?", "When would you use useLayoutEffect?"],
    evaluationCriteria: ["Understanding of mounting/unmounting", "Knowledge of hooks", "Practical examples"],
  },
  {
    id: "t2",
    text: "How would you optimize a React application that's experiencing slow renders?",
    category: "Technical",
    role: "Frontend",
    difficulty: "Hard",
    expectedDuration: 8,
    followUps: ["How would you identify the bottleneck?", "When would you use React.memo vs useMemo?"],
    evaluationCriteria: ["Profiling knowledge", "Memoization strategies", "Virtual DOM understanding"],
  },
  {
    id: "t3",
    text: "Explain the difference between CSS Grid and Flexbox. When would you use each?",
    category: "Technical",
    role: "Frontend",
    difficulty: "Easy",
    expectedDuration: 3,
    followUps: ["Can you combine them?", "How do you handle browser compatibility?"],
    evaluationCriteria: ["Layout understanding", "Use case awareness", "Practical examples"],
  },
  // Technical - Backend
  {
    id: "t4",
    text: "Describe how you would design a RESTful API for a social media platform.",
    category: "Technical",
    role: "Backend",
    difficulty: "Medium",
    expectedDuration: 7,
    followUps: ["How would you handle pagination?", "What about rate limiting?"],
    evaluationCriteria: ["REST principles", "Resource modeling", "Security considerations"],
  },
  {
    id: "t5",
    text: "What strategies would you use to scale a database that's becoming a bottleneck?",
    category: "Technical",
    role: "Backend",
    difficulty: "Hard",
    expectedDuration: 10,
    followUps: ["When would you choose sharding vs replication?", "How do you handle migrations?"],
    evaluationCriteria: ["Scaling strategies", "Trade-off analysis", "Real-world experience"],
  },
  // System Design
  {
    id: "sd1",
    text: "Design a URL shortening service like bit.ly.",
    category: "System Design",
    role: "System Design",
    difficulty: "Medium",
    expectedDuration: 15,
    followUps: ["How would you handle analytics?", "What about custom URLs?"],
    evaluationCriteria: ["Scalability", "Data modeling", "API design", "Caching strategy"],
  },
  {
    id: "sd2",
    text: "Design a real-time chat application that supports group conversations.",
    category: "System Design",
    role: "System Design",
    difficulty: "Hard",
    expectedDuration: 20,
    followUps: ["How would you handle message ordering?", "What about offline support?"],
    evaluationCriteria: ["WebSocket understanding", "Message queuing", "Presence system", "Scalability"],
  },
  // Behavioral
  {
    id: "b1",
    text: "Tell me about a time when you had to work with a difficult team member.",
    category: "Behavioral",
    role: "All",
    difficulty: "Medium",
    expectedDuration: 5,
    followUps: ["What did you learn from that experience?", "Would you do anything differently?"],
    evaluationCriteria: ["STAR format", "Conflict resolution", "Self-awareness", "Outcome focus"],
  },
  {
    id: "b2",
    text: "Describe a project where you had to learn a new technology quickly.",
    category: "Behavioral",
    role: "All",
    difficulty: "Easy",
    expectedDuration: 4,
    followUps: ["How did you approach the learning?", "What resources did you use?"],
    evaluationCriteria: ["Learning ability", "Problem-solving", "Resourcefulness"],
  },
  {
    id: "b3",
    text: "Tell me about a time when you disagreed with a technical decision.",
    category: "Behavioral",
    role: "All",
    difficulty: "Medium",
    expectedDuration: 5,
    followUps: ["How did you communicate your concerns?", "What was the outcome?"],
    evaluationCriteria: ["Communication skills", "Technical reasoning", "Professionalism"],
  },
  // HR
  {
    id: "hr1",
    text: "Why are you interested in this role and our company?",
    category: "HR",
    role: "All",
    difficulty: "Easy",
    expectedDuration: 3,
    followUps: ["What do you know about our products?", "Where do you see yourself in 5 years?"],
    evaluationCriteria: ["Research quality", "Genuine interest", "Career alignment"],
  },
  {
    id: "hr2",
    text: "What are your salary expectations for this role?",
    category: "HR",
    role: "All",
    difficulty: "Medium",
    expectedDuration: 3,
    followUps: ["Is that negotiable?", "What other factors are important to you?"],
    evaluationCriteria: ["Market awareness", "Confidence", "Flexibility"],
  },
  // Problem-Solving
  {
    id: "ps1",
    text: "Walk me through how you would debug a production issue where the application is running slowly.",
    category: "Problem-Solving",
    role: "Full Stack",
    difficulty: "Medium",
    expectedDuration: 6,
    followUps: ["What tools would you use?", "How do you prioritize what to check first?"],
    evaluationCriteria: ["Systematic approach", "Tool knowledge", "Communication"],
  },
]

export const RECENT_SESSIONS: Session[] = [
  {
    id: "1",
    type: "System Design",
    role: "Senior Engineer",
    difficulty: "Hard",
    date: "2 hrs ago",
    duration: 35,
    score: 92,
    status: "completed",
    feedback: "Excellent grasp of distributed caching.",
    transcript: [],
    scores: { technical: 94, communication: 90, confidence: 88, relevance: 96 },
  },
  {
    id: "2",
    type: "Behavioral",
    role: "Frontend",
    difficulty: "Medium",
    date: "Yesterday",
    duration: 25,
    score: 85,
    status: "completed",
    feedback: "Good examples, but work on STAR structure.",
    transcript: [],
    scores: { technical: 80, communication: 88, confidence: 82, relevance: 90 },
  },
  {
    id: "3",
    type: "Technical",
    role: "Frontend",
    difficulty: "Medium",
    date: "2 days ago",
    duration: 30,
    score: 78,
    status: "completed",
    feedback: "Missed key concepts on useEffect dependencies.",
    transcript: [],
    scores: { technical: 72, communication: 85, confidence: 78, relevance: 77 },
  },
]

export const LEARNING_RESOURCES = [
  {
    id: 1,
    title: "React Reconciliation",
    type: "Article",
    duration: "10 min",
    category: "Technical",
    reason: "Based on your last session",
    url: "https://react.dev/learn/preserving-and-resetting-state",
    platform: "Official Docs",
  },
  {
    id: 2,
    title: "System Design - Load Balancing",
    type: "Article",
    duration: "15 min",
    category: "System Design",
    reason: "Recommended for Senior role",
    url: "https://www.geeksforgeeks.org/load-balancing-system-design-interview-questions/",
    platform: "GeeksforGeeks",
  },
  {
    id: 3,
    title: "Java Multithreading",
    type: "Article",
    duration: "12 min",
    category: "Backend",
    reason: "Improve technical depth",
    url: "https://www.javatpoint.com/multithreading-in-java",
    platform: "Javatpoint",
  },
  {
    id: 4,
    title: "Database Indexing",
    type: "Article",
    duration: "8 min",
    category: "Backend",
    reason: "Enhance system design knowledge",
    url: "https://www.geeksforgeeks.org/indexing-in-databases-set-1/",
    platform: "GeeksforGeeks",
  },
  {
    id: 5,
    title: "Advanced TypeScript Patterns",
    type: "Video",
    duration: "20 min",
    category: "Technical",
    reason: "Level up your TypeScript skills",
    url: "https://www.youtube.com/watch?v=dZQtyCzwSBw",
    platform: "YouTube",
  },
  {
    id: 6,
    title: "Conflict Resolution",
    type: "Guide",
    duration: "8 min",
    category: "Behavioral",
    reason: "Leadership skill development",
    url: "https://www.atlassian.com/team-playbook/plays/conflict-resolution",
    platform: "Atlassian",
  },
]

export const SKILL_GAPS = [
  { skill: "React Performance", current: 72, target: 85, priority: "high" },
  { skill: "System Design", current: 78, target: 90, priority: "high" },
  { skill: "STAR Method", current: 65, target: 80, priority: "medium" },
  { skill: "Database Design", current: 70, target: 85, priority: "medium" },
  { skill: "Communication", current: 82, target: 90, priority: "low" },
]

export const VIEW_TRANSITION = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as any },
}

export type Note = {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

export type InterviewConfig = {
  role: string
  type: string
  difficulty: string
  focusArea: string
  questionCount?: number
  company?: string
  jobDescription?: string
  questions?: Question[]
}

export type Preferences = {
  autoSaveNotes: boolean
  soundEffects: boolean
  sessionRecordings: boolean
}

export type AISettings = {
  apiKey: string // Deprecated but kept for compatibility or advanced users
  model: string
  preferences: Preferences
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  apiKey: "",
  model: "meta-llama/llama-3.3-70b-instruct:free",
  preferences: {
    autoSaveNotes: true,
    soundEffects: false,
    sessionRecordings: true,
  },
}

export const OPENROUTER_MODELS = [
  // Free Models
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)", provider: "Google" },
  { id: "meta-llama/llama-3.2-3b-instruct:free", name: "Llama 3.2 3B (Free)", provider: "Meta" },
  // OpenAI Models
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI" },
  // Anthropic Models
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  // Google Models
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", provider: "Google" },
  { id: "google/gemini-flash-1.5", name: "Gemini Flash 1.5", provider: "Google" },
  // Meta Models
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", provider: "Meta" },
  { id: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B", provider: "Meta" },
  // Mistral Models
  { id: "mistralai/mistral-large", name: "Mistral Large", provider: "Mistral" },
  { id: "mistralai/mixtral-8x7b-instruct", name: "Mixtral 8x7B", provider: "Mistral" },
  // DeepSeek
  { id: "deepseek/deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek" },
]
