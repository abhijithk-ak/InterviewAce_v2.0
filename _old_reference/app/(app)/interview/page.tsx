"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ActiveInterview } from "@/components/views/active-interview"
import { useSessions } from "@/components/providers/SessionsProvider"
import type { Session, InterviewConfig } from "@/lib/data"
import { LoadingScreen } from "@/components/ui/page-transition"

export default function InterviewPage() {
    const router = useRouter()
    const { addSession } = useSessions()
    const [config, setConfig] = useState<InterviewConfig | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Retrieve config from local storage (set by setup page)
        const storedConfig = localStorage.getItem("currentInterviewConfig")
        if (storedConfig) {
            try {
                setConfig(JSON.parse(storedConfig))
            } catch (e) {
                console.error("Failed to parse interview config", e)
            }
        } else {
            // Redirect to setup if no config found
            router.replace("/setup")
        }
    }, [router])

    const handleEnd = (session: Session) => {
        addSession(session)
        // Clear the current config as interview is done
        localStorage.removeItem("currentInterviewConfig")
        router.replace(`/review/${session.id}`)
    }

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />
    }

    if (!config) {
        return null // Will redirect
    }

    return <ActiveInterview onEnd={handleEnd} config={config} />
}
