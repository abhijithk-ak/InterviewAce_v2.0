"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart2,
  Settings,
  LogOut,
  Target,
  User,
  BookOpen,
  GraduationCap,
  StickyNote,
  Github,
  Zap,
  Activity,
} from "lucide-react"
import { APP_ROUTES } from "@/lib/routes"
import { useMounted } from "@/hooks/use-mounted"
import { isAdmin } from "@/lib/config/admin"
import Image from "next/image"

const ICON_MAP = {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Settings,
  BookOpen,
  GraduationCap,
  StickyNote,
  Github,
  Activity,
}

const NAV_SECTIONS = [
  {
    title: "MAIN",
    routes: APP_ROUTES.filter(r => r.href === "/dashboard")
  },
  {
    title: "PRACTICE",
    routes: APP_ROUTES.filter(r => 
      r.href === "/interview/setup" || 
      r.href === "/questions" || 
      r.href === "/learning-hub"
    )
  },
  {
    title: "ORGANIZE", 
    routes: APP_ROUTES.filter(r => r.href === "/notes")
  },
  {
    title: "INSIGHTS",
    routes: APP_ROUTES.filter(r => 
      r.href === "/analytics" || 
      r.href === "/github-wrap"
    )
  },
  {
    title: "SETTINGS",
    routes: APP_ROUTES.filter(r => r.href === "/settings")
  }
]

export function Sidebar() {
  const mounted = useMounted()
  const pathname = usePathname()
  const { data: session } = useSession()
  const userIsAdmin = isAdmin(session?.user?.email)

  if (!mounted) return null

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-600/50 transition-shadow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">InterviewAce</h1>
            <p className="text-[10px] text-neutral-500 mt-0.5">AI Interview Coach</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto app-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <div className="px-2 mb-1.5">
              <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">
                {section.title}
              </span>
            </div>
            <ul className="space-y-0.5">
              {section.routes.map((route) => {
                const Icon = ICON_MAP[route.icon as keyof typeof ICON_MAP]
                const isActive = pathname === route.href || 
                  (route.href === "/interview/setup" && pathname?.startsWith("/interview"))
                
                return (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-150
                        ${isActive 
                          ? 'bg-indigo-600 text-white nav-active-glow' 
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                      <span className="truncate">{route.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        
        {/* Admin-Only Section */}
        {userIsAdmin && (
          <div>
            <div className="px-2 mb-1.5">
              <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">
                RESEARCH
              </span>
            </div>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/research"
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-150
                    ${pathname === "/research"
                      ? 'bg-purple-600 text-white'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                    }
                  `}
                >
                  <Activity className={`w-4 h-4 flex-shrink-0 ${pathname === "/research" ? 'text-white' : 'text-neutral-500'}`} />
                  <span className="truncate">Research Analytics</span>
                  {pathname === "/research" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                  )}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="px-3 pb-4 pt-2 border-t border-neutral-800 space-y-1">
        {session?.user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-800 transition-colors group">
            <div className="relative w-7 h-7 flex-shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="rounded-full object-cover ring-1 ring-neutral-700 group-hover:ring-indigo-500/50 transition-all"
                />
              ) : (
                <div className="w-7 h-7 bg-neutral-700 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate leading-none">
                {session.user.name || "User"}
              </p>
              <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
