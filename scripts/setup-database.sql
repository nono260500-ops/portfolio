-- ============================================================
-- SETUP COMPLET de la base de données Supabase pour DEV.PRO
-- À coller dans : Supabase → SQL Editor → New query → Run
--
-- Ce script :
--   1. Crée la table `projects` (si elle n'existe pas déjà)
--   2. Vide les données existantes
--   3. Insère les 3 vrais projets
-- ============================================================

-- ─── 1. CRÉATION DE LA TABLE ──────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id               SERIAL PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  long_description TEXT,
  category         TEXT NOT NULL,
  tags             TEXT[] NOT NULL DEFAULT '{}',
  image_url        TEXT,
  project_url      TEXT,
  github_url       TEXT,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  published        BOOLEAN NOT NULL DEFAULT TRUE,
  "order"          INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─── 2. NETTOYAGE (réinitialise les IDs) ──────────────────
TRUNCATE TABLE projects RESTART IDENTITY;

-- ─── 3. INSERTION DES 3 VRAIS PROJETS ─────────────────────
INSERT INTO projects (
  title, description, long_description, category, tags,
  image_url, project_url, github_url, featured, published, "order"
) VALUES
-- ─── Projet 1 : Location Val Fréjus ────────────────────
(
  'Location Val Fréjus',
  'Site de location d''appartement avec système de réservation et paiement en ligne sécurisé.',
  'Plateforme complète de réservation pour un appartement de vacances à Val Fréjus. Calendrier de disponibilités en temps réel, formulaire de réservation, paiement en ligne sécurisé via Stripe, gestion des arrhes et confirmations automatiques par email. Interface responsive optimisée pour mobile et desktop.',
  'E-commerce',
  ARRAY['Réservation', 'Stripe', 'Calendrier', 'Email', 'Responsive'],
  NULL,
  'https://locationvalfrejus.com',
  NULL,
  TRUE,
  TRUE,
  1
),
-- ─── Projet 2 : Suisse Toiture ─────────────────────────
(
  'Suisse Toiture',
  'Site vitrine professionnel pour entreprise de couverture en Suisse, avec formulaire de contact qualifié.',
  'Site vitrine moderne pour une entreprise suisse de toiture. Présentation des services (rénovation, étanchéité, isolation), galerie de réalisations, formulaire de contact qualifié pour générer des demandes de devis, et SEO local optimisé pour capter le trafic régional.',
  'Landing Page',
  ARRAY['Vitrine', 'Formulaire', 'SEO local', 'Responsive'],
  NULL,
  'https://www.suissetoiture.ch',
  NULL,
  TRUE,
  TRUE,
  2
),
-- ─── Projet 3 : DEV.PRO Portfolio ──────────────────────
(
  'DEV.PRO Portfolio',
  'Portfolio professionnel avec back-office d''administration et architecture full-stack moderne.',
  'Le site que vous regardez. Architecture monorepo full-stack : frontend HTML/CSS/JS pur avec Vite (multi-page), backend Express + TypeScript, base PostgreSQL via Drizzle ORM, déploiement serverless sur Vercel. Inclut un back-office d''administration sécurisé pour gérer les projets sans toucher au code.',
  'Application Web',
  ARRAY['TypeScript', 'Express', 'PostgreSQL', 'Drizzle', 'Vercel', 'Vite'],
  NULL,
  NULL,
  'https://github.com/Nono2605/portfolio-Final',
  TRUE,
  TRUE,
  3
);

-- ─── 4. VÉRIFICATION ──────────────────────────────────────
SELECT
  id,
  title,
  category,
  featured,
  published,
  "order",
  array_length(tags, 1) AS nb_tags
FROM projects
ORDER BY "order" ASC;
