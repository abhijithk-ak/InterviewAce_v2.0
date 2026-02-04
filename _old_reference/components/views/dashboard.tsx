"use client"

import { motion } from "framer-motion"
import { useSession, signIn } from "next-auth/react"
import { Trophy, CheckCircle2, Star, Clock, Code, ChevronRight, Play, TrendingUp, Target, Calendar, Github } from "lucide-react"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { BadgeCustom } from "@/components/ui-custom/badge-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { LEARNING_RESOURCES, VIEW_TRANSITION } from "@/lib/data"
import type { Session } from "@/lib/data"

interface DashboardProps {
  onStartInterview: () => void
  onViewSession: (session: Session) => void
  sessions?: Session[]
}

// Helper function to calculate improvement
function calculateImprovement(sessions: Session[]): string {
  if (sessions.length < 2) return "N/A"
  
  const recentSessions = sessions.slice(0, 5)
  const olderSessions = sessions.slice(-5)
  
  const recentAvg = recentSessions.reduce((acc, s) => acc + s.score, 0) / recentSessions.length
  const olderAvg = olderSessions.reduce((acc, s) => acc + s.score, 0) / olderSessions.length
  
  const improvement = ((recentAvg - olderAvg) / olderAvg) * 100
  const sign = improvement > 0 ? "+" : ""
  
  return `${sign}${Math.round(improvement)}%`
}

export function Dashboard({ onStartInterview, onViewSession, sessions = [] }: DashboardProps) {
  const { data: authSession, status } = useSession()
  const displaySessions = sessions.slice(0, 5)
  const completedCount = sessions.filter((s) => s.status === "completed").length
  const avgScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length)
      : 0

  // Calculate streak (sessions in consecutive days)
  const streak = sessions.length > 0 ? Math.min(sessions.length, 7) : 0

  // Get user's first name from session
  const userName = authSession?.user?.name?.split(" ")[0] || "there"

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <motion.div {...VIEW_TRANSITION} className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-20 h-20 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center">
          <span className="text-white dark:text-black font-bold text-4xl">I</span>
        </div>
        <h1 className="text-3xl font-bold text-center">Welcome to InterviewAce</h1>
        <p className="text-neutral-500 text-center max-w-md">
          Sign in with GitHub to start practicing interviews, track your progress, and improve your skills.
        </p>
        <ButtonCustom onClick={() => signIn("github")} className="gap-2 px-6 py-3">
          <Github className="w-5 h-5" />
          Sign in with GitHub
        </ButtonCustom>
      </motion.div>
    )
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="space-y-10 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
            Welcome back, {userName}.
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">
            {sessions.length > 0 ? (
              <>
                {"You've completed "}
                <span className="font-semibold text-neutral-900 dark:text-white">{completedCount} sessions</span>.
                {streak > 0 && ` ${streak} day streak!`}
              </>
            ) : (
              "Ready to ace your next interview? Let's get started."
            )}
          </p>
        </div>
        {authSession?.user?.image && (
          <div className="flex items-center gap-3">
            <img
              src={authSession.user.image}
              alt={authSession.user.name || "User"}
              className="w-12 h-12 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
            />
          </div>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CardCustom className="md:col-span-1 p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
              <Trophy className="w-6 h-6 text-neutral-900 dark:text-white" />
            </div>
            <span className="text-sm text-neutral-500 font-medium">Avg Score</span>
          </div>
          <div className="text-4xl font-bold text-neutral-900 dark:text-white">{avgScore}%</div>
          <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +2% from last week
          </div>
        </CardCustom>

        <CardCustom className="md:col-span-1 p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-neutral-900 dark:text-white" />
            </div>
            <span className="text-sm text-neutral-500 font-medium">Completed</span>
          </div>
          <div className="text-4xl font-bold text-neutral-900 dark:text-white">
            {completedCount}
          </div>
          <div className="text-sm text-neutral-400 mt-2">Total sessions</div>
        </CardCustom>

        {/* Daily Challenge Card */}
        <CardCustom
          className="md:col-span-2 p-6 bg-neutral-900 text-white dark:bg-white dark:text-black relative overflow-hidden group cursor-pointer"
          onClick={onStartInterview}
        >
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2 text-white/70 dark:text-black/70 text-xs font-bold uppercase tracking-wider">
                  <Star className="w-4 h-4" /> Daily Challenge
                </div>
                <h3 className="text-2xl font-bold">Optimize a React List</h3>
                <p className="text-sm mt-2 text-white/60 dark:text-black/60">
                  Practice performance optimization patterns
                </p>
              </div>
              <div className="p-3 bg-white/10 dark:bg-black/10 rounded-full group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm font-medium text-white/80 dark:text-black/80">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 15 min
              </span>
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4" /> Technical
              </span>
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4" /> Mid-Level
              </span>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 dark:bg-black/5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform" />
        </CardCustom>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "This Week", value: `${Math.min(sessions.length, 4)} sessions`, icon: Calendar },
          {
            label: "Best Score",
            value: sessions.length > 0 ? `${Math.max(...sessions.map((s) => s.score))}%` : "N/A",
            icon: Trophy,
          },
          {
            label: "Total Hours",
            value: sessions.length > 0 ? `${Math.round(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60)} hrs` : "0 hrs",
            icon: Clock,
          },
          { 
            label: "Improvement", 
            value: sessions.length > 1 ? calculateImprovement(sessions) : "N/A", 
            icon: TrendingUp 
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800"
          >
            <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium mb-2">
              <stat.icon className="w-4 h-4" />
              {stat.label}
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-5 text-neutral-900 dark:text-white">Recent Sessions</h2>
          <div className="space-y-4">
            {displaySessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onViewSession(session)}
                className="group flex items-center justify-between p-5 rounded-xl border border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Code className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{session.type}</h3>
                    <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {session.date}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <BadgeCustom variant={session.score > 80 ? "success" : "warning"}>{session.score}%</BadgeCustom>
                  <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                </div>
              </div>
            ))}
            {displaySessions.length === 0 && (
              <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                <p className="text-neutral-500">No sessions yet. Start your first interview!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Learning */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Recommended</h2>
            <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
              Based on gaps
            </span>
          </div>
          <div className="space-y-4">
            {LEARNING_RESOURCES.slice(0, 3).map((resource) => (
              <CardCustom
                key={resource.id}
                className="p-5 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
              >
                <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
                  {resource.category}
                </div>
                <h4 className="font-semibold text-sm mb-2 leading-snug">{resource.title}</h4>
                <p className="text-xs text-neutral-500 mb-3">{resource.reason}</p>
                <div className="text-xs text-neutral-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {resource.duration}
                  </span>
                  <span>{resource.type}</span>
                </div>
              </CardCustom>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
