"use client"

import { motion } from "framer-motion"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  BarChart2,
  Sun,
  Moon,
  Settings,
  StickyNote,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  Github,
  LogOut,
  MoreVertical,
} from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { SidebarItem } from "./sidebar-item"

interface SidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

const SIDEBAR_GROUPS = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: Briefcase, label: "New Session", href: "/setup" },
    ],
  },
  {
    label: "Practice",
    items: [
      { icon: HelpCircle, label: "Question Bank", href: "/questions" },
      { icon: BookOpen, label: "Learning Hub", href: "/resources" },
      { icon: Github, label: "GitHub Wrap", href: "/github-wrap" },
    ],
  },
  {
    label: "Insights",
    items: [
      { icon: BarChart2, label: "Analytics", href: "/analytics" },
      { icon: StickyNote, label: "Notes", href: "/notes" },
    ],
  },
]

export function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname?.startsWith(path)) return true
    return false
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? "80px" : "280px" }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full border-r border-neutral-100 dark:border-neutral-900 flex flex-col justify-between bg-white dark:bg-black z-20 overflow-hidden shadow-sm"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-neutral-100 dark:border-neutral-900/50">
          <div className={`flex items-center gap-4 w-full ${sidebarCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/10 dark:shadow-white/10">
                <span className="text-white dark:text-black font-bold text-lg">I</span>
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white">
                  InterviewAce
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-3 overflow-y-auto space-y-8 scrollbar-hide">
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex justify-center mb-6 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          {SIDEBAR_GROUPS.map((group, index) => (
            <div key={group.label}>
              {!sidebarCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <SidebarItem
                      icon={item.icon}
                      label={item.label}
                      active={isActive(item.href)}
                      onClick={() => { }}
                      collapsed={sidebarCollapsed}
                    />
                  </Link>
                ))}
              </div>
              {/* Divider between groups unless last */}
              {index < SIDEBAR_GROUPS.length - 1 && !sidebarCollapsed && (
                <div className="my-4 mx-3 h-px bg-neutral-100 dark:bg-neutral-800" />
              )}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-900/50 bg-neutral-50/50 dark:bg-neutral-900/20">
          <Link href="/settings" className="mb-2 block">
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={isActive("/settings")}
              onClick={() => { }}
              collapsed={sidebarCollapsed}
            />
          </Link>

          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white ${sidebarCollapsed ? "justify-center" : ""}`}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-sm font-medium">Toggle Theme</span>}
          </button>

          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            {status === "loading" ? (
              <div className="flex items-center gap-3 justify-center">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              </div>
            ) : session?.user ? (
              <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : "justify-between px-1"}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-neutral-800"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-neutral-800">
                      {session.user.name?.[0] || "U"}
                    </div>
                  )}
                  {!sidebarCollapsed && (
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white truncate max-w-[120px]">
                        {session.user.name}
                      </span>
                      <span className="text-xs text-neutral-500 truncate max-w-[120px]">
                        {session.user.email}
                      </span>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <button
                    onClick={() => signOut()}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-neutral-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("github")}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity ${sidebarCollapsed ? "justify-center" : "justify-center"}`}
              >
                <Github className="w-4 h-4" />
                {!sidebarCollapsed && <span className="text-sm font-semibold">Sign In</span>}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
