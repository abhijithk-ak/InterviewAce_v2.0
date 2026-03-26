/**
 * Deterministic scorer stubs.
 *
 * Runtime evaluation uses AI + MiniLM hybrid scoring in engine.ts.
 * These are retained only for compatibility with legacy callers.
 */

export function relevanceScore(_question: string, _answer: string): number {
  return 0
}

export function clarityScore(_answer: string): number {
  return 0
}

export function confidenceScore(_answer: string): number {
  return 0
}

export function structureScore(_answer: string): number {
  return 0
}
