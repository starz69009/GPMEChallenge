import { createClient } from "@/lib/supabase/server"
import { JoueursClient } from "@/components/admin/joueurs-client"

export default async function JoueursPage() {
  const supabase = await createClient()
  const [joueursRes, entreprisesRes, sessionsRes, equipesRes] = await Promise.all([
    supabase.from("joueurs").select("*, equipes(nom), sessions(nom), entreprises(nom)").eq("is_admin", false).order("created_at", { ascending: false }),
    supabase.from("entreprises").select("id, nom").order("nom"),
    supabase.from("sessions").select("id, nom").order("nom"),
    supabase.from("equipes").select("id, nom, session_id").order("nom"),
  ])

  return (
    <JoueursClient
      joueurs={joueursRes.data ?? []}
      entreprises={entreprisesRes.data ?? []}
      sessions={sessionsRes.data ?? []}
      equipes={equipesRes.data ?? []}
    />
  )
}
