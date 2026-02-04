"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart2,
  Settings,
  LogOut,
  Target
} from "lucide-react"
import { APP_ROUTES } from "@/lib/routes"
import { useMounted } from "@/hooks/use-mounted"

const ICON_MAP = {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Settings,
}

// Group routes by section
const NAV_SECTIONS = [
  {
    title: "MAIN",
    routes: APP_ROUTES.filter(r => r.href === "/dashboard")
  },
  {
    title: "PRACTICE",
    routes: APP_ROUTES.filter(r => r.href === "/interview/setup")
  },
  {
    title: "INSIGHTS",
    routes: APP_ROUTES.filter(r => r.href === "/analytics" || r.href === "/settings")
  }
]

export function Sidebar() {
  const mounted = useMounted()
  const pathname = usePathname()

  // Prevent SSR mismatch
  if (!mounted) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <aside className="w-64 bg-neutral-900 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-lg font-bold text-white">InterviewAce</h1>
            <p className="text-xs text-neutral-400">AI Practice</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {section.title}
              </span>
            </div>
            <ul className="space-y-1">
              {section.routes.map((route) => {
                const Icon = ICON_MAP[route.icon as keyof typeof ICON_MAP]
                const isActive = pathname === route.href || 
                  (route.href === "/interview/setup" && pathname?.startsWith("/interview"))
                
                return (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-all
                        ${isActive 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{route.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
