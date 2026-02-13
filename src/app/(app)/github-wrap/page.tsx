"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import {
    Github,
    Star,
    GitFork,
    Code2,
    TrendingUp,
    ExternalLink,
    LogOut,
    Loader2,
    RefreshCw
} from "lucide-react"
import { Button, Card, CardContent, CardHeader } from "@/components/ui"

interface GitHubStats {
    user: {
        login: string
        name: string
        avatar: string
        bio: string | null
        publicRepos: number
        followers: number
        following: number
    }
    languages: Array<{
        language: string
        bytes: number
        percentage: number
    }>
    topRepos: Array<{
        name: string
        fullName: string
        description: string | null
        language: string | null
        stars: number
        forks: number
        url: string
        pushedAt: string
    }>
    stats: {
        totalRepos: number
        recentlyActive: number
        totalStars: number
        totalForks: number
    }
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Shell: "#89e051",
    Dart: "#00B4AB",
    Vue: "#41b883",
    Svelte: "#ff3e00",
}

export default function GitHubWrapPage() {
    const { data: session, status } = useSession()
    const [stats, setStats] = useState<GitHubStats | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/github/stats")
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to fetch stats")
            }
            const data = await response.json()
            setStats(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session?.accessToken) {
            fetchStats()
        }
    }, [session])

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-neutral-900 -m-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-neutral-900 -m-8 py-12">
                <div className="max-w-2xl mx-auto px-6">
                    <header className="text-center mb-12">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Github className="w-10 h-10 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                            GitHub Wrap
                        </h1>
                        <p className="text-neutral-400 text-lg">
                            Connect your GitHub account to see your tech stack and coding activity
                        </p>
                    </header>

                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardContent className="text-center">
                            <h2 className="text-xl font-semibold mb-4 text-white">Sign in to get started</h2>
                            <p className="text-neutral-400 mb-6">
                                We'll analyze your repositories to show your programming languages,
                                top projects, and activity stats.
                            </p>
                            <Button onClick={() => signIn("github", { callbackUrl: window.location.origin })} className="inline-flex items-center gap-2">
                                <Github className="w-5 h-5" />
                                Sign in with GitHub
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-900 -m-8 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                <p className="text-neutral-400">Analyzing your GitHub profile...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-neutral-900 -m-8 py-12">
                <div className="max-w-2xl mx-auto px-6">
                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardContent className="text-center">
                            <h2 className="text-xl font-semibold text-red-400 mb-4">Error</h2>
                            <p className="text-neutral-400 mb-6">{error}</p>
                            <Button onClick={fetchStats} variant="secondary" className="inline-flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!stats) return null

    return (
        <div className="min-h-screen bg-neutral-900 -m-8 py-12">
            <div className="max-w-6xl mx-auto px-6 space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                            GitHub Wrap
                        </h1>
                        <p className="text-neutral-400">
                            Your coding activity and tech stack overview
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={stats.user.avatar}
                                alt={stats.user.login}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-medium text-sm text-white">{stats.user.name || stats.user.login}</p>
                                <p className="text-xs text-neutral-400">@{stats.user.login}</p>
                            </div>
                        </div>
                        <Button onClick={() => signOut()} variant="secondary" className="inline-flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </div>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardContent className="text-center">
                            <Code2 className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                            <p className="text-2xl font-bold text-white">{stats.stats.totalRepos}</p>
                            <p className="text-sm text-neutral-400">Repositories</p>
                        </CardContent>
                    </Card>
                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardContent className="text-center">
                            <Star className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                            <p className="text-2xl font-bold text-white">{stats.stats.totalStars}</p>
                            <p className="text-sm text-neutral-400">Total Stars</p>
                        </CardContent>
                    </Card>
                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardContent className="text-center">
                            <GitFork className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                            <p className="text-2xl font-bold text-white">{stats.stats.totalForks}</p>
                            <p className="text-sm text-neutral-400">Total Forks</p>
                        </CardContent>
                    </Card>
                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardContent className="text-center">
                            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                            <p className="text-2xl font-bold text-white">{stats.stats.recentlyActive}</p>
                            <p className="text-sm text-neutral-400">Active (30d)</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Languages */}
                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardHeader>
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                                <Code2 className="w-5 h-5" />
                                Tech Stack
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.languages.map((lang) => (
                                    <div key={lang.language} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor: LANGUAGE_COLORS[lang.language] || "#6b7280",
                                                    }}
                                                />
                                                <span className="font-medium text-white">{lang.language}</span>
                                            </div>
                                            <span className="text-neutral-400">{lang.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-700 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    backgroundColor: LANGUAGE_COLORS[lang.language] || "#6b7280",
                                                    width: `${lang.percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Repos */}
                    <Card className="border-neutral-700 bg-neutral-800">
                        <CardHeader>
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                                <Star className="w-5 h-5" />
                                Top Repositories
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.topRepos.slice(0, 5).map((repo) => (
                                    <a
                                        key={repo.fullName}
                                        href={repo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 rounded-xl border border-neutral-600 hover:bg-neutral-700 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate flex items-center gap-2 text-white">
                                                    {repo.name}
                                                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                                                </h3>
                                                {repo.description && (
                                                    <p className="text-sm text-neutral-400 truncate mt-1">
                                                        {repo.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-neutral-400">
                                            {repo.language && (
                                                <div className="flex items-center gap-1">
                                                    <div
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            backgroundColor: LANGUAGE_COLORS[repo.language] || "#6b7280",
                                                        }}
                                                    />
                                                    {repo.language}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5" />
                                                {repo.stars}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <GitFork className="w-3.5 h-3.5" />
                                                {repo.forks}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-center">
                    <Button onClick={fetchStats} variant="secondary" className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh Stats
                    </Button>
                </div>
            </div>
        </div>
    )
}