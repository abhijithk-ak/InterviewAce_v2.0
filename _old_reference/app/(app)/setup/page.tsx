"use client"

import { InterviewSetup } from "@/components/views/interview-setup"
import { useRouter } from "next/navigation"

export default function SetupPage() {
    const router = useRouter()

    const handleStart = (config: any) => {
        // Save config to url params or local storage?
        // For now, let's assume active interview page reads from storage or we pass via query
        // But InterviewSetup calls onStart with config.
        // Let's store in localStorage for simplicity before navigating
        localStorage.setItem("currentInterviewConfig", JSON.stringify(config))
        router.push("/interview")
    }

    return <InterviewSetup onStart={handleStart} />
}
