#!/bin/bash
# ============================================================
# PORTFOLIO — Lancement en local
# Usage : ./start-local.sh [--seed]
#   --seed  : Recharge les données d'exemple (efface les données existantes)
# ============================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WITH_SEED=false

# Lecture des arguments
for arg in "$@"; do
  case $arg in
    --seed) WITH_SEED=true ;;
  esac
done

# ── Vérifications ───────────────────────────────────────────

if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm n'est pas installé."
  echo "   Installez-le : npm install -g pnpm"
  exit 1
fi

ENV_FILE="$ROOT_DIR/artifacts/api-server/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Fichier .env manquant dans artifacts/api-server/"
  echo ""
  echo "   Créez-le depuis le modèle :"
  echo "   cp artifacts/api-server/.env.example artifacts/api-server/.env"
  echo ""
  echo "   Puis renseignez DATABASE_URL avec votre connexion PostgreSQL."
  echo "   Exemples dans .env.example (local, Neon, Supabase, Railway...)"
  exit 1
fi

# Charge le DATABASE_URL depuis .env
source "$ENV_FILE"

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL n'est pas défini dans artifacts/api-server/.env"
  exit 1
fi

# ── Dépendances ─────────────────────────────────────────────

echo "📦 Installation des dépendances..."
cd "$ROOT_DIR"
pnpm install --silent

# ── Base de données ─────────────────────────────────────────

echo "🗄️  Création de la structure de la base de données..."
if command -v psql &> /dev/null; then
  psql "$DATABASE_URL" -f "$ROOT_DIR/database/schema.sql" -q
  echo "   ✓ Structure créée"

  if [ "$WITH_SEED" = true ]; then
    echo "   Chargement des données d'exemple..."
    psql "$DATABASE_URL" -f "$ROOT_DIR/database/seed.sql" -q
    echo "   ✓ Données d'exemple insérées"
  else
    # Vérifie si la table est vide pour proposer le seed
    COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM projects" 2>/dev/null | tr -d ' \n' || echo "0")
    if [ "$COUNT" = "0" ]; then
      echo ""
      echo "   ℹ️  La table projects est vide."
      echo "   Pour ajouter des données d'exemple : ./start-local.sh --seed"
      echo ""
    fi
  fi
else
  echo "   ⚠️  psql non trouvé — structure non appliquée automatiquement."
  echo "   Appliquez manuellement : psql \$DATABASE_URL -f database/schema.sql"
fi

# ── API ─────────────────────────────────────────────────────

echo "⚙️  Démarrage de l'API (port 3001)..."
cd "$ROOT_DIR/artifacts/api-server"
pnpm dev &
API_PID=$!

# Attend que l'API soit prête (max 15s)
echo -n "   Attente de l'API"
for i in {1..15}; do
  if curl -s "http://localhost:3001/api/health" > /dev/null 2>&1 || \
     curl -s "http://localhost:3001/api/projects" > /dev/null 2>&1; then
    echo " ✓"
    break
  fi
  echo -n "."
  sleep 1
done
echo ""

# ── Site HTML ───────────────────────────────────────────────

echo "🌐 Démarrage du site HTML (port 5173)..."
cd "$ROOT_DIR/artifacts/portfolio"
PORT=5173 BASE_PATH=/ API_PORT=3001 pnpm dev &
WEB_PID=$!

sleep 2

echo ""
echo "═══════════════════════════════════════"
echo "  ✅ Projet lancé !"
echo "═══════════════════════════════════════"
echo "  → Site :  http://localhost:5173"
echo "  → Admin : http://localhost:5173/admin/"
echo "  → API :   http://localhost:3001/api"
echo "═══════════════════════════════════════"
echo "  Ctrl+C pour arrêter"
echo ""

# Arrête proprement sur Ctrl+C
trap "echo ''; echo 'Arrêt du projet...'; kill $API_PID $WEB_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
