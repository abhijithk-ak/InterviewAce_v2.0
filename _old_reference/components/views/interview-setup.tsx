"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Sparkles, Clock, Target, Zap, Building, FileText, Loader2 } from "lucide-react"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { VIEW_TRANSITION, type InterviewConfig, QUESTION_BANK } from "@/lib/data"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface InterviewSetupProps {
  onStart: (config: InterviewConfig) => void
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [selectedRole, setSelectedRole] = useState("Frontend")
  const [selectedType, setSelectedType] = useState("Technical")
  const [difficulty, setDifficulty] = useState("Mid-Level")
  const [focusArea, setFocusArea] = useState("")
  const [company, setCompany] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [questionCount, setQuestionCount] = useState([5])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const relevantQuestions = QUESTION_BANK.filter(
    (q) =>
      (q.role === selectedRole || q.role === "All") &&
      (q.category === selectedType || selectedType === "Technical") &&
      (difficulty === "Junior / Intern"
        ? q.difficulty === "Easy"
        : difficulty === "Senior / Lead"
          ? q.difficulty === "Hard"
          : true),
  ).slice(0, 3)

  const handleStart = async () => {
    setIsGenerating(true)

    const config = {
      role: selectedRole,
      type: selectedType,
      difficulty,
      focusArea,
      questionCount: questionCount[0],
      company,
      jobDescription,
    }

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const data = await response.json()

      onStart({
        ...config,
        questions: data.questions,
      })
    } catch (error) {
      console.error("Error generating questions:", error)
      // Fallback to start without pre-generated questions (AI will generate on the fly)
      onStart(config)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="max-w-5xl mx-auto pt-4">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Configure Session</h2>
        <p className="text-neutral-500 text-lg">
          Customize your mock interview parameters for the best practice experience.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2">
          <CardCustom className="space-y-10 p-8">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                Target Role
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Frontend", "Backend", "Full Stack", "Product Mgr", "Data Science", "System Design"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 text-sm rounded-xl border text-left transition-all flex justify-between items-center ${selectedRole === role
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600"
                      }`}
                  >
                    <span>{role}</span>
                    {selectedRole === role && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                  <Target className="w-4 h-4 inline mr-2" />
                  Interview Type
                </label>
                <div className="flex flex-col gap-3">
                  {[
                    { type: "Technical", desc: "Coding & architecture questions" },
                    { type: "Behavioral", desc: "Situational & experience based" },
                    { type: "System Design", desc: "Architecture & scalability" },
                    { type: "HR Screen", desc: "Culture fit & background" },
                  ].map(({ type, desc }) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 text-sm rounded-xl border text-left transition-all ${selectedType === type
                          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{type}</div>
                          <div className={`text-xs mt-1 ${selectedType === type ? "opacity-70" : "text-neutral-400"}`}>
                            {desc}
                          </div>
                        </div>
                        {selectedType === type && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Difficulty
                </label>
                <div className="flex flex-col gap-3">
                  {[
                    { diff: "Junior / Intern", time: "~20 min", questions: "3-5" },
                    { diff: "Mid-Level", time: "~30 min", questions: "5-7" },
                    { diff: "Senior / Lead", time: "~45 min", questions: "7-10" },
                  ].map(({ diff, time, questions }) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`p-4 text-sm rounded-xl border text-left transition-all ${difficulty === diff
                          ? "border-neutral-900 bg-neutral-100 text-neutral-900 dark:border-white dark:bg-neutral-800 dark:text-white"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{diff}</span>
                          <div className="text-xs mt-1 text-neutral-400">{questions} questions</div>
                        </div>
                        <span className="text-xs flex items-center gap-1 opacity-60">
                          <Clock className="w-3 h-3" /> {time}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Focus Area */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Focus Area (Optional)
              </label>
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="e.g. 'React Hooks' or 'Database Sharding' or 'Leadership scenarios'"
                className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
              />
            </div>

            {/* Advanced Options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Options
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                      <Building className="w-4 h-4 inline mr-2" />
                      Target Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Google, Meta, Startup"
                      className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Job Description (Optional)
                    </label>
                    <Textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here for tailored questions..."
                      className="min-h-[120px] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                      Number of Questions: {questionCount[0]}
                    </label>
                    <Slider
                      value={questionCount}
                      onValueChange={setQuestionCount}
                      min={3}
                      max={15}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-neutral-400 mt-2">
                      <span>Quick (3)</span>
                      <span>Standard (7)</span>
                      <span>Comprehensive (15)</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="pt-6 flex justify-end border-t border-neutral-100 dark:border-neutral-800">
              <ButtonCustom
                onClick={handleStart}
                disabled={isGenerating}
                className="w-full md:w-auto px-10 py-4 text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  "Start Simulation"
                )}
              </ButtonCustom>
            </div>
          </CardCustom>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <CardCustom className="p-6">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Session Preview</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Role</span>
                <span className="font-medium">{selectedRole}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Type</span>
                <span className="font-medium">{selectedType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Difficulty</span>
                <span className="font-medium">{difficulty}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Est. Duration</span>
                <span className="font-medium">
                  {difficulty === "Junior / Intern"
                    ? "~20 min"
                    : difficulty === "Senior / Lead"
                      ? "~45 min"
                      : "~30 min"}
                </span>
              </div>
              {focusArea && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Focus</span>
                  <span className="font-medium truncate max-w-[150px]">{focusArea}</span>
                </div>
              )}
            </div>
          </CardCustom>

          <CardCustom className="p-6">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Sample Questions</h3>
            <div className="space-y-4">
              {relevantQuestions.map((q, i) => (
                <div key={q.id} className="text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-neutral-400 font-mono">{i + 1}.</span>
                    <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">{q.text}</p>
                  </div>
                </div>
              ))}
              {relevantQuestions.length === 0 && (
                <p className="text-sm text-neutral-500 italic">AI will generate custom questions</p>
              )}
            </div>
          </CardCustom>
        </div>
      </div>
    </motion.div>
  )
}
