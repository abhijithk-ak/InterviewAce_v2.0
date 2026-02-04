"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useMounted } from "@/hooks/use-mounted"

type Theme = "dark" | "light"

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
    mounted: boolean
}

const initialState: ThemeProviderState = {
    theme: "dark",
    setTheme: () => null,
    toggleTheme: () => null,
    mounted: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "dark",
    storageKey = "interview-ace-ui-theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const mounted = useMounted()

    useEffect(() => {
        if (!mounted) return
        
        const savedTheme = localStorage.getItem(storageKey) as Theme
        if (savedTheme && savedTheme !== theme) {
            setTheme(savedTheme)
        }
    }, [storageKey, mounted, theme])

    useEffect(() => {
        if (!mounted) return
        
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey, mounted])

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark")
    }

    const value = {
        theme,
        setTheme,
        toggleTheme,
        mounted,
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
