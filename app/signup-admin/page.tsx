"use client"

import { useState } from "react"
import { signUpAdmin } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function SignUpAdminPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSecretCode, setShowSecretCode] = useState(false)

  async function handleSubmit(formData: FormData) {
    if (!showSecretCode) {
      setError("Vous devez cocher la case administrateur.")
      return
    }
    setLoading(true)
    setError(null)
    const result = await signUpAdmin(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">PME</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Inscription Administrateur</CardTitle>
          <CardDescription className="text-muted-foreground">
            {"Creez un compte administrateur pour gerer le jeu"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="prenom" className="text-foreground">Prenom</Label>
                <Input id="prenom" name="prenom" placeholder="Jean" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nom" className="text-foreground">Nom</Label>
                <Input id="nom" name="nom" placeholder="Dupont" required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@exemple.com" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
              <Input id="password" name="password" type="password" placeholder="Minimum 6 caracteres" required minLength={6} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isAdmin"
                checked={showSecretCode}
                onCheckedChange={(checked) => setShowSecretCode(checked === true)}
              />
              <Label htmlFor="isAdmin" className="text-sm text-foreground cursor-pointer">
                {"Creer un compte administrateur"}
              </Label>
            </div>
            {showSecretCode && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="secretCode" className="text-foreground">
                  Code administrateur
                </Label>
                <Input
                  id="secretCode"
                  name="secretCode"
                  type="password"
                  placeholder="Entrez le code secret"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {"Ce code est fourni par l'organisateur du jeu."}
                </p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creation..." : "Creer le compte"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              {"Deja un compte ? Se connecter"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
