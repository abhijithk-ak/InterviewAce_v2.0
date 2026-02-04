// Clean UI components - No animations, no state, hydration-safe
import type { ButtonHTMLAttributes, HTMLAttributes } from "react"

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800 focus:ring-neutral-900",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500",
    outline: "border border-neutral-300 bg-transparent hover:bg-neutral-50 focus:ring-neutral-500",
    ghost: "bg-transparent hover:bg-neutral-100 focus:ring-neutral-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Card Components
interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg border border-neutral-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
  return (
    <div 
      className={`px-6 py-4 border-b border-neutral-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, className = "", ...props }: CardProps) {
  return (
    <div 
      className={`px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ children, className = "", ...props }: CardProps) {
  return (
    <div 
      className={`px-6 py-4 border-t border-neutral-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
