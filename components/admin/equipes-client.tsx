"use client"

import { useState } from "react"
import { createEquipe, updateEquipe, deleteEquipe } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Users } from "lucide-react"

type Equipe = {
  id: string
  nom: string
  session_id: string
  couleur: string
  slogan: string | null
  created_at: string
  sessions: { nom: string } | null
}

type Session = { id: string; nom: string }

export function EquipesClient({ equipes, sessions }: { equipes: Equipe[]; sessions: Session[] }) {
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<Equipe | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    const result = await createEquipe(formData)
    if (result.error) { setError(result.error); return }
    setOpen(false)
    setError(null)
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return
    const result = await updateEquipe(editItem.id, formData)
    if (result.error) { setError(result.error); return }
    setEditItem(null)
    setError(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette equipe ?")) return
    await deleteEquipe(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Equipes</h1>
          <p className="mt-1 text-muted-foreground">Gerez les equipes de joueurs</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nouvelle equipe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Creer une equipe</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label>Nom</Label>
                <Input name="nom" placeholder="Equipe Alpha" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Session</Label>
                <Select name="session_id" required>
                  <SelectTrigger><SelectValue placeholder="Choisir une session" /></SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Couleur</Label>
                <Input name="couleur" type="color" defaultValue="#3B82F6" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Slogan</Label>
                <Input name="slogan" placeholder="Optionnel" />
              </div>
              <Button type="submit">Creer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {equipes.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Aucune equipe</p>
            <p className="text-sm text-muted-foreground">{"Creez votre premiere equipe"}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{equipes.length} equipe{equipes.length > 1 ? "s" : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Slogan</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipes.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: e.couleur }} />
                    </TableCell>
                    <TableCell className="font-medium">{e.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{e.sessions?.nom || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">{e.slogan || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditItem(e)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="text-destructive hover:text-destructive">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier equipe</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label>Nom</Label>
                <Input name="nom" defaultValue={editItem.nom} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Session</Label>
                <Select name="session_id" defaultValue={editItem.session_id}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Couleur</Label>
                <Input name="couleur" type="color" defaultValue={editItem.couleur} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Slogan</Label>
                <Input name="slogan" defaultValue={editItem.slogan || ""} />
              </div>
              <Button type="submit">Enregistrer</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
