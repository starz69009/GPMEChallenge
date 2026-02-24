import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { EventWorkflow } from "@/components/player/event-workflow"

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: joueur } = await supabase
    .from("joueurs")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!joueur) redirect("/login")

  // Get the triggered event
  const { data: event } = await supabase
    .from("evenements_declenches")
    .select("*, evenements(titre, description, domaine, id)")
    .eq("id", id)
    .single()

  if (!event) notFound()

  // Get options for this event
  const { data: options } = await supabase
    .from("options_evenement")
    .select("*")
    .eq("evenement_id", event.evenement_id)
    .order("created_at")

  // Get workflow for this team
  const { data: workflow } = await supabase
    .from("workflow_equipes")
    .select("*, options_evenement(label)")
    .eq("evenement_declenche_id", id)
    .eq("equipe_id", joueur.equipe_id)
    .single()

  // Get votes for this workflow
  const { data: votes } = workflow
    ? await supabase
        .from("votes")
        .select("*, joueurs(nom, prenom, poste)")
        .eq("workflow_equipe_id", workflow.id)
    : { data: [] }

  // Get DG validation
  const { data: dgValidation } = workflow
    ? await supabase
        .from("validation_dg")
        .select("*, options_evenement(label)")
        .eq("workflow_equipe_id", workflow.id)
        .single()
    : { data: null }

  // Get team members
  const { data: teamMembers } = await supabase
    .from("joueurs")
    .select("id, nom, prenom, poste")
    .eq("equipe_id", joueur.equipe_id)

  return (
    <EventWorkflow
      event={event}
      options={options ?? []}
      workflow={workflow}
      votes={votes ?? []}
      dgValidation={dgValidation}
      joueur={joueur}
      teamMembers={teamMembers ?? []}
    />
  )
}
