/**
 * Global Loading Component
 * Displayed during route transitions and data fetching
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-block animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">Zen</span>
            </div>
          </div>
        </div>
        <div className="text-xl font-medium text-white mb-2 animate-pulse">
          Zen AI is preparing your interview...
        </div>
        <div className="text-sm text-neutral-400">
          This will only take a moment
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
        </div>
      </div>
    </div>
  )
}
