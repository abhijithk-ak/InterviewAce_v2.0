import type { Note, AISettings, Session, InterviewConfig } from "./data"
import { DEFAULT_AI_SETTINGS, RECENT_SESSIONS } from "./data"

const NOTES_KEY = "interview-ace-notes"
const SETTINGS_KEY = "interview-ace-settings"
const SESSIONS_KEY = "interview-ace-sessions"
const ACTIVE_SESSION_KEY = "interview-ace-active-session"

// Notes
export function getNotes(): Note[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(NOTES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveNotes(notes: Note[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
}

// AI Settings
export function getAISettings(): AISettings {
  if (typeof window === "undefined") return DEFAULT_AI_SETTINGS
  const stored = localStorage.getItem(SETTINGS_KEY)
  return stored ? JSON.parse(stored) : DEFAULT_AI_SETTINGS
}

export function saveAISettings(settings: AISettings) {
  if (typeof window === "undefined") return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getSessions(): Session[] {
  if (typeof window === "undefined") return RECENT_SESSIONS
  const stored = localStorage.getItem(SESSIONS_KEY)
  return stored ? JSON.parse(stored) : RECENT_SESSIONS
}

export function saveSessions(sessions: Session[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function saveSession(session: Session) {
  const sessions = getSessions()
  const existingIndex = sessions.findIndex((s) => s.id === session.id)
  if (existingIndex >= 0) {
    sessions[existingIndex] = session
  } else {
    sessions.unshift(session)
  }
  saveSessions(sessions)
}

export function getSessionById(id: string): Session | null {
  const sessions = getSessions()
  return sessions.find((s) => s.id === id) || null
}

// Active Session (for pause/resume)
export type ActiveSessionState = {
  config: InterviewConfig
  messages: Array<{ id: string; role: "assistant" | "user"; content: string }>
  elapsedTime: number
  sessionId: string
}

export function getActiveSession(): ActiveSessionState | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(ACTIVE_SESSION_KEY)
  return stored ? JSON.parse(stored) : null
}

export function saveActiveSession(state: ActiveSessionState | null) {
  if (typeof window === "undefined") return
  if (state) {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(state))
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY)
  }
}

export function clearActiveSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACTIVE_SESSION_KEY)
}
