import type React from "react"
import { AdminSidebar } from "@/components/sidebar-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
