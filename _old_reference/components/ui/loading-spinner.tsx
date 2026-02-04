"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-neutral-200 dark:border-neutral-800" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neutral-900 dark:border-t-white animate-spin" />
    </div>
  )
}

export function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-neutral-200 dark:border-neutral-800" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-neutral-900 dark:border-t-white animate-spin" />
          <div
            className="absolute inset-2 w-12 h-12 rounded-full border-2 border-transparent border-b-neutral-400 dark:border-b-neutral-500 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 animate-pulse-soft">{message}</p>
      </div>
    </div>
  )
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-neutral-100 dark:border-neutral-800 bg-card p-6", className)}>
      <div className="space-y-4">
        <div className="h-4 w-1/3 rounded-md animate-skeleton" />
        <div className="h-8 w-1/2 rounded-md animate-skeleton" />
        <div className="h-3 w-1/4 rounded-md animate-skeleton" />
      </div>
    </div>
  )
}

export function LoadingChart({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-neutral-100 dark:border-neutral-800 bg-card p-6", className)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-32 rounded-md animate-skeleton" />
            <div className="h-3 w-48 rounded-md animate-skeleton stagger-1" />
          </div>
          <div className="h-9 w-32 rounded-lg animate-skeleton stagger-2" />
        </div>
        <div className="flex items-end justify-between gap-3 h-[200px] pt-4">
          {[45, 70, 55, 85, 60, 75, 90].map((h, i) => (
            <div
              key={i}
              className={cn("flex-1 rounded-t-md animate-skeleton", `stagger-${i + 1}`)}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-3 w-8 rounded-md animate-skeleton" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"
          style={{
            animation: "dot-pulse 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  )
}
