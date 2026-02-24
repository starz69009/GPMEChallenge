import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CalendarDays, Users, UserCog } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [entreprises, sessions, equipes, joueurs] = await Promise.all([
    supabase.from("entreprises").select("id", { count: "exact" }),
    supabase.from("sessions").select("id", { count: "exact" }),
    supabase.from("equipes").select("id", { count: "exact" }),
    supabase.from("joueurs").select("id", { count: "exact" }).eq("is_admin", false),
  ])

  const stats = [
    { label: "Entreprises", count: entreprises.count ?? 0, icon: Building2 },
    { label: "Sessions", count: sessions.count ?? 0, icon: CalendarDays },
    { label: "Equipes", count: equipes.count ?? 0, icon: Users },
    { label: "Joueurs", count: joueurs.count ?? 0, icon: UserCog },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de bord</h1>
        <p className="mt-1 text-muted-foreground">
          {"Vue d'ensemble de votre jeu PME Challenge"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
