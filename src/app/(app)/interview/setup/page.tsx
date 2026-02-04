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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Start New Interview</h1>
        <p className="text-neutral-600 mt-2">
          Configure your practice session
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-neutral-900 mb-3">
                Target Role
              </label>
              <input
                id="role"
                type="text"
                value={config.role}
                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[15px]"
              />
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
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
                          ? "border-blue-600 bg-blue-50"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-blue-600" : "text-neutral-600"}`} />
                      <div className={`font-semibold text-sm mb-1 ${isSelected ? "text-blue-900" : "text-neutral-900"}`}>
                        {type.label}
                      </div>
                      <div className={`text-xs ${isSelected ? "text-blue-700" : "text-neutral-600"}`}>
                        {type.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-3">
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
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Start Interview
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
