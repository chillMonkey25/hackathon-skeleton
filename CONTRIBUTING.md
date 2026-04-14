# Contributing

## Who owns what

| Group | Pages | API routes | Components |
|-------|-------|------------|------------|
| A | `app/group-a/` | `app/api/group-a/` | `components/group-a/` |
| B | `app/group-b/` | `app/api/group-b/` | `components/group-b/` |
| C | `app/group-c/` | `app/api/group-c/` | `components/group-c/` |

> Folder names will be renamed to match your project once the prompt is known.
> Claude handles the renaming — see `CLAUDE.md`.

**Shared (one person changes at a time):**
- `prisma/schema.prisma` — agree on all models before anyone runs migrate
- `lib/db/prisma.ts` — never modify; just `import { prisma }` from here
- `app/layout.tsx` / `app/page.tsx` — Group A owns these
- `lib/ai/gemini.ts` — Group B owns this, only if the project uses AI

## Setup

```bash
git clone <repo-url>
cd hackathon-skeleton
npm install
cp .env.example .env        # fill in DATABASE_URL, DIRECT_URL, GEMINI_API_KEY
npx prisma generate         # generate the Prisma client
npm run dev                 # http://localhost:3000
```

## Branch workflow

Each group works on their own branch and never edits files outside their column.

```
main  ←  group-a
      ←  group-b
      ←  group-c
```

1. Check out your branch: `git checkout group-a` (or b / c)
2. Work only inside your group's folders
3. Push regularly: `git push origin group-a`
4. When done, tell the project owner — they merge all three into main

## Database changes

If you need to add or change a model in `prisma/schema.prisma`:
1. Tell the team so nobody runs a migration at the same time
2. Edit the schema
3. `npx prisma migrate dev --name <short-description>`
4. `npx prisma generate`
5. Commit the migration file alongside the schema change and push to `main`
6. Everyone else pulls `main` and runs `npx prisma generate`
