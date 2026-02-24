import { createClient } from "@/lib/supabase/server"
import { EntreprisesClient } from "@/components/admin/entreprises-client"

export default async function EntreprisesPage() {
  const supabase = await createClient()
  const { data: entreprises } = await supabase
    .from("entreprises")
    .select("*")
    .order("created_at", { ascending: false })

  return <EntreprisesClient entreprises={entreprises ?? []} />
}
