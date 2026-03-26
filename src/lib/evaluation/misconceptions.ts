/**
 * Misconception Detection System
 * 
 * Identifies common conceptual errors and incorrect explanations
 * that should significantly reduce technical scores.
 * 
 * This prevents the system from rewarding wrong answers that
 * contain keywords and are well-structured but factually incorrect.
 */

export type MisconceptionPenalty = {
  detected: boolean
  errors: string[]
  severityScore: number  // 0-100 penalty
  categories: string[]
}

/**
 * Domain-specific misconception patterns
 * Each pattern detects a fundamental misunderstanding
 */
export const MISCONCEPTION_PATTERNS = {
  // Machine Learning Misconceptions
  'ml': [
    {
      patterns: [
        /overfitting.*(?:doesn't|not|never).*memorize/i,
        /overfitting.*good.*training.*perfect/i,
        /overfitting.*(?:low|poor).*training.*accuracy/i,
      ],
      error: "Overfitting defined incorrectly (confuses with underfitting)",
      severity: 40,
      category: "fundamental-concept"
    },
    {
      patterns: [
        /train.*(?:all|full|entire).*data.*(?:better|efficient|best)/i,
        /(?:don't|no|skip|avoid).*(?:split|validation|test).*data/i,
        /test.*data.*(?:unnecessary|waste|ignore)/i,
      ],
      error: "Misunderstands train/test split - critical ML practice",
      severity: 35,
      category: "methodology"
    },
    {
      patterns: [
        /(?:don't|no|skip|avoid).*(?:regularization|dropout|early.?stopping)/i,
        /regularization.*(?:slow|waste|unnecessary)/i,
      ],
      error: "Dismisses regularization techniques without justification",
      severity: 25,
      category: "methodology"
    },
    {
      patterns: [
        /cross.?validation.*single.*(?:point|sample)/i,
        /cross.?validation.*(?:guessing|visual)/i,
        /(?:don't|no).*k.?fold/i,
      ],
      error: "Cross-validation explained incorrectly",
      severity: 30,
      category: "fundamental-concept"
    },
    {
      patterns: [
        /hyperparameter.*(?:random|arbitrary|guess).*until.*like/i,
        /(?:don't|no|skip|avoid).*(?:grid|random|bayesian).*search/i,
      ],
      error: "Hyperparameter tuning reduced to random guessing",
      severity: 25,
      category: "methodology"
    },
    {
      patterns: [
        /(?:feel|looks?).*correct.*instead.*(?:metric|accuracy|rmse)/i,
        /(?:don't|no).*(?:calculate|compute|measure).*(?:accuracy|precision|recall)/i,
      ],
      error: "Evaluation without proper metrics",
      severity: 30,
      category: "methodology"
    },
    {
      patterns: [
        /excel.*(?:instead|replace|better).*(?:python|tensorflow|scikit)/i,
        /(?:don't|no).*(?:use|need).*(?:python|libraries|frameworks)/i,
      ],
      error: "Dismisses standard ML tools/libraries",
      severity: 20,
      category: "tools"
    },
    {
      patterns: [
        /(?:don't|no|skip).*(?:clean|preprocess|handle).*(?:data|missing|outliers)/i,
        /model.*should.*figure.*out.*(?:itself|automatically)/i,
      ],
      error: "Ignores data preprocessing/cleaning",
      severity: 25,
      category: "methodology"
    },
  ],

  // Software Development Misconceptions
  'development': [
    {
      patterns: [
        /(?:don't|no|never).*(?:test|unit.?test|testing)/i,
        /testing.*(?:waste|slow|unnecessary)/i,
      ],
      error: "Dismisses testing practices",
      severity: 30,
      category: "methodology"
    },
    {
      patterns: [
        /(?:don't|no).*version.*control/i,
        /(?:don't|no).*git/i,
      ],
      error: "Doesn't use version control",
      severity: 25,
      category: "tools"
    },
    {
      patterns: [
        /(?:don't|no|skip).*documentation/i,
        /comments.*(?:waste|unnecessary)/i,
      ],
      error: "Ignores documentation",
      severity: 15,
      category: "best-practices"
    },
  ],

  // System Design Misconceptions
  'system-design': [
    {
      patterns: [
        /(?:don't|no).*(?:need|use).*(?:cache|caching)/i,
        /database.*(?:enough|sufficient).*alone/i,
      ],
      error: "Ignores caching for scalability",
      severity: 25,
      category: "architecture"
    },
    {
      patterns: [
        /single.*server.*(?:enough|sufficient|fine)/i,
        /(?:don't|no).*(?:scale|load.?balance)/i,
      ],
      error: "Doesn't consider scalability",
      severity: 30,
      category: "architecture"
    },
  ],

  // General Technical Misconceptions
  'general': [
    {
      patterns: [
        /(?:never|didn't).*(?:actually|really).*(?:us|implement|do)/i,
        /(?:never|don't).*(?:learn|study|practice)/i,
      ],
      error: "Admits lack of experience/knowledge",
      severity: 20,
      category: "experience"
    },
    {
      patterns: [
        /manual.*(?:guessing|typing).*predictions/i,
        /just.*(?:guess|randomly|arbitrarily)/i,
      ],
      error: "Describes manual/arbitrary process instead of systematic approach",
      severity: 30,
      category: "methodology"
    },
  ]
}

/**
 * Detect misconceptions in an answer
 * 
 * @param answer - The candidate's answer
 * @param domain - The interview domain (ml, development, system-design, general)
 * @returns MisconceptionPenalty with detected errors and severity
 */
export function detectMisconceptions(
  answer: string,
  domain: string = 'general'
): MisconceptionPenalty {
  const errors: string[] = []
  const categories = new Set<string>()
  let totalSeverity = 0

  // Get relevant misconception patterns for domain
  const domainPatterns = MISCONCEPTION_PATTERNS[domain as keyof typeof MISCONCEPTION_PATTERNS] || []
  const generalPatterns = MISCONCEPTION_PATTERNS.general

  const allPatterns = [...domainPatterns, ...generalPatterns]

  // Check each misconception pattern
  for (const misconception of allPatterns) {
    for (const pattern of misconception.patterns) {
      if (pattern.test(answer)) {
        errors.push(misconception.error)
        categories.add(misconception.category)
        totalSeverity += misconception.severity
        break // Don't count same misconception multiple times
      }
    }
  }

  return {
    detected: errors.length > 0,
    errors,
    severityScore: Math.min(totalSeverity, 100), // Cap at 100
    categories: Array.from(categories)
  }
}

/**
 * Get domain from role/type
 */
export function inferDomain(role: string, type: string): string {
  const roleLower = role.toLowerCase()
  const typeLower = type.toLowerCase()

  if (roleLower.includes('ml') || roleLower.includes('data') || roleLower.includes('ai')) {
    return 'ml'
  }
  
  if (typeLower.includes('system') || typeLower.includes('design') || typeLower.includes('architecture')) {
    return 'system-design'
  }

  if (roleLower.includes('backend') || roleLower.includes('frontend') || roleLower.includes('fullstack')) {
    return 'development'
  }

  return 'general'
}

/**
 * Calculate penalty to apply to technical score
 * 
 * @param misconceptionResult - Result from detectMisconceptions
 * @returns number - Points to subtract from technical score (0-50)
 */
export function calculateMisconceptionPenalty(
  misconceptionResult: MisconceptionPenalty
): number {
  if (!misconceptionResult.detected) {
    return 0
  }

  // Severity score is already 0-100, convert to penalty out of 50 points
  // We cap the penalty so even multiple errors don't completely zero the score
  const penalty = Math.min(misconceptionResult.severityScore * 0.5, 50)
  
  return Math.round(penalty)
}
