@AGENTS.md

# Hackathon Skeleton — Claude Instructions

## What this repo is

A reusable Next.js + Prisma + Supabase + Gemini skeleton pre-wired for a 3-person hackathon team.
Each person clones this repo, tells Claude which group they are, pastes the hackathon prompt,
and Claude builds only that group's portion of the app on the correct branch.
All three branches merge into main at the end with zero conflicts.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS, Prisma 7, PostgreSQL on Supabase, Google Gemini API, Recharts

---

## When a teammate opens this repo and gives you a prompt

### Step 1 — Identify the group

The user will say something like "I am Group A" or "I'm working on Group B".
If they do not say which group they are, **ask them before doing anything else**:

> "Which group are you — A, B, or C?"

Do not write any code until you know the group.

### Step 2 — Check out and confirm the correct branch

Run the following immediately:

```bash
git fetch origin
git checkout group-a    # or group-b / group-c depending on what they said
git pull origin group-a # pull latest in case teammates pushed
```

Confirm out loud which branch you are on before writing any code.
If the branch does not exist yet, create it from main:

```bash
git checkout main
git pull origin main
git checkout -b group-a
git push -u origin group-a
```

### Step 3 — Identify what this group builds from the prompt

Read the hackathon prompt and map it to the group's responsibility:

| Group | Default responsibility |
|-------|----------------------|
| **Group A** | User-facing forms, input flows, landing page, navigation shell |
| **Group B** | AI/Gemini integration, backend processing, data pipelines |
| **Group C** | Dashboard, data visualisation (Recharts), alerts, admin/clinician views |

State clearly what this group will build before starting. If something is ambiguous, ask.

### Step 4 — Rename placeholder folders if not already done

If the folders are still named `group-a`, `group-b`, `group-c`, rename them on `main` first
(coordinate with the team — only one person does this):

```bash
git checkout main
git mv app/group-a app/<feature-name>
git mv app/api/group-a app/api/<feature-name>
git mv components/group-a components/<feature-name>
git commit -m "rename group-a folders to <feature-name>"
git push origin main
git checkout group-a
git merge main
```

### Step 5 — Build only inside the group's files

**This is the rule that guarantees zero merge conflicts.**
Only ever create or edit files inside the group's assigned columns:

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
| `lib/ai/gemini.ts` | ❌ never | ✅ owns | ❌ never |
| `app/page.tsx` | ✅ Group A only | ❌ never | ❌ never |
| `app/layout.tsx` | ✅ Group A only | ❌ never | ❌ never |
| `prisma/schema.prisma` | 🔒 coordinate — one person at a time | | |
| `lib/db/prisma.ts` | ❌ never modify — just import `prisma` | | |

**Cross-group data rule:** Groups B and C consume other groups' data only by calling their
API routes via `fetch('/api/group-a/...')`. They never directly import another group's components
or write queries against tables another group owns.

### Step 6 — After each significant piece of work, verify no errors

Run these before committing:

```bash
npx tsc --noEmit
```

Fix every type error before moving on. Do not leave broken code on the branch.

### Step 7 — Commit frequently to the group's branch

```bash
git add <only files in this group's folders>
git commit -m "group-a: <short description>"
git push origin group-a
```

Never use `git add .` or `git add -A` — always add specific files to avoid accidentally
staging files outside the group's ownership column.

### Step 8 — Before declaring the group's work done, run the full check

```bash
npx tsc --noEmit          # zero type errors required
npm run build 2>&1 | tail -20   # must complete without error
```

Only tell the user their work is ready to merge once both pass cleanly.

### Step 9 — Merge instructions (project owner runs this at the end)

```bash
git checkout main
git pull origin main
git merge group-a --no-ff -m "merge group-a"
git merge group-b --no-ff -m "merge group-b"
git merge group-c --no-ff -m "merge group-c"
git push origin main
```

If a conflict appears, it means a file was edited outside its ownership column.
Identify the file, check which group modified it, revert that change on the offending branch,
and re-merge.

---

## When you are the project owner setting up from scratch

Run these steps once on `main` before teammates clone:

1. Rename placeholder folders to match the project (see Step 4 above)
2. Write the full Prisma schema — all models, relationships, and ownership labels
3. Run `npx prisma migrate dev --name init` to push schema to Supabase
4. Write named Gemini stubs in `lib/ai/gemini.ts` for Group B
5. Commit everything to `main` and push
6. Create the three branches from main and push them:
   ```bash
   git checkout -b group-a && git push -u origin group-a && git checkout main
   git checkout -b group-b && git push -u origin group-b && git checkout main
   git checkout -b group-c && git push -u origin group-c && git checkout main
   ```
7. Share the repo URL and the `.env` values with teammates

---

## Database setup (already done for this project)

- Supabase project: `hnpluqjszthcryxgcuvm`
- Region: `aws-1-us-west-2`
- `DATABASE_URL` → pooled connection (port 6543, pgbouncer=true) — runtime
- `DIRECT_URL` → direct connection (port 5432) — migrations only
- Schema already migrated. Run `npx prisma migrate dev --name <change>` for new models.

---

## Commands reference

```bash
npm run dev                              # start dev server → http://localhost:3000
npx tsc --noEmit                         # type-check without building
npm run build                            # full production build check
npx prisma migrate dev --name <name>     # apply schema changes to Supabase
npx prisma generate                      # regenerate client after schema change
npx prisma studio                        # local DB browser → http://localhost:5555
```
