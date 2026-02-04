"use client"

import React, { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { ButtonCustom } from "@/components/ui-custom/button-custom"
import { CardCustom } from "@/components/ui-custom/card-custom"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <CardCustom className="p-8 text-center max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ButtonCustom
              variant="outline"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh Page
            </ButtonCustom>
            <ButtonCustom
              onClick={() => window.location.href = '/dashboard'}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </ButtonCustom>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs bg-neutral-100 dark:bg-neutral-900 p-4 rounded border overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </CardCustom>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Simplified error boundary for specific use cases
export function ChartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <CardCustom className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="font-medium mb-1">Chart Error</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Unable to load chart data. Please try again.
          </p>
        </CardCustom>
      }
    >
      {children}
    </ErrorBoundary>
  )
}