-- PME Challenge - Database Schema
-- All core tables for the serious game

-- 1. Entreprises
CREATE TABLE IF NOT EXISTS public.entreprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  entreprise_id UUID NOT NULL REFERENCES public.entreprises(id) ON DELETE CASCADE,
  statut TEXT NOT NULL DEFAULT 'active' CHECK (statut IN ('active', 'terminee', 'archivee')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Equipes
CREATE TABLE IF NOT EXISTS public.equipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  couleur TEXT DEFAULT '#3B82F6',
  logo_url TEXT,
  slogan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Joueurs (references auth.users)
CREATE TABLE IF NOT EXISTS public.joueurs (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  mot_de_passe TEXT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  entreprise_id UUID REFERENCES public.entreprises(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  equipe_id UUID REFERENCES public.equipes(id) ON DELETE SET NULL,
  poste TEXT CHECK (poste IN ('DG', 'Commercial', 'RH', 'Finance', 'Production')),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Evenements (master event list)
CREATE TABLE IF NOT EXISTS public.evenements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  domaine TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Options Evenement (6 per event)
CREATE TABLE IF NOT EXISTS public.options_evenement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evenement_id UUID NOT NULL REFERENCES public.evenements(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  points_social INTEGER DEFAULT 0,
  points_commercial INTEGER DEFAULT 0,
  points_tresorerie INTEGER DEFAULT 0,
  points_production INTEGER DEFAULT 0,
  points_reglementaire INTEGER DEFAULT 0,
  moyenne NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Evenements Declenches (triggered events in a session)
CREATE TABLE IF NOT EXISTS public.evenements_declenches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evenement_id UUID NOT NULL REFERENCES public.evenements(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  duree_minutes INTEGER NOT NULL DEFAULT 30,
  date_debut TIMESTAMPTZ DEFAULT now(),
  date_fin TIMESTAMPTZ NOT NULL,
  statut TEXT NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'termine')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Workflow Equipes (per-team workflow for triggered events)
CREATE TABLE IF NOT EXISTS public.workflow_equipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evenement_declenche_id UUID NOT NULL REFERENCES public.evenements_declenches(id) ON DELETE CASCADE,
  equipe_id UUID NOT NULL REFERENCES public.equipes(id) ON DELETE CASCADE,
  etape_courante INTEGER NOT NULL DEFAULT 1 CHECK (etape_courante >= 1 AND etape_courante <= 4),
  option_choisie_id UUID REFERENCES public.options_evenement(id),
  avantages TEXT,
  inconvenients TEXT,
  justification TEXT,
  responsable_id UUID REFERENCES auth.users(id),
  statut TEXT NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'termine', 'bloque')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Votes (team members vote on proposal)
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_equipe_id UUID NOT NULL REFERENCES public.workflow_equipes(id) ON DELETE CASCADE,
  joueur_id UUID NOT NULL REFERENCES auth.users(id),
  vote BOOLEAN NOT NULL,
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(workflow_equipe_id, joueur_id)
);

-- 10. Validation DG
CREATE TABLE IF NOT EXISTS public.validation_dg (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_equipe_id UUID NOT NULL REFERENCES public.workflow_equipes(id) ON DELETE CASCADE,
  joueur_id UUID NOT NULL REFERENCES auth.users(id),
  option_validee_id UUID NOT NULL REFERENCES public.options_evenement(id),
  justification TEXT,
  a_change_option BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Scores Equipes
CREATE TABLE IF NOT EXISTS public.scores_equipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipe_id UUID NOT NULL REFERENCES public.equipes(id) ON DELETE CASCADE,
  evenement_declenche_id UUID NOT NULL REFERENCES public.evenements_declenches(id) ON DELETE CASCADE,
  points_social INTEGER DEFAULT 0,
  points_commercial INTEGER DEFAULT 0,
  points_tresorerie INTEGER DEFAULT 0,
  points_production INTEGER DEFAULT 0,
  points_reglementaire INTEGER DEFAULT 0,
  ajuste_par_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(equipe_id, evenement_declenche_id)
);
