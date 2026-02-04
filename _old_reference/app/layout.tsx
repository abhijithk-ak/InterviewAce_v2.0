import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import "./globals.css"

import { Geist, Geist_Mono, Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const geist = Geist({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const sourceSerif4 = Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

export const metadata: Metadata = {
  title: "InterviewAce - AI Mock Interview Practice",
  description: "Master your interviews with AI-powered mock practice, real-time feedback, and comprehensive analytics. Practice technical, behavioral, and system design interviews.",
  keywords: ["interview practice", "mock interview", "AI interview", "technical interview", "behavioral interview", "job interview prep"],
  authors: [{ name: "InterviewAce" }],
  creator: "InterviewAce",
  publisher: "InterviewAce",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "InterviewAce - AI Mock Interview Practice",
    description: "Master your interviews with AI-powered mock practice and real-time feedback",
    siteName: "InterviewAce",
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewAce - AI Mock Interview Practice",
    description: "Master your interviews with AI-powered mock practice and real-time feedback",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192x192.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="InterviewAce" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered:', reg.scope))
                    .catch(err => console.log('SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
