import { createClient } from "@/lib/supabase/server"
import { EquipesClient } from "@/components/admin/equipes-client"

export default async function EquipesPage() {
  const supabase = await createClient()
  const [equipesRes, sessionsRes] = await Promise.all([
    supabase.from("equipes").select("*, sessions(nom)").order("created_at", { ascending: false }),
    supabase.from("sessions").select("id, nom").order("nom"),
  ])

  return (
    <EquipesClient
      equipes={equipesRes.data ?? []}
      sessions={sessionsRes.data ?? []}
    />
  )
}
