"use client"

import { useMemo, useState } from "react"
import { Search, BookOpen, Target, Code, Users, Settings, Filter } from "lucide-react"
import type { Question } from "@/lib/questions/bank"

type Props = {
  questions: Question[]
}

export function QuestionBankClient({ questions }: Props) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | Question["category"]>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | Question["difficulty"]>("all")
  const [roleFilter, setRoleFilter] = useState<"all" | Question["role"]>("all")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return questions.filter((question) => {
      const matchesSearch =
        q.length === 0 ||
        question.text.toLowerCase().includes(q) ||
        question.id.toLowerCase().includes(q) ||
        (question.sampleAnswer || "").toLowerCase().includes(q)

      const matchesCategory = categoryFilter === "all" || question.category === categoryFilter
      const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter
      const matchesRole = roleFilter === "all" || question.role === roleFilter

      return matchesSearch && matchesCategory && matchesDifficulty && matchesRole
    })
  }, [questions, search, categoryFilter, difficultyFilter, roleFilter])

  const grouped = useMemo(() => {
    return {
      technical: filtered.filter((q) => q.category === "technical"),
      behavioral: filtered.filter((q) => q.category === "behavioral"),
      hr: filtered.filter((q) => q.category === "hr"),
      "system-design": filtered.filter((q) => q.category === "system-design"),
    }
  }, [filtered])

  const stats = {
    total: questions.length,
    technical: questions.filter((q) => q.category === "technical").length,
    behavioral: questions.filter((q) => q.category === "behavioral").length,
    hr: questions.filter((q) => q.category === "hr").length,
    systemDesign: questions.filter((q) => q.category === "system-design").length,
  }

  const roles = Array.from(new Set(questions.map((q) => q.role))).sort()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return Code
      case "behavioral":
        return Users
      case "hr":
        return Target
      case "system-design":
        return Settings
      default:
        return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-900/30 text-blue-300 border border-blue-600/30"
      case "behavioral":
        return "bg-green-900/30 text-green-300 border border-green-600/30"
      case "hr":
        return "bg-purple-900/30 text-purple-300 border border-purple-600/30"
      case "system-design":
        return "bg-orange-900/30 text-orange-300 border border-orange-600/30"
      default:
        return "bg-neutral-700 text-neutral-300 border border-neutral-600"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-900/30 text-green-300 border border-green-600/30"
      case "medium":
        return "bg-yellow-900/30 text-yellow-300 border border-yellow-600/30"
      case "hard":
        return "bg-red-900/30 text-red-300 border border-red-600/30"
      default:
        return "bg-neutral-700 text-neutral-300 border border-neutral-600"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "frontend":
        return "bg-cyan-900/30 text-cyan-300 border border-cyan-600/30"
      case "backend":
        return "bg-indigo-900/30 text-indigo-300 border border-indigo-600/30"
      case "fullstack":
        return "bg-pink-900/30 text-pink-300 border border-pink-600/30"
      case "general":
        return "bg-neutral-700 text-neutral-300 border border-neutral-600"
      default:
        return "bg-neutral-700 text-neutral-300 border border-neutral-600"
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            Question Bank
          </h1>
          <p className="text-neutral-400 mb-6">
            Browse and practice with {stats.total} curated interview questions
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-neutral-400">Total Questions</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
              <div className="text-xl font-bold text-blue-300">{stats.technical}</div>
              <div className="text-sm text-neutral-400">Technical</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
              <div className="text-xl font-bold text-green-300">{stats.behavioral}</div>
              <div className="text-sm text-neutral-400">Behavioral</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
              <div className="text-xl font-bold text-purple-300">{stats.hr}</div>
              <div className="text-sm text-neutral-400">HR</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
              <div className="text-xl font-bold text-orange-300">{stats.systemDesign}</div>
              <div className="text-sm text-neutral-400">System Design</div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-4 text-neutral-200 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions or answers"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="hr">HR</option>
              <option value="system-design">System Design</option>
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-neutral-500 mt-3">Showing {filtered.length} matching questions</p>
        </div>

        <div className="space-y-12">
          {(["technical", "behavioral", "hr", "system-design"] as const).map((category) => {
            const categoryQuestions = grouped[category]
            const CategoryIcon = getCategoryIcon(category)
            if (categoryQuestions.length === 0) return null

            return (
              <div key={category}>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3 capitalize">
                    <CategoryIcon className="h-6 w-6 text-blue-400" />
                    {category.replace("-", " ")} Questions ({categoryQuestions.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryQuestions.map((question) => {
                    const QuestionCategoryIcon = getCategoryIcon(question.category)
                    return (
                      <div
                        key={question.id}
                        className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <QuestionCategoryIcon className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-medium text-neutral-400">{question.id}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                            {question.category.replace("-", " ")}
                          </span>
                        </div>

                        <p className="text-white mb-4 leading-relaxed">{question.text}</p>

                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(question.role)}`}>
                            {question.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        </div>

                        <details className="mt-4 rounded-lg border border-neutral-700 bg-neutral-900/40">
                          <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-blue-300 hover:text-blue-200">
                            View Suggested Answer
                          </summary>
                          <div className="px-3 pb-3">
                            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                              {question.sampleAnswer || "Suggested answer will be added soon for this question."}
                            </p>
                          </div>
                        </details>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-10 bg-neutral-800 border border-neutral-700 rounded-lg">
              <p className="text-neutral-300">No questions match these filters.</p>
              <p className="text-neutral-500 text-sm mt-1">Try resetting search or selecting broader filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
