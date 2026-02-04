import { useEffect, useState } from "react"

/**
 * Hook to detect if component is mounted (hydrated)
 * Prevents SSR/client mismatch issues
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}