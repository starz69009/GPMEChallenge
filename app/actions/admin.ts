"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

// ---- ENTREPRISES ----

export async function createEntreprise(formData: FormData) {
  const supabase = await createClient()
  const nom = formData.get("nom") as string
  const description = formData.get("description") as string

  const { error } = await supabase.from("entreprises").insert({ nom, description })
  if (error) return { error: error.message }
  revalidatePath("/admin/entreprises")
  return { success: true }
}

export async function updateEntreprise(id: string, formData: FormData) {
  const supabase = await createClient()
  const nom = formData.get("nom") as string
  const description = formData.get("description") as string

  const { error } = await supabase.from("entreprises").update({ nom, description }).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/entreprises")
  return { success: true }
}

export async function deleteEntreprise(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("entreprises").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/entreprises")
  return { success: true }
}

// ---- SESSIONS ----

export async function createSession(formData: FormData) {
  const supabase = await createClient()
  const nom = formData.get("nom") as string
  const entreprise_id = formData.get("entreprise_id") as string

  const { error } = await supabase.from("sessions").insert({ nom, entreprise_id })
  if (error) return { error: error.message }
  revalidatePath("/admin/sessions")
  return { success: true }
}

export async function updateSession(id: string, formData: FormData) {
  const supabase = await createClient()
  const nom = formData.get("nom") as string
  const entreprise_id = formData.get("entreprise_id") as string
  const statut = formData.get("statut") as string

  const { error } = await supabase.from("sessions").update({ nom, entreprise_id, statut }).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/sessions")
  return { success: true }
}

export async function deleteSession(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("sessions").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/sessions")
  return { success: true }
}

// ---- EQUIPES ----

export async function createEquipe(formData: FormData) {
  const supabase = await createClient()
  const nom = formData.get("nom") as string
  const session_id = formData.get("session_id") as string
  const couleur = formData.get("couleur") as string || "#3B82F6"
  const slogan = formData.get("slogan") as string

  const { error } = await supabase.from("equipes").insert({ nom, session_id, couleur, slogan })
  if (error) return { error: error.message }
  revalidatePath("/admin/equipes")
  return { success: true }
}

export async function updateEquipe(id: string, formData: FormData) {
  const supabase = await createClient()
  const nom = formData.get("nom") as string
  const session_id = formData.get("session_id") as string
  const couleur = formData.get("couleur") as string
  const slogan = formData.get("slogan") as string

  const { error } = await supabase.from("equipes").update({ nom, session_id, couleur, slogan }).eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/equipes")
  return { success: true }
}

export async function deleteEquipe(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("equipes").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/equipes")
  return { success: true }
}

// ---- JOUEURS ----

export async function createJoueur(formData: FormData) {
  const admin = createAdminClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const nom = formData.get("nom") as string
  const prenom = formData.get("prenom") as string
  const entreprise_id = formData.get("entreprise_id") as string
  const session_id = formData.get("session_id") as string
  const equipe_id = formData.get("equipe_id") as string
  const poste = formData.get("poste") as string

  // Create auth user via admin API (no email confirmation)
  const { data, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { is_admin: false, nom, prenom },
  })

  if (authError) return { error: authError.message }

  // Insert joueur record
  const { error } = await admin.from("joueurs").insert({
    id: data.user.id,
    email,
    mot_de_passe: password,
    nom,
    prenom,
    entreprise_id: entreprise_id || null,
    session_id: session_id || null,
    equipe_id: equipe_id || null,
    poste,
    is_admin: false,
  })

  if (error) return { error: error.message }
  revalidatePath("/admin/joueurs")
  return { success: true }
}

export async function updateJoueur(id: string, formData: FormData) {
  const admin = createAdminClient()
  const nom = formData.get("nom") as string
  const prenom = formData.get("prenom") as string
  const entreprise_id = formData.get("entreprise_id") as string
  const session_id = formData.get("session_id") as string
  const equipe_id = formData.get("equipe_id") as string
  const poste = formData.get("poste") as string

  const { error } = await admin.from("joueurs").update({
    nom,
    prenom,
    entreprise_id: entreprise_id || null,
    session_id: session_id || null,
    equipe_id: equipe_id || null,
    poste,
  }).eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/joueurs")
  return { success: true }
}

export async function deleteJoueur(id: string) {
  const admin = createAdminClient()
  // Delete auth user (cascades to joueurs table)
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) return { error: error.message }
  revalidatePath("/admin/joueurs")
  return { success: true }
}

// ---- EVENTS ----

export async function triggerEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const evenement_id = formData.get("evenement_id") as string
  const session_id = formData.get("session_id") as string
  const duree_minutes = parseInt(formData.get("duree_minutes") as string)

  const date_debut = new Date()
  const date_fin = new Date(date_debut.getTime() + duree_minutes * 60 * 1000)

  // Create the triggered event
  const { data: triggered, error: triggerError } = await supabase
    .from("evenements_declenches")
    .insert({
      evenement_id,
      session_id,
      duree_minutes,
      date_debut: date_debut.toISOString(),
      date_fin: date_fin.toISOString(),
      created_by: user?.id,
    })
    .select()
    .single()

  if (triggerError) return { error: triggerError.message }

  // Get all teams in this session
  const { data: equipes } = await supabase
    .from("equipes")
    .select("id")
    .eq("session_id", session_id)

  if (equipes && equipes.length > 0) {
    // Get the event domain to auto-assign responsible
    const { data: event } = await supabase
      .from("evenements")
      .select("domaine")
      .eq("id", evenement_id)
      .single()

    const domainToPoste: Record<string, string> = {
      "Finance": "Finance",
      "Production": "Production",
      "RH": "RH",
      "Commercial": "Commercial",
      "Reglementaire": "DG",
    }

    const targetPoste = event?.domaine ? domainToPoste[event.domaine] || "DG" : "DG"

    // Create workflow for each team
    for (const equipe of equipes) {
      // Find the responsible player based on role
      const { data: responsable } = await supabase
        .from("joueurs")
        .select("id")
        .eq("equipe_id", equipe.id)
        .eq("poste", targetPoste)
        .limit(1)
        .single()

      await supabase.from("workflow_equipes").insert({
        evenement_declenche_id: triggered.id,
        equipe_id: equipe.id,
        responsable_id: responsable?.id || null,
        etape_courante: 1,
        statut: "en_cours",
      })
    }
  }

  revalidatePath(`/admin/sessions/${session_id}`)
  return { success: true }
}

export async function closeEvent(evenement_declenche_id: string, session_id: string) {
  const supabase = await createClient()
  await supabase
    .from("evenements_declenches")
    .update({ statut: "termine", date_fin: new Date().toISOString() })
    .eq("id", evenement_declenche_id)

  await supabase
    .from("workflow_equipes")
    .update({ statut: "termine" })
    .eq("evenement_declenche_id", evenement_declenche_id)

  revalidatePath(`/admin/sessions/${session_id}`)
  return { success: true }
}

export async function updateScore(formData: FormData) {
  const supabase = await createClient()
  const equipe_id = formData.get("equipe_id") as string
  const evenement_declenche_id = formData.get("evenement_declenche_id") as string
  const points_social = parseInt(formData.get("points_social") as string) || 0
  const points_commercial = parseInt(formData.get("points_commercial") as string) || 0
  const points_tresorerie = parseInt(formData.get("points_tresorerie") as string) || 0
  const points_production = parseInt(formData.get("points_production") as string) || 0
  const points_reglementaire = parseInt(formData.get("points_reglementaire") as string) || 0

  const { error } = await supabase.from("scores_equipes").upsert({
    equipe_id,
    evenement_declenche_id,
    points_social,
    points_commercial,
    points_tresorerie,
    points_production,
    points_reglementaire,
    ajuste_par_admin: true,
  }, { onConflict: "equipe_id,evenement_declenche_id" })

  if (error) return { error: error.message }

  // Mark workflow as done
  await supabase
    .from("workflow_equipes")
    .update({ etape_courante: 4, statut: "termine" })
    .eq("evenement_declenche_id", evenement_declenche_id)
    .eq("equipe_id", equipe_id)

  revalidatePath(`/admin/sessions`)
  return { success: true }
}
