"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useMounted } from "@/hooks/use-mounted"
import type { Session } from "@/lib/data"
import { getSessions, saveSession } from "@/lib/storage"

interface SessionsContextType {
    sessions: Session[]
    addSession: (session: Session) => void
    isLoading: boolean
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined)

export function SessionsProvider({ children }: { children: React.ReactNode }) {
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const mounted = useMounted()

    useEffect(() => {
        if (!mounted) return
        
        // Load sessions from local storage on mount
        const loadedSessions = getSessions()
        setSessions(loadedSessions)
        setIsLoading(false)
    }, [mounted])

    const addSession = useCallback((session: Session) => {
        saveSession(session)
        setSessions((prev) => [session, ...prev])
    }, [])

    return (
        <SessionsContext.Provider value={{ sessions, addSession, isLoading }}>
            {children}
        </SessionsContext.Provider>
    )
}

export function useSessions() {
    const context = useContext(SessionsContext)
    if (context === undefined) {
        throw new Error("useSessions must be used within a SessionsProvider")
    }
    return context
}
