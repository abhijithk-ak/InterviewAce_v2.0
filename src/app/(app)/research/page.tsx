import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/config/admin"
import ImprovedDashboard from "./ImprovedDashboard"

/**
 * Research Analytics Page - ADMIN ONLY
 * For IEEE paper - comparison of evaluation methods and system performance
 */
export default async function ResearchPage() {
  const session = await auth()

  // Restrict to admin emails only
  if (!session || !isAdmin(session.user?.email)) {
    redirect("/dashboard")
  }

  return <ImprovedDashboard />
}
