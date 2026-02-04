"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, ChevronRight, Clock, Target, Zap, Shuffle } from "lucide-react"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { BadgeCustom } from "@/components/ui-custom/badge-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { VIEW_TRANSITION, QUESTION_BANK } from "@/lib/data"

export function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const categories = ["All", "Technical", "Behavioral", "System Design", "HR", "Problem-Solving"]
  const difficulties = ["All", "Easy", "Medium", "Hard"]

  const filteredQuestions = QUESTION_BANK.filter((q) => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
    setExpandedQuestion(filteredQuestions[randomIndex]?.id || null)
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="max-w-5xl mx-auto space-y-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">Question Bank</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          Browse curated interview questions organized by category, role, and difficulty.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
          />
        </div>
        <ButtonCustom onClick={getRandomQuestion} variant="secondary" className="gap-2">
          <Shuffle className="w-4 h-4" /> Random Question
        </ButtonCustom>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Filter className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-500">Category:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Zap className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-500">Difficulty:</span>
        </div>
        {difficulties.map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedDifficulty === diff
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">{filteredQuestions.length} questions found</span>
        </div>

        {filteredQuestions.map((question) => (
          <CardCustom
            key={question.id}
            className={`p-6 cursor-pointer transition-all ${
              expandedQuestion === question.id ? "ring-2 ring-neutral-900 dark:ring-white" : ""
            }`}
            onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCustom variant="default">{question.category}</BadgeCustom>
                  <BadgeCustom
                    variant={
                      question.difficulty === "Easy"
                        ? "success"
                        : question.difficulty === "Hard"
                          ? "warning"
                          : "default"
                    }
                  >
                    {question.difficulty}
                  </BadgeCustom>
                  <span className="text-xs text-neutral-400">{question.role}</span>
                </div>
                <p className="font-medium text-neutral-900 dark:text-white">{question.text}</p>
              </div>
              <div className="shrink-0">
                {expandedQuestion === question.id ? (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                )}
              </div>
            </div>

            {expandedQuestion === question.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4"
              >
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Expected Duration
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Clock className="w-4 h-4" />
                    <span>{question.expectedDuration} minutes</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Follow-up Questions
                  </h4>
                  <ul className="space-y-2">
                    {question.followUps.map((followUp, i) => (
                      <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                        <span className="text-neutral-400">{i + 1}.</span>
                        {followUp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    <Target className="w-4 h-4 inline mr-1" />
                    Evaluation Criteria
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {question.evaluationCriteria.map((criteria, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-600 dark:text-neutral-400"
                      >
                        {criteria}
                      </span>
                    ))}
                  </div>
                </div>

                <ButtonCustom variant="secondary" className="w-full mt-4">
                  Practice This Question
                </ButtonCustom>
              </motion.div>
            )}
          </CardCustom>
        ))}
      </div>
    </motion.div>
  )
}
