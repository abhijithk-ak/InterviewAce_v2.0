import { AVAILABLE_DOMAINS } from "@/lib/onboarding/constants"

interface DomainsStepProps {
  value: { domains: string[] }
  onChange: (field: string, value: string[]) => void
}

const DOMAIN_LABELS: Record<string, { label: string; description: string }> = {
  "frontend": { label: "Frontend", description: "React, Vue, Angular, UI/UX" },
  "backend": { label: "Backend", description: "APIs, databases, server logic" },
  "fullstack": { label: "Full Stack", description: "End-to-end development" },
  "data-science": { label: "Data Science", description: "Analytics, ML, statistics" },
  "devops": { label: "DevOps", description: "CI/CD, infrastructure, deployment" },
  "mobile": { label: "Mobile", description: "iOS, Android, React Native" },
  "machine-learning": { label: "Machine Learning", description: "AI, neural networks, models" },
  "system-design": { label: "System Design", description: "Architecture, scalability" },
  "cybersecurity": { label: "Cybersecurity", description: "Security, encryption, compliance" },
  "cloud": { label: "Cloud", description: "AWS, Azure, GCP, serverless" },
}

export default function DomainsStep({ value, onChange }: DomainsStepProps) {
  const toggleDomain = (domain: string) => {
    const newDomains = value.domains.includes(domain)
      ? value.domains.filter(d => d !== domain)
      : [...value.domains, domain]
    
    onChange("domains", newDomains)
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-6">
        Select your areas of interest (choose up to 5)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AVAILABLE_DOMAINS.map((domain) => {
          const domainInfo = DOMAIN_LABELS[domain] || { label: domain, description: "" }
          const isSelected = value.domains.includes(domain)
          const isDisabled = !isSelected && value.domains.length >= 5
          
          return (
            <label
              key={domain}
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
                onChange={() => !isDisabled && toggleDomain(domain)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {domainInfo.label}
                </div>
                <div className="text-sm text-gray-500">
                  {domainInfo.description}
                </div>
              </div>
            </label>
          )
        })}
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        Selected: {value.domains.length}/5
      </p>
    </div>
  )
}