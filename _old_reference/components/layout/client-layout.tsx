"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { SessionsProvider } from "@/components/providers/SessionsProvider"
import { LoadingScreen, PageTransition } from "@/components/ui/page-transition"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { useTheme } from "@/components/providers/theme-provider"
import { usePathname, useSearchParams } from "next/navigation"

export function ClientLayout({ children }: { children: React.ReactNode }) {
    // Global theme is managed by ThemeProvider now
    // We only manage sidebar state here
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Default to open or load from storage if needed
    const [isTransitioning, setIsTransitioning] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Only trigger transition for significant route changes
        const isSignificantChange = !searchParams.get('from-cache')
        if (isSignificantChange) {
            setIsTransitioning(true)
            const timeout = setTimeout(() => setIsTransitioning(false), 300) // Reduced duration
            return () => clearTimeout(timeout)
        }
    }, [pathname, searchParams])

    return (
        <>
            <PageTransition isTransitioning={isTransitioning} />

            <motion.div
                className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex h-screen">
                    <ErrorBoundary>
                        <Sidebar
                            sidebarCollapsed={sidebarCollapsed}
                            setSidebarCollapsed={setSidebarCollapsed}
                        />
                    </ErrorBoundary>

                    <main className="flex-1 overflow-y-auto relative bg-neutral-50/30 dark:bg-neutral-900/10">
                        <div className="p-8 md:p-12 min-h-full max-w-7xl mx-auto">
                            <ErrorBoundary>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={pathname}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </ErrorBoundary>
                        </div>
                    </main>
                </div>
            </motion.div>
        </>
    )
}
