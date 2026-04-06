import { Sidebar } from "@/components/layout/sidebar"
import { PageTransition } from "@/components/layout/PageTransition"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-neutral-950 app-scrollbar">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
