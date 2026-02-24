"use client"

import { useState } from "react"
import Link from "next/link"
import { createSession, updateSession, deleteSession } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, CalendarDays, Eye } from "lucide-react"

type Session = {
  id: string
  nom: string
  entreprise_id: string
  statut: string
  created_at: string
  entreprises: { nom: string } | null
}

type Entreprise = { id: string; nom: string }

export function SessionsClient({ sessions, entreprises }: { sessions: Session[]; entreprises: Entreprise[] }) {
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    const result = await createSession(formData)
    if (result.error) { setError(result.error); return }
    setOpen(false)
    setError(null)
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return
    const result = await updateSession(editItem.id, formData)
    if (result.error) { setError(result.error); return }
    setEditItem(null)
    setError(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette session ? Toutes les donnees associees seront perdues.")) return
    await deleteSession(id)
  }

  const statusColor: Record<string, string> = {
    active: "bg-success/15 text-success border-success/30",
    terminee: "bg-muted text-muted-foreground border-border",
    archivee: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sessions</h1>
          <p className="mt-1 text-muted-foreground">Gerez les sessions de jeu</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nouvelle session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Creer une session</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" placeholder="BTS GPME 2026" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="entreprise_id">Entreprise</Label>
                <Select name="entreprise_id" required>
                  <SelectTrigger><SelectValue placeholder="Choisir une entreprise" /></SelectTrigger>
                  <SelectContent>
                    {entreprises.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Creer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sessions.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Aucune session</p>
            <p className="text-sm text-muted-foreground">{"Creez votre premiere session pour commencer"}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{sessions.length} session{sessions.length > 1 ? "s" : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{s.entreprises?.nom || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[s.statut] || ""}>
                        {s.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/sessions/${s.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditItem(s)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive">
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
            <DialogTitle>Modifier session</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label>Nom</Label>
                <Input name="nom" defaultValue={editItem.nom} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Entreprise</Label>
                <Select name="entreprise_id" defaultValue={editItem.entreprise_id}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {entreprises.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Statut</Label>
                <Select name="statut" defaultValue={editItem.statut}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="terminee">Terminee</SelectItem>
                    <SelectItem value="archivee">Archivee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Enregistrer</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
