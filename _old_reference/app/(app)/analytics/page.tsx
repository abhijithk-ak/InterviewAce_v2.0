"use client"

import { Analytics } from "@/components/views/analytics"
import { useSessions } from "@/components/providers/SessionsProvider"

export default function AnalyticsPage() {
    const { sessions } = useSessions()

    return <Analytics sessions={sessions} />
}
