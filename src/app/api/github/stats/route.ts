import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const GITHUB_API = "https://api.github.com"

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

export async function GET() {
    try {
        const session = await auth()
        
        if (!session?.accessToken) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const accessToken = (session as any).accessToken as string
        const headers = {
            "Authorization": `token ${accessToken}`,
            "Accept": "application/vnd.github.v3+json",
        }

        // Get authenticated user info
        const userResponse = await fetch(`${GITHUB_API}/user`, { headers })
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user info")
        }
        const user = await userResponse.json()

        // Get user repositories
        const reposResponse = await fetch(`${GITHUB_API}/user/repos?per_page=100&sort=pushed`, { headers })
        if (!reposResponse.ok) {
            throw new Error("Failed to fetch repositories")
        }
        const repos = await reposResponse.json()

        // Only count public repos and filter out forks for stats
        const publicRepos = repos.filter((repo: any) => !repo.private)
        const ownRepos = publicRepos.filter((repo: any) => !repo.fork)

        // Calculate language stats
        const languageStats: Record<string, number> = {}
        let totalBytes = 0

        // Get languages for each repository
        for (const repo of ownRepos.slice(0, 20)) { // Limit to avoid rate limits
            try {
                const langResponse = await fetch(`${GITHUB_API}/repos/${repo.full_name}/languages`, { headers })
                if (langResponse.ok) {
                    const languages = await langResponse.json()
                    Object.entries(languages).forEach(([lang, bytes]) => {
                        languageStats[lang] = (languageStats[lang] || 0) + (bytes as number)
                        totalBytes += bytes as number
                    })
                }
            } catch (error) {
                // Skip if we can't get language data for this repo
                continue
            }
        }

        // Convert to percentage and format
        const languages = Object.entries(languageStats)
            .map(([language, bytes]) => ({
                language,
                bytes,
                percentage: Math.round((bytes / totalBytes) * 100 * 10) / 10
            }))
            .sort((a, b) => b.bytes - a.bytes)
            .slice(0, 8)

        // Get recently active repos (pushed within last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const recentlyActive = ownRepos.filter((repo: any) => 
            new Date(repo.pushed_at) > thirtyDaysAgo
        ).length

        // Calculate total stats
        const stats = {
            totalRepos: publicRepos.length,
            recentlyActive,
            totalStars: publicRepos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
            totalForks: publicRepos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0)
        }

        // Get top repositories
        const topRepos = ownRepos
            .sort((a: any, b: any) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
            .slice(0, 8)
            .map((repo: any) => ({
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                pushedAt: repo.pushed_at
            }))

        const githubStats: GitHubStats = {
            user: {
                login: user.login,
                name: user.name,
                avatar: user.avatar_url,
                bio: user.bio,
                publicRepos: user.public_repos,
                followers: user.followers,
                following: user.following
            },
            languages,
            topRepos,
            stats
        }

        return NextResponse.json(githubStats)
    } catch (error) {
        console.error("GitHub stats error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to fetch GitHub stats" },
            { status: 500 }
        )
    }
}