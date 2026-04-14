@AGENTS.md

# Hackathon Skeleton — Claude Instructions

## What this repo is

A generic Next.js + Prisma + Supabase skeleton for a 3-person hackathon team.
The folder structure is pre-split so each person owns completely separate files.
All three branches merge into main at the end with zero conflicts.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS, Prisma 7, PostgreSQL on Supabase, Recharts
**Optional:** Gemini API (`lib/ai/gemini.ts`) — only use it if the prompt calls for AI

---

## When a teammate opens this repo and gives you a prompt

### Step 1 — Identify the group

The user will say something like "I am Group A" or "I'm working on Group B".
If they do not say which group they are, **ask them before doing anything else**:

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

Confirm the branch name out loud before writing any code.

### Step 3 — Read the prompt and plan the split

Analyse the prompt and divide the work into three independent workstreams.
The split should follow this pattern:

| Group | Default responsibility |
|-------|----------------------|
| **A** | User-facing pages, forms, input flows, navigation, landing page |
| **B** | Backend processing, business logic, AI integration (if needed), data pipelines |
| **C** | Dashboard, data visualisation (Recharts), reporting, admin views |

Adjust the split to fit the actual prompt. State clearly what this group builds before starting.
If anything is ambiguous, ask.

### Step 4 — Decide whether AI is needed

Only use `lib/ai/gemini.ts` if the prompt genuinely requires AI generation or processing.
If AI is not needed, ignore that file entirely — do not import it or install extra packages.
If AI IS needed, Group B owns `lib/ai/gemini.ts`. Groups A and C never touch it.

### Step 5 — Rename placeholder folders to match the project (first time only)

If folders are still named `group-a/b/c`, rename them on `main` before branching.
One person does this — coordinate with the team:

```bash
git checkout main
git mv app/group-a app/<feature-name>
git mv app/api/group-a app/api/<feature-name>
git mv components/group-a components/<feature-name>
# repeat for group-b and group-c
git commit -m "rename placeholder folders to match project"
git push origin main

# then update your branch
git checkout group-a
git merge main
```

### Step 6 — Build only inside the group's files

**This is what makes zero merge conflicts possible.**
Only ever create or edit files inside the group's assigned column:

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
| `lib/ai/gemini.ts` | ❌ never | ✅ (if AI needed) | ❌ never |
| `app/page.tsx` | ✅ Group A only | ❌ never | ❌ never |
| `app/layout.tsx` | ✅ Group A only | ❌ never | ❌ never |
| `prisma/schema.prisma` | 🔒 one person edits, team agrees first | | |
| `lib/db/prisma.ts` | ❌ never modify — just `import { prisma }` from here | | |

**Cross-group data rule:** Groups consume other groups' data only by calling their API routes
via `fetch('/api/group-a/...')`. Never import another group's components or write directly
to a table another group owns.

### Step 7 — Schema changes (coordinate before running migrate)

Only one person edits `prisma/schema.prisma` at a time.
Ideal flow: agree on all models on Day 1, one person writes and migrates the full schema,
everyone pulls `main` before branching. After that, schema changes go through a quick team check.

```bash
npx prisma migrate dev --name <description>   # after editing schema.prisma
npx prisma generate                            # after any schema change
```

### Step 8 — Verify before every commit

```bash
npx tsc --noEmit
```

Fix every type error before committing. Never push broken code to a branch.

### Step 9 — Commit only your group's files

```bash
git add app/group-a/ app/api/group-a/ components/group-a/
git commit -m "group-a: <short description>"
git push origin group-a
```

Never use `git add .` — always add specific files to avoid touching other groups' folders.

### Step 10 — Before declaring done, run the full check

```bash
npx tsc --noEmit
npm run build
```

Both must pass cleanly. Only tell the user their work is ready to merge once they do.

---

## Merging at the end (project owner runs this)

```bash
git checkout main
git pull origin main
git merge group-a --no-ff -m "merge group-a"
git merge group-b --no-ff -m "merge group-b"
git merge group-c --no-ff -m "merge group-c"
git push origin main
```

If a conflict appears, a file was edited outside its ownership column.
Identify the file, revert that change on the offending branch, and re-merge.

---

## Database setup (already configured)

- Supabase project: `hnpluqjszthcryxgcuvm` · Region: `aws-1-us-west-2`
- `DATABASE_URL` → pooled (port 6543, pgbouncer=true) — runtime queries
- `DIRECT_URL` → direct (port 5432) — migrations only
- Initial migration already applied. Add new models to `schema.prisma` and run migrate.

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
