import { getServerSession } from "next-auth/next"
import { authConfig } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectDB } from "@/lib/db"
import { UserProfileModel } from "@/lib/db/models/UserProfile"
import OnboardingWizard from "@/components/onboarding/OnboardingWizard"

/**
 * Protected Onboarding Page
 * Server-side gatekeeping with no hydration risks
 */

export default async function OnboardingPage() {
  // Server-side authentication check
  const session = await getServerSession(authConfig)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Server-side onboarding status check
  let onboardingCompleted = false
  
  try {
    await connectDB()
    const profile = await UserProfileModel.findOne({
      userId: session.user.email,
    }).exec()
    
    onboardingCompleted = profile?.onboardingCompleted || false
  } catch (error) {
    console.error("Failed to fetch onboarding status:", error)
    // If DB fails, allow onboarding to proceed
    onboardingCompleted = false
  }

  // Redirect completed users to dashboard
  if (onboardingCompleted) {
    redirect("/dashboard")
  }

  // Render onboarding wizard for new users
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to InterviewAce
          </h1>
          <p className="text-lg text-gray-600">
            Let's personalize your interview experience
          </p>
        </div>
        
        <OnboardingWizard />
      </div>
    </div>
  )
}