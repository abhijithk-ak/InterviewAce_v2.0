/**
 * Concept Validation Engine
 * 
 * Validates conceptual correctness by checking for known correct/incorrect patterns.
 * This prevents the evaluation system from rewarding factually wrong answers.
 */

export interface ConceptValidation {
  conceptErrors: string[]
  severity: number
  violatedConcepts: string[]
}

/**
 * Knowledge base of correct and incorrect concept patterns
 */
const CONCEPT_DB = {
  gradient_descent: {
    correct: [
      /minimize.*loss/i,
      /reduce.*loss/i,
      /decrease.*loss/i,
      /lower.*error/i,
      /optimize.*weights/i,
      /move.*opposite.*gradient/i,
      /negative.*gradient/i,
      /descend.*gradient/i,
      /find.*minimum/i,
    ],
    incorrect: [
      /increase.*loss/i,
      /maximize.*loss/i,
      /raise.*loss/i,
      /higher.*loss/i,
      /increase.*error/i,
      /maximize.*error/i,
      /loss.*increases/i,
      /make.*loss.*bigger/i,
      /push.*loss.*up/i,
    ],
    severity: 45,
  },

  supervised_learning: {
    correct: [
      /labeled.*data/i,
      /label.*data/i,
      /input.*output.*pair/i,
      /target.*value/i,
      /ground.*truth/i,
      /annotation/i,
      /supervision.*requir/i,
      /known.*output/i,
    ],
    incorrect: [
      /without.*label/i,
      /no.*label/i,
      /unlabeled.*data/i,
      /without.*supervision/i,
      /no.*supervision/i,
      /learn.*by.*itself/i,
      /automatically.*find.*answer/i,
      /without.*human.*help/i,
      /learns.*independently/i,
    ],
    severity: 40,
  },

  unsupervised_learning: {
    correct: [
      /without.*label/i,
      /no.*label/i,
      /unlabeled.*data/i,
      /find.*pattern/i,
      /discover.*structure/i,
      /cluster/i,
      /group.*similar/i,
    ],
    incorrect: [
      /labeled.*data/i,
      /require.*label/i,
      /human.*label/i,
      /supervisor.*guide/i,
      /manual.*label/i,
      /data.*scientist.*tell/i,
      /human.*supervision/i,
    ],
    severity: 40,
  },

  overfitting: {
    correct: [
      /memorize.*training/i,
      /too.*complex/i,
      /poor.*generalization/i,
      /high.*training.*low.*test/i,
      /learn.*noise/i,
      /fits.*training.*too.*well/i,
      /low.*bias.*high.*variance/i,
    ],
    incorrect: [
      /doesn'?t.*memorize.*enough/i,
      /not.*memorize/i,
      /under.*memorize/i,
      /too.*simple/i,
      /needs.*more.*memorization/i,
      /increase.*layers.*reduce.*overfitting/i,
      /remove.*regularization/i,
      /train.*entire.*dataset/i,
      /without.*split/i,
      /100%.*accuracy.*good/i,
      /higher.*training.*accuracy.*better/i,
      /not.*serious.*issue/i,
    ],
    severity: 45,
  },

  regularization: {
    correct: [
      /prevent.*overfitting/i,
      /reduce.*complexity/i,
      /l1.*l2/i,
      /penalty.*term/i,
      /dropout/i,
      /weight.*decay/i,
      /shrink.*weight/i,
    ],
    incorrect: [
      /increase.*overfitting/i,
      /remove.*regularization.*good/i,
      /regularization.*reduce.*learning/i,
      /don'?t.*need.*regularization/i,
    ],
    severity: 35,
  },

  train_test_split: {
    correct: [
      /separate.*train.*test/i,
      /hold.*out.*test/i,
      /validation.*set/i,
      /split.*data.*train.*test/i,
      /unseen.*data/i,
    ],
    incorrect: [
      /train.*entire.*dataset/i,
      /no.*split/i,
      /don'?t.*split/i,
      /without.*validation/i,
      /no.*test.*set/i,
      /all.*data.*training/i,
    ],
    severity: 40,
  },

  early_stopping: {
    correct: [
      /monitor.*validation.*loss/i,
      /validation.*loss.*increase/i,
      /stop.*before.*overfitting/i,
      /prevent.*overfitting/i,
      /validation.*performance.*degrade/i,
    ],
    incorrect: [
      /stop.*when.*training.*accuracy.*high/i,
      /stop.*when.*training.*loss.*decrease/i,
      /prevent.*learning.*too.*much/i,
      /model.*too.*accurate/i,
      /stop.*before.*finish.*learning/i,
      /interrupt.*training.*early/i,
      /model.*too.*powerful/i,
    ],
    severity: 40,
  },

  hyperparameters: {
    correct: [
      /set.*before.*training/i,
      /learning.*rate/i,
      /batch.*size/i,
      /number.*layers/i,
      /chosen.*by.*user/i,
      /not.*learned/i,
      /tuned.*manually/i,
      /grid.*search/i,
      /random.*search/i,
    ],
    incorrect: [
      /learned.*during.*training/i,
      /automatically.*updated/i,
      /weights.*biases.*hyperparameter/i,
      /model.*learns.*hyperparameter/i,
      /gradient.*descent.*tune.*hyperparameter/i,
    ],
    severity: 40,
  },

  cross_validation: {
    correct: [
      /k.*fold/i,
      /multiple.*split/i,
      /rotation/i,
      /each.*fold.*test/i,
      /average.*performance/i,
      /reduce.*variance/i,
    ],
    incorrect: [
      /one.*random.*point/i,
      /single.*data.*point/i,
      /pick.*one.*sample/i,
      /test.*one.*time/i,
    ],
    severity: 45,
  },

  batch_gradient_descent: {
    correct: [
      /entire.*dataset/i,
      /all.*sample/i,
      /whole.*batch/i,
    ],
    incorrect: [
      /gpu.*only/i,
      /cpu.*gpu.*difference/i,
    ],
    severity: 30,
  },

  loss_function: {
    correct: [
      /measure.*error/i,
      /difference.*prediction.*actual/i,
      /objective.*minimize/i,
      /quantif.*performance/i,
    ],
    incorrect: [
      /high.*loss.*good/i,
      /increase.*loss.*improve/i,
      /loss.*show.*confidence/i,
      /high.*loss.*learning.*more/i,
    ],
    severity: 45,
  },
}

/**
 * Validate answer for conceptual correctness
 */
export function validateConcepts(answer: string): ConceptValidation {
  const conceptErrors: string[] = []
  const violatedConcepts: string[] = []
  let totalSeverity = 0

  // Normalize answer for better pattern matching
  const normalizedAnswer = answer.toLowerCase()

  // Check each concept in the knowledge base
  for (const [conceptName, patterns] of Object.entries(CONCEPT_DB)) {
    let hasCorrectPattern = false
    let hasIncorrectPattern = false

    // Check for correct patterns
    if (patterns.correct) {
      for (const pattern of patterns.correct) {
        if (pattern.test(normalizedAnswer)) {
          hasCorrectPattern = true
          break
        }
      }
    }

    // Check for incorrect patterns
    if (patterns.incorrect) {
      for (const pattern of patterns.incorrect) {
        if (pattern.test(normalizedAnswer)) {
          hasIncorrectPattern = true
          
          // Create error message
          const errorMsg = `Conceptual error in ${conceptName.replace(/_/g, ' ')}: ${getErrorDescription(conceptName)}`
          conceptErrors.push(errorMsg)
          violatedConcepts.push(conceptName)
          totalSeverity += patterns.severity
          break
        }
      }
    }
  }

  return {
    conceptErrors,
    severity: totalSeverity,
    violatedConcepts,
  }
}

/**
 * Get human-readable error description for a concept
 */
function getErrorDescription(conceptName: string): string {
  const descriptions: Record<string, string> = {
    gradient_descent: "Gradient descent minimizes loss, it doesn't increase it",
    supervised_learning: "Supervised learning requires labeled data",
    unsupervised_learning: "Unsupervised learning works with unlabeled data",
    overfitting: "Overfitting means the model memorizes training data too well, harming generalization",
    regularization: "Regularization prevents overfitting by constraining model complexity",
    train_test_split: "Data must be split into train/test sets to evaluate generalization",
    early_stopping: "Early stopping monitors validation loss to prevent overfitting",
    hyperparameters: "Hyperparameters are set before training, not learned during training",
    cross_validation: "Cross-validation uses multiple train/test splits, not a single random point",
    batch_gradient_descent: "Batch gradient descent processes the entire dataset per update",
    loss_function: "Loss function measures prediction error and should be minimized",
  }

  return descriptions[conceptName] || "Incorrect understanding of this concept"
}

/**
 * Detect negation patterns that often indicate misconceptions
 */
export function detectNegationMisconceptions(answer: string): string[] {
  const negationPatterns = [
    {
      pattern: /don'?t.*split.*data/i,
      error: "Claims not to split data (violates train/test separation)",
    },
    {
      pattern: /no.*validation/i,
      error: "Claims validation is not needed (critical for preventing overfitting)",
    },
    {
      pattern: /never.*test.*set/i,
      error: "Claims not to use test sets (essential for evaluation)",
    },
    {
      pattern: /don'?t.*need.*regularization/i,
      error: "Claims regularization is not needed (important for generalization)",
    },
    {
      pattern: /without.*label.*supervised/i,
      error: "Claims supervised learning works without labels (contradicts definition)",
    },
    {
      pattern: /no.*supervision.*supervised/i,
      error: "Claims supervised learning needs no supervision (contradicts name)",
    },
    {
      pattern: /accuracy.*not.*important/i,
      error: "Claims accuracy is not important (dismisses core evaluation metric)",
    },
  ]

  const errors: string[] = []

  for (const { pattern, error } of negationPatterns) {
    if (pattern.test(answer)) {
      errors.push(error)
    }
  }

  return errors
}

/**
 * Check if answer contains dangerous misconceptions that warrant hard penalties
 */
export function hasCriticalError(validation: ConceptValidation): boolean {
  return validation.severity >= 35
}

/**
 * Calculate penalty based on concept validation results
 */
export function calculateConceptPenalty(validation: ConceptValidation): number {
  if (validation.severity === 0) return 0
  
  // Map severity to penalty points
  if (validation.severity >= 80) return 50  // Multiple critical errors
  if (validation.severity >= 60) return 45  // 2+ serious errors
  if (validation.severity >= 40) return 40  // 1 critical error
  if (validation.severity >= 30) return 30  // 1 serious error
  if (validation.severity >= 20) return 20  // Minor error
  
  return 15  // Small error
}
