import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "InterviewAce - Master Tech Interviews",
    description: "AI-powered mock interviews and personalized styling.",
}

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}
