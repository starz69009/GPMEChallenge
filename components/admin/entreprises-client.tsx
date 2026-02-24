"use client"

import { useState } from "react"
import { createEntreprise, updateEntreprise, deleteEntreprise } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Building2 } from "lucide-react"

type Entreprise = {
  id: string
  nom: string
  description: string | null
  created_at: string
}

export function EntreprisesClient({ entreprises }: { entreprises: Entreprise[] }) {
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<Entreprise | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(formData: FormData) {
    const result = await createEntreprise(formData)
    if (result.error) { setError(result.error); return }
    setOpen(false)
    setError(null)
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return
    const result = await updateEntreprise(editItem.id, formData)
    if (result.error) { setError(result.error); return }
    setEditItem(null)
    setError(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette entreprise ?")) return
    await deleteEntreprise(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Entreprises</h1>
          <p className="mt-1 text-muted-foreground">Gerez les entreprises du jeu</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nouvelle entreprise</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Creer une entreprise</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <Button type="submit">Creer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {entreprises.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Aucune entreprise</p>
            <p className="text-sm text-muted-foreground">{"Creez votre premiere entreprise pour commencer"}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{entreprises.length} entreprise{entreprises.length > 1 ? "s" : ""}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entreprises.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{e.description || "-"}</TableCell>
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
            <DialogTitle>Modifier entreprise</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="flex flex-col gap-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-nom">Nom</Label>
                <Input id="edit-nom" name="nom" defaultValue={editItem.nom} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editItem.description || ""} />
              </div>
              <Button type="submit">Enregistrer</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
