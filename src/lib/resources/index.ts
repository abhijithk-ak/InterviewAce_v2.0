// Learning Resources for InterviewAce v2
// Categorized by technical areas to provide targeted learning paths

export type ResourceCategory = {
  id: string
  name: string  
  description: string
  resources: Resource[]
}

export type Resource = {
  id: string
  title: string
  description: string
  url: string
  type: "article" | "video" | "course" | "book" | "practice"
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string // e.g., "15 min", "2 hours"
  tags: string[]
}

export const LEARNING_RESOURCES: ResourceCategory[] = [
  {
    id: "algorithm-design",
    name: "Algorithm Design",
    description: "Master algorithmic thinking and problem-solving patterns",
    resources: [
      {
        id: "algo-1",
        title: "Big O Notation Explained",
        description: "Understanding time and space complexity analysis",
        url: "https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation/a/big-o-notation",
        type: "article",
        difficulty: "beginner",
        duration: "30 min",
        tags: ["big-o", "complexity", "fundamentals"]
      },
      {
        id: "algo-2", 
        title: "LeetCode Patterns Guide",
        description: "Common algorithmic patterns for technical interviews",
        url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns",
        type: "practice",
        difficulty: "intermediate",
        duration: "2 hours",
        tags: ["patterns", "dynamic-programming", "practice"]
      },
      {
        id: "algo-3",
        title: "Grokking Algorithms",
        description: "Visual approach to understanding algorithms",
        url: "https://www.manning.com/books/grokking-algorithms",
        type: "book",
        difficulty: "beginner",
        duration: "8 hours",
        tags: ["visual-learning", "comprehensive", "beginner-friendly"]
      }
    ]
  },
  {
    id: "system-architecture",
    name: "System Architecture",
    description: "Learn to design scalable and reliable systems",
    resources: [
      {
        id: "sys-1",
        title: "System Design Primer",
        description: "Comprehensive guide to system design concepts",
        url: "https://github.com/donnemartin/system-design-primer",
        type: "article",
        difficulty: "intermediate",
        duration: "4 hours",
        tags: ["scalability", "distributed-systems", "architecture"]
      },
      {
        id: "sys-2",
        title: "Designing Data-Intensive Applications",
        description: "Deep dive into modern data system architectures",
        url: "https://dataintensive.net/",
        type: "book", 
        difficulty: "advanced",
        duration: "20 hours",
        tags: ["databases", "distributed-systems", "advanced"]
      },
      {
        id: "sys-3",
        title: "High Scalability Blog",
        description: "Real-world system architecture case studies",
        url: "http://highscalability.com/",
        type: "article",
        difficulty: "intermediate",
        duration: "1 hour",
        tags: ["case-studies", "real-world", "scalability"]
      }
    ]
  },
  {
    id: "database-design",
    name: "Database Design",
    description: "Master database modeling and optimization",
    resources: [
      {
        id: "db-1",
        title: "SQL vs NoSQL Explained",
        description: "When to choose relational vs document databases",
        url: "https://www.mongodb.com/nosql-explained/nosql-vs-sql",
        type: "article",
        difficulty: "beginner",
        duration: "20 min",
        tags: ["sql", "nosql", "fundamentals"]
      },
      {
        id: "db-2",
        title: "Database Indexing Strategies",
        description: "Optimize query performance with proper indexing",
        url: "https://use-the-index-luke.com/",
        type: "course",
        difficulty: "intermediate", 
        duration: "3 hours",
        tags: ["performance", "indexing", "optimization"]
      }
    ]
  },
  {
    id: "communication-clarity",
    name: "Communication Skills",
    description: "Improve technical communication and interview presence",
    resources: [
      {
        id: "comm-1",
        title: "Technical Communication Guide",
        description: "How to explain complex concepts clearly",
        url: "https://developers.google.com/tech-writing/one",
        type: "course",
        difficulty: "beginner",
        duration: "1 hour",
        tags: ["communication", "clarity", "presentation"]
      },
      {
        id: "comm-2",
        title: "Mock Interview Practice",
        description: "Practice explaining code and thought process",
        url: "https://www.pramp.com/",
        type: "practice",
        difficulty: "intermediate",
        duration: "45 min",
        tags: ["mock-interviews", "practice", "feedback"]
      }
    ]
  },
  {
    id: "confidence-building", 
    name: "Interview Confidence",
    description: "Build confidence and manage interview anxiety",
    resources: [
      {
        id: "conf-1",
        title: "Interview Anxiety Management",
        description: "Techniques to stay calm under pressure",
        url: "https://www.indeed.com/career-advice/interviewing/how-to-calm-interview-nerves",
        type: "article", 
        difficulty: "beginner",
        duration: "15 min",
        tags: ["anxiety", "confidence", "mental-preparation"]
      },
      {
        id: "conf-2",
        title: "Body Language in Interviews",
        description: "Project confidence through non-verbal communication",
        url: "https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are",
        type: "video",
        difficulty: "beginner", 
        duration: "21 min",
        tags: ["body-language", "presence", "confidence"]
      }
    ]
  }
]

// Helper function to get resources for specific weak areas
export function getResourcesForWeakAreas(weakAreas: string[]): Resource[] {
  const relevantResources: Resource[] = []
  
  for (const weakArea of weakAreas) {
    const category = LEARNING_RESOURCES.find(cat => cat.id === weakArea)
    if (category) {
      relevantResources.push(...category.resources)
    }
  }
  
  return relevantResources
}

// Helper function to get beginner resources for experience level
export function getResourcesForExperienceLevel(level: string): Resource[] {
  if (level === "student" || level === "fresher") {
    return LEARNING_RESOURCES.flatMap(cat => 
      cat.resources.filter(resource => resource.difficulty === "beginner")
    )
  }
  
  return LEARNING_RESOURCES.flatMap(cat => 
    cat.resources.filter(resource => 
      resource.difficulty === "intermediate" || resource.difficulty === "advanced"
    )
  )
}