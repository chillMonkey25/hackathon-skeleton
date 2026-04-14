@AGENTS.md

# Hackathon Skeleton — Claude Instructions

## What this repo is

A generic Next.js + Prisma + Supabase skeleton for a 3-person hackathon team.
Each person owns a completely self-contained feature — their own pages, API routes, components,
and database tables. No group depends on any other group's code or data.
All three branches merge into main at the end with zero conflicts.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS, Prisma 7, PostgreSQL on Supabase, Recharts
**Optional:** Gemini API (`lib/ai/gemini.ts`) — only use if the prompt calls for AI

---

## Core rule — every group is fully independent

Each group's feature must work on its own without any other group's code being present.

- No group imports components from another group's folder
- No group calls another group's API routes via fetch
- No group reads from a table that another group writes to
- Each group owns its own tables end to end: they create, read, update, and delete their own data

The only things shared across groups are:
- `lib/db/prisma.ts` — the database client (never modify, just import)
- `prisma/schema.prisma` — agreed on Day 1 before anyone branches
- `app/layout.tsx` / `app/page.tsx` — Group A owns the nav shell and landing page
- A single shared `User` table if authentication is needed (agreed on Day 1)

---

## When a teammate opens this repo and gives you a prompt

### Step 1 — Identify the group

The user will say something like "I am Group A" or "I'm on Group B".
If they do not say which group, **ask before doing anything else**:

> "Which group are you — A, B, or C?"

Do not write any code until you know the group.

### Step 2 — Check out the correct branch

```bash
git fetch origin
git checkout group-a    # or group-b / group-c
git pull origin group-a
```

If the branch does not exist yet, create it from main:

```bash
git checkout main && git pull origin main
git checkout -b group-a
git push -u origin group-a
```

State which branch you are on before writing any code.

### Step 3 — Read the prompt and split into three independent features

Analyse the prompt and identify three features that can be built completely independently.
Each feature must be usable on its own — it has its own data, its own UI, its own API.

Good split examples:
- A user registration/profile feature, a search feature, and a results/history feature
- A submission form feature, a review feature, and a leaderboard feature
- An inventory feature, an orders feature, and a reporting feature

Bad split (creates dependencies):
- A creates data → B processes it → C displays it  ← avoid this

If the prompt naturally has pipeline dependencies, restructure the split so each group owns
one full vertical slice (input + processing + display) for a different part of the product.

State clearly what this group's self-contained feature is before writing any code.

### Step 4 — Decide whether AI is needed

Only use `lib/ai/gemini.ts` if this group's feature genuinely needs AI.
If not needed, ignore that file entirely.
Group B owns `lib/ai/gemini.ts` by default — Groups A and C never touch it.

### Step 5 — Rename placeholder folders to match the feature (first time only)

One person does this on `main` before anyone branches — coordinate with the team:

```bash
git checkout main
git mv app/group-a app/<feature-a-name>
git mv app/api/group-a app/api/<feature-a-name>
git mv components/group-a components/<feature-a-name>
# repeat for group-b and group-c
git commit -m "rename placeholder folders to match features"
git push origin main
```

Then each person merges main into their branch:
```bash
git checkout group-a && git merge main
```

### Step 6 — Build only inside the group's files

| File / folder | Group A | Group B | Group C |
|--------------|---------|---------|---------|
| `app/group-a/` (or renamed) | ✅ owns | ❌ never | ❌ never |
| `app/api/group-a/` (or renamed) | ✅ owns | ❌ never | ❌ never |
| `components/group-a/` (or renamed) | ✅ owns | ❌ never | ❌ never |
| `app/group-b/` (or renamed) | ❌ never | ✅ owns | ❌ never |
| `app/api/group-b/` (or renamed) | ❌ never | ✅ owns | ❌ never |
| `components/group-b/` (or renamed) | ❌ never | ✅ owns | ❌ never |
| `app/group-c/` (or renamed) | ❌ never | ❌ never | ✅ owns |
| `app/api/group-c/` (or renamed) | ❌ never | ❌ never | ✅ owns |
| `components/group-c/` (or renamed) | ❌ never | ❌ never | ✅ owns |
| `lib/ai/gemini.ts` | ❌ never | ✅ if AI needed | ❌ never |
| `app/page.tsx` | ✅ Group A only | ❌ never | ❌ never |
| `app/layout.tsx` | ✅ Group A only | ❌ never | ❌ never |
| `prisma/schema.prisma` | 🔒 one person edits, team agrees first | | |
| `lib/db/prisma.ts` | ❌ never modify — just `import { prisma }` | | |

### Step 7 — Each group owns its own database tables end to end

When the prompt is received, the project owner proposes the schema split so that:
- Each group has its own models in `prisma/schema.prisma`
- No group queries a table owned by another group
- If a shared concept is needed (e.g. User), it is defined once and every group only reads it — nobody except the project owner writes to it during setup

### Step 8 — Verify before every commit

```bash
npx tsc --noEmit
```

Fix every type error before committing. Never push broken code.

### Step 9 — Commit only your group's files

```bash
git add app/group-a/ app/api/group-a/ components/group-a/
git commit -m "group-a: <short description>"
git push origin group-a
```

Never use `git add .` — always stage specific files.

### Step 10 — Before declaring done, run the full check

```bash
npx tsc --noEmit
npm run build
```

Both must pass cleanly before telling the user their feature is ready to merge.

---

## Merging at the end (project owner runs this once)

Because every group worked in separate files on a separate independent feature,
merging is automatic — Git has nothing to reconcile.

```bash
git checkout main
git pull origin main
git merge group-a --no-ff -m "merge group-a"
git merge group-b --no-ff -m "merge group-b"
git merge group-c --no-ff -m "merge group-c"
git push origin main
```

If a conflict appears, a file was edited outside its ownership column.
Find the file, revert that change on the offending branch, and re-merge.

---

## Database setup (already configured)

- Supabase project: `hnpluqjszthcryxgcuvm` · Region: `aws-1-us-west-2`
- `DATABASE_URL` → pooled (port 6543, pgbouncer=true) — runtime queries
- `DIRECT_URL` → direct (port 5432) — migrations only
- Initial migration already applied. Add new models and run migrate for new tables.

---

## Commands reference

```bash
npm run dev                              # start dev server → http://localhost:3000
npx tsc --noEmit                         # type-check
npm run build                            # production build check
npx prisma migrate dev --name <name>     # push schema changes to Supabase
npx prisma generate                      # regenerate Prisma client
npx prisma studio                        # browse DB at localhost:5555
```
