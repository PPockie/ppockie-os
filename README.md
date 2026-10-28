# ppockie-os

A personal portfolio styled as a desktop OS: folders open as draggable windows, a dock links to About, Education and Resume/CV, and the content (projects, skills, achievements, experience, contacts) is read from Supabase. English and Thai are supported.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- Tailwind CSS 4
- [next-intl](https://next-intl.dev) for `en` / `th` routing (English has no prefix: `/projects`, Thai is `/th/projects`)
- [Supabase](https://supabase.com) (Postgres + Storage) as a read-only content store
- GSAP for the intro and animations

## Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project (the free tier is enough)

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` from Supabase, under Project Settings, then API:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The `anon` public key |

The app throws on startup if either is missing. Only the public anon key is used; every table is read-only to it through Row Level Security.

### 3. Database

Open the Supabase SQL Editor and run these files, in order.

Migrations, from `supabase/migrations/`:

1. `0001_init.sql` (core tables, RLS, public `media` storage bucket)
2. `0002_documents.sql`
3. `0003_cv_sections.sql`
4. `0004_skills.sql`
5. `0005_skill_level_profile_bio.sql`
6. `0006_skill_groups_by_position.sql`
7. `0007_achievement_tools.sql`
8. `0008_achievement_position.sql`
9. `0009_achievement_images.sql`

Seed data, from `supabase/seed/`:

1. `01_contacts.sql`
2. `02_projects.sql`
3. `03_documents.sql`
4. `05_profile.sql`
5. `06_skills.sql`
6. `07_experiences.sql`
7. `08_education.sql`
8. `04_achievements_optional.sql` (sample achievements, skip if you have your own)

The seeds are my own data. Replace them with yours, or edit the rows in the Supabase dashboard afterwards.

### 4. Resume / CV (optional)

The Resume/CV button in the dock only appears when a published document exists.

1. Upload the PDF to the `media` bucket, e.g. `documents/cv-en.pdf` and `documents/cv-th.pdf`.
2. In the `documents` table, make sure `file_path` matches and set `is_published` to `true`.

A Thai visitor falls back to the English file when there is no Thai one.

### 5. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server. Database content is not cached, so dashboard edits show on refresh |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## How it works

- **Windows and URLs.** Opening a folder opens a window and updates the URL to `/<folder>`: `projects`, `skills`, `achievements`, `blogs`, `contact`, `about`, `education`, `resume`. Visiting one of these URLs directly opens that window after the intro finishes.
- **Responsive.** Below 1024px the dock moves to the bottom with four slots (About, Education, Resume/CV, Contact) and the folders become an icon grid, like a phone home screen.
- **Data.** Queries live in `src/libs/supabase/queries.ts`. Text columns come in `_en` / `_th` pairs and fall back to English when the Thai one is empty. Production pages are cached and revalidated hourly, so they keep rendering if the free-tier database is paused.
- **Translations.** UI strings are in `messages/en.json` and `messages/th.json`.

## Project layout

```
src/app/[locale]/        layout, desktop page, and [folder]/ deep links
src/components/          ui (navbar, intro, welcome), window (windows and their contents)
src/constants/           folders and navbar configuration
src/hooks/               animation effects and the draggable-window hook
src/libs/supabase/       client, row types, queries
src/i18n/                routing and request config
messages/                en / th strings
supabase/                migrations and seed SQL
```

## Deploying

1. Import the repo into [Vercel](https://vercel.com). The Next.js preset needs no extra build settings.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for Production and Preview.
3. Add the domain under Project Settings, then Domains. If DNS is on Cloudflare, add the records Vercel shows. When proxied (orange cloud), set SSL/TLS to **Full (strict)** and turn off Rocket Loader and Auto Minify.

### Supabase keep-alive

`.github/workflows/supabase-keepalive.yml` queries the database daily so the free tier is not paused. Add these repository secrets for it to work:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
