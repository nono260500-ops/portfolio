# Déploiement sur Vercel

## Prérequis

- Un compte Vercel → [vercel.com](https://vercel.com) (gratuit)
- Votre projet poussé sur GitHub / GitLab / Bitbucket
- Une base de données PostgreSQL (ex : [Neon](https://neon.tech) — gratuit)

---

## Étapes

### 1. Créez une base de données Neon (si pas déjà fait)

1. Allez sur [neon.tech](https://neon.tech) → créez un compte gratuit
2. Créez un projet → copiez la `DATABASE_URL` (format `postgresql://...`)

---

### 2. Importez le projet sur Vercel

1. Allez sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importez votre repo GitHub
3. Vercel détecte automatiquement le `vercel.json` — ne touchez à rien

---

### 3. Configurez les variables d'environnement

Dans **Settings → Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` |
| `SESSION_SECRET` | une chaîne aléatoire longue (ex: 64 caractères) |

> `NODE_ENV=production` est déjà défini dans `vercel.json`.

---

### 4. Initialisez la base de données

Une seule fois, depuis votre Mac :

```bash
psql "postgresql://..." -f database/schema.sql
psql "postgresql://..." -f database/seed.sql   # optionnel : données d'exemple
```

---

### 5. Déployez

Cliquez **Deploy** sur Vercel — ou poussez simplement sur votre branche principale.

Chaque `git push` déclenche un nouveau déploiement automatiquement.

---

## Mise à jour du site

```bash
# Faites vos modifications, puis :
git add .
git commit -m "mise à jour"
git push
# → Vercel redéploie automatiquement
```

---

## Domaine personnalisé

Dans **Settings → Domains** sur Vercel, ajoutez votre domaine Infomaniak.
Infomaniak vous donnera les enregistrements DNS à configurer (CNAME ou A).

---

## Structure du déploiement

```
vercel.json              ← configuration Vercel (à la racine)
artifacts/
  api-server/
    dist/
      vercel.mjs         ← point d'entrée serverless (généré par deploy:build)
      public/            ← pages HTML/CSS/JS (servies par Express)
```
