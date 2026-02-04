"use client"

import type { LucideIcon } from "lucide-react"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  active: boolean
  onClick: () => void
  collapsed: boolean
}

export function SidebarItem({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group w-full ${active
          ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white font-medium"
          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
        }`}
    >
      {/* Active Indicator Pille */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black dark:bg-white rounded-r-full" />
      )}

      <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "stroke-2" : "stroke-[1.5] group-hover:scale-110"}`} />

      {!collapsed && (
        <span className="text-sm border-neutral-200 dark:border-neutral-800 whitespace-nowrap overflow-hidden transition-all duration-300 origin-left">
          {label}
        </span>
      )}
    </button>
  )
}
