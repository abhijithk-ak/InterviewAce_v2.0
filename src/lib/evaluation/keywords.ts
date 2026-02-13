/**
 * Domain-Specific Keyword Libraries
 * Used for technical depth scoring
 */

export const DOMAIN_KEYWORDS: Record<string, string[]> = {
  frontend: [
    // Core Technologies
    "react", "vue", "angular", "svelte", "nextjs", "typescript", "javascript",
    // State Management
    "redux", "context", "zustand", "recoil", "state", "props",
    // React Concepts
    "hooks", "useeffect", "usestate", "usememo", "usecallback", "useref",
    "lifecycle", "component", "jsx", "virtual dom", "reconciliation",
    // Performance
    "optimization", "memo", "lazy loading", "code splitting", "bundle",
    "performance", "lighthouse", "core web vitals", "ssr", "csr",
    // Styling
    "css", "tailwind", "styled-components", "sass", "flexbox", "grid",
    // Tools
    "webpack", "vite", "babel", "eslint", "prettier",
    // Testing
    "jest", "testing library", "cypress", "playwright", "unit test",
    // Accessibility
    "accessibility", "aria", "semantic html", "wcag",
  ],

  backend: [
    // Languages & Frameworks
    "nodejs", "express", "fastify", "nestjs", "python", "django", "flask",
    "java", "spring", "golang", "rust",
    // Databases
    "postgresql", "mysql", "mongodb", "redis", "database", "sql", "nosql",
    "orm", "prisma", "sequelize", "mongoose", "query", "migration",
    // API Design
    "rest", "graphql", "api", "endpoint", "route", "middleware",
    "authentication", "authorization", "jwt", "oauth", "cors",
    // Architecture
    "microservices", "monolith", "architecture", "design pattern",
    "mvc", "repository", "service layer", "dependency injection",
    // Performance
    "caching", "indexing", "optimization", "scaling", "load balancing",
    "throughput", "latency", "concurrency", "async", "queue",
    // Security
    "security", "encryption", "hashing", "validation", "sanitization",
    "sql injection", "xss", "csrf",
    // DevOps
    "docker", "kubernetes", "ci/cd", "deployment", "monitoring",
    "logging", "error handling",
  ],

  fullstack: [
    // Frontend
    "react", "nextjs", "typescript", "hooks", "component", "state",
    // Backend
    "nodejs", "express", "api", "database", "mongodb", "postgresql",
    // Full Stack Concepts
    "fullstack", "end-to-end", "client-server", "spa", "ssr",
    "authentication", "authorization", "session", "cookie",
    // DevOps
    "deployment", "docker", "ci/cd", "git", "version control",
    // Architecture
    "architecture", "design", "scalability", "performance",
    "rest", "graphql", "websocket",
  ],

  "data-science": [
    // Languages & Tools
    "python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "jupyter", "matplotlib", "seaborn", "plotly",
    // Concepts
    "machine learning", "deep learning", "neural network", "model",
    "algorithm", "regression", "classification", "clustering",
    "supervised", "unsupervised", "reinforcement",
    // Statistics
    "statistics", "probability", "hypothesis", "correlation",
    "distribution", "variance", "standard deviation",
    // Data Processing
    "data cleaning", "feature engineering", "preprocessing",
    "normalization", "encoding", "pipeline",
    // Evaluation
    "accuracy", "precision", "recall", "f1 score", "cross validation",
    "overfitting", "underfitting", "bias", "variance",
  ],

  devops: [
    // Containers & Orchestration
    "docker", "kubernetes", "container", "pod", "deployment",
    "helm", "service mesh", "istio",
    // CI/CD
    "ci/cd", "jenkins", "github actions", "gitlab", "pipeline",
    "continuous integration", "continuous deployment",
    // Cloud
    "aws", "azure", "gcp", "cloud", "ec2", "s3", "lambda",
    "kubernetes", "terraform", "cloudformation",
    // Monitoring
    "monitoring", "prometheus", "grafana", "elk", "logging",
    "metrics", "alerting", "observability",
    // Automation
    "automation", "scripting", "ansible", "puppet", "chef",
    "infrastructure as code", "iac",
    // Security
    "security", "secrets management", "vault", "ssl", "tls",
  ],

  general: [
    // Software Engineering
    "software", "engineering", "development", "programming",
    "algorithm", "data structure", "complexity", "optimization",
    // Best Practices
    "design pattern", "solid", "dry", "kiss", "clean code",
    "refactoring", "testing", "debugging", "documentation",
    // Collaboration
    "git", "version control", "code review", "agile", "scrum",
    "collaboration", "communication", "team", "project",
    // Problem Solving
    "problem solving", "analysis", "solution", "approach",
    "implementation", "troubleshooting", "debugging",
  ],
}

/**
 * Get relevant keywords based on role and interview type
 */
export function getRelevantKeywords(role: string, type: string): string[] {
  const roleKeywords = DOMAIN_KEYWORDS[role.toLowerCase()] || []
  const generalKeywords = DOMAIN_KEYWORDS.general

  // For technical interviews, heavily weight role-specific keywords
  if (type === "technical") {
    return [...roleKeywords, ...generalKeywords.slice(0, 10)]
  }

  // For behavioral, use general keywords
  if (type === "behavioral") {
    return generalKeywords
  }

  // For system design, mix role-specific and general
  if (type === "system-design") {
    return [...roleKeywords, ...generalKeywords]
  }

  // Default: combine all
  return [...roleKeywords, ...generalKeywords]
}
