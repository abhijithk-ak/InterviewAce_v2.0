"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ClientLayout } from "@/components/layout/client-layout"

import { Suspense } from "react"
import { LoadingScreen } from "@/components/ui/page-transition"
import { ErrorBoundary } from "@/components/ui/error-boundary"

import { SessionsProvider } from "@/components/providers/SessionsProvider"

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    // Optional: Show loading state or nothing while checking auth
    // But ClientLayout handles loading too.
    // We'll let ClientLayout render, but redirect if needed.

    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingScreen onComplete={() => { }} />}>
                <SessionsProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </SessionsProvider>
            </Suspense>
        </ErrorBoundary>
    )
}
