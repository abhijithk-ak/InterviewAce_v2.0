// MongoDB Schema Design for InterviewAce
// Collections needed for 500MB limit optimization

// 1. users (Auth data + preferences)
interface User {
  _id: ObjectId
  githubId: string
  email: string
  name: string
  avatar: string
  preferences: {
    theme: 'dark' | 'light'
    defaultDifficulty: string
    aiSettings: AISettings
  }
  createdAt: Date
  lastActive: Date
}

// 2. sessions (Interview sessions - main data)
interface Session {
  _id: ObjectId
  userId: ObjectId
  type: 'Technical' | 'Behavioral' | 'System Design' | 'HR'
  config: InterviewConfig
  messages: Message[] // Limit to last 50 messages for storage optimization
  scores: ScoreBreakdown
  duration: number
  status: 'completed' | 'paused' | 'abandoned'
  createdAt: Date
  completedAt?: Date
}

// 3. notes (User notes - separate for query optimization)
interface Note {
  _id: ObjectId
  userId: ObjectId
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// 4. analytics (Aggregated progress data)
interface UserAnalytics {
  _id: ObjectId
  userId: ObjectId
  totalSessions: number
  averageScores: ScoreBreakdown
  skillProgress: SkillProgress[]
  lastCalculated: Date
}

// Storage Optimization Strategies:
// - Limit message history per session (50 messages max)
// - Archive old sessions after 6 months
// - Use MongoDB TTL indexes for temporary data
// - Compress large text fields
// - Index only essential query fields