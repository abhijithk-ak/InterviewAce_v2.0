import { auth } from "@/lib/auth"
import { Card, CardHeader, CardContent } from "@/components/ui"
import { Button } from "@/components/ui"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Sparkles, Target, Trophy, TrendingUp } from "lucide-react"

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // For now, assume all users are new (Phase 1 - no DB queries yet)
  const isNewUser = true

  if (isNewUser) {
    // New user onboarding
    return (
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Welcome to InterviewAce! 👋
          </h1>
          <p className="text-lg text-neutral-600">
            Your AI-powered interview practice platform
          </p>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900">
              How It Works
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Choose Your Path
                </h3>
                <p className="text-sm text-neutral-600">
                  Select interview type, role, and difficulty level
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Practice Live
                </h3>
                <p className="text-sm text-neutral-600">
                  Answer realistic questions in real-time
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-3">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Get Insights
                </h3>
                <p className="text-sm text-neutral-600">
                  Receive AI-powered feedback to improve
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-600">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to start?
            </h3>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Launch your first mock interview session and practice with confidence
            </p>
            <Link href="/interview/setup">
              <Button 
                variant="primary" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
              >
                Start Your First Interview
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Existing user dashboard
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          Welcome back, {session.user?.name?.split(" ")[0]}
        </h1>
        <p className="text-neutral-600 mt-2">
          Ready to practice your next interview?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Total Sessions
                </p>
                <p className="text-3xl font-bold text-neutral-900">0</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Average Score
                </p>
                <p className="text-3xl font-bold text-neutral-900">—</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Improvement
                </p>
                <p className="text-3xl font-bold text-neutral-900">—</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Sessions</h2>
            <Link href="/interview/setup">
              <Button variant="primary">New Session</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No sessions yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Your interview sessions will appear here
            </p>
            <Link href="/interview/setup">
              <Button variant="outline">Start First Session</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
