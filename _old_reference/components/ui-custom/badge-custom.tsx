import type { ReactNode } from "react"

interface BadgeProps {
  children: ReactNode
  variant?: "neutral" | "success" | "warning" | "blue"
  className?: string
}

export function BadgeCustom({ children, variant = "neutral", className = "" }: BadgeProps) {
  const variants = {
    neutral: "bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>
}
