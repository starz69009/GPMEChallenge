-- PME Challenge - Seed 12 Events + 72 Options
-- Each event has exactly 6 options with point values across 5 categories

-- ======== EVENT 1: Crise de tresorerie ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000001-0000-0000-0000-000000000001', 'Crise de tresorerie',
 'Votre entreprise fait face a une baisse soudaine de tresorerie. Les comptes montrent un decouvert imminent. Il faut agir vite pour maintenir l''activite.',
 'Finance');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000001-0000-0000-0000-000000000001', 'Negocier un decouvert bancaire', 'Demander a la banque un decouvert autorise temporaire.', 0, 0, 3, 0, 1, 0.80),
('e0000001-0000-0000-0000-000000000001', 'Reduire les charges salariales', 'Mettre en place du chomage partiel ou geler les embauches.', -3, 0, 3, -1, 1, 0.00),
('e0000001-0000-0000-0000-000000000001', 'Relancer les clients debiteurs', 'Envoyer des relances pour accelerer les encaissements.', 0, 1, 2, 0, 1, 0.80),
('e0000001-0000-0000-0000-000000000001', 'Vendre des actifs non essentiels', 'Ceder du materiel ou des stocks pour generer de la tresorerie.', 0, 0, 2, -2, 0, 0.00),
('e0000001-0000-0000-0000-000000000001', 'Demander un pret d''urgence', 'Solliciter un pret rapide aupres d''un organisme financier.', 0, 0, 2, 0, 1, 0.60),
('e0000001-0000-0000-0000-000000000001', 'Ne rien faire et attendre', 'Esperer que la situation se resorbe d''elle-meme.', 0, -1, -3, -1, -1, -1.20);

-- ======== EVENT 2: Investissement strategique ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000002-0000-0000-0000-000000000002', 'Investissement strategique',
 'Une opportunite d''investissement se presente : acquerir un nouveau local ou une nouvelle machine. L''enjeu est de peser les couts et les avantages.',
 'Finance');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000002-0000-0000-0000-000000000002', 'Investir immediatement', 'Acheter maintenant pour profiter de l''opportunite.', 1, 2, -3, 3, 0, 0.60),
('e0000002-0000-0000-0000-000000000002', 'Investir avec un emprunt', 'Financer l''investissement via un pret bancaire.', 0, 2, -1, 3, 1, 1.00),
('e0000002-0000-0000-0000-000000000002', 'Reporter l''investissement', 'Attendre un meilleur moment pour investir.', 0, -1, 1, -1, 0, -0.20),
('e0000002-0000-0000-0000-000000000002', 'Investir partiellement', 'N''acheter qu''une partie de ce qui est propose.', 0, 1, -1, 1, 0, 0.20),
('e0000002-0000-0000-0000-000000000002', 'Chercher un partenaire', 'Trouver un co-investisseur pour partager le risque.', 1, 1, 0, 2, 1, 1.00),
('e0000002-0000-0000-0000-000000000002', 'Refuser l''investissement', 'Decliner completement l''offre.', 0, -2, 2, -2, 0, -0.40);

-- ======== EVENT 3: Depart collaborateur cle ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000003-0000-0000-0000-000000000003', 'Depart d''un collaborateur cle',
 'Un employe essentiel annonce son depart. Son savoir-faire est difficile a remplacer et son absence risque de desorganiser l''equipe.',
 'RH');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000003-0000-0000-0000-000000000003', 'Contre-proposition salariale', 'Proposer une augmentation ou des avantages pour le retenir.', 2, 0, -2, 1, 0, 0.20),
('e0000003-0000-0000-0000-000000000003', 'Lancer un recrutement urgent', 'Publier une offre et recruter rapidement un remplacant.', 0, 0, -1, 0, 1, 0.00),
('e0000003-0000-0000-0000-000000000003', 'Redistribuer les taches', 'Repartir le travail du partant entre les collegues.', -1, 0, 1, -1, 0, -0.20),
('e0000003-0000-0000-0000-000000000003', 'Former un successeur interne', 'Identifier et former un employe interne pour prendre le relais.', 2, 0, -1, 1, 1, 0.60),
('e0000003-0000-0000-0000-000000000003', 'Faire appel a un interim', 'Embaucher un interimaire le temps de trouver un remplacant.', 0, 0, -2, 1, 1, 0.00),
('e0000003-0000-0000-0000-000000000003', 'Ne rien faire', 'Laisser la situation se gerer naturellement.', -2, -1, 0, -2, -1, -1.20);

-- ======== EVENT 4: Conflit d''equipe ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000004-0000-0000-0000-000000000004', 'Conflit d''equipe',
 'Des tensions eclatent entre deux membres de l''equipe, perturbant le travail et l''ambiance generale.',
 'RH');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000004-0000-0000-0000-000000000004', 'Mediation interne', 'Organiser une rencontre avec les deux parties pour resoudre le conflit.', 3, 0, 0, 1, 1, 1.00),
('e0000004-0000-0000-0000-000000000004', 'Faire appel a un mediateur externe', 'Recruter un professionnel externe pour gerer le conflit.', 2, 0, -1, 1, 2, 0.80),
('e0000004-0000-0000-0000-000000000004', 'Sanctionner les responsables', 'Appliquer des sanctions disciplinaires aux fautifs.', -1, 0, 0, 0, 2, 0.20),
('e0000004-0000-0000-0000-000000000004', 'Reorganiser les equipes', 'Separer les personnes en conflit dans des equipes differentes.', 1, 0, 0, -1, 0, 0.00),
('e0000004-0000-0000-0000-000000000004', 'Organiser un team building', 'Mettre en place une activite pour resserrer les liens.', 2, 0, -1, 1, 0, 0.40),
('e0000004-0000-0000-0000-000000000004', 'Ignorer le conflit', 'Ne prendre aucune mesure et esperer que ca passe.', -3, -1, 0, -2, -1, -1.40);

-- ======== EVENT 5: Nouvelle demande gros client ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000005-0000-0000-0000-000000000005', 'Nouvelle demande d''un gros client',
 'Un client important souhaite une commande speciale urgente. La satisfaire pourrait renforcer la relation mais monopoliser des ressources.',
 'Commercial');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000005-0000-0000-0000-000000000005', 'Accepter la commande en totalite', 'Mobiliser toutes les ressources pour satisfaire le client.', 0, 3, 2, -2, 0, 0.60),
('e0000005-0000-0000-0000-000000000005', 'Negocier un delai supplementaire', 'Accepter mais demander plus de temps pour livrer.', 0, 1, 1, 0, 0, 0.40),
('e0000005-0000-0000-0000-000000000005', 'Accepter partiellement', 'Ne livrer qu''une partie de la commande.', 0, 1, 1, -1, 0, 0.20),
('e0000005-0000-0000-0000-000000000005', 'Sous-traiter une partie', 'Confier une partie de la production a un sous-traitant.', 0, 2, 0, 1, 1, 0.80),
('e0000005-0000-0000-0000-000000000005', 'Refuser poliment', 'Decliner la commande en expliquant les contraintes.', 0, -2, 0, 1, 0, -0.20),
('e0000005-0000-0000-0000-000000000005', 'Accepter et embaucher en urgence', 'Recruter du personnel temporaire pour honorer la commande.', 1, 3, -2, 1, 0, 0.60);

-- ======== EVENT 6: Avis negatif viral ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000006-0000-0000-0000-000000000006', 'Avis negatif viral',
 'Un avis tres negatif sur votre entreprise circule sur les reseaux sociaux et menace votre reputation.',
 'Commercial');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000006-0000-0000-0000-000000000006', 'Repondre publiquement et s''excuser', 'Publier une reponse officielle reconnaissant le probleme.', 2, 2, 0, 0, 1, 1.00),
('e0000006-0000-0000-0000-000000000006', 'Contacter le client en prive', 'Essayer de resoudre le probleme discretement.', 1, 1, 0, 0, 0, 0.40),
('e0000006-0000-0000-0000-000000000006', 'Lancer une campagne de communication', 'Investir dans une campagne pour contrebalancer l''avis.', 0, 2, -2, 0, 0, 0.00),
('e0000006-0000-0000-0000-000000000006', 'Demander la suppression de l''avis', 'Tenter de faire retirer l''avis via la plateforme.', -1, 0, 0, 0, -1, -0.40),
('e0000006-0000-0000-0000-000000000006', 'Ameliorer le produit/service', 'Corriger le probleme a la source et communiquer dessus.', 1, 2, -1, 1, 1, 0.80),
('e0000006-0000-0000-0000-000000000006', 'Ignorer l''avis', 'Ne rien faire et laisser passer la crise.', -2, -3, 0, 0, -1, -1.20);

-- ======== EVENT 7: Panne de materiel ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000007-0000-0000-0000-000000000007', 'Panne de materiel',
 'Une machine essentielle tombe en panne, ralentissant fortement la production.',
 'Production');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000007-0000-0000-0000-000000000007', 'Reparer en interne', 'Mobiliser l''equipe technique pour une reparation rapide.', 1, 0, 0, 2, 0, 0.60),
('e0000007-0000-0000-0000-000000000007', 'Faire appel a un reparateur externe', 'Contacter un technicien specialise pour la reparation.', 0, 0, -1, 2, 1, 0.40),
('e0000007-0000-0000-0000-000000000007', 'Acheter une nouvelle machine', 'Remplacer la machine par une neuve.', 0, 1, -3, 3, 1, 0.40),
('e0000007-0000-0000-0000-000000000007', 'Louer une machine temporaire', 'Prendre en location une machine le temps de la reparation.', 0, 0, -1, 1, 0, 0.00),
('e0000007-0000-0000-0000-000000000007', 'Reorganiser la production', 'Adapter le processus pour fonctionner sans la machine.', 1, 0, 0, -1, 0, 0.00),
('e0000007-0000-0000-0000-000000000007', 'Arreter la production temporairement', 'Suspendre la production en attendant la reparation.', -1, -2, -1, -3, 0, -1.40);

-- ======== EVENT 8: Augmentation matieres premieres ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000008-0000-0000-0000-000000000008', 'Augmentation des matieres premieres',
 'Le prix des matieres premieres augmente fortement, impactant vos couts de production.',
 'Production');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000008-0000-0000-0000-000000000008', 'Repercuter sur les prix de vente', 'Augmenter les prix pour compenser la hausse.', 0, -1, 1, 0, 0, 0.00),
('e0000008-0000-0000-0000-000000000008', 'Negocier avec les fournisseurs', 'Rencontrer les fournisseurs pour obtenir de meilleurs tarifs.', 0, 0, 1, 1, 0, 0.40),
('e0000008-0000-0000-0000-000000000008', 'Chercher des fournisseurs alternatifs', 'Identifier de nouveaux fournisseurs moins chers.', 0, 0, 0, 1, 1, 0.40),
('e0000008-0000-0000-0000-000000000008', 'Reduire les marges temporairement', 'Absorber la hausse en reduisant la marge beneficiaire.', 1, 1, -2, 0, 0, 0.00),
('e0000008-0000-0000-0000-000000000008', 'Optimiser les processus', 'Reduire le gaspillage et ameliorer l''efficacite.', 1, 0, 0, 2, 1, 0.80),
('e0000008-0000-0000-0000-000000000008', 'Ne rien changer', 'Continuer comme avant malgre la hausse.', 0, -1, -2, -1, 0, -0.80);

-- ======== EVENT 9: Proposition de formation ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000009-0000-0000-0000-000000000009', 'Proposition de formation',
 'Un organisme propose une formation professionnelle pour vos employes. C''est un investissement en competences mais aussi en temps et argent.',
 'RH');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000009-0000-0000-0000-000000000009', 'Accepter pour toute l''equipe', 'Inscrire tous les employes a la formation.', 3, 1, -2, 1, 2, 1.00),
('e0000009-0000-0000-0000-000000000009', 'Accepter pour quelques employes', 'N''inscrire que les employes les plus concernes.', 2, 0, -1, 1, 1, 0.60),
('e0000009-0000-0000-0000-000000000009', 'Reporter la formation', 'Remettre a plus tard pour des raisons de planning.', 0, 0, 0, 0, 0, 0.00),
('e0000009-0000-0000-0000-000000000009', 'Organiser en interne', 'Creer une formation similaire en interne.', 2, 0, 0, 1, 1, 0.80),
('e0000009-0000-0000-0000-000000000009', 'Demander un financement OPCO', 'Faire financer la formation par un organisme paritaire.', 2, 0, 1, 1, 2, 1.20),
('e0000009-0000-0000-0000-000000000009', 'Refuser la formation', 'Decliner l''offre de formation.', -2, -1, 1, -1, -1, -0.80);

-- ======== EVENT 10: Nouvelle reglementation ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000010-0000-0000-0000-000000000010', 'Nouvelle reglementation',
 'Une nouvelle loi impose des changements dans votre activite. Il faut vous mettre en conformite rapidement.',
 'Reglementaire');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000010-0000-0000-0000-000000000010', 'Se conformer immediatement', 'Mettre en place les changements requis sans attendre.', 1, 0, -2, 0, 3, 0.40),
('e0000010-0000-0000-0000-000000000010', 'Demander un delai de mise en conformite', 'Negocier un delai supplementaire avec l''administration.', 0, 0, 0, 0, 1, 0.20),
('e0000010-0000-0000-0000-000000000010', 'Consulter un expert juridique', 'Faire appel a un avocat pour comprendre les implications.', 0, 0, -1, 0, 2, 0.20),
('e0000010-0000-0000-0000-000000000010', 'Se conformer partiellement', 'Appliquer les changements les plus urgents en premier.', 0, 0, -1, 0, 1, 0.00),
('e0000010-0000-0000-0000-000000000010', 'Rejoindre un collectif d''entreprises', 'S''associer a d''autres entreprises pour mutualiser les couts.', 1, 1, 0, 0, 2, 0.80),
('e0000010-0000-0000-0000-000000000010', 'Ignorer la reglementation', 'Ne pas se conformer et esperer ne pas etre controle.', 0, 0, 1, 0, -3, -0.40);

-- ======== EVENT 11: Inspection surprise ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000011-0000-0000-0000-000000000011', 'Inspection surprise',
 'Un inspecteur se presente a l''improviste pour controler votre entreprise. Vous devez reagir rapidement.',
 'Reglementaire');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000011-0000-0000-0000-000000000011', 'Cooperer pleinement', 'Accueillir l''inspecteur et fournir tous les documents.', 1, 0, 0, 0, 3, 0.80),
('e0000011-0000-0000-0000-000000000011', 'Demander un report', 'Tenter de reporter l''inspection a une date ulterieure.', 0, 0, 0, 0, -1, -0.20),
('e0000011-0000-0000-0000-000000000011', 'Preparer rapidement les documents', 'Mobiliser l''equipe pour rassembler les pieces manquantes.', 0, 0, 0, -1, 1, 0.00),
('e0000011-0000-0000-0000-000000000011', 'Faire appel a un conseil juridique', 'Contacter un avocat pour vous assister pendant l''inspection.', 0, 0, -1, 0, 2, 0.20),
('e0000011-0000-0000-0000-000000000011', 'Cooperer et proposer un plan d''action', 'Montrer votre bonne volonte avec un plan correctif.', 2, 0, -1, 0, 3, 0.80),
('e0000011-0000-0000-0000-000000000011', 'Tenter de dissimuler des irregularites', 'Cacher les problemes a l''inspecteur.', -2, 0, 0, 0, -3, -1.00);

-- ======== EVENT 12: Campagne marketing ratee ========
INSERT INTO public.evenements (id, titre, description, domaine) VALUES
('e0000012-0000-0000-0000-000000000012', 'Campagne marketing ratee',
 'Votre derniere campagne publicitaire n''a pas eu l''effet escompte et a genere des retours negatifs.',
 'Commercial');

INSERT INTO public.options_evenement (evenement_id, label, description, points_social, points_commercial, points_tresorerie, points_production, points_reglementaire, moyenne) VALUES
('e0000012-0000-0000-0000-000000000012', 'Lancer une nouvelle campagne corrective', 'Concevoir une campagne pour corriger l''image.', 0, 2, -2, 0, 0, 0.00),
('e0000012-0000-0000-0000-000000000012', 'Analyser les retours et s''adapter', 'Etudier les critiques pour ameliorer la communication.', 1, 2, 0, 0, 1, 0.80),
('e0000012-0000-0000-0000-000000000012', 'Presenter des excuses publiques', 'Publier un communique reconnaissant l''erreur.', 2, 1, 0, 0, 1, 0.80),
('e0000012-0000-0000-0000-000000000012', 'Retirer la campagne', 'Stopper immediatement la diffusion de la campagne.', 0, 0, -1, 0, 0, -0.20),
('e0000012-0000-0000-0000-000000000012', 'Engager une agence specialisee', 'Confier la communication a des professionnels.', 0, 2, -2, 0, 1, 0.20),
('e0000012-0000-0000-0000-000000000012', 'Ne rien faire', 'Laisser la polemique se calmer d''elle-meme.', -1, -2, 0, 0, -1, -0.80);
