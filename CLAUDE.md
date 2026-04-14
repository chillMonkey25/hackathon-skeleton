@AGENTS.md

# Hackathon Skeleton — Claude Instructions

## What this repo is

A reusable Next.js + Prisma + Supabase + Gemini skeleton pre-wired for a 3-person hackathon team.
The folder structure is pre-split so each person owns a completely distinct set of files.
**No two branches ever touch the same file — so merging all three into main produces zero conflicts.**

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS, Prisma 7, PostgreSQL on Supabase, Google Gemini API, Recharts

---

## When you receive a hackathon prompt

Do ALL of the following automatically — do not wait to be asked.

---

### Step 1 — Analyse the prompt and define three workstreams

Split the project into exactly three groups. Default split:

| Group | Default responsibility |
|-------|----------------------|
| **Group A** | User-facing forms, input flows, landing page, navigation |
| **Group B** | AI/backend processing, data pipelines, Gemini integration |
| **Group C** | Dashboard, data visualisation, alerts, clinician/admin views |

Adapt this to the actual prompt. Every feature must belong to exactly one group — no shared ownership.

---

### Step 2 — Create the three branches immediately

Run these commands before writing any code:

```bash
git checkout main
git pull origin main

git checkout -b group-a
git push -u origin group-a

git checkout main
git checkout -b group-b
git push -u origin group-b

git checkout main
git checkout -b group-c
git push -u origin group-c
```

Each group member clones the repo and checks out their branch:
```bash
git checkout group-a   # or group-b / group-c
```

They work exclusively on their branch and never touch another group's files.

---

### Step 3 — Rename placeholder folders to match the project

The skeleton uses `group-a`, `group-b`, `group-c` as placeholders. Rename them to reflect the actual features, for example:
- `group-a` → `patient`, `user`, `intake`, `onboarding`
- `group-b` → `session`, `engine`, `pipeline`, `ai`
- `group-c` → `dashboard`, `analytics`, `admin`, `clinician`

Provide the exact commands, run these on `main` before the branches are created:

```bash
git mv app/group-a app/<feature-a>
git mv app/api/group-a app/api/<feature-a>
git mv components/group-a components/<feature-a>

git mv app/group-b app/<feature-b>
git mv app/api/group-b app/api/<feature-b>
git mv components/group-b components/<feature-b>

git mv app/group-c app/<feature-c>
git mv app/api/group-c app/api/<feature-c>
git mv components/group-c components/<feature-c>

git commit -m "rename placeholder folders to match project"
git push origin main
```

Then create the branches from the updated main.

---

### Step 4 — Enforce strict file ownership (the no-conflict guarantee)

This is what makes zero merge conflicts possible. Each group ONLY touches files in their column:

| File / folder | Group A | Group B | Group C |
|--------------|---------|---------|---------|
| `app/<feature-a>/` | ✅ owns | ❌ never | ❌ never |
| `app/api/<feature-a>/` | ✅ owns | ❌ never | ❌ never |
| `components/<feature-a>/` | ✅ owns | ❌ never | ❌ never |
| `app/<feature-b>/` | ❌ never | ✅ owns | ❌ never |
| `app/api/<feature-b>/` | ❌ never | ✅ owns | ❌ never |
| `components/<feature-b>/` | ❌ never | ✅ owns | ❌ never |
| `app/<feature-c>/` | ❌ never | ❌ never | ✅ owns |
| `app/api/<feature-c>/` | ❌ never | ❌ never | ✅ owns |
| `components/<feature-c>/` | ❌ never | ❌ never | ✅ owns |
| `lib/ai/gemini.ts` | ❌ never | ✅ owns | ❌ never |
| `app/page.tsx` | ✅ owns | ❌ never | ❌ never |
| `app/layout.tsx` | ✅ owns | ❌ never | ❌ never |
| `prisma/schema.prisma` | 🔒 coordinate | 🔒 coordinate | 🔒 coordinate |
| `lib/db/prisma.ts` | ❌ never modify | ❌ never modify | ❌ never modify |

**Cross-group data access rule:** Groups B and C consume Group A's data only through API routes
(`/api/<feature-a>/`). They call the API — they never import Group A's components or directly
query tables that Group A owns.

**Schema changes rule:** Only ONE person updates `prisma/schema.prisma` at a time.
Agree on the full schema on day one, commit it to `main`, then everyone pulls before branching.
After that, schema changes go through a PR that all three members review before merging.

---

### Step 5 — Design the Prisma schema

Based on the prompt, write out every model needed. Rules:
- Every model: `id String @id @default(cuid())` and `createdAt DateTime @default(now())`
- Join tables: `@@unique([fieldA, fieldB])`
- AI output fields: `Json?` or `String?` — never block record creation on AI processing
- Label each model with which group **writes** it and which groups **read** it
- Commit the final schema to `main` before anyone creates their branch

---

### Step 6 — Write the Gemini stubs for Group B

In `lib/ai/gemini.ts`, replace the placeholder stubs with functions named for the actual project.
For each function:
- Name it after what it does (e.g. `extractSessionSignals`, `generateAlertMessage`)
- Add a comment block describing: the input, the exact JSON shape to return, and any context to include in the prompt
- Leave the body as `throw new Error("Not implemented — Group B owns this")`
- Commit these named stubs to `main` so Groups A and C know what to call

---

### Step 7 — Output the work breakdown for each group

For each group produce:
- **What they build** — bullet list of specific pages, API routes, and components
- **Files they create** — exact paths, no overlap with other groups
- **Files they read but never edit** — API routes from other groups they call via `fetch`
- **Week-by-week tasks** across the hackathon timeline

---

### Step 8 — Write the merge instructions

At the end of the project, merging is done in this order with zero conflicts because no files overlap:

```bash
# Merge all three branches into main
git checkout main
git merge group-a --no-ff -m "merge group-a"
git merge group-b --no-ff -m "merge group-b"
git merge group-c --no-ff -m "merge group-c"
git push origin main
```

If a conflict does appear, it means a group edited a file outside their column — identify which file,
revert that change on the offending branch, and re-merge.

---

## Database setup (already done — do not repeat)

- Supabase project: `hnpluqjszthcryxgcuvm`
- Region: `aws-1-us-west-2`
- `DATABASE_URL` → pooled connection (port 6543, pgbouncer=true) — used at runtime
- `DIRECT_URL` → direct connection (port 5432) — used only by `prisma migrate`
- Schema is already migrated. Run `npx prisma migrate dev --name <change>` for any new models.

---

## Environment variables

Every teammate copies `.env.example` to `.env` and fills in:
1. `DATABASE_URL` — get the pooled URL from the project owner
2. `DIRECT_URL` — get the direct URL from the project owner
3. `GEMINI_API_KEY` — each person gets their own free key at aistudio.google.com

Never commit `.env` — it is gitignored.

---

## Commands reference

```bash
npm run dev                              # start dev server → http://localhost:3000
npx prisma migrate dev --name <name>     # apply schema changes to Supabase
npx prisma generate                      # regenerate client after schema change
npx prisma studio                        # local DB browser → http://localhost:5555
npx tsc --noEmit                         # type-check without building
```
