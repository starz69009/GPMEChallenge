"use client"

import { useState } from "react"
import { triggerEvent, closeEvent, updateScore } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Square, Clock, CheckCircle2, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"
import { CountdownTimer } from "@/components/countdown-timer"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function SessionDetailClient({
  session, allEvents, triggeredEvents, equipes, workflows,
}: {
  session: any
  allEvents: any[]
  triggeredEvents: any[]
  equipes: any[]
  workflows: any[]
}) {
  const [openTrigger, setOpenTrigger] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeEvents = triggeredEvents.filter(e => e.statut === "en_cours")
  const completedEvents = triggeredEvents.filter(e => e.statut === "termine")

  // Events already triggered
  const triggeredEventIds = triggeredEvents.map(e => e.evenement_id)
  const availableEvents = allEvents.filter(e => !triggeredEventIds.includes(e.id))

  async function handleTrigger(formData: FormData) {
    const result = await triggerEvent(formData)
    if (result.error) { setError(result.error); return }
    setOpenTrigger(false)
    setError(null)
  }

  async function handleClose(eventId: string) {
    if (!confirm("Forcer la fermeture de cet evenement ?")) return
    await closeEvent(eventId, session.id)
  }

  async function handleScore(formData: FormData) {
    await updateScore(formData)
  }

  const stepLabels = ["Proposition", "Votes", "Validation DG", "Traitement Admin"]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/sessions"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{session.nom}</h1>
          <p className="mt-1 text-muted-foreground">
            Entreprise: {session.entreprises?.nom} | {equipes.length} equipe{equipes.length > 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={openTrigger} onOpenChange={setOpenTrigger}>
          <DialogTrigger asChild>
            <Button disabled={availableEvents.length === 0}>
              <Zap className="mr-2 h-4 w-4" />Declencher un evenement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Declencher un evenement</DialogTitle>
            </DialogHeader>
            <form action={handleTrigger} className="flex flex-col gap-4">
              <input type="hidden" name="session_id" value={session.id} />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-col gap-2">
                <Label>Evenement</Label>
                <Select name="evenement_id" required>
                  <SelectTrigger><SelectValue placeholder="Choisir un evenement" /></SelectTrigger>
                  <SelectContent>
                    {availableEvents.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.titre} ({e.domaine})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Duree (minutes)</Label>
                <Input name="duree_minutes" type="number" defaultValue={30} min={1} required />
                <p className="text-xs text-muted-foreground">Exemples: 30 min, 60 min (1h), 1440 min (1 jour)</p>
              </div>
              <Button type="submit"><Play className="mr-2 h-4 w-4" />Demarrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Clock className="h-4 w-4" />En cours ({activeEvents.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />Termines ({completedEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="flex flex-col gap-4 mt-4">
          {activeEvents.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">Aucun evenement en cours</p>
                <p className="text-sm text-muted-foreground">{"Declenchez un evenement pour commencer"}</p>
              </CardContent>
            </Card>
          ) : activeEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              equipes={equipes}
              workflows={workflows.filter(w => w.evenement_declenche_id === event.id)}
              stepLabels={stepLabels}
              onClose={() => handleClose(event.id)}
              onScore={handleScore}
              isActive
            />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="flex flex-col gap-4 mt-4">
          {completedEvents.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">Aucun evenement termine</p>
              </CardContent>
            </Card>
          ) : completedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              equipes={equipes}
              workflows={workflows.filter(w => w.evenement_declenche_id === event.id)}
              stepLabels={stepLabels}
              onClose={() => {}}
              onScore={handleScore}
              isActive={false}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EventCard({
  event, equipes, workflows, stepLabels, onClose, onScore, isActive,
}: {
  event: any; equipes: any[]; workflows: any[]; stepLabels: string[]
  onClose: () => void; onScore: (fd: FormData) => void; isActive: boolean
}) {
  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-foreground">{event.evenements?.titre}</CardTitle>
          <CardDescription>
            Domaine: {event.evenements?.domaine} | Duree: {event.duree_minutes} min
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          {isActive && <CountdownTimer dateFin={event.date_fin} />}
          {isActive && (
            <Button variant="destructive" size="sm" onClick={onClose}>
              <Square className="mr-1 h-3 w-3" />Forcer fin
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {equipes.map((equipe) => {
            const workflow = workflows.find(w => w.equipe_id === equipe.id)
            return (
              <TeamWorkflowRow
                key={equipe.id}
                equipe={equipe}
                workflow={workflow}
                stepLabels={stepLabels}
                eventId={event.id}
                onScore={onScore}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function TeamWorkflowRow({
  equipe, workflow, stepLabels, eventId, onScore,
}: {
  equipe: any; workflow: any; stepLabels: string[]; eventId: string; onScore: (fd: FormData) => void
}) {
  const [showScore, setShowScore] = useState(false)
  const currentStep = workflow?.etape_courante || 1
  const isDone = workflow?.statut === "termine"

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center gap-4 p-3">
        <div className="flex items-center gap-2 w-36">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: equipe.couleur }} />
          <span className="text-sm font-medium text-foreground">{equipe.nom}</span>
        </div>
        <div className="flex flex-1 items-center gap-1">
          {stepLabels.map((label, i) => {
            const step = i + 1
            const isCompleted = isDone || currentStep > step
            const isCurrent = !isDone && currentStep === step
            return (
              <div key={step} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`h-2 w-full rounded-full ${
                    isCompleted ? "bg-success" : isCurrent ? "bg-primary" : "bg-muted"
                  }`}
                />
                <span className={`text-[10px] ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isDone ? "bg-success/15 text-success border-success/30" : "bg-primary/15 text-primary border-primary/30"}>
            {isDone ? "Termine" : `Etape ${currentStep}`}
          </Badge>
          {workflow && currentStep >= 3 && !isDone && (
            <Button size="sm" variant="outline" onClick={() => setShowScore(!showScore)}>
              Scorer
            </Button>
          )}
        </div>
      </div>
      {showScore && (
        <form action={onScore} className="flex items-end gap-2 border-t border-border px-3 py-2">
          <input type="hidden" name="equipe_id" value={equipe.id} />
          <input type="hidden" name="evenement_declenche_id" value={eventId} />
          {["social", "commercial", "tresorerie", "production", "reglementaire"].map((dim) => (
            <div key={dim} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground capitalize">{dim.slice(0, 4)}</span>
              <Input
                name={`points_${dim}`}
                type="number"
                className="h-7 w-16 text-center text-xs"
                defaultValue={workflow?.options_evenement?.[`points_${dim}`] || 0}
              />
            </div>
          ))}
          <Button size="sm" type="submit">Valider scores</Button>
        </form>
      )}
    </div>
  )
}
