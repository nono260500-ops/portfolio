-- ============================================================
-- PORTFOLIO — Données d'exemple (seed)
-- Lance ce fichier APRÈS schema.sql
--
-- Usage :
--   psql $DATABASE_URL -f database/seed.sql
-- ============================================================

INSERT INTO projects (title, description, long_description, category, tags, image_url, project_url, github_url, featured, published, "order")
VALUES
  (
    'Dashboard Analytics',
    'Tableau de bord temps réel avec visualisations interactives de données business.',
    'Application web complète permettant de visualiser des données business en temps réel. Intègre des graphiques interactifs (bar, line, pie), des filtres dynamiques et une export CSV. Développé avec une architecture REST et une base PostgreSQL.',
    'Application Web',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Chart.js'],
    NULL,
    'https://exemple.com/dashboard',
    'https://github.com/vous/dashboard',
    true,
    true,
    1
  ),
  (
    'E-commerce Artisans',
    'Boutique en ligne pour artisans locaux avec paiement intégré et gestion des commandes.',
    'Plateforme e-commerce sur-mesure pour des artisans. Inclut un back-office de gestion des produits, un système de paiement Stripe, la gestion des stocks et un tableau de bord des ventes.',
    'E-commerce',
    ARRAY['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
    NULL,
    'https://exemple.com/boutique',
    NULL,
    true,
    true,
    2
  ),
  (
    'API REST Gestion RH',
    'API REST complète pour la gestion des ressources humaines (congés, présences, fiches de paie).',
    'API REST documentée (OpenAPI) pour la gestion RH. Gère les employés, les congés, les présences et les fiches de paie. Authentification JWT, rôles et permissions, audit log.',
    'API / Backend',
    ARRAY['Node.js', 'Express', 'PostgreSQL', 'Swagger'],
    NULL,
    NULL,
    'https://github.com/vous/api-rh',
    false,
    true,
    3
  ),
  (
    'Site Vitrine Cabinet Médical',
    'Site vitrine responsive pour un cabinet médical avec prise de rendez-vous en ligne.',
    'Site vitrine moderne et accessible pour un cabinet médical. Présentation des médecins, des spécialités, et intégration d'un module de prise de rendez-vous en ligne. Optimisé SEO et RGPD.',
    'Site Vitrine',
    ARRAY['HTML', 'CSS', 'JavaScript', 'Calendly API'],
    NULL,
    'https://exemple.com/cabinet',
    NULL,
    false,
    true,
    4
  ),
  (
    'Application Mobile Budget',
    'Application mobile de gestion de budget personnel avec synchronisation cloud.',
    'App mobile cross-platform de gestion budgétaire. Catégorisation automatique des dépenses, graphiques d'évolution, alertes personnalisées et export PDF des rapports mensuels.',
    'Application Mobile',
    ARRAY['React Native', 'Expo', 'SQLite', 'Node.js'],
    NULL,
    NULL,
    'https://github.com/vous/budget-app',
    false,
    true,
    5
  ),
  (
    'Automatisation Facturation',
    'Script d'automatisation de la facturation et relances clients pour PME.',
    'Solution d'automatisation qui génère automatiquement des factures PDF depuis un tableur Google Sheets, envoie des relances email aux clients en retard et exporte les données comptables.',
    'Automatisation',
    ARRAY['Python', 'Google Sheets API', 'SMTP', 'PDF generation'],
    NULL,
    NULL,
    'https://github.com/vous/auto-facturation',
    false,
    true,
    6
  );
