"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, Button } from "@/components/ui"
import { Briefcase, Code, Users, FileText } from "lucide-react"

type InterviewConfig = {
  role: string
  type: "Technical" | "Behavioral" | "System Design" | "HR"
  difficulty: "Easy" | "Medium" | "Hard"
}

const INTERVIEW_TYPES = [
  { value: "Technical", icon: Code, label: "Technical", description: "Coding & problem solving" },
  { value: "Behavioral", icon: Users, label: "Behavioral", description: "Past experiences & situations" },
  { value: "System Design", icon: FileText, label: "System Design", description: "Architecture & scalability" },
  { value: "HR", icon: Briefcase, label: "HR", description: "Culture fit & background" },
]

export default function InterviewSetup() {
  const router = useRouter()
  const [config, setConfig] = useState<InterviewConfig>({
    role: "",
    type: "Technical",
    difficulty: "Medium",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!config.role.trim()) {
      alert("Please enter a role")
      return
    }
    
    // Store config in sessionStorage for the interview
    sessionStorage.setItem("interviewConfig", JSON.stringify(config))
    router.push("/interview/session")
  }

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="max-w-3xl mx-auto p-6 pt-14">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Start New Interview</h1>
          <p className="text-neutral-400 mt-2">
            Configure your practice session
          </p>
        </div>

        <div className="bg-neutral-800 rounded-lg border border-neutral-700">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-white mb-3">
                  Target Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={config.role}
                  onChange={(e) => setConfig({ ...config, role: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[15px] text-white placeholder-neutral-400"
                />
              </div>

              {/* Interview Type */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Interview Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {INTERVIEW_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = config.type === type.value
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setConfig({ ...config, type: type.value as InterviewConfig["type"] })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-blue-600 bg-blue-900/20"
                            : "border-neutral-600 hover:border-neutral-500 bg-neutral-700"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-blue-400" : "text-neutral-400"}`} />
                        <div className={`font-semibold text-sm mb-1 ${isSelected ? "text-blue-300" : "text-white"}`}>
                          {type.label}
                        </div>
                        <div className={`text-xs ${isSelected ? "text-blue-400" : "text-neutral-400"}`}>
                          {type.description}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Difficulty Level
                </label>
                <div className="flex gap-3">
                  {["Easy", "Medium", "Hard"].map((level) => {
                    const isSelected = config.difficulty === level
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setConfig({ ...config, difficulty: level as InterviewConfig["difficulty"] })}
                        className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-neutral-600 text-neutral-300 hover:border-neutral-500 bg-neutral-700"
                        }`}
                      >
                        {level}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-neutral-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Start Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
