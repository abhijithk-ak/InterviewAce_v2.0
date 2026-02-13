import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { User, Mail, Bell, Shield, Settings } from "lucide-react"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-neutral-900 -m-8">
      <div className="max-w-4xl mx-auto p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-400" />
            Settings
          </h1>
          <p className="text-neutral-400">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6 max-w-2xl">
          
          {/* Account Settings */}
          <div className="bg-neutral-800 rounded-lg border border-neutral-700">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Account</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-700 rounded-lg border border-neutral-600">
                    <User className="w-4 h-4 text-neutral-300" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-400 mb-1">
                      Name
                    </label>
                    <div className="text-white">{session.user?.name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-700 rounded-lg border border-neutral-600">
                    <Mail className="w-4 h-4 text-neutral-300" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-400 mb-1">
                      Email
                    </label>
                    <div className="text-white">{session.user?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-neutral-800 rounded-lg border border-neutral-700">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Preferences</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-700 rounded-full mb-3 border border-neutral-600">
                  <Shield className="w-6 h-6 text-neutral-400" />
                </div>
                <p className="text-neutral-400">
                  User preferences will be implemented in future phases
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
