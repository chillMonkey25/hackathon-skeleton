# Contributing

## The one rule that makes everything work

**Every group builds a fully independent feature.**
No group imports from, calls, or depends on another group's code or tables.
Each feature works on its own. Merging is automatic because there is nothing to reconcile.

---

## Who owns what

| Group | Pages | API routes | Components | DB tables |
|-------|-------|------------|------------|-----------|
| A | `app/group-a/` | `app/api/group-a/` | `components/group-a/` | Group A's own models |
| B | `app/group-b/` | `app/api/group-b/` | `components/group-b/` | Group B's own models |
| C | `app/group-c/` | `app/api/group-c/` | `components/group-c/` | Group C's own models |

> Folder names are renamed to match your project once the prompt is known.

**The only shared resource is the Supabase database** — one instance, same connection
strings for everyone. Each group has their own tables inside it. Nobody touches another
group's tables.

**Shared files (one person sets up on Day 1, nobody changes after):**
- `prisma/schema.prisma` — full schema agreed as a team, one person migrates
- `lib/db/prisma.ts` — never modify, just `import { prisma }` from here
- `app/layout.tsx` / `app/page.tsx` — Group A owns these
- `lib/ai/gemini.ts` — Group B owns this, only if the project uses AI

---

## Setup

```bash
git clone https://github.com/chillMonkey25/hackathon-skeleton.git
cd hackathon-skeleton
npm install
cp .env.example .env        # fill in DATABASE_URL, DIRECT_URL, GEMINI_API_KEY
npx prisma generate
npm run dev                 # http://localhost:3000
```

---

## Branch workflow

```
main  ←  group-a  (Feature A — fully independent)
      ←  group-b  (Feature B — fully independent)
      ←  group-c  (Feature C — fully independent)
```

1. Check out your branch: `git checkout group-a` (or b / c)
2. Build only inside your group's folders
3. Never import or call anything from another group's folders
4. Push regularly: `git push origin group-a`
5. Run `npx tsc --noEmit` and `npm run build` before declaring done
6. Tell the project owner when your feature is ready

---

## Database changes

1. Tell the team before touching `prisma/schema.prisma`
2. Edit the schema — only add models your group owns
3. `npx prisma migrate dev --name <description>`
4. `npx prisma generate`
5. Commit and push to `main`
6. Everyone pulls main and runs `npx prisma generate`
