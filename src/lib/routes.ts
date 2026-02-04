export const APP_ROUTES = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "New Session", href: "/interview/setup", icon: "Briefcase" },
  { label: "Analytics", href: "/analytics", icon: "BarChart2" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const

export type AppRoute = typeof APP_ROUTES[number]
