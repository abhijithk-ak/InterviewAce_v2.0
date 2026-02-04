"use client"

import { useParams, useRouter } from "next/navigation"
import { SessionReview } from "@/components/views/session-review"
import { useSessions } from "@/components/providers/SessionsProvider"
import { use, useEffect, useState } from "react"
import { LoadingScreen } from "@/components/ui/page-transition"

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { sessions, isLoading } = useSessions()
    const [session, setSession] = useState(sessions.find((s) => s.id === id))

    useEffect(() => {
        const foundSession = sessions.find((s) => s.id === id)
        if (foundSession) {
            setSession(foundSession)
        }
    }, [sessions, id])

    if (isLoading) {
        return <LoadingScreen onComplete={() => { }} />
    }

    if (!session) {
        // If not found in context (e.g. direct link and context loading delay or invalid id)
        // We wait for isLoading to be false above.
        // If still not found, show error or redirect
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-xl font-bold">Session not found</h2>
                <button
                    onClick={() => router.push("/")}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
                >
                    Return to Dashboard
                </button>
            </div>
        )
    }

    return <SessionReview session={session} onBack={() => router.push("/")} />
}
