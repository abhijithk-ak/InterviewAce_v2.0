"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Download,
  Share2,
  Play,
  Clock,
  Target,
  TrendingUp,
  MessageSquare,
} from "lucide-react"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { BadgeCustom } from "@/components/ui-custom/badge-custom"
import { VIEW_TRANSITION, type Session } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

interface SessionReviewProps {
  session: Session | null
  onBack: () => void
}

export function SessionReview({ session, onBack }: SessionReviewProps) {
  const [activeTab, setActiveTab] = useState<"transcript" | "feedback" | "resources">("transcript")

  if (!session) return null

  const isPassing = session.score >= 70

  const improvements = []
  if (session.scores.technical < 80) {
    improvements.push({
      area: "Technical Depth",
      suggestion: "Practice explaining concepts in more detail",
      resource: "Deep Dive Technical Guides",
    })
  }
  if (session.scores.communication < 80) {
    improvements.push({
      area: "Communication",
      suggestion: "Use the STAR method for structuring answers",
      resource: "STAR Method Masterclass",
    })
  }
  if (session.scores.confidence < 80) {
    improvements.push({
      area: "Confidence",
      suggestion: "Practice with mock interviews to build confidence",
      resource: "Confidence Building Workshop",
    })
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{session.type} Interview</h1>
            <BadgeCustom variant={isPassing ? "success" : "warning"}>{isPassing ? "PASSED" : "NEEDS WORK"}</BadgeCustom>
          </div>
          <div className="flex items-center gap-4 text-neutral-500 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {session.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4" /> {session.role}
            </span>
            <span>{session.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ButtonCustom variant="secondary" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </ButtonCustom>
          <ButtonCustom variant="secondary" className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </ButtonCustom>
        </div>
      </header>

      {/* Score Overview */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <CardCustom className="md:col-span-1 p-6 bg-neutral-900 text-white dark:bg-white dark:text-black text-center">
          <div className="text-5xl font-bold mb-2">{session.score}</div>
          <div className="text-sm opacity-70">Overall Score</div>
        </CardCustom>
        <CardCustom className="p-5">
          <div className="text-sm text-neutral-500 mb-2">Technical</div>
          <div className="text-2xl font-bold mb-2">{session.scores.technical}%</div>
          <Progress value={session.scores.technical} className="h-2" />
        </CardCustom>
        <CardCustom className="p-5">
          <div className="text-sm text-neutral-500 mb-2">Communication</div>
          <div className="text-2xl font-bold mb-2">{session.scores.communication}%</div>
          <Progress value={session.scores.communication} className="h-2" />
        </CardCustom>
        <CardCustom className="p-5">
          <div className="text-sm text-neutral-500 mb-2">Confidence</div>
          <div className="text-2xl font-bold mb-2">{session.scores.confidence}%</div>
          <Progress value={session.scores.confidence} className="h-2" />
        </CardCustom>
        <CardCustom className="p-5">
          <div className="text-sm text-neutral-500 mb-2">Relevance</div>
          <div className="text-2xl font-bold mb-2">{session.scores.relevance}%</div>
          <Progress value={session.scores.relevance} className="h-2" />
        </CardCustom>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
        {[
          { id: "transcript", label: "Transcript", icon: MessageSquare },
          { id: "feedback", label: "Detailed Feedback", icon: TrendingUp },
          { id: "resources", label: "Recommended Resources", icon: Target },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "transcript" && (
        <div className="space-y-6">
          {session.transcript.length > 0 ? (
            session.transcript.map((item) => (
              <div key={item.id} className="space-y-4">
                <div
                  className={`p-5 rounded-xl ${
                    item.role === "assistant"
                      ? "bg-neutral-100 dark:bg-neutral-900"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 ml-8"
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wider">
                    {item.role === "assistant" ? "AI Interviewer" : "Your Response"}
                  </div>
                  <p className="text-sm leading-relaxed">{item.content}</p>
                </div>
                {item.feedback && (
                  <div className="ml-8 p-4 border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        Score: {item.feedback.score}/100
                      </span>
                    </div>
                    <div className="text-xs text-blue-800 dark:text-blue-400">
                      Strengths: {item.feedback.strengths.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <CardCustom className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Transcript Available</h3>
              <p className="text-neutral-500 text-sm">
                This session doesn{"'"}t have a saved transcript. Future sessions will save the full conversation.
              </p>
            </CardCustom>
          )}

          {/* Sample transcript for demo */}
          {session.transcript.length === 0 && (
            <div className="space-y-4 opacity-60">
              <div className="p-5 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
                <div className="text-xs font-bold text-neutral-500 mb-2 uppercase">AI Interviewer</div>
                <p className="text-sm">How would you handle state management in a large scale application?</p>
              </div>
              <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl ml-8">
                <div className="text-xs font-bold text-neutral-500 mb-2 uppercase">Your Response</div>
                <p className="text-sm">
                  I would probably use Redux or maybe Context API depending on the size. Redux is good for global
                  state...
                </p>
              </div>
              <div className="p-4 border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg ml-8 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">
                    Feedback: Be more specific
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    Your answer is correct but vague. Mention specific criteria for choosing one over the other.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "feedback" && (
        <div className="space-y-6">
          <CardCustom className="p-6">
            <h3 className="text-lg font-semibold mb-4">Overall Assessment</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{session.feedback}</p>
          </CardCustom>

          <div className="grid md:grid-cols-2 gap-6">
            <CardCustom className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> Strengths
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">+</span>
                  <span>Good understanding of core concepts</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">+</span>
                  <span>Clear communication style</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">+</span>
                  <span>Relevant examples from experience</span>
                </li>
              </ul>
            </CardCustom>

            <CardCustom className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" /> Areas to Improve
              </h3>
              <ul className="space-y-3">
                {improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-600 mt-1">!</span>
                    <div>
                      <span className="font-medium">{imp.area}:</span> {imp.suggestion}
                    </div>
                  </li>
                ))}
                {improvements.length === 0 && (
                  <li className="text-sm text-neutral-500">Great job! No major areas for improvement identified.</li>
                )}
              </ul>
            </CardCustom>
          </div>
        </div>
      )}

      {activeTab === "resources" && (
        <div className="grid md:grid-cols-2 gap-6">
          {improvements.map((imp, i) => (
            <CardCustom
              key={i}
              className="p-6 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
            >
              <BadgeCustom variant="default" className="mb-3">
                {imp.area}
              </BadgeCustom>
              <h3 className="text-lg font-semibold mb-2">{imp.resource}</h3>
              <p className="text-sm text-neutral-500 mb-4">{imp.suggestion}</p>
              <ButtonCustom variant="secondary" className="w-full gap-2">
                <Play className="w-4 h-4" /> Start Learning
              </ButtonCustom>
            </CardCustom>
          ))}
          {improvements.length === 0 && (
            <CardCustom className="md:col-span-2 p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Excellent Performance!</h3>
              <p className="text-neutral-500">
                You scored well across all areas. Keep practicing to maintain your skills.
              </p>
            </CardCustom>
          )}
        </div>
      )}
    </motion.div>
  )
}
