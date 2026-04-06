"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Settings, 
  Save, 
  RotateCcw, 
  ChevronLeft, 
  Loader2,
  Cpu,
  Target,
  BarChart3,
  Palette
} from "lucide-react"
import {
  loadSettingsFromAPI,
  saveSettingsToAPI,
  resetSettingsToAPI,
  AVAILABLE_MODELS,
  type InterviewSettings,
  type InterviewLength,
} from "@/lib/settings/store"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<InterviewSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadSettingsFromAPI()
      .then((loadedSettings) => {
        setSettings(loadedSettings)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to load settings:", error)
        setMessage({ type: "error", text: "Failed to load settings from database" })
        setLoading(false)
      })
  }, [])

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading settings from database...
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      const result = await saveSettingsToAPI(settings)
      
      if (result.success) {
        setMessage({ type: "success", text: result.message || "Settings saved to database successfully" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save settings" })
      }
    } catch (error) {
      console.error("Save error:", error)
      setMessage({ type: "error", text: "Network error: Could not save settings" })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm("Reset all settings to defaults? This will update your database settings.")) {
      return
    }

    setSaving(true)
    setMessage(null)
    
    try {
      const result = await resetSettingsToAPI()
      
      if (result.success) {
        const resetSettings = await loadSettingsFromAPI()
        setSettings(resetSettings)
        setMessage({ type: "success", text: "Settings reset to defaults" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: "error", text: result.error || "Failed to reset settings" })
      }
    } catch (error) {
      console.error("Reset error:", error)
      setMessage({ type: "error", text: "Network error: Could not reset settings" })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = <K extends keyof InterviewSettings>(
    key: K,
    value: InterviewSettings[K]
  ) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <div className="min-h-full bg-neutral-900 text-white">
      {/* Header */}
      <div className="border-b border-neutral-700 bg-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">Interview Settings</h1>
              <p className="text-sm text-neutral-400">
                Configure your interview experience and AI behavior
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* AI Configuration */}
          <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-blue-400" />
              AI Configuration
            </h2>
            <div className="space-y-4">
              {/* AI Model */}
              <div>
                <label className="block text-sm font-medium mb-2">AI Model</label>
                <select
                  value={settings.aiModel}
                  onChange={(e) => updateSetting("aiModel", e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* Recommended */}
                  <optgroup label="⭐ Recommended">
                    {AVAILABLE_MODELS.filter((m) => m.category === "recommended").map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </optgroup>
                  
                  {/* Free Models */}
                  <optgroup label="🆓 Free Models">
                    {AVAILABLE_MODELS.filter((m) => m.category === "free").map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </optgroup>
                  
                  {/* Paid Models */}
                  <optgroup label="💎 Paid Models (Higher Cost)">
                    {AVAILABLE_MODELS.filter((m) => m.category === "paid").map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <p className="text-xs text-neutral-400 mt-1">
                  Recommended model is free and optimized for interviews
                </p>
              </div>

              {/* AI Temperature */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  AI Temperature: {settings.aiTemperature.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.aiTemperature}
                  onChange={(e) =>
                    updateSetting("aiTemperature", parseFloat(e.target.value))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>Focused (0.0)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Interview Configuration */}
          <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-400" />
              Interview Configuration
            </h2>
            <div className="space-y-4">
              {/* Interview Length */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Interview Length
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {([3, 5, 6] as InterviewLength[]).map((length) => (
                    <button
                      key={length}
                      onClick={() => updateSetting("interviewLength", length)}
                      className={`px-4 py-3 rounded-lg border transition-colors ${
                        settings.interviewLength === length
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-neutral-700 border-neutral-600 text-neutral-300 hover:border-neutral-500"
                      }`}
                    >
                      {length} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Questions */}
              <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg">
                <div>
                  <div className="font-medium">Voice Questions (TTS)</div>
                  <div className="text-sm text-neutral-400">
                    AI reads questions aloud
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateSetting("voiceQuestionsEnabled", !settings.voiceQuestionsEnabled)
                  }
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.voiceQuestionsEnabled
                      ? "bg-green-600 text-white"
                      : "bg-neutral-600 text-neutral-300"
                  }`}
                >
                  {settings.voiceQuestionsEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              {/* Video Recording */}
              <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg">
                <div>
                  <div className="font-medium">Video Recording</div>
                  <div className="text-sm text-neutral-400">
                    Enable webcam during interview
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateSetting("videoRecordingEnabled", !settings.videoRecordingEnabled)
                  }
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.videoRecordingEnabled
                      ? "bg-green-600 text-white"
                      : "bg-neutral-600 text-neutral-300"
                  }`}
                >
                  {settings.videoRecordingEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </section>

          {/* Scoring Configuration */}
          <section className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Scoring Configuration
            </h2>
            <div className="space-y-4">
              {/* Show Score Explanation */}
              <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg">
                <div>
                  <div className="font-medium">Show Score Explanation</div>
                  <div className="text-sm text-neutral-400">
                    Display detailed reasoning for scores
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateSetting("showScoreExplanation", !settings.showScoreExplanation)
                  }
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.showScoreExplanation
                      ? "bg-green-600 text-white"
                      : "bg-neutral-600 text-neutral-300"
                  }`}
                >
                  {settings.showScoreExplanation ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving to Database...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors border border-neutral-600"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 p-4 border rounded-lg text-sm text-center ${
              message.type === "success"
                ? "bg-green-900/20 border-green-700 text-green-300"
                : "bg-red-900/20 border-red-700 text-red-300"
            }`}
          >
            {message.type === "success" ? "✓" : "✗"} {message.text}
          </div>
        )}
      </div>
    </div>
  )
}

