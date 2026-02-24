import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PlayerDashboard } from "@/components/player/player-dashboard"

export default async function PlayerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: joueur } = await supabase
    .from("joueurs")
    .select("*, equipes(nom, couleur)")
    .eq("id", user.id)
    .single()

  if (!joueur?.session_id || !joueur?.equipe_id) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-foreground">{"Vous n'etes pas encore assigne a une equipe"}</p>
        <p className="text-sm text-muted-foreground">{"Contactez votre administrateur."}</p>
      </div>
    )
  }

  // Get active triggered events for this session
  const { data: triggeredEvents } = await supabase
    .from("evenements_declenches")
    .select("*, evenements(titre, description, domaine)")
    .eq("session_id", joueur.session_id)
    .order("created_at", { ascending: false })

  // Get workflows for this team
  const { data: workflows } = await supabase
    .from("workflow_equipes")
    .select("*, options_evenement(label)")
    .eq("equipe_id", joueur.equipe_id)

  // Get scores for this team
  const { data: scores } = await supabase
    .from("scores_equipes")
    .select("*")
    .eq("equipe_id", joueur.equipe_id)

  return (
    <PlayerDashboard
      joueur={joueur}
      triggeredEvents={triggeredEvents ?? []}
      workflows={workflows ?? []}
      scores={scores ?? []}
    />
  )
}
