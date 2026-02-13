import { type NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import GitHub from "next-auth/providers/github"
import { env } from "./env"

export const authConfig: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email public_repo"
        }
      }
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account?.provider === "github") {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        // Store GitHub access token and username
        if (account?.access_token) {
          token.accessToken = account.access_token
        }
        if (profile) {
          token.githubUsername = (profile as any).login
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        // Add GitHub data to session
        ;(session as any).accessToken = token.accessToken
        ;(session.user as any).githubUsername = token.githubUsername
      }
      return session
    },
  },
}

export async function auth() {
  return getServerSession(authConfig)
}

