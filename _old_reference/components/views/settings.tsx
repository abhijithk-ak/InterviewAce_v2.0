"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, CheckCircle2, AlertCircle, Loader2, Sparkles, User, Monitor, Database, Trash2, Sun, Moon, LogOut } from "lucide-react"
import { CardCustom } from "@/components/ui-custom/card-custom"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { VIEW_TRANSITION, OPENROUTER_MODELS, DEFAULT_AI_SETTINGS, type AISettings } from "@/lib/data"
import { getAISettings, saveAISettings } from "@/lib/storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "@/components/providers/theme-provider"

export function Settings() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)

  useEffect(() => {
    // Load settings, merging with defaults to handle new fields
    const loaded = getAISettings()
    setSettings({
      ...DEFAULT_AI_SETTINGS,
      ...loaded,
      preferences: {
        ...DEFAULT_AI_SETTINGS.preferences,
        ...(loaded.preferences || {})
      }
    })
  }, [])

  const handleSave = () => {
    saveAISettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        setTestResult("success")
      } else {
        setTestResult("error")
      }
    } catch {
      setTestResult("error")
    } finally {
      setTesting(false)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all local data? This includes interview history and notes. This cannot be undone.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <motion.div {...VIEW_TRANSITION} className="max-w-4xl mx-auto space-y-6 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">
          Manage your account, preferences, and AI configuration.
        </p>
      </header>

      {/* Account Section */}
      <CardCustom className="p-8 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Account</h2>
            <p className="text-sm text-neutral-500">Your profile information</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name || "User"} className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-neutral-800" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                <User className="w-6 h-6 text-neutral-400" />
              </div>
            )}
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">{session?.user?.name || "Guest User"}</p>
              <p className="text-sm text-neutral-500">{session?.user?.email || "Not signed in"}</p>
            </div>
          </div>
          <ButtonCustom onClick={() => signOut()} variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 shadow-none border-neutral-200 dark:border-neutral-700">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </ButtonCustom>
        </div>
      </CardCustom>

      {/* Appearance Section */}
      <CardCustom className="p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Monitor className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Appearance</h2>
            <p className="text-sm text-neutral-500">Customize the interface theme</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <Label className="text-sm font-medium">Theme Mode</Label>
            <p className="text-xs text-neutral-500">Toggle between Light and Dark mode</p>
          </div>
          <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full">
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white shadow-sm text-yellow-500' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-neutral-700 shadow-sm text-blue-400' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardCustom>

      {/* AI Model Settings */}
      <CardCustom className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">AI Model</h2>
            <p className="text-sm text-neutral-500">Choose your preferred AI model</p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 block">
            Model Selection
          </Label>
          <Select value={settings.model} onValueChange={(value) => setSettings({ ...settings, model: value })}>
            <SelectTrigger className="w-full p-4 h-auto rounded-xl">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {OPENROUTER_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <span className="flex items-center gap-2">
                    {model.name}
                    <span className="text-xs text-neutral-400">({model.provider})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-neutral-500 mt-2">
            Models powered by OpenRouter. Performance may vary.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <ButtonCustom onClick={handleTestConnection} variant="secondary" disabled={testing}>
            {testing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Test Connection
          </ButtonCustom>

          {testResult === "success" && (
            <span className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" /> Service connected
            </span>
          )}
          {testResult === "error" && (
            <span className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" /> Connection failed
            </span>
          )}
        </div>
      </CardCustom>

      {/* Preferences */}
      <CardCustom className="p-8 space-y-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Preferences</h2>

        <div className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <Label className="text-sm font-medium">Auto-save notes</Label>
            <p className="text-xs text-neutral-500">Automatically save notes while typing</p>
          </div>
          <Switch
            checked={settings.preferences?.autoSaveNotes ?? true}
            onCheckedChange={(c) => setSettings({ ...settings, preferences: { ...settings.preferences, autoSaveNotes: c } })}
          />
        </div>

        <div className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <Label className="text-sm font-medium">Sound effects</Label>
            <p className="text-xs text-neutral-500">Play sounds for session events</p>
          </div>
          <Switch
            checked={settings.preferences?.soundEffects ?? false}
            onCheckedChange={(c) => setSettings({ ...settings, preferences: { ...settings.preferences, soundEffects: c } })}
          />
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <Label className="text-sm font-medium">Session recordings</Label>
            <p className="text-xs text-neutral-500">Save audio recordings of your sessions</p>
          </div>
          <Switch
            checked={settings.preferences?.sessionRecordings ?? true}
            onCheckedChange={(c) => setSettings({ ...settings, preferences: { ...settings.preferences, sessionRecordings: c } })}
          />
        </div>
      </CardCustom>

      {/* Data Management */}
      <CardCustom className="p-8 space-y-6 border-red-100 dark:border-red-900/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <Database className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Data Assessment</h2>
            <p className="text-sm text-neutral-500">Manage your local data</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <Label className="text-sm font-medium text-red-600 dark:text-red-400">Clear all local data</Label>
            <p className="text-xs text-neutral-500">This will remove all interview history and settings.</p>
          </div>
          <ButtonCustom onClick={handleClearData} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 shadow-none">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </ButtonCustom>
        </div>
      </CardCustom>

      {/* Save Button */}
      <div className="sticky bottom-6 flex justify-end z-10">
        <ButtonCustom onClick={handleSave} className="px-8 py-4 text-lg shadow-xl shadow-indigo-500/20">
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? "Changes Saved!" : "Save Changes"}
        </ButtonCustom>
      </div>
    </motion.div>
  )
}
