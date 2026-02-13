// Recent Sessions Component (Last 5 Only)

import { Card, CardHeader, CardContent } from "@/components/ui"
import { Calendar, Clock, Target } from "lucide-react"

type SessionData = {
  _id: string
  config: {
    role: string
    type: string
    difficulty: string
  }
  startedAt: string
  endedAt?: string
  overallScore?: number
}

type RecentSessionsProps = {
  sessions: SessionData[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 24) {
    return diffHours <= 1 ? '1 hour ago' : `${diffHours} hours ago`
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

function calculateDuration(startedAt: string, endedAt?: string): string {
  if (!endedAt) return 'In progress'
  
  const startTime = new Date(startedAt)
  const endTime = new Date(endedAt)
  const durationMs = endTime.getTime() - startTime.getTime()
  const minutes = Math.floor(durationMs / (1000 * 60))
  
  if (minutes < 60) {
    return `${minutes}m`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-orange-400'
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  // Take last 5 sessions sorted by startedAt descending
  const recentSessions = sessions
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5)

  if (recentSessions.length === 0) {
    return (
      <Card className="border-neutral-700 bg-neutral-800 mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Start your first interview to generate insights
            </h3>
            <p className="text-neutral-400">
              Your session history and performance data will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-neutral-700 bg-neutral-800 mb-8">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSessions.map((session) => (
            <div 
              key={session._id} 
              className="flex items-center justify-between p-4 rounded-lg border border-neutral-600 hover:bg-neutral-700 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-white capitalize">
                    {session.config.role} - {session.config.type}
                  </h3>
                  <span className="px-2 py-1 text-xs bg-neutral-600 text-neutral-300 rounded">
                    {session.config.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(session.startedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {calculateDuration(session.startedAt, session.endedAt)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {session.overallScore !== undefined ? (
                  <div className={`text-lg font-bold ${getScoreColor(session.overallScore)}`}>
                    {session.overallScore}%
                  </div>
                ) : (
                  <div className="text-neutral-400 text-sm">
                    No score
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}