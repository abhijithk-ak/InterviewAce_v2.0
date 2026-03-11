/**
 * Admin Configuration
 * Defines admin emails with access to research analytics and system management
 */

export const ADMIN_EMAILS = [
  "ak.abhijithk@gmail.com",
  // Add additional admin emails here
]

/**
 * Check if a user is an admin
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
