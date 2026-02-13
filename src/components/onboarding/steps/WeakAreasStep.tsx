import { WEAK_AREAS } from "@/lib/onboarding/constants"

interface WeakAreasStepProps {
  value: { weakAreas: string[] }
  onChange: (field: string, value: string[]) => void
}

const WEAK_AREA_LABELS: Record<string, { label: string; description: string }> = {
  "algorithm-design": { label: "Algorithm Design", description: "Creating efficient algorithms" },
  "system-architecture": { label: "System Architecture", description: "Designing scalable systems" },
  "code-optimization": { label: "Code Optimization", description: "Writing efficient, clean code" },
  "database-design": { label: "Database Design", description: "Schema design and queries" },
  "api-design": { label: "API Design", description: "RESTful APIs and interfaces" },
  "testing-strategies": { label: "Testing Strategies", description: "Unit, integration, and E2E testing" },
  "debugging-skills": { label: "Debugging Skills", description: "Finding and fixing issues" },
  "communication-clarity": { label: "Communication Clarity", description: "Explaining technical concepts clearly" },
  "confidence-building": { label: "Confidence Building", description: "Overcoming interview anxiety" },
  "time-management": { label: "Time Management", description: "Solving problems under pressure" },
}

export default function WeakAreasStep({ value, onChange }: WeakAreasStepProps) {
  const toggleWeakArea = (area: string) => {
    const newAreas = value.weakAreas.includes(area)
      ? value.weakAreas.filter(a => a !== area)
      : [...value.weakAreas, area]
    
    onChange("weakAreas", newAreas)
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Which areas would you like to focus on improving? (optional)
        </p>
        <p className="text-sm text-gray-500">
          This helps us provide targeted feedback and practice suggestions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {WEAK_AREAS.map((area) => {
          const areaInfo = WEAK_AREA_LABELS[area] || { label: area, description: "" }
          const isSelected = value.weakAreas.includes(area)
          
          return (
            <label
              key={area}
              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleWeakArea(area)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {areaInfo.label}
                </div>
                <div className="text-sm text-gray-500">
                  {areaInfo.description}
                </div>
              </div>
            </label>
          )
        })}
      </div>
      
      {value.weakAreas.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Selected {value.weakAreas.length} area{value.weakAreas.length !== 1 ? 's' : ''} for improvement
        </p>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> You can always update these preferences later in your settings
        </p>
      </div>
    </div>
  )
}