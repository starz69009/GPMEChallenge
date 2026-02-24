"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/app/actions/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"
import {
  Building2,
  CalendarDays,
  Users,
  UserCog,
  LayoutDashboard,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/entreprises", label: "Entreprises", icon: Building2 },
  { href: "/admin/sessions", label: "Sessions", icon: CalendarDays },
  { href: "/admin/equipes", label: "Equipes", icon: Users },
  { href: "/admin/joueurs", label: "Joueurs", icon: UserCog },
]

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar sticky top-0">
      <div className="flex items-center gap-3 border-b border-sidebar-border p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">PME</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">PME Challenge</p>
          <p className="text-xs text-muted-foreground">Administration</p>
        </div>
      </div>
      <nav className="flex-1 overflow-auto p-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
            {user.user_metadata?.prenom?.[0]}{user.user_metadata?.nom?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.user_metadata?.prenom} {user.user_metadata?.nom}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <form action={logout}>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Deconnexion
          </Button>
        </form>
      </div>
    </aside>
  )
}
