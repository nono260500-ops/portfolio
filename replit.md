# Workspace

## Overview

Portfolio site for a web developer / digital agency — dark, modern, conversion-oriented. Includes a public-facing portfolio + services site and an admin interface for project management.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Wouter

## Artifacts

- **portfolio** (`/`) — Public portfolio + services site (dark theme, French)
- **api-server** (`/api`) — Express REST API

## Pages (portfolio)

- `/` — Landing: hero, stats, services, portfolio, pourquoi moi, processus, témoignages, contact
- `/services` — Detailed services page with pricing
- `/a-propos` — About page
- `/contact` — Standalone contact/devis page
- `/projects/:id` — Project detail
- `/admin` — Admin dashboard (add/edit/delete projects)
- `/admin/projects/new` — Create project form
- `/admin/projects/:id/edit` — Edit project form

## Database

- `projects` table: id, title, description, long_description, category, tags[], image_url, project_url, github_url, featured, published, order, created_at, updated_at

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
