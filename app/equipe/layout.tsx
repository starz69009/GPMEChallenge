import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PlayerHeader } from "@/components/player-header"

export default async function PlayerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")
  if (user.user_metadata?.is_admin) redirect("/admin")

  // Get player data
  const { data: joueur } = await supabase
    .from("joueurs")
    .select("*, equipes(nom, couleur, slogan), sessions(nom), entreprises(nom)")
    .eq("id", user.id)
    .single()

  if (!joueur) redirect("/login")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PlayerHeader joueur={joueur} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
