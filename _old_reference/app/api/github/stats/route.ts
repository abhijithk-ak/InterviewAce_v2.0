import { auth } from "@/lib/auth"

export async function GET() {
    const session = await auth()

    if (!session?.accessToken) {
        return Response.json(
            { error: "Not authenticated. Please sign in with GitHub." },
            { status: 401 }
        )
    }

    try {
        // Fetch user's repositories
        const reposResponse = await fetch(
            "https://api.github.com/user/repos?per_page=100&sort=pushed",
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        )

        if (!reposResponse.ok) {
            throw new Error("Failed to fetch repositories")
        }

        const repos = await reposResponse.json()

        // Fetch user profile
        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        })

        const user = await userResponse.json()

        // Aggregate language stats
        const languageStats: Record<string, number> = {}
        const repoDetails: Array<{
            name: string
            fullName: string
            description: string | null
            language: string | null
            stars: number
            forks: number
            url: string
            pushedAt: string
        }> = []

        for (const repo of repos.slice(0, 50)) {
            // Fetch languages for each repo
            const langResponse = await fetch(repo.languages_url, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
            })

            if (langResponse.ok) {
                const languages = await langResponse.json()
                for (const [lang, bytes] of Object.entries(languages)) {
                    languageStats[lang] = (languageStats[lang] || 0) + (bytes as number)
                }
            }

            repoDetails.push({
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                pushedAt: repo.pushed_at,
            })
        }

        // Sort languages by bytes and get top 10
        const sortedLanguages = Object.entries(languageStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)

        const totalBytes = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0)

        const languagePercentages = sortedLanguages.map(([lang, bytes]) => ({
            language: lang,
            bytes,
            percentage: Math.round((bytes / totalBytes) * 100),
        }))

        // Get top repositories by stars
        const topRepos = repoDetails
            .sort((a, b) => b.stars - a.stars)
            .slice(0, 10)

        // Calculate activity stats
        const recentRepos = repoDetails
            .filter((r) => {
                const pushedDate = new Date(r.pushedAt)
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                return pushedDate > thirtyDaysAgo
            })
            .length

        return Response.json({
            user: {
                login: user.login,
                name: user.name,
                avatar: user.avatar_url,
                bio: user.bio,
                publicRepos: user.public_repos,
                followers: user.followers,
                following: user.following,
            },
            languages: languagePercentages,
            topRepos,
            stats: {
                totalRepos: repos.length,
                recentlyActive: recentRepos,
                totalStars: repoDetails.reduce((sum, r) => sum + r.stars, 0),
                totalForks: repoDetails.reduce((sum, r) => sum + r.forks, 0),
            },
        })
    } catch (error) {
        console.error("Error fetching GitHub stats:", error)
        return Response.json(
            { error: "Failed to fetch GitHub stats" },
            { status: 500 }
        )
    }
}
