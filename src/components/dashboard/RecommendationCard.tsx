// Single Intelligent Recommendation Component

import { Card, CardHeader, CardContent } from "@/components/ui"
import { Button } from "@/components/ui"  
import { Target, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getDomainDisplayName, type PriorityResult } from "@/lib/recommendation/priority"

type RecommendationCardProps = {
  recommendation: PriorityResult
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'text-green-400 bg-green-400/10 border-green-400/20'
    case 'medium':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    case 'hard':
      return 'text-red-400 bg-red-400/10 border-red-400/20'
    default:
      return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20'
  }
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const domainDisplayName = getDomainDisplayName(recommendation.domain)
  
  return (
    <Card className="border-neutral-700 bg-neutral-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">
            🎯 Focus Area: {domainDisplayName}
          </h2>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Reason */}
        <div>
          <h3 className="text-sm font-medium text-neutral-400 mb-1">Reason</h3>
          <p className="text-white">{recommendation.reason}</p>
        </div>

        {/* Suggested Difficulty */}
        <div>
          <h3 className="text-sm font-medium text-neutral-400 mb-2">Suggested Difficulty</h3>
          <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(recommendation.suggestedDifficulty)}`}>
            {recommendation.suggestedDifficulty.charAt(0).toUpperCase() + recommendation.suggestedDifficulty.slice(1)}
          </span>
        </div>

        {/* Next Action */}
        <div>
          <h3 className="text-sm font-medium text-neutral-400 mb-3">Next Action</h3>
          <Link href="/interview/setup">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <span className="flex items-center gap-2">
                {recommendation.nextAction}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Priority Score (for debugging/transparency) */}
        <div className="pt-2 border-t border-neutral-600">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>Priority Score</span>
            <span>{recommendation.priority.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}