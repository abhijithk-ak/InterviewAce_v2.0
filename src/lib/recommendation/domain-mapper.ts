// Domain Mapping Engine
// Maps user domains to interview question categories and types

export type UserDomain = 
  | "frontend" 
  | "backend" 
  | "fullstack"
  | "data-science"
  | "devops" 
  | "mobile"
  | "machine-learning"
  | "system-design"
  | "cybersecurity"
  | "cloud"

export type QuestionRole = "frontend" | "backend" | "fullstack" | "general"
export type QuestionCategory = "technical" | "behavioral" | "hr" | "system-design"

export interface DomainMapping {
  primaryRole: QuestionRole
  secondaryRole: QuestionRole
  preferredCategories: QuestionCategory[]
  skillFocus: string[]
}

/**
 * Map user domains to question bank roles and categories
 * Provides intelligent question selection based on user's technical focus
 */
export function mapDomainsToQuestions(userDomains: UserDomain[]): DomainMapping {
  // Count domain frequencies to determine primary focus
  const domainCounts: Record<string, number> = {}
  
  userDomains.forEach(domain => {
    const roleGroup = getDomainRoleGroup(domain)
    domainCounts[roleGroup] = (domainCounts[roleGroup] || 0) + 1
  })

  // Determine primary and secondary roles
  const sortedRoles = Object.entries(domainCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([role]) => role as QuestionRole)

  const primaryRole = sortedRoles[0] || "general"
  const secondaryRole = sortedRoles[1] || "general"

  // Determine preferred categories based on domain mix
  const preferredCategories = getPreferredCategories(userDomains)
  
  // Identify skill focus areas
  const skillFocus = getSkillFocusAreas(userDomains)

  return {
    primaryRole,
    secondaryRole, 
    preferredCategories,
    skillFocus
  }
}

/**
 * Group domains into question bank roles
 */
function getDomainRoleGroup(domain: UserDomain): QuestionRole {
  const roleMap: Record<UserDomain, QuestionRole> = {
    "frontend": "frontend",
    "backend": "backend", 
    "fullstack": "fullstack",
    "data-science": "backend", // Typically backend-heavy
    "devops": "backend", // Infrastructure/backend focus
    "mobile": "frontend", // UI/frontend-adjacent
    "machine-learning": "backend", // Algorithm/backend focus
    "system-design": "fullstack", // Broad architectural knowledge
    "cybersecurity": "backend", // Security implementation
    "cloud": "backend" // Infrastructure/backend
  }
  
  return roleMap[domain]
}

/**
 * Determine preferred question categories based on domain mix
 */
function getPreferredCategories(domains: UserDomain[]): QuestionCategory[] {
  const categories: QuestionCategory[] = []
  
  // Always include technical for any technical domain
  if (domains.some(d => d !== "system-design")) {
    categories.push("technical")
  }
  
  // Include system design for senior domains or explicit system-design
  if (domains.includes("system-design") || 
      domains.includes("cloud") ||
      domains.includes("devops") ||
      domains.length >= 3) { // Multi-domain suggests system thinking
    categories.push("system-design")
  }
  
  // Always include behavioral for well-rounded preparation
  categories.push("behavioral")
  
  // Include HR for comprehensive interview prep
  if (domains.length >= 2) { // Multi-domain suggests career focus
    categories.push("hr")
  }
  
  return categories
}

/**
 * Identify specific skill focus areas for learning recommendations
 */
function getSkillFocusAreas(domains: UserDomain[]): string[] {
  const focusMap: Record<UserDomain, string[]> = {
    "frontend": ["React", "JavaScript", "CSS", "Web Performance", "UI/UX"],
    "backend": ["APIs", "Databases", "System Architecture", "Scalability"],
    "fullstack": ["Full-Stack Architecture", "API Design", "Database Design"],
    "data-science": ["Algorithms", "Data Structures", "Statistics", "ML Basics"],
    "devops": ["System Administration", "CI/CD", "Infrastructure", "Monitoring"],
    "mobile": ["Mobile Architecture", "Performance", "Native vs Cross-platform"],
    "machine-learning": ["Algorithm Design", "Data Processing", "Model Training"],
    "system-design": ["System Architecture", "Scalability", "Distributed Systems"],
    "cybersecurity": ["Security Principles", "Cryptography", "Vulnerability Assessment"], 
    "cloud": ["Cloud Architecture", "Serverless", "Microservices", "DevOps"]
  }
  
  return Array.from(new Set(
    domains.flatMap(domain => focusMap[domain] || [])
  )).slice(0, 5) // Limit to top 5 focus areas
}

/**
 * Get learning resource categories that map to user domains
 */
export function getDomainResourceMapping(domains: UserDomain[]): string[] {
  const resourceMap: Record<UserDomain, string[]> = {
    "frontend": ["algorithm-design", "system-architecture"], // Core CS + architecture
    "backend": ["algorithm-design", "system-architecture", "database-design"],
    "fullstack": ["algorithm-design", "system-architecture", "database-design"],
    "data-science": ["algorithm-design", "system-architecture"],
    "devops": ["system-architecture", "database-design"],
    "mobile": ["algorithm-design", "system-architecture"],
    "machine-learning": ["algorithm-design", "system-architecture"],
    "system-design": ["system-architecture", "database-design"],
    "cybersecurity": ["algorithm-design", "system-architecture"],
    "cloud": ["system-architecture", "database-design"]
  }
  
  return Array.from(new Set(
    domains.flatMap(domain => resourceMap[domain] || ["algorithm-design"])
  ))
}

/**
 * Recommend interview session configuration based on domains
 */
export function recommendSessionConfig(domains: UserDomain[], skillWeakness?: string) {
  const mapping = mapDomainsToQuestions(domains)
  
  // Default technical session
  let recommendedType: QuestionCategory = "technical"
  let recommendedRole = mapping.primaryRole
  
  // Adjust based on skill weakness
  if (skillWeakness) {
    if (skillWeakness.includes("communication") || skillWeakness.includes("clarity")) {
      recommendedType = "behavioral"
      recommendedRole = "general"
    } else if (skillWeakness.includes("technical")) {
      recommendedType = "technical" 
      // Keep primary role
    } else if (skillWeakness.includes("confidence")) {
      recommendedType = "hr"
      recommendedRole = "general" 
    }
  }
  
  return {
    role: recommendedRole,
    type: recommendedType,
    categories: mapping.preferredCategories,
    skillFocus: mapping.skillFocus
  }
}