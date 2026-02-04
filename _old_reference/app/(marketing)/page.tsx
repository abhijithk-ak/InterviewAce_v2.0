"use client"

import { motion } from "framer-motion"
import { signIn, useSession } from "next-auth/react"
import { Github, Play, Cpu, Code, TrendingUp, Sun, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { GridPattern } from "@/components/ui/background-patterns"
import { useTheme } from "@/components/providers/theme-provider"

export default function LandingPage() {
    const { status } = useSession()
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard")
        }
    }, [status, router])

    if (status === "authenticated") {
        return null
    }

    return (
        <div className="relative min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white selection:bg-neutral-100 dark:selection:bg-neutral-800 overflow-hidden transition-colors duration-500">
            {/* Background Patterns */}
            <GridPattern className="opacity-50 dark:opacity-20 text-neutral-300 dark:text-neutral-700" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-black z-0 pointer-events-none" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white dark:text-black font-bold text-2xl">I</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block">InterviewAce</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            className="text-sm font-medium text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                        >
                            Log In
                        </button>
                        <ButtonCustom
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            className="gap-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            <Github className="w-4 h-4" />
                            Get Started
                        </ButtonCustom>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col items-center justify-center text-center z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-8 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 tracking-wide uppercase">Now Publicly Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500">
                            Technical Interview.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        AI-powered mock interviews, real-time feedback, and personalized roadmaps.
                        Connect your GitHub to get started instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <ButtonCustom
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            className="h-14 px-8 text-lg gap-3 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 hover:scale-105 transition-all shadow-xl shadow-neutral-500/10 dark:shadow-white/5"
                        >
                            <Github className="w-6 h-6" />
                            Continue with GitHub
                        </ButtonCustom>
                        <button className="h-14 px-8 text-lg font-medium text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-2">
                            <Play className="w-5 h-5 fill-current" />
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
                    {[
                        { icon: Cpu, title: "AI Coach", desc: "Real-time voice and code analysis." },
                        { icon: Code, title: "Live Coding", desc: "Interactive environment with 30+ languages." },
                        { icon: TrendingUp, title: "Smart Stats", desc: "Track progress and identify knowledge gaps." }
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="group p-8 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors text-left backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 bg-white dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 text-black dark:text-white group-hover:scale-110 transition-transform duration-300 shadow-sm border border-neutral-100 dark:border-neutral-700">
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">{f.title}</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 px-6 text-center text-neutral-500 text-sm bg-neutral-50 dark:bg-black relative z-10">
                <p>© 2026 InterviewAce. Powered by OpenRouter.</p>
            </footer>
        </div>
    )
}
