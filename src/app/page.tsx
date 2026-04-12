"use client"

import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { Brain, Gauge, Sparkles, Target, Zap } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/dashboard")
    }
  }, [status])

  if (status === "loading") {
    return null
  }

  return (
    <div className="landing-shell min-h-screen overflow-x-hidden text-neutral-900">
      <div className="landing-orb orb-a" />
      <div className="landing-orb orb-b" />
      <div className="landing-orb orb-c" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#111111]/72 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                <Zap className="h-4 w-4" />
              </span>
              InterviewAce
            </h1>
            <Button
              variant="outline"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="pt-18 pb-14 text-center sm:pt-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-neutral-200 backdrop-blur-sm landing-fade-up">
            <Sparkles className="h-4 w-4 text-amber-500" />
            AI interview practice with research-grade scoring
          </div>

          <h2 className="landing-rise-in mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Ace your next interview with precision coaching
          </h2>

          <p className="landing-fade-up mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-neutral-300">
            Simulate real interviews, receive instant hybrid feedback, and track your
            progress across Technical, Behavioral, System Design, and HR rounds.
          </p>

          <div className="landing-fade-up mt-9 flex items-center justify-center">
            <Button
              variant="primary"
              className="min-w-[220px] text-lg px-8 py-3 shadow-lg shadow-neutral-900/20"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              Get Started Free
            </Button>
          </div>

          <div className="landing-fade-up mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="landing-chip">13+ Target Roles</div>
            <div className="landing-chip">Hybrid Scoring Engine</div>
            <div className="landing-chip">Session Analytics</div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-5 py-10 md:grid-cols-3">
          <div className="landing-card">
            <div className="landing-icon">
              <Target className="h-5 w-5 text-neutral-800" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Realistic Practice</h3>
            <p className="text-neutral-300">
              Role-specific questions, adaptive flow, and interview formats that mirror
              real hiring conversations.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-icon">
              <Brain className="h-5 w-5 text-neutral-800" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">AI Feedback</h3>
            <p className="text-neutral-300">
              Multi-dimensional scoring with concept, semantic, and clarity insights for
              every answer.
            </p>
          </div>

          <div className="landing-card">
            <div className="landing-icon">
              <Gauge className="h-5 w-5 text-neutral-800" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">Track Progress</h3>
            <p className="text-neutral-300">
              Monitor trends, identify weak areas, and follow structured improvements
              session by session.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#111111]/45">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-neutral-400">
            © 2026 InterviewAce. Built with Next.js and AI.
          </p>
        </div>
      </footer>
    </div>
  )
}
