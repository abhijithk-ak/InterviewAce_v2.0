"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, Button } from "@/components/ui"
import { Briefcase, Code, Users, FileText, ChevronDown } from "lucide-react"

type InterviewConfig = {
  role: string
  type: "Technical" | "Behavioral" | "System Design" | "HR"
  difficulty: "Easy" | "Medium" | "Hard"
}

const SPECIALIZED_ROLES = [
  { value: "Flutter Developer", label: "Flutter Developer", category: "Mobile" },
  { value: "Mobile Developer", label: "Mobile Developer (React Native/iOS/Android)", category: "Mobile" },
  { value: "Frontend Developer", label: "Frontend Developer", category: "Web" },
  { value: "Backend Developer", label: "Backend Developer (Node.js/Python)", category: "Web" },
  { value: "Backend Java Developer", label: "Backend Java Developer (Spring Boot)", category: "Web" },
  { value: "Fullstack Developer", label: "Fullstack Developer", category: "Web" },
  { value: "DevOps Engineer", label: "DevOps Engineer", category: "Infrastructure" },
  { value: "Data Engineer", label: "Data Engineer", category: "Data" },
  { value: "Data Scientist", label: "Data Scientist", category: "Data" },
  { value:"Data Analyst", label: "Data Analyst", category: "Data" },
  { value: "ML Engineer", label: "ML Engineer", category: "Data" },
  { value: "QA Engineer", label: "QA Engineer", category: "Testing" },
  { value: "Technical Support Engineer", label: "Technical Support Engineer", category: "Support" },
  { value: "System Design Specialist", label: "System Design Specialist", category: "Architecture" },
]

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
  const [customRole, setCustomRole] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleRoleChange = (value: string) => {
    if (value === "other") {
      setShowCustomInput(true)
      setConfig({ ...config, role: customRole })
    } else {
      setShowCustomInput(false)
      setCustomRole("")
      setConfig({ ...config, role: value })
    }
  }

  const handleCustomRoleChange = (value: string) => {
    setCustomRole(value)
    setConfig({ ...config, role: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!config.role.trim()) {
      alert("Please select or enter a role")
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
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-white mb-3">
                  Target Role
                  <span className="ml-2 text-xs text-neutral-400 font-normal">
                    (13+ specialized roles)
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={showCustomInput ? "other" : config.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[15px] text-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-neutral-700 text-neutral-400">
                      Select a role...
                    </option>
                    <optgroup label="Mobile Development" className="bg-neutral-800">
                      {SPECIALIZED_ROLES.filter(r => r.category === "Mobile").map(role => (
                        <option key={role.value} value={role.value} className="bg-neutral-700 text-white py-2">
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Web Development" className="bg-neutral-800">
                      {SPECIALIZED_ROLES.filter(r => r.category === "Web").map(role => (
                        <option key={role.value} value={role.value} className="bg-neutral-700 text-white py-2">
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Data & ML" className="bg-neutral-800">
                      {SPECIALIZED_ROLES.filter(r => r.category === "Data").map(role => (
                        <option key={role.value} value={role.value} className="bg-neutral-700 text-white py-2">
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Infrastructure & DevOps" className="bg-neutral-800">
                      {SPECIALIZED_ROLES.filter(r => r.category === "Infrastructure").map(role => (
                        <option key={role.value} value={role.value} className="bg-neutral-700 text-white py-2">
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Testing & QA" className="bg-neutral-800">
                      {SPECIALIZED_ROLES.filter(r => r.category === "Testing").map(role => (
                        <option key={role.value} value={role.value} className="bg-neutral-700 text-white py-2">
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Support" className="bg-neutral-800">
                      {SPECIALIZED_ROLES.filter(r => r.category === "Support").map(role => (
                        <option key={role.value} value={role.value} className="bg-neutral-700 text-white py-2">
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Architecture" className="bg-neutral-800">
                      {SPECIALIZED_ROLES.filter(r => r.category === "Architecture").map(role => (
                        <option key={role.value} value={role.value} className="bg-neutral-700 text-white py-2">
                          {role.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other" className="bg-neutral-800">
                      <option value="other" className="bg-neutral-700 text-white py-2">
                        Other (Enter custom role)
                      </option>
                    </optgroup>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                </div>
                
                {/* Custom Role Input */}
                {showCustomInput && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => handleCustomRoleChange(e.target.value)}
                      placeholder="Enter your role (e.g., Solutions Architect, Product Manager)"
                      className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[15px] text-white placeholder-neutral-400"
                      autoFocus
                    />
                  </div>
                )}
                
                <p className="mt-2 text-xs text-neutral-400">
                  {showCustomInput 
                    ? "Enter your specific role for tailored interview questions"
                    : `Select from ${SPECIALIZED_ROLES.length} specialized roles with role-specific questions and evaluation`
                  }
                </p>
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
