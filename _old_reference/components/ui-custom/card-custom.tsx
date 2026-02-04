"use client"

import type { ReactNode, MouseEventHandler } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function CardCustom({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black transition-all duration-300 ${onClick ? "cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600" : ""} ${className}`}
    >
      {children}
    </div>
  )
}
