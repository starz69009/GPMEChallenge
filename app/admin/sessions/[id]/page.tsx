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

  const [evenementsRes, eventsRes, equipesRes] = await Promise.all([
    supabase.from("evenements").select("id, titre, domaine").order("titre"),
    supabase.from("evenements_declenches")
      .select("*, evenements(titre, domaine)")
      .eq("session_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("equipes").select("id, nom, couleur").eq("session_id", id),
  ])

  // Get triggered event IDs, then fetch workflows only if there are any
  const triggeredIds = eventsRes.data?.map(e => e.id) ?? []
  let workflowsData: any[] = []
  if (triggeredIds.length > 0) {
    const { data } = await supabase
      .from("workflow_equipes")
      .select("*, equipes(nom, couleur), options_evenement(label, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire)")
      .in("evenement_declenche_id", triggeredIds)
    workflowsData = data ?? []
  }

  return (
    <SessionDetailClient
      session={session}
      allEvents={evenementsRes.data ?? []}
      triggeredEvents={eventsRes.data ?? []}
      equipes={equipesRes.data ?? []}
      workflows={workflowsData}
    />
  )
}
