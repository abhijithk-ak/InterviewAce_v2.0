import { auth } from "@/lib/auth"
import { Card, CardHeader, CardContent } from "@/components/ui"
import { redirect } from "next/navigation"
import { User, Mail, Bell, Shield } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-neutral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Account</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <User className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Name
                  </label>
                  <div className="text-neutral-900">{session.user?.name}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Mail className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email
                  </label>
                  <div className="text-neutral-900">{session.user?.email}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-neutral-600" />
              <h2 className="text-lg font-semibold text-neutral-900">Preferences</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full mb-3">
                <Shield className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-neutral-600">
                User preferences will be implemented in future phases
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
