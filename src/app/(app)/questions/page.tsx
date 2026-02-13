import { Search, Filter, BookOpen, Target, Code, Users, Settings } from "lucide-react"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { QUESTION_BANK } from "@/lib/questions/bank"

type Question = {
  id: string
  category: "technical" | "behavioral" | "hr" | "system-design"
  role: "frontend" | "backend" | "fullstack" | "general"
  difficulty: "easy" | "medium" | "hard"
  text: string
}

export default async function QuestionBankPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/login')
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical": return Code
      case "behavioral": return Users
      case "hr": return Target
      case "system-design": return Settings
      default: return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical": return "bg-blue-900/30 text-blue-300 border border-blue-600/30"
      case "behavioral": return "bg-green-900/30 text-green-300 border border-green-600/30"
      case "hr": return "bg-purple-900/30 text-purple-300 border border-purple-600/30"
      case "system-design": return "bg-orange-900/30 text-orange-300 border border-orange-600/30"
      default: return "bg-neutral-700 text-neutral-300 border border-neutral-600"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-900/30 text-green-300 border border-green-600/30"
      case "medium": return "bg-yellow-900/30 text-yellow-300 border border-yellow-600/30"
      case "hard": return "bg-red-900/30 text-red-300 border border-red-600/30"
      default: return "bg-neutral-700 text-neutral-300 border border-neutral-600"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "frontend": return "bg-cyan-900/30 text-cyan-300 border border-cyan-600/30"
      case "backend": return "bg-indigo-900/30 text-indigo-300 border border-indigo-600/30"
      case "fullstack": return "bg-pink-900/30 text-pink-300 border border-pink-600/30"
      case "general": return "bg-neutral-700 text-neutral-300 border border-neutral-600"
      default: return "bg-neutral-700 text-neutral-300 border border-neutral-600"
    }
  }

  // Get stats for the header
  const stats = {
    total: QUESTION_BANK.length,
    technical: QUESTION_BANK.filter(q => q.category === 'technical').length,
    behavioral: QUESTION_BANK.filter(q => q.category === 'behavioral').length,
    hr: QUESTION_BANK.filter(q => q.category === 'hr').length,
    systemDesign: QUESTION_BANK.filter(q => q.category === 'system-design').length
  }

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            Question Bank
          </h1>
          <p className="text-neutral-400 mb-6">
            Browse and practice with {stats.total} curated interview questions
          </p>
          
          {/* Stats Overview */}
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

        {/* Questions by Category */}
        <div className="space-y-12">
          {['technical', 'behavioral', 'hr', 'system-design'].map((category) => {
            const categoryQuestions = QUESTION_BANK.filter(q => q.category === category)
            const CategoryIcon = getCategoryIcon(category)
            
            if (categoryQuestions.length === 0) return null

            return (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3 capitalize">
                    <CategoryIcon className="h-6 w-6 text-blue-400" />
                    {category.replace('-', ' ')} Questions ({categoryQuestions.length})
                  </h2>
                  <p className="text-neutral-400 text-sm">
                    {category === 'technical' && "Algorithm, data structures, and system architecture questions"}
                    {category === 'behavioral' && "Experience, teamwork, and problem-solving scenarios"}
                    {category === 'hr' && "Company culture, career goals, and personal motivation"}
                    {category === 'system-design' && "Large-scale system architecture and scalability"}
                  </p>
                </div>

                {/* Questions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryQuestions.map((question) => {
                    const QuestionCategoryIcon = getCategoryIcon(question.category)
                    return (
                      <div key={question.id} className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <QuestionCategoryIcon className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-medium text-neutral-400">
                              {question.id}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                              {question.category.replace('-', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Question Text */}
                        <p className="text-white mb-4 leading-relaxed">
                          {question.text}
                        </p>

                        {/* Question Metadata */}
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(question.role)}`}>
                            {question.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}