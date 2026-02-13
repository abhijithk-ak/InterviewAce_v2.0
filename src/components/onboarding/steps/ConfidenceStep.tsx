interface ConfidenceStepProps {
  value: { confidenceLevel: number }
  onChange: (field: string, value: number) => void
}

const CONFIDENCE_LABELS = [
  { value: 1, label: "Not Confident", description: "I'm new to technical interviews" },
  { value: 2, label: "Slightly Confident", description: "I have some experience but need practice" },
  { value: 3, label: "Moderately Confident", description: "I'm comfortable with basic questions" },
  { value: 4, label: "Very Confident", description: "I handle most interview questions well" },
  { value: 5, label: "Extremely Confident", description: "I excel in technical interviews" },
]

export default function ConfidenceStep({ value, onChange }: ConfidenceStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-6">
        How confident do you feel about technical interviews?
      </p>
      
      <div className="space-y-4">
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Confidence Level</span>
            <span className="text-lg font-bold text-blue-600">{value.confidenceLevel}/5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={value.confidenceLevel}
            onChange={(e) => onChange("confidenceLevel", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        <div className="space-y-3">
          {CONFIDENCE_LABELS.map((level) => (
            <label
              key={level.value}
              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                value.confidenceLevel === level.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="confidenceLevel"
                value={level.value}
                checked={value.confidenceLevel === level.value}
                onChange={(e) => onChange("confidenceLevel", parseInt(e.target.value))}
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}