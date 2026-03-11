import { Sidebar } from "@/components/layout/sidebar"
import { PageTransition } from "@/components/layout/PageTransition"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-neutral-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-neutral-950">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
