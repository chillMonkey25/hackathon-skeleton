# Hackathon Skeleton

Next.js · TypeScript · Tailwind · Prisma · Supabase · Gemini

---

## For every teammate — do this first

### 1. Clone the repo

```bash
git clone https://github.com/chillMonkey25/hackathon-skeleton.git
cd hackathon-skeleton
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in every value. Get the database URLs from the **project owner** (do not share these in chat or commit them):

```
DATABASE_URL="..."     # get from project owner
DIRECT_URL="..."       # get from project owner
GEMINI_API_KEY="..."   # get your own free key at https://aistudio.google.com/app/apikey
```

> **Never commit `.env`** — it is already gitignored.

### 4. Generate the Prisma client

```bash
npx prisma generate
```

### 5. Check out your group's branch

```bash
git checkout group-a   # if you are Group A
git checkout group-b   # if you are Group B
git checkout group-c   # if you are Group C
```

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the app.

---

## Tell Claude which group you are

Once the dev server is running, open Claude Code in this folder and say:

> "I am Group A. Here is the hackathon prompt: [paste prompt]"

Claude will read the `CLAUDE.md` in this repo, check out your branch, and start building only your part of the app.

---

## File ownership — never edit outside your column

| Folder | Group A | Group B | Group C |
|--------|---------|---------|---------|
| `app/group-a/` | ✅ | ❌ | ❌ |
| `app/api/group-a/` | ✅ | ❌ | ❌ |
| `components/group-a/` | ✅ | ❌ | ❌ |
| `app/group-b/` | ❌ | ✅ | ❌ |
| `app/api/group-b/` | ❌ | ✅ | ❌ |
| `components/group-b/` | ❌ | ✅ | ❌ |
| `app/group-c/` | ❌ | ❌ | ✅ |
| `app/api/group-c/` | ❌ | ❌ | ✅ |
| `components/group-c/` | ❌ | ❌ | ✅ |
| `lib/ai/gemini.ts` | ❌ | ✅ | ❌ |
| `app/page.tsx` + `app/layout.tsx` | ✅ | ❌ | ❌ |
| `prisma/schema.prisma` | 🔒 coordinate with team | | |

This is what guarantees **zero merge conflicts** when all three branches are merged at the end.

---

## Merging at the end

Once all three groups confirm their features work and pass type checks, the project owner runs:

```bash
git checkout main
git merge group-a --no-ff -m "merge group-a"
git merge group-b --no-ff -m "merge group-b"
git merge group-c --no-ff -m "merge group-c"
git push origin main
```

---

## Useful commands

```bash
npm run dev                               # start dev server
npx tsc --noEmit                          # type-check (run before merging)
npx prisma migrate dev --name <name>      # apply a schema change to Supabase
npx prisma generate                       # regenerate client after schema change
npx prisma studio                         # browse the database at localhost:5555
```
