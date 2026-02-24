"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CountdownTimer } from "@/components/countdown-timer"
import { ArrowLeft, CheckCircle2, Lock, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"

/* eslint-disable @typescript-eslint/no-explicit-any */

export function EventWorkflow({
  event, options, workflow, votes, dgValidation, joueur, teamMembers,
}: {
  event: any; options: any[]; workflow: any; votes: any[]; dgValidation: any
  joueur: any; teamMembers: any[]
}) {
  const currentStep = workflow?.etape_courante || 1
  const isDone = workflow?.statut === "termine"
  const isExpired = new Date(event.date_fin).getTime() < Date.now()
  const isLocked = isDone || isExpired || event.statut === "termine"
  const isResponsable = workflow?.responsable_id === joueur.id
  const isDG = joueur.poste === "DG"

  const stepLabels = ["Proposition", "Votes", "Validation DG", "Traitement Admin"]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/equipe"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{event.evenements?.titre}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{event.evenements?.description}</p>
        </div>
        <CountdownTimer dateFin={event.date_fin} />
      </div>

      {/* Step progress bar */}
      <div className="flex items-center gap-2">
        {stepLabels.map((label, i) => {
          const step = i + 1
          const isCompleted = isDone || currentStep > step
          const isCurrent = !isDone && currentStep === step
          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex items-center gap-1 w-full">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium shrink-0 ${
                  isCompleted ? "bg-success text-success-foreground" : isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step}
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`h-0.5 flex-1 rounded-full ${isCompleted ? "bg-success" : "bg-muted"}`} />
                )}
              </div>
              <span className={`text-xs ${isCurrent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {isLocked && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {isDone ? "Cet evenement est termine." : isExpired ? "Le temps est ecoule." : "Evenement cloture par l'administrateur."}
          </span>
        </div>
      )}

      {/* Step 1: Proposition */}
      {currentStep >= 1 && (
        <Step1Proposition
          options={options}
          workflow={workflow}
          isResponsable={isResponsable}
          isCurrent={currentStep === 1}
          isLocked={isLocked || currentStep > 1}
        />
      )}

      {/* Step 2: Votes */}
      {currentStep >= 2 && (
        <Step2Votes
          workflow={workflow}
          votes={votes}
          joueur={joueur}
          teamMembers={teamMembers}
          isResponsable={isResponsable}
          isCurrent={currentStep === 2}
          isLocked={isLocked || currentStep > 2}
        />
      )}

      {/* Step 3: DG Validation */}
      {currentStep >= 3 && (
        <Step3DGValidation
          workflow={workflow}
          options={options}
          dgValidation={dgValidation}
          isDG={isDG}
          isCurrent={currentStep === 3}
          isLocked={isLocked || currentStep > 3}
          joueur={joueur}
        />
      )}

      {/* Step 4: Admin treatment */}
      {currentStep >= 4 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Etape 4 - Traitement Administrateur</CardTitle>
            <CardDescription>
              {"L'administrateur va traiter votre decision et attribuer les scores."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDone ? (
              <p className="text-sm text-success">Les scores ont ete attribues par l'administrateur.</p>
            ) : (
              <p className="text-sm text-muted-foreground">En attente du traitement...</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Step1Proposition({
  options, workflow, isResponsable, isCurrent, isLocked,
}: {
  options: any[]; workflow: any; isResponsable: boolean; isCurrent: boolean; isLocked: boolean
}) {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [avantages, setAvantages] = useState("")
  const [inconvenients, setInconvenients] = useState("")
  const [justification, setJustification] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const canSubmit = isResponsable && isCurrent && !isLocked
  const alreadySubmitted = workflow?.option_choisie_id

  async function handleSubmit() {
    if (!selectedOption || !workflow) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from("workflow_equipes").update({
      option_choisie_id: selectedOption,
      avantages,
      inconvenients,
      justification,
      etape_courante: 2,
      updated_at: new Date().toISOString(),
    }).eq("id", workflow.id)
    router.refresh()
  }

  return (
    <Card className={`border-border ${isCurrent ? "ring-1 ring-primary" : ""}`}>
      <CardHeader>
        <CardTitle className="text-foreground">
          Etape 1 - Proposition {alreadySubmitted && <CheckCircle2 className="inline h-4 w-4 text-success ml-2" />}
        </CardTitle>
        <CardDescription>
          {canSubmit
            ? "Choisissez une option et redigez votre justification."
            : isResponsable
            ? "Vous avez deja soumis votre proposition."
            : "Le responsable doit choisir une option."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {canSubmit && !alreadySubmitted ? (
          <>
            <div className="flex flex-col gap-3">
              <Label className="text-foreground">Options disponibles (6)</Label>
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {options.map((opt) => (
                  <div key={opt.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <RadioGroupItem value={opt.id} id={opt.id} className="mt-0.5" />
                    <label htmlFor={opt.id} className="flex-1 cursor-pointer">
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                      {opt.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                      )}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Avantages</Label>
              <Textarea value={avantages} onChange={(e) => setAvantages(e.target.value)} placeholder="Decrivez les avantages de cette option..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Inconvenients</Label>
              <Textarea value={inconvenients} onChange={(e) => setInconvenients(e.target.value)} placeholder="Decrivez les inconvenients..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Justification finale</Label>
              <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Justifiez votre choix..." />
            </div>
            <Button onClick={handleSubmit} disabled={!selectedOption || submitting}>
              {submitting ? "Envoi..." : "Valider la proposition"}
            </Button>
          </>
        ) : (
          <div className="rounded-lg bg-muted/50 p-4">
            {workflow?.options_evenement && (
              <p className="text-sm"><span className="text-muted-foreground">Option choisie:</span> <span className="font-medium text-foreground">{workflow.options_evenement.label}</span></p>
            )}
            {workflow?.justification && (
              <p className="mt-2 text-sm"><span className="text-muted-foreground">Justification:</span> <span className="text-foreground">{workflow.justification}</span></p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Step2Votes({
  workflow, votes, joueur, teamMembers, isResponsable, isCurrent, isLocked,
}: {
  workflow: any; votes: any[]; joueur: any; teamMembers: any[]; isResponsable: boolean
  isCurrent: boolean; isLocked: boolean
}) {
  const [vote, setVote] = useState<string>("")
  const [commentaire, setCommentaire] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const hasVoted = votes.some(v => v.joueur_id === joueur.id)
  const canVote = !isResponsable && isCurrent && !isLocked && !hasVoted
  const votersNeeded = teamMembers.filter(m => m.id !== workflow?.responsable_id)
  const allVoted = votersNeeded.every(v => votes.some(vote => vote.joueur_id === v.id))

  async function handleVote() {
    if (!vote || !workflow) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from("votes").insert({
      workflow_equipe_id: workflow.id,
      joueur_id: joueur.id,
      vote: vote === "oui",
      commentaire,
    })

    // Check if all votes are in; if so, advance to step 3
    const { data: allVotes } = await supabase
      .from("votes")
      .select("id")
      .eq("workflow_equipe_id", workflow.id)

    if ((allVotes?.length || 0) + 1 >= votersNeeded.length) {
      await supabase.from("workflow_equipes").update({
        etape_courante: 3,
        updated_at: new Date().toISOString(),
      }).eq("id", workflow.id)
    }

    router.refresh()
  }

  return (
    <Card className={`border-border ${isCurrent ? "ring-1 ring-primary" : ""}`}>
      <CardHeader>
        <CardTitle className="text-foreground">
          Etape 2 - Votes {allVoted && <CheckCircle2 className="inline h-4 w-4 text-success ml-2" />}
        </CardTitle>
        <CardDescription>
          {votes.length}/{votersNeeded.length} votes recus
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Show existing votes */}
        {votes.length > 0 && (
          <div className="flex flex-col gap-2">
            {votes.map((v) => (
              <div key={v.id} className="flex items-center gap-3 rounded-lg border border-border p-2">
                {v.vote ? <ThumbsUp className="h-4 w-4 text-success" /> : <ThumbsDown className="h-4 w-4 text-destructive" />}
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{v.joueurs?.prenom} {v.joueurs?.nom}</span>
                  <Badge variant="outline" className="ml-2 text-[10px]">{v.joueurs?.poste}</Badge>
                  {v.commentaire && <p className="text-xs text-muted-foreground mt-0.5">{v.commentaire}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {canVote && (
          <div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Label className="text-foreground">Votre vote ({joueur.poste})</Label>
            <RadioGroup value={vote} onValueChange={setVote} className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="oui" id="vote-oui" />
                <label htmlFor="vote-oui" className="text-sm text-foreground cursor-pointer">Oui</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="non" id="vote-non" />
                <label htmlFor="vote-non" className="text-sm text-foreground cursor-pointer">Non</label>
              </div>
            </RadioGroup>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Commentaire ({joueur.poste})</Label>
              <Textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder={`Votre avis en tant que ${joueur.poste}...`} />
            </div>
            <Button onClick={handleVote} disabled={!vote || submitting}>
              {submitting ? "Envoi..." : "Voter"}
            </Button>
          </div>
        )}

        {hasVoted && <p className="text-sm text-success">Vous avez deja vote.</p>}
        {isResponsable && isCurrent && <p className="text-sm text-muted-foreground">{"En tant que responsable, vous ne votez pas a cette etape."}</p>}
      </CardContent>
    </Card>
  )
}

function Step3DGValidation({
  workflow, options, dgValidation, isDG, isCurrent, isLocked, joueur,
}: {
  workflow: any; options: any[]; dgValidation: any; isDG: boolean
  isCurrent: boolean; isLocked: boolean; joueur: any
}) {
  const [selectedOption, setSelectedOption] = useState(workflow?.option_choisie_id || "")
  const [justification, setJustification] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const canValidate = isDG && isCurrent && !isLocked && !dgValidation

  async function handleValidate() {
    if (!selectedOption || !workflow) return
    setSubmitting(true)
    const supabase = createClient()

    const changedOption = selectedOption !== workflow.option_choisie_id

    await supabase.from("validation_dg").insert({
      workflow_equipe_id: workflow.id,
      joueur_id: joueur.id,
      option_validee_id: selectedOption,
      justification,
      a_change_option: changedOption,
    })

    // Update workflow to step 4
    await supabase.from("workflow_equipes").update({
      etape_courante: 4,
      option_choisie_id: selectedOption,
      updated_at: new Date().toISOString(),
    }).eq("id", workflow.id)

    router.refresh()
  }

  return (
    <Card className={`border-border ${isCurrent ? "ring-1 ring-primary" : ""}`}>
      <CardHeader>
        <CardTitle className="text-foreground">
          Etape 3 - Validation DG {dgValidation && <CheckCircle2 className="inline h-4 w-4 text-success ml-2" />}
        </CardTitle>
        <CardDescription>
          {canValidate ? "Validez ou modifiez la decision." : "Le DG doit valider la proposition."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {canValidate ? (
          <>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Option retenue</Label>
              <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedOption !== workflow?.option_choisie_id && (
                <p className="text-xs text-warning">{"Vous changez l'option du responsable."}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Justification du DG</Label>
              <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Votre justification..." />
            </div>
            <Button onClick={handleValidate} disabled={!selectedOption || submitting}>
              {submitting ? "Envoi..." : "Valider la decision"}
            </Button>
          </>
        ) : dgValidation ? (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm">
              <span className="text-muted-foreground">Decision:</span>{" "}
              <span className="font-medium text-foreground">{dgValidation.options_evenement?.label}</span>
            </p>
            {dgValidation.a_change_option && (
              <Badge variant="outline" className="mt-1 bg-warning/15 text-warning border-warning/30">
                {"Option modifiee par le DG"}
              </Badge>
            )}
            {dgValidation.justification && (
              <p className="mt-2 text-sm"><span className="text-muted-foreground">Justification:</span> {dgValidation.justification}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">En attente de la validation du DG...</p>
        )}
      </CardContent>
    </Card>
  )
}
