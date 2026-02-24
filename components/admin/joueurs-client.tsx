"use client"

import { useState } from "react"
import { createJoueur, updateJoueur, deleteJoueur } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, UserCog, Eye, EyeOff } from "lucide-react"

const POSTES = ["DG", "Commercial", "RH", "Finance", "Production"]

type Joueur = {
  id: string
  email: string
  mot_de_passe: string | null
  nom: string
  prenom: string
  entreprise_id: string | null
  session_id: string | null
  equipe_id: string | null
  poste: string
  equipes: { nom: string } | null
  sessions: { nom: string } | null
  entreprises: { nom: string } | null
}

type Entreprise = { id: string; nom: string }
type Session = { id: string; nom: string }
type Equipe = { id: string; nom: string; session_id: string }

export function JoueursClient({
  joueurs, entreprises, sessions, equipes
}: {
  joueurs: Joueur[]; entreprises: Entreprise[]; sessions: Session[]; equipes: Equipe[]
}) {
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<Joueur | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [selectedSession, setSelectedSession] = useState<string>("")

  const filteredEquipes = selectedSession 
    ? equipes.filter(e => e.session_id === selectedSession) 
    : equipes

  async function handleCreate(formData: FormData) {
    const result = await createJoueur(formData)
    if (result.error) { setError(result.error); return }
    setOpen(false)
    setError(null)
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return
    const result = await updateJoueur(editItem.id, formData)
    if (result.error) { setError(result.error); return }
    setEditItem(null)
    setError(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce joueur ? Son compte sera definitivement supprime.")) return
    await deleteJoueur(id)
  }

  const posteColor: Record<string, string> = {
    DG: "bg-primary/15 text-primary border-primary/30",
    Commercial: "bg-chart-2/15 text-chart-2 border-chart-2/30",
    RH: "bg-chart-3/15 text-chart-3 border-chart-3/30",
    Finance: "bg-chart-4/15 text-chart-4 border-chart-4/30",
    Production: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Joueurs</h1>
          <p className="mt-1 text-muted-foreground">Creez et gerez les comptes joueurs</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) { setError(null); setSelectedSession("") } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nouveau joueur</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Creer un joueur</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Prenom</Label>
                  <Input name="prenom" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Nom</Label>
                  <Input name="nom" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Mot de passe</Label>
                  <Input name="password" type="text" required minLength={6} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Entreprise</Label>
                  <Select name="entreprise_id">
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      {entreprises.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Session</Label>
                  <Select name="session_id" onValueChange={setSelectedSession}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      {sessions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Equipe</Label>
                  <Select name="equipe_id">
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      {filteredEquipes.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Poste</Label>
                  <Select name="poste" required>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      {POSTES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit">Creer le joueur</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {joueurs.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCog className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Aucun joueur</p>
            <p className="text-sm text-muted-foreground">{"Creez des joueurs pour commencer le jeu"}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{joueurs.length} joueur{joueurs.length > 1 ? "s" : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Joueur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mot de passe</TableHead>
                  <TableHead>Equipe</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {joueurs.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.prenom} {j.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{j.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm text-muted-foreground">
                          {showPasswords[j.id] ? (j.mot_de_passe || "N/A") : "********"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowPasswords(p => ({ ...p, [j.id]: !p[j.id] }))}
                        >
                          {showPasswords[j.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{j.equipes?.nom || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={posteColor[j.poste] || ""}>
                        {j.poste}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditItem(j); setSelectedSession(j.session_id || "") }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(j.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!editItem} onOpenChange={(o) => { if (!o) setEditItem(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier joueur</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Prenom</Label>
                  <Input name="prenom" defaultValue={editItem.prenom} required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Nom</Label>
                  <Input name="nom" defaultValue={editItem.nom} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Entreprise</Label>
                  <Select name="entreprise_id" defaultValue={editItem.entreprise_id || undefined}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      {entreprises.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Session</Label>
                  <Select name="session_id" defaultValue={editItem.session_id || undefined} onValueChange={setSelectedSession}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      {sessions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Equipe</Label>
                  <Select name="equipe_id" defaultValue={editItem.equipe_id || undefined}>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>
                      {filteredEquipes.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Poste</Label>
                  <Select name="poste" defaultValue={editItem.poste}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {POSTES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit">Enregistrer</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
