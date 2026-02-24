import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { SessionDetailClient } from "@/components/admin/session-detail-client"

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: session } = await supabase
    .from("sessions")
    .select("*, entreprises(nom)")
    .eq("id", id)
    .single()

  if (!session) notFound()

  const [evenementsRes, eventsRes, equipesRes, workflowsRes] = await Promise.all([
    supabase.from("evenements").select("id, titre, domaine").order("titre"),
    supabase.from("evenements_declenches")
      .select("*, evenements(titre, domaine)")
      .eq("session_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("equipes").select("id, nom, couleur").eq("session_id", id),
    supabase.from("workflow_equipes")
      .select("*, equipes(nom, couleur), options_evenement(label, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire), votes(*), validation_dg(*, options_evenement(label))")
      .in("evenement_declenche_id", 
        (await supabase.from("evenements_declenches").select("id").eq("session_id", id)).data?.map(e => e.id) || []
      ),
  ])

  return (
    <SessionDetailClient
      session={session}
      allEvents={evenementsRes.data ?? []}
      triggeredEvents={eventsRes.data ?? []}
      equipes={equipesRes.data ?? []}
      workflows={workflowsRes.data ?? []}
    />
  )
}
