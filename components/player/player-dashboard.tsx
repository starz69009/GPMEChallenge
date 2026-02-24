"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { Zap, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function PlayerDashboard({
  joueur, triggeredEvents, workflows, scores,
}: {
  joueur: any; triggeredEvents: any[]; workflows: any[]; scores: any[]
}) {
  const activeEvents = triggeredEvents.filter(e => e.statut === "en_cours")
  const completedEvents = triggeredEvents.filter(e => e.statut === "termine")

  // Calculate total scores
  const totalScores = scores.reduce((acc, s) => ({
    social: acc.social + (s.points_social || 0),
    commercial: acc.commercial + (s.points_commercial || 0),
    tresorerie: acc.tresorerie + (s.points_tresorerie || 0),
    production: acc.production + (s.points_production || 0),
    reglementaire: acc.reglementaire + (s.points_reglementaire || 0),
  }), { social: 0, commercial: 0, tresorerie: 0, production: 0, reglementaire: 0 })

  const scoreItems = [
    { label: "Social", value: totalScores.social, color: "text-chart-1" },
    { label: "Commercial", value: totalScores.commercial, color: "text-chart-2" },
    { label: "Tresorerie", value: totalScores.tresorerie, color: "text-chart-3" },
    { label: "Production", value: totalScores.production, color: "text-chart-4" },
    { label: "Reglementaire", value: totalScores.reglementaire, color: "text-chart-5" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Tableau de bord
        </h1>
        <p className="mt-1 text-muted-foreground">
          Equipe {joueur.equipes?.nom} | Poste: {joueur.poste}
        </p>
      </div>

      {/* Score overview */}
      {scores.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5" />Scores cumules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {scoreItems.map((item) => (
                <div key={item.label} className="text-center">
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active events */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Evenements en cours ({activeEvents.length})
        </h2>
        {activeEvents.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Zap className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">{"Aucun evenement en cours"}</p>
              <p className="text-sm text-muted-foreground">{"Attendez que l'admin declenche un evenement"}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {activeEvents.map((event) => {
              const workflow = workflows.find(w => w.evenement_declenche_id === event.id)
              return (
                <EventCard key={event.id} event={event} workflow={workflow} joueur={joueur} />
              )
            })}
          </div>
        )}
      </div>

      {/* Completed events */}
      {completedEvents.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Evenements termines ({completedEvents.length})
          </h2>
          <div className="flex flex-col gap-3">
            {completedEvents.map((event) => {
              const workflow = workflows.find(w => w.evenement_declenche_id === event.id)
              return (
                <Card key={event.id} className="border-border opacity-75">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-foreground">{event.evenements?.titre}</CardTitle>
                      <Badge variant="outline" className="bg-success/15 text-success border-success/30">Termine</Badge>
                    </div>
                    <CardDescription>{event.evenements?.domaine}</CardDescription>
                  </CardHeader>
                  {workflow?.options_evenement && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Option choisie: <span className="text-foreground font-medium">{workflow.options_evenement.label}</span>
                      </p>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, workflow, joueur }: { event: any; workflow: any; joueur: any }) {
  const stepLabels = ["Proposition", "Votes", "Validation DG", "Admin"]
  const currentStep = workflow?.etape_courante || 1
  const isDone = workflow?.statut === "termine"
  const isResponsable = workflow?.responsable_id === joueur.id
  const isDG = joueur.poste === "DG"

  // Determine if this player can act at current step
  const canAct = !isDone && (
    (currentStep === 1 && isResponsable) ||
    (currentStep === 2 && !isResponsable) ||
    (currentStep === 3 && isDG)
  )

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-foreground">{event.evenements?.titre}</CardTitle>
            <CardDescription className="mt-1">{event.evenements?.description}</CardDescription>
          </div>
          <CountdownTimer dateFin={event.date_fin} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Step progress */}
        <div className="mb-4 flex items-center gap-1">
          {stepLabels.map((label, i) => {
            const step = i + 1
            const isCompleted = isDone || currentStep > step
            const isCurrent = !isDone && currentStep === step
            return (
              <div key={step} className="flex flex-1 flex-col items-center gap-1">
                <div className={`h-2 w-full rounded-full ${
                  isCompleted ? "bg-success" : isCurrent ? "bg-primary" : "bg-muted"
                }`} />
                <span className={`text-[10px] ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {currentStep === 1 && isResponsable && "C'est a vous de proposer une option"}
            {currentStep === 1 && !isResponsable && "En attente de la proposition du responsable"}
            {currentStep === 2 && !isResponsable && "C'est a vous de voter"}
            {currentStep === 2 && isResponsable && "En attente des votes de l'equipe"}
            {currentStep === 3 && isDG && "C'est a vous de valider en tant que DG"}
            {currentStep === 3 && !isDG && "En attente de la validation du DG"}
            {currentStep === 4 && "En attente du traitement administrateur"}
          </div>
          {canAct && (
            <Button asChild size="sm">
              <Link href={`/equipe/evenement/${event.id}`}>
                Participer <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          )}
          {!canAct && !isDone && (
            <Button asChild size="sm" variant="outline">
              <Link href={`/equipe/evenement/${event.id}`}>
                Voir <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
