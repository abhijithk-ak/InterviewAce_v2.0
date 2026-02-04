import { auth } from "@/lib/auth"
import { Card, CardHeader, CardContent } from "@/components/ui"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui"
import { BarChart2, TrendingUp, Award, Target } from "lucide-react"

export default async function AnalyticsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
        <p className="text-neutral-600 mt-2">
          Track your interview performance and progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Performance Trends</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                <BarChart2 className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-neutral-600 mb-4">
                Complete interviews to see performance trends
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Skills Breakdown</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-neutral-600 mb-4">
                Track your strongest and weakest areas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="mt-6 border-dashed">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No data yet
          </h3>
          <p className="text-neutral-600 mb-6">
            Complete your first interview to unlock detailed analytics and insights
          </p>
          <Link href="/interview/setup">
            <Button variant="primary">Start Interview</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
