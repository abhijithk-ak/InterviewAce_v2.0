import { INTERVIEW_GOALS } from "@/lib/onboarding/constants"

interface GoalsStepProps {
  value: { interviewGoals: string[] }
  onChange: (field: string, value: string[]) => void
}

const GOAL_LABELS: Record<string, { label: string; description: string }> = {
  "practice-technical-skills": { label: "Practice Technical Skills", description: "Coding, algorithms, problem-solving" },
  "improve-communication": { label: "Improve Communication", description: "Explain solutions clearly and confidently" },
  "prepare-for-job-interviews": { label: "Job Interview Preparation", description: "Get ready for real interviews" },
  "build-confidence": { label: "Build Confidence", description: "Overcome interview anxiety" },
  "learn-new-concepts": { label: "Learn New Concepts", description: "Expand technical knowledge" },
  "benchmark-skills": { label: "Benchmark Skills", description: "Assess current skill level" },
  "get-feedback": { label: "Get Feedback", description: "Receive detailed performance analysis" },
  "mock-interview-practice": { label: "Mock Interview Practice", description: "Realistic interview simulation" },
}

export default function GoalsStep({ value, onChange }: GoalsStepProps) {
  const toggleGoal = (goal: string) => {
    const newGoals = value.interviewGoals.includes(goal)
      ? value.interviewGoals.filter(g => g !== goal)
      : [...value.interviewGoals, goal]
    
    onChange("interviewGoals", newGoals)
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-6">
        What do you want to achieve with InterviewAce? (choose up to 5)
      </p>
      
      <div className="space-y-3">
        {INTERVIEW_GOALS.map((goal) => {
          const goalInfo = GOAL_LABELS[goal] || { label: goal, description: "" }
          const isSelected = value.interviewGoals.includes(goal)
          const isDisabled = !isSelected && value.interviewGoals.length >= 5
          
          return (
            <label
              key={goal}
              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isDisabled
                  ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => !isDisabled && toggleGoal(goal)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {goalInfo.label}
                </div>
                <div className="text-sm text-gray-500">
                  {goalInfo.description}
                </div>
              </div>
            </label>
          )
        })}
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        Selected: {value.interviewGoals.length}/5
      </p>
    </div>
  )
}