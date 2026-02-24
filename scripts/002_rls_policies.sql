-- PME Challenge - Row Level Security Policies
-- Admin check helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.joueurs WHERE id = auth.uid() AND is_admin = true
  );
$$;

-- Enable RLS on all tables
ALTER TABLE public.entreprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.joueurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options_evenement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evenements_declenches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_dg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores_equipes ENABLE ROW LEVEL SECURITY;

-- ========= ENTREPRISES =========
CREATE POLICY "admin_full_entreprises" ON public.entreprises FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_entreprises" ON public.entreprises FOR SELECT USING (auth.uid() IS NOT NULL);

-- ========= SESSIONS =========
CREATE POLICY "admin_full_sessions" ON public.sessions FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_own_session" ON public.sessions FOR SELECT
  USING (id IN (SELECT session_id FROM public.joueurs WHERE id = auth.uid()));

-- ========= EQUIPES =========
CREATE POLICY "admin_full_equipes" ON public.equipes FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_own_equipe" ON public.equipes FOR SELECT
  USING (session_id IN (SELECT session_id FROM public.joueurs WHERE id = auth.uid()));

-- ========= JOUEURS =========
CREATE POLICY "admin_full_joueurs" ON public.joueurs FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_team_joueurs" ON public.joueurs FOR SELECT
  USING (equipe_id IN (SELECT equipe_id FROM public.joueurs WHERE id = auth.uid()));
CREATE POLICY "joueurs_insert_self" ON public.joueurs FOR INSERT WITH CHECK (id = auth.uid());

-- ========= EVENEMENTS =========
CREATE POLICY "admin_full_evenements" ON public.evenements FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_evenements" ON public.evenements FOR SELECT USING (auth.uid() IS NOT NULL);

-- ========= OPTIONS EVENEMENT =========
CREATE POLICY "admin_full_options" ON public.options_evenement FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_options" ON public.options_evenement FOR SELECT USING (auth.uid() IS NOT NULL);

-- ========= EVENEMENTS DECLENCHES =========
CREATE POLICY "admin_full_ev_declenches" ON public.evenements_declenches FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_own_session_events" ON public.evenements_declenches FOR SELECT
  USING (session_id IN (SELECT session_id FROM public.joueurs WHERE id = auth.uid()));

-- ========= WORKFLOW EQUIPES =========
CREATE POLICY "admin_full_workflow" ON public.workflow_equipes FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_own_workflow" ON public.workflow_equipes FOR SELECT
  USING (equipe_id IN (SELECT equipe_id FROM public.joueurs WHERE id = auth.uid()));
CREATE POLICY "players_update_own_workflow" ON public.workflow_equipes FOR UPDATE
  USING (equipe_id IN (SELECT equipe_id FROM public.joueurs WHERE id = auth.uid()));

-- ========= VOTES =========
CREATE POLICY "admin_full_votes" ON public.votes FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_own_votes" ON public.votes FOR SELECT
  USING (workflow_equipe_id IN (
    SELECT id FROM public.workflow_equipes WHERE equipe_id IN (
      SELECT equipe_id FROM public.joueurs WHERE id = auth.uid()
    )
  ));
CREATE POLICY "players_insert_own_vote" ON public.votes FOR INSERT
  WITH CHECK (joueur_id = auth.uid());

-- ========= VALIDATION DG =========
CREATE POLICY "admin_full_validation_dg" ON public.validation_dg FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_own_validation" ON public.validation_dg FOR SELECT
  USING (workflow_equipe_id IN (
    SELECT id FROM public.workflow_equipes WHERE equipe_id IN (
      SELECT equipe_id FROM public.joueurs WHERE id = auth.uid()
    )
  ));
CREATE POLICY "dg_insert_validation" ON public.validation_dg FOR INSERT
  WITH CHECK (joueur_id = auth.uid());

-- ========= SCORES EQUIPES =========
CREATE POLICY "admin_full_scores" ON public.scores_equipes FOR ALL USING (public.is_admin());
CREATE POLICY "players_read_own_scores" ON public.scores_equipes FOR SELECT
  USING (equipe_id IN (SELECT equipe_id FROM public.joueurs WHERE id = auth.uid()));
