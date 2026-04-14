# Contributing

## Who owns what

| Group | Pages | API routes | Components | AI stubs |
|-------|-------|------------|------------|----------|
| A | `app/group-a/` | `app/api/group-a/` | `components/group-a/` | `groupAFeature` in `lib/ai/gemini.ts` |
| B | `app/group-b/` | `app/api/group-b/` | `components/group-b/` | `groupBFeature` in `lib/ai/gemini.ts` |
| C | `app/group-c/` | `app/api/group-c/` | `components/group-c/` | `groupCFeature` in `lib/ai/gemini.ts` |

**Shared (everyone reads, one person changes at a time):**
- `prisma/schema.prisma` — coordinate schema changes before migrating
- `lib/db/prisma.ts` — don't modify; just import `prisma` from here
- `app/layout.tsx` / `app/page.tsx` — shared shell

## Setup

```bash
git clone <repo-url>
cd hackathon-skeleton
npm install
cp .env.example .env      # fill in DATABASE_URL and GEMINI_API_KEY
npx prisma generate       # generate the Prisma client
npx prisma migrate dev    # apply schema to your DB
npm run dev               # http://localhost:3000
```

## Branch workflow

```
main  ←  develop  ←  feature/group-a-checkin
                  ←  feature/group-b-session
                  ←  feature/group-c-dashboard
```

1. Branch off `develop` — name it `feature/<group>-<feature>`
2. Open a PR into `develop`, get 1 approval
3. Never push directly to `main`

## Database changes

If you need to add or change a model in `prisma/schema.prisma`:
1. Tell the team in Slack/Discord so nobody is running a migration at the same time
2. Edit the schema
3. `npx prisma migrate dev --name <short-description>`
4. Commit the generated migration file alongside your schema change
