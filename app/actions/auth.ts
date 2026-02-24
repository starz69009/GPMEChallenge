"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

const ADMIN_SECRET_CODE = "260660"

export async function signUpAdmin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const secretCode = formData.get("secretCode") as string
  const nom = formData.get("nom") as string
  const prenom = formData.get("prenom") as string

  if (secretCode !== ADMIN_SECRET_CODE) {
    return { error: "Code administrateur invalide." }
  }

  // Use admin client to create user (bypasses email confirmation)
  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { is_admin: true, nom, prenom },
  })

  if (error) return { error: error.message }

  // Create joueur record (admin client bypasses RLS)
  if (data.user) {
    const { error: insertError } = await admin.from("joueurs").insert({
      id: data.user.id,
      email,
      nom,
      prenom,
      is_admin: true,
    })
    if (insertError) return { error: insertError.message }
  }

  // Now sign in as the newly created user
  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) return { error: signInError.message }

  redirect("/admin")
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }

  const isAdmin = data.user?.user_metadata?.is_admin === true
  redirect(isAdmin ? "/admin" : "/equipe")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
