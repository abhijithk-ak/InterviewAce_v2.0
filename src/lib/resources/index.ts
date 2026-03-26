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
        title: "Think Fast, Talk Smart",
        description: "Frameworks for concise and clear communication under pressure.",
        url: "https://www.gsb.stanford.edu/insights/think-fast-talk-smart-podcast",
        type: "article",
        difficulty: "beginner",
        duration: "30 min",
        tags: ["communication", "clarity", "structured-thinking"]
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
  },
  {
    id: "role-frontend",
    name: "Frontend Track",
    description: "Role-focused preparation for frontend engineering interviews",
    resources: [
      {
        id: "role-frontend-1",
        title: "Frontend Interview Handbook",
        description: "Deep guide for React, JS, rendering, and browser internals.",
        url: "https://www.frontendinterviewhandbook.com/",
        type: "article",
        difficulty: "intermediate",
        duration: "3 hours",
        tags: ["frontend", "javascript", "react", "browser"]
      },
      {
        id: "role-frontend-2",
        title: "Web.dev Performance Learn",
        description: "Practical performance techniques commonly asked in frontend interviews.",
        url: "https://web.dev/learn/performance/",
        type: "course",
        difficulty: "intermediate",
        duration: "2 hours",
        tags: ["frontend", "performance", "web", "javascript"]
      }
    ]
  },
  {
    id: "role-backend",
    name: "Backend Track",
    description: "Role-focused preparation for backend engineering interviews",
    resources: [
      {
        id: "role-backend-1",
        title: "Backend System Design (ByteByteGo)",
        description: "Backend-focused architecture patterns and trade-offs.",
        url: "https://blog.bytebytego.com/",
        type: "article",
        difficulty: "intermediate",
        duration: "2 hours",
        tags: ["backend", "apis", "architecture", "scalability"]
      },
      {
        id: "role-backend-2",
        title: "REST API Design Best Practices",
        description: "Core API design patterns, versioning, and reliability principles.",
        url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design",
        type: "article",
        difficulty: "intermediate",
        duration: "1 hour",
        tags: ["backend", "api", "rest", "design"]
      }
    ]
  },
  {
    id: "role-fullstack",
    name: "Fullstack Track",
    description: "Role-focused preparation for fullstack engineering interviews",
    resources: [
      {
        id: "role-fullstack-1",
        title: "Fullstack Open",
        description: "Comprehensive fullstack path: React, Node, testing, DevOps.",
        url: "https://fullstackopen.com/en/",
        type: "course",
        difficulty: "intermediate",
        duration: "10 hours",
        tags: ["fullstack", "frontend", "backend", "apis"]
      },
      {
        id: "role-fullstack-2",
        title: "The Odin Project - Full Stack JavaScript",
        description: "Hands-on project path covering client-server integration.",
        url: "https://www.theodinproject.com/paths/full-stack-javascript",
        type: "course",
        difficulty: "beginner",
        duration: "8 hours",
        tags: ["fullstack", "javascript", "node", "react"]
      }
    ]
  },
  {
    id: "role-data-science",
    name: "Data Science Track",
    description: "Role-focused preparation for data science interviews",
    resources: [
      {
        id: "role-datascience-1",
        title: "Data Science Interview Study Guide",
        description: "Statistics, ML intuition, and practical interview prep.",
        url: "https://www.kdnuggets.com/",
        type: "article",
        difficulty: "intermediate",
        duration: "2 hours",
        tags: ["data-science", "statistics", "ml", "python"]
      },
      {
        id: "role-datascience-2",
        title: "StatQuest",
        description: "Clear explanations of core statistics and ML concepts.",
        url: "https://www.youtube.com/c/joshstarmer",
        type: "video",
        difficulty: "beginner",
        duration: "3 hours",
        tags: ["data-science", "statistics", "machine-learning", "fundamentals"]
      }
    ]
  },
  {
    id: "role-cloud",
    name: "Cloud Track",
    description: "Role-focused preparation for cloud engineering interviews",
    resources: [
      {
        id: "role-cloud-1",
        title: "AWS Architecture Center",
        description: "Cloud reference architectures and best practices.",
        url: "https://aws.amazon.com/architecture/",
        type: "article",
        difficulty: "intermediate",
        duration: "2 hours",
        tags: ["cloud", "aws", "architecture", "distributed-systems"]
      },
      {
        id: "role-cloud-2",
        title: "Google Cloud Architecture Framework",
        description: "Design guidance for reliability, security, and operational excellence.",
        url: "https://cloud.google.com/architecture/framework",
        type: "article",
        difficulty: "intermediate",
        duration: "90 min",
        tags: ["cloud", "gcp", "architecture", "reliability"]
      }
    ]
  },
  {
    id: "role-devops",
    name: "DevOps Track",
    description: "Role-focused preparation for DevOps interviews",
    resources: [
      {
        id: "role-devops-1",
        title: "DevOps Roadmap",
        description: "End-to-end roadmap for CI/CD, IaC, containers, and observability.",
        url: "https://roadmap.sh/devops",
        type: "course",
        difficulty: "beginner",
        duration: "4 hours",
        tags: ["devops", "cloud", "kubernetes", "ci-cd"]
      },
      {
        id: "role-devops-2",
        title: "Kubernetes Basics",
        description: "Foundational Kubernetes concepts for deployment and operations.",
        url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        type: "course",
        difficulty: "intermediate",
        duration: "2 hours",
        tags: ["devops", "kubernetes", "containers", "operations"]
      }
    ]
  },
  {
    id: "role-mobile",
    name: "Mobile Track",
    description: "Role-focused preparation for mobile engineering interviews",
    resources: [
      {
        id: "role-mobile-1",
        title: "Mobile System Design Basics",
        description: "Offline-first, sync, performance, and app architecture patterns.",
        url: "https://developer.android.com/topic/architecture",
        type: "article",
        difficulty: "intermediate",
        duration: "90 min",
        tags: ["mobile", "flutter", "android", "ios"]
      },
      {
        id: "role-mobile-2",
        title: "iOS App Dev Tutorials",
        description: "Core iOS architecture and app lifecycle fundamentals.",
        url: "https://developer.apple.com/tutorials/app-dev-training",
        type: "course",
        difficulty: "beginner",
        duration: "3 hours",
        tags: ["mobile", "ios", "swift", "app-architecture"]
      }
    ]
  },
  {
    id: "role-machine-learning",
    name: "Machine Learning Track",
    description: "Role-focused preparation for ML engineering interviews",
    resources: [
      {
        id: "role-ml-1",
        title: "Made With ML - Production ML",
        description: "Hands-on path for model development and ML system reliability.",
        url: "https://madewithml.com/",
        type: "course",
        difficulty: "advanced",
        duration: "6 hours",
        tags: ["machine-learning", "ml-engineer", "data-science", "mlops"]
      },
      {
        id: "role-ml-2",
        title: "Chip Huyen - MLOps Notes",
        description: "Practical MLOps and ML system design notes.",
        url: "https://huyenchip.com/machine-learning-systems-design/toc.html",
        type: "article",
        difficulty: "advanced",
        duration: "2 hours",
        tags: ["machine-learning", "mlops", "system-design", "production"]
      }
    ]
  },
  {
    id: "role-system-design",
    name: "System Design Track",
    description: "Role-focused preparation for system design interviews",
    resources: [
      {
        id: "role-systemdesign-1",
        title: "System Design Interview Playlist",
        description: "End-to-end architecture discussions for common design prompts.",
        url: "https://www.youtube.com/c/SystemDesignInterview",
        type: "video",
        difficulty: "intermediate",
        duration: "3 hours",
        tags: ["system-design", "backend", "architecture", "scalability"]
      },
      {
        id: "role-systemdesign-2",
        title: "ByteByteGo Newsletter",
        description: "Concise system design lessons with architecture trade-offs.",
        url: "https://blog.bytebytego.com/",
        type: "article",
        difficulty: "intermediate",
        duration: "90 min",
        tags: ["system-design", "architecture", "distributed-systems", "backend"]
      }
    ]
  },
  {
    id: "role-cybersecurity",
    name: "Cybersecurity Track",
    description: "Role-focused preparation for cybersecurity interviews",
    resources: [
      {
        id: "role-cybersecurity-1",
        title: "OWASP Top 10",
        description: "Most critical web security risks every engineer should know.",
        url: "https://owasp.org/www-project-top-ten/",
        type: "article",
        difficulty: "beginner",
        duration: "60 min",
        tags: ["cybersecurity", "backend", "web-security", "risk"]
      },
      {
        id: "role-cybersecurity-2",
        title: "PortSwigger Web Security Academy",
        description: "Hands-on labs for real-world web security vulnerabilities.",
        url: "https://portswigger.net/web-security",
        type: "practice",
        difficulty: "intermediate",
        duration: "4 hours",
        tags: ["cybersecurity", "web-security", "practice", "vulnerabilities"]
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