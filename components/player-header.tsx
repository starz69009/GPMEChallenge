"use client"

import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function PlayerHeader({ joueur }: { joueur: any }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">PME</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {joueur.prenom} {joueur.nom}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">{joueur.poste}</Badge>
              {joueur.equipes && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: joueur.equipes.couleur }} />
                  {joueur.equipes.nom}
                </span>
              )}
            </div>
          </div>
        </div>
        <form action={logout}>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Deconnexion
          </Button>
        </form>
      </div>
    </header>
  )
}
