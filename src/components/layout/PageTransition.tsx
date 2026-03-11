'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const prevPath = useRef(pathname)

  useEffect(() => {
    if (prevPath.current !== pathname && ref.current) {
      prevPath.current = pathname
      // Re-trigger animation by briefly removing and re-adding the class
      ref.current.style.animation = 'none'
      void ref.current.offsetHeight // force reflow
      ref.current.style.animation = ''
    }
  }, [pathname])

  return (
    <div ref={ref} className="page-enter h-full">
      {children}
    </div>
  )
}
