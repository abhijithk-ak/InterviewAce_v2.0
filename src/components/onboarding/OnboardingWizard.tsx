"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type OnboardingPayload } from "@/lib/onboarding/constants"
import ExperienceStep from "./steps/ExperienceStep"
import DomainsStep from "./steps/DomainsStep" 
import GoalsStep from "./steps/GoalsStep"
import ConfidenceStep from "./steps/ConfidenceStep"
import WeakAreasStep from "./steps/WeakAreasStep"

interface FormData {
  experienceLevel: string
  domains: string[]
  interviewGoals: string[]
  confidenceLevel: number
  weakAreas: string[]
}

const STEPS = [
  { title: "Experience Level", component: ExperienceStep },
  { title: "Technical Domains", component: DomainsStep },
  { title: "Interview Goals", component: GoalsStep },
  { title: "Confidence Level", component: ConfidenceStep },
  { title: "Areas to Improve", component: WeakAreasStep },
] as const

export default function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    experienceLevel: "",
    domains: [],
    interviewGoals: [],
    confidenceLevel: 3,
    weakAreas: [],
  })

  // Update form data for current step
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null) // Clear errors on input change
  }

  // Validate current step
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0: // Experience level
        return formData.experienceLevel.length > 0
      case 1: // Domains
        return formData.domains.length > 0
      case 2: // Goals
        return formData.interviewGoals.length > 0
      case 3: // Confidence
        return formData.confidenceLevel >= 1 && formData.confidenceLevel <= 5
      case 4: // Weak areas (optional)
        return true
      default:
        return false
    }
  }

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Submit onboarding form
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: OnboardingPayload = {
        experienceLevel: formData.experienceLevel as any,
        domains: formData.domains as any,
        interviewGoals: formData.interviewGoals as any,
        confidenceLevel: formData.confidenceLevel,
        weakAreas: formData.weakAreas as any,
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to save profile")
      }

      // Success - redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep].component
  const isLastStep = currentStep === STEPS.length - 1

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {STEPS[currentStep].title}
        </h2>
      </div>

      {/* Current step component */}
      <div className="mb-8">
        <CurrentStepComponent
          value={formData}
          onChange={updateFormData}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isStepValid() || isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Complete Setup"}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}