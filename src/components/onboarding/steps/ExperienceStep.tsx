import { EXPERIENCE_LEVELS } from "@/lib/onboarding/constants"

interface ExperienceStepProps {
  value: { experienceLevel: string }
  onChange: (field: string, value: string) => void
}

export default function ExperienceStep({ value, onChange }: ExperienceStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-6">
        Help us calibrate the difficulty of your interviews
      </p>
      
      <div className="space-y-3">
        {EXPERIENCE_LEVELS.map((level) => (
          <label
            key={level.value}
            className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name="experienceLevel"
              value={level.value}
              checked={value.experienceLevel === level.value}
              onChange={(e) => onChange("experienceLevel", e.target.value)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {level.label}
              </div>
              <div className="text-sm text-gray-500">
                {level.description}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}