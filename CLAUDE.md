@AGENTS.md

# Hackathon Skeleton — Claude Instructions

## What this repo is

A reusable Next.js + Prisma + Supabase + Gemini skeleton pre-wired for a 3-person hackathon team.
The folder structure is pre-split so each person owns a distinct area with zero overlap.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS, Prisma 7, PostgreSQL on Supabase, Google Gemini API, Recharts

---

## When you receive a hackathon prompt

Do the following automatically — do not wait to be asked:

### 1. Analyse the prompt and identify three workstreams

Split the project into exactly three groups along these lines:

| Group | Default responsibility | Owns |
|-------|----------------------|------|
| **Group A** | User-facing forms and input flows | `app/group-a/`, `app/api/group-a/`, `components/group-a/` |
| **Group B** | AI/backend processing and data pipelines | `app/group-b/`, `app/api/group-b/`, `components/group-b/`, `lib/ai/gemini.ts` stubs |
| **Group C** | Dashboard, data visualisation, and alerting | `app/group-c/`, `app/api/group-c/`, `components/group-c/` |

Adapt the split to the actual prompt. The goal is:
- Each group can work in parallel with minimal merge conflicts
- Each group has a clear deliverable they can demo independently
- Group A finishes slightly earlier and can help Group C

### 2. Output a concrete work breakdown

For each group produce:
- **What they build** — specific pages, API routes, components, and DB tables
- **File paths they own** — exact directories from the table above, renamed to match the feature
- **Dependencies on other groups** — what data/APIs they consume and from whom
- **Week-by-week tasks** — 4 weeks: Foundation → Connect → Intelligence → Polish

### 3. Rename the placeholder folders to match the project

The skeleton uses `group-a`, `group-b`, `group-c` as placeholders.
Rename them to reflect the actual feature areas, e.g.:
- `group-a` → `patient` or `user` or `intake`
- `group-b` → `session` or `engine` or `pipeline`
- `group-c` → `dashboard` or `analytics` or `admin`

List the exact `git mv` commands for the team to run.

### 4. Update the schema

Based on the prompt, propose the Prisma models that go in `prisma/schema.prisma`.
Follow these rules:
- Every model uses `id String @id @default(cuid())`
- Every model gets `createdAt DateTime @default(now())`
- Join tables get a `@@unique` constraint on the pair of foreign keys
- Optional AI output fields use `Json?` or `String?` — never block a record creation on AI processing
- Tell the team which group owns each model and which group only reads it

### 5. Update the Gemini stubs

In `lib/ai/gemini.ts`, rename and describe the three stub functions to match the project:
- One stub per group that needs AI
- Each stub must have a comment describing exactly what prompt it should send and what JSON it should return
- Leave the implementation as `throw new Error("Not implemented")` — the group fills it in

### 6. Produce the CONTRIBUTING.md ownership table

Rewrite `CONTRIBUTING.md` with the actual folder names, model ownership, and branch naming convention for this specific project.

---

## Shared files — coordinate before touching

| File | Who coordinates |
|------|----------------|
| `prisma/schema.prisma` | Agree on models before anyone runs `migrate` |
| `prisma.config.ts` | Do not modify after setup |
| `lib/db/prisma.ts` | Do not modify — just import `prisma` |
| `app/layout.tsx` | Group A typically owns the nav shell |
| `app/page.tsx` | Group A owns the landing/role switcher |

---

## Database setup (already done — do not repeat)

- Supabase project: `hnpluqjszthcryxgcuvm`
- Region: `aws-1-us-west-2`
- `DATABASE_URL` → pooled connection (port 6543, pgbouncer=true) — used at runtime
- `DIRECT_URL` → direct connection (port 5432) — used only by `prisma migrate`
- Schema is already migrated. Run `npx prisma migrate dev --name <change>` for any new models.

---

## Environment variables

Every teammate needs a `.env` file. They copy `.env.example` and fill in:
1. `DATABASE_URL` — pooled Supabase URL (get from project owner)
2. `DIRECT_URL` — direct Supabase URL (get from project owner)
3. `GEMINI_API_KEY` — their own key from Google AI Studio (free)

Never commit `.env`. It is gitignored.

---

## Branch workflow

```
main  ←  develop  ←  feature/group-a-<feature>
                  ←  feature/group-b-<feature>
                  ←  feature/group-c-<feature>
```

- Branch off `develop`
- 1 PR approval required to merge back
- Never push directly to `main`

---

## Commands reference

```bash
npm run dev                              # start dev server → http://localhost:3000
npx prisma migrate dev --name <name>     # apply schema changes to Supabase
npx prisma generate                      # regenerate client after schema change
npx prisma studio                        # local DB browser → http://localhost:5555
npx tsc --noEmit                         # type-check without building
```
