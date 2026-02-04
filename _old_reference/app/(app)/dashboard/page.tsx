"use client"

import { Dashboard } from "@/components/views/dashboard"
import { useRouter } from "next/navigation"
import { useSessions } from "@/components/providers/SessionsProvider"

export default function HomePage() {
  const router = useRouter()
  const { sessions } = useSessions()

  return (
    <Dashboard
      onStartInterview={() => router.push("/setup")}
      onViewSession={(session) => router.push(`/review/${session.id}`)}
      sessions={sessions}
    />
  )
}
