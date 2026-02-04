import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware without auth wrapper to avoid Next.js 16 issues
export function middleware(request: NextRequest) {
  // For now, just allow all dashboard routes
  // We'll protect them at the page level with auth()
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
