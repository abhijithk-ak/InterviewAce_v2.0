export const APP_ROUTES = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "New Session", href: "/interview/setup", icon: "Briefcase" },
  { label: "Question Bank", href: "/questions", icon: "BookOpen" },
  { label: "Learning Hub", href: "/learning-hub", icon: "GraduationCap" },
  { label: "Notes", href: "/notes", icon: "StickyNote" },
  { label: "Analytics", href: "/analytics", icon: "BarChart2" },
  { label: "GitHub Wrap", href: "/github-wrap", icon: "Github" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const

export type AppRoute = typeof APP_ROUTES[number]
