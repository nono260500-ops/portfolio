# Déploiement sur Infomaniak (Node.js)

## Ce qui tourne en production

Un seul processus Node.js qui fait tout :
- Sert les pages HTML/CSS/JS (accueil, services, à propos, contact, admin)
- Répond aux appels API (`/api/projects`, etc.)
- Se connecte à votre base de données PostgreSQL

---

## Prérequis

- Hébergement **Cloud Server** ou **VPS** Infomaniak avec Node.js ≥ 20
- Base de données PostgreSQL (Infomaniak en propose, ou Neon/Supabase gratuit)
- Git installé sur le serveur

---

## Étapes de déploiement

### 1. Transférez votre code

```bash
git clone <votre-repo> /home/your-user/portfolio
cd /home/your-user/portfolio
```

Ou via SFTP : envoyez tout le projet sauf `node_modules/` et `.env`.

---

### 2. Installez pnpm (si pas déjà fait)

```bash
npm install -g pnpm
```

---

### 3. Installez les dépendances

```bash
pnpm install --frozen-lockfile
```

---

### 4. Créez le fichier `.env`

Dans `artifacts/api-server/`, créez `.env` :

```env
DATABASE_URL=postgresql://user:password@host:5432/nom_de_la_base
PORT=3000
NODE_ENV=production
SESSION_SECRET=changez-cette-valeur-par-une-chaine-aleatoire
```

> **PORT** : Infomaniak assigne souvent un port spécifique.
> Vérifiez dans votre panneau de contrôle Infomaniak quel port utiliser.

---

### 5. Créez la structure de la base de données

**Une seule fois** (ou après une réinitialisation) :

```bash
psql $DATABASE_URL -f database/schema.sql
```

---

### 6. Compilez le projet

```bash
pnpm run deploy:build
```

Cette commande :
1. Compile les pages HTML/CSS/JS en fichiers optimisés
2. Compile le serveur Node.js
3. Copie les pages HTML dans le dossier du serveur

---

### 7. Démarrez le serveur

```bash
pnpm run deploy:start
```

---

## Configuration dans le panneau Infomaniak

Dans votre panneau de contrôle Node.js Infomaniak :

| Paramètre | Valeur |
|-----------|--------|
| **Commande de build** | `pnpm install --frozen-lockfile && pnpm run deploy:build` |
| **Commande de démarrage** | `pnpm run deploy:start` |
| **Version Node.js** | 20 ou 22 (LTS) |
| **Répertoire racine** | `/` (racine du projet) |

Variables d'environnement à définir dans le panneau Infomaniak :
- `DATABASE_URL`
- `NODE_ENV=production`
- `SESSION_SECRET`
- `PORT` (si Infomaniak ne l'injecte pas automatiquement)

---

## Mise à jour du site

```bash
git pull
pnpm install --frozen-lockfile
pnpm run deploy:build
# Redémarrez le processus Node.js depuis le panneau Infomaniak
```

---

## Structure du dossier de production

Après `deploy:build`, le serveur lit uniquement :

```
artifacts/api-server/dist/
├── index.mjs          ← Point d'entrée Node.js
├── public/            ← Pages HTML/CSS/JS compilées
│   ├── index.html
│   ├── services/
│   ├── a-propos/
│   ├── contact/
│   └── admin/
└── *.mjs              ← Code serveur compilé
```

---

## Test local avant déploiement

```bash
# Compilez
pnpm run deploy:build

# Démarrez en mode production
cd artifacts/api-server
DATABASE_URL=... PORT=3000 NODE_ENV=production node --enable-source-maps ./dist/index.mjs

# Ouvrez http://localhost:3000
```
