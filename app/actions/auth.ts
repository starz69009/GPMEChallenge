"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

const ADMIN_SECRET_CODE = "260660"

export async function signUpAdmin(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const secretCode = formData.get("secretCode") as string
  const nom = formData.get("nom") as string
  const prenom = formData.get("prenom") as string

  if (secretCode !== ADMIN_SECRET_CODE) {
    return { error: "Code administrateur invalide." }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { is_admin: true, nom, prenom },
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
    },
  })

  if (error) return { error: error.message }

  // Create joueur record via admin client (bypasses RLS)
  if (data.user) {
    const admin = createAdminClient()
    await admin.from("joueurs").insert({
      id: data.user.id,
      email,
      nom,
      prenom,
      is_admin: true,
    })
  }

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
