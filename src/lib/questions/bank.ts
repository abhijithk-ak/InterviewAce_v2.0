type Question = {
  id: string
  category: "technical" | "behavioral" | "hr" | "system-design"
  role: "frontend" | "backend" | "fullstack" | "general"
  difficulty: "easy" | "medium" | "hard"
  text: string
}

const QUESTION_BANK: Question[] = [
  // Frontend - Easy
  {
    id: "fe-easy-1",
    category: "technical",
    role: "frontend",
    difficulty: "easy",
    text: "Can you explain the difference between var, let, and const in JavaScript?",
  },
  {
    id: "fe-easy-2",
    category: "technical",
    role: "frontend",
    difficulty: "easy",
    text: "What is the virtual DOM and how does it work in React?",
  },
  {
    id: "fe-easy-3",
    category: "technical",
    role: "frontend",
    difficulty: "easy",
    text: "How would you optimize the performance of a slow-loading web page?",
  },
  
  // Frontend - Medium
  {
    id: "fe-medium-1",
    category: "technical",
    role: "frontend",
    difficulty: "medium",
    text: "Explain the concept of closures in JavaScript. Can you provide a practical use case?",
  },
  {
    id: "fe-medium-2",
    category: "technical",
    role: "frontend",
    difficulty: "medium",
    text: "How do you handle state management in a large React application? What libraries or patterns do you use?",
  },
  {
    id: "fe-medium-3",
    category: "technical",
    role: "frontend",
    difficulty: "medium",
    text: "What are Web Workers and when would you use them? Can you describe a scenario?",
  },
  
  // Frontend - Hard
  {
    id: "fe-hard-1",
    category: "technical",
    role: "frontend",
    difficulty: "hard",
    text: "Explain how the JavaScript event loop works. How does it handle async operations, promises, and microtasks?",
  },
  {
    id: "fe-hard-2",
    category: "technical",
    role: "frontend",
    difficulty: "hard",
    text: "Design a solution for implementing infinite scroll with virtualization for a list of 100,000 items.",
  },
  
  // Backend - Easy
  {
    id: "be-easy-1",
    category: "technical",
    role: "backend",
    difficulty: "easy",
    text: "What is the difference between SQL and NoSQL databases? When would you use each?",
  },
  {
    id: "be-easy-2",
    category: "technical",
    role: "backend",
    difficulty: "easy",
    text: "Explain what RESTful APIs are. What are the main HTTP methods and their purposes?",
  },
  {
    id: "be-easy-3",
    category: "technical",
    role: "backend",
    difficulty: "easy",
    text: "How do you handle authentication and authorization in your applications?",
  },
  
  // Backend - Medium
  {
    id: "be-medium-1",
    category: "technical",
    role: "backend",
    difficulty: "medium",
    text: "Explain database indexing. How does it improve performance and what are the trade-offs?",
  },
  {
    id: "be-medium-2",
    category: "technical",
    role: "backend",
    difficulty: "medium",
    text: "How would you design a rate limiting system for an API?",
  },
  {
    id: "be-medium-3",
    category: "technical",
    role: "backend",
    difficulty: "medium",
    text: "What strategies do you use for error handling and logging in production systems?",
  },
  
  // Backend - Hard
  {
    id: "be-hard-1",
    category: "technical",
    role: "backend",
    difficulty: "hard",
    text: "Design a distributed caching system that handles cache invalidation across multiple servers.",
  },
  {
    id: "be-hard-2",
    category: "technical",
    role: "backend",
    difficulty: "hard",
    text: "Explain database transactions and ACID properties. How would you handle a distributed transaction?",
  },
  
  // Full Stack - Easy
  {
    id: "fs-easy-1",
    category: "technical",
    role: "fullstack",
    difficulty: "easy",
    text: "Walk me through how a web request travels from the browser to the server and back.",
  },
  {
    id: "fs-easy-2",
    category: "technical",
    role: "fullstack",
    difficulty: "easy",
    text: "What is CORS and why is it important? How do you handle it in your applications?",
  },
  {
    id: "fs-easy-3",
    category: "technical",
    role: "fullstack",
    difficulty: "easy",
    text: "Explain the difference between server-side rendering and client-side rendering.",
  },
  
  // Full Stack - Medium
  {
    id: "fs-medium-1",
    category: "technical",
    role: "fullstack",
    difficulty: "medium",
    text: "How would you implement real-time features in a web application (like live chat or notifications)?",
  },
  {
    id: "fs-medium-2",
    category: "technical",
    role: "fullstack",
    difficulty: "medium",
    text: "Describe how you would architect a file upload system that handles large files efficiently.",
  },
  {
    id: "fs-medium-3",
    category: "technical",
    role: "fullstack",
    difficulty: "medium",
    text: "What security measures do you implement to protect against common web vulnerabilities?",
  },
  
  // Full Stack - Hard
  {
    id: "fs-hard-1",
    category: "technical",
    role: "fullstack",
    difficulty: "hard",
    text: "Design a system to handle 1 million concurrent users. What technologies and architecture would you use?",
  },
  {
    id: "fs-hard-2",
    category: "technical",
    role: "fullstack",
    difficulty: "hard",
    text: "Explain how you would implement end-to-end encryption for a messaging application.",
  },
  
  // Behavioral - General
  {
    id: "beh-1",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Tell me about a time when you had to deal with a difficult team member. How did you handle it?",
  },
  {
    id: "beh-2",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Describe a challenging technical problem you solved. What was your approach?",
  },
  {
    id: "beh-3",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Tell me about a time when you had to learn a new technology quickly. How did you approach it?",
  },
  {
    id: "beh-4",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Describe a situation where you had to make a trade-off between perfect code and meeting a deadline.",
  },
  {
    id: "beh-5",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "Tell me about a project you're most proud of. What was your role and what made it successful?",
  },
  {
    id: "beh-6",
    category: "behavioral",
    role: "general",
    difficulty: "medium",
    text: "How do you handle code reviews? Can you describe a time when you received critical feedback?",
  },
  
  // System Design
  {
    id: "sys-1",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "Design a URL shortening service like bit.ly. Consider scalability and analytics.",
  },
  {
    id: "sys-2",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "How would you design a notification system that delivers notifications via email, SMS, and push?",
  },
  {
    id: "sys-3",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "Design a social media feed system. How would you rank and personalize content for users?",
  },
  {
    id: "sys-4",
    category: "system-design",
    role: "general",
    difficulty: "hard",
    text: "Design a video streaming service like YouTube. Focus on video storage and delivery.",
  },
  
  // HR/General
  {
    id: "hr-1",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "Can you briefly introduce yourself and tell me about your background?",
  },
  {
    id: "hr-2",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "What interests you about this role? Why do you want to work here?",
  },
  {
    id: "hr-3",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "What are your career goals for the next 3-5 years?",
  },
  {
    id: "hr-4",
    category: "hr",
    role: "general",
    difficulty: "easy",
    text: "What do you consider your greatest strength and weakness as a developer?",
  },
]

type InterviewConfig = {
  role: string
  type: string
  difficulty: string
}

const MAX_QUESTIONS = 6

/**
 * Select questions for an interview session
 * Returns exactly 6 questions based on config
 */
export function selectQuestions(config: InterviewConfig): Question[] {
  const { role, type, difficulty } = config
  
  // Normalize inputs
  const normalizedRole = role.toLowerCase().includes("frontend")
    ? "frontend"
    : role.toLowerCase().includes("backend")
    ? "backend"
    : role.toLowerCase().includes("full")
    ? "fullstack"
    : "general"
  
  const normalizedType = type.toLowerCase().includes("technical")
    ? "technical"
    : type.toLowerCase().includes("behavioral")
    ? "behavioral"
    : type.toLowerCase().includes("system")
    ? "system-design"
    : type.toLowerCase().includes("hr")
    ? "hr"
    : "technical"
  
  const normalizedDifficulty = difficulty.toLowerCase() as "easy" | "medium" | "hard"
  
  // Filter questions
  let filtered = QUESTION_BANK.filter((q) => {
    const roleMatch = q.role === normalizedRole || q.role === "general"
    const typeMatch = q.category === normalizedType
    const difficultyMatch = q.difficulty === normalizedDifficulty
    
    return roleMatch && typeMatch && difficultyMatch
  })
  
  // Fallback: if not enough questions, broaden criteria
  if (filtered.length < MAX_QUESTIONS) {
    filtered = QUESTION_BANK.filter((q) => {
      const typeMatch = q.category === normalizedType
      return typeMatch
    })
  }
  
  // Fallback: if still not enough, use any questions of similar difficulty
  if (filtered.length < MAX_QUESTIONS) {
    filtered = QUESTION_BANK.filter((q) => q.difficulty === normalizedDifficulty)
  }
  
  // Final fallback: use any questions
  if (filtered.length < MAX_QUESTIONS) {
    filtered = [...QUESTION_BANK]
  }
  
  // Shuffle and take exactly MAX_QUESTIONS
  const shuffled = filtered.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, MAX_QUESTIONS)
}

export { MAX_QUESTIONS, QUESTION_BANK }
export type { Question }
