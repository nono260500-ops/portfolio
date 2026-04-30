-- ============================================================
-- PORTFOLIO — Structure de la base de données
-- Compatible avec n'importe quelle base PostgreSQL
--
-- Usage :
--   psql $DATABASE_URL -f database/schema.sql
--
-- Ou copiez-collez dans votre client SQL (TablePlus, DBeaver, pgAdmin, etc.)
-- ============================================================

-- Supprime la table si elle existe déjà (réinitialisation complète)
-- Commentez cette ligne si vous voulez garder vos données existantes
DROP TABLE IF EXISTS projects;

-- ============================================================
-- TABLE : projects
-- ============================================================
CREATE TABLE projects (
  id            SERIAL PRIMARY KEY,
  title         TEXT    NOT NULL,
  description   TEXT    NOT NULL,
  long_description TEXT,
  category      TEXT    NOT NULL,
  tags          TEXT[]  NOT NULL DEFAULT '{}',
  image_url     TEXT,
  project_url   TEXT,
  github_url    TEXT,
  featured      BOOLEAN NOT NULL DEFAULT false,
  published     BOOLEAN NOT NULL DEFAULT true,
  "order"       INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index pour accélérer les filtres par catégorie
CREATE INDEX idx_projects_category ON projects(category);

-- Index pour les projets vedettes
CREATE INDEX idx_projects_featured ON projects(featured);

-- Index pour les projets publiés
CREATE INDEX idx_projects_published ON projects(published);

-- Index pour l'ordre d'affichage
CREATE INDEX idx_projects_order ON projects("order");

-- ============================================================
-- TRIGGER : met à jour automatiquement updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
