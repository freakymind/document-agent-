"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, FileText, LayoutDashboard, Users, FileCheck, FolderOpen } from "lucide-react"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/institutions", label: "Institutions", icon: Building2 },
  { href: "/admin/document-types", label: "Document Types", icon: FileText },
  { href: "/admin/applications", label: "Applications", icon: FolderOpen },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <FileCheck className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">DocIntel</span>
      </div>
      <nav className="space-y-1 p-4">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Users className="h-4 w-4" />
          Customer Portal
        </Link>
      </div>
    </aside>
  )
}
