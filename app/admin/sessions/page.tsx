import { createClient } from "@/lib/supabase/server"
import { SessionsClient } from "@/components/admin/sessions-client"

export default async function SessionsPage() {
  const supabase = await createClient()
  const [sessionsRes, entreprisesRes] = await Promise.all([
    supabase.from("sessions").select("*, entreprises(nom)").order("created_at", { ascending: false }),
    supabase.from("entreprises").select("id, nom").order("nom"),
  ])

  return (
    <SessionsClient
      sessions={sessionsRes.data ?? []}
      entreprises={entreprisesRes.data ?? []}
    />
  )
}
