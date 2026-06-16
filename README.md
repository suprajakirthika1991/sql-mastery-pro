<div align="center">

# 🛢️ SQL Mastery Pro

![CI](https://github.com/suprajakirthika1991/sql-mastery-pro/actions/workflows/ci.yml/badge.svg)

**Learn SQL from your first `SELECT` to interview-ready window functions.**

An interactive SQL learning platform: structured lessons, a browser-based SQLite playground, auto-graded coding challenges, an interview-style quiz bank, gamified progress, and an AI tutor.

[Stack](#-stack) · [Quick start](#-quick-start) · [Architecture](#-architecture) · [Scripts](#-scripts) · [Roadmap](#-roadmap)

![CI](https://github.com/YOUR_USERNAME/sql-mastery-pro/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

</div>

---

## ✨ Features

| Area | What it does |
|------|--------------|
| **Learn** | 15 lessons (databases → window functions → star schemas) with real-world analogies, runnable examples, common mistakes, and key takeaways. |
| **Playground** | Real **SQLite compiled to WebAssembly** (sql.js) running entirely in the browser. Joins, GROUP BY, subqueries, CTEs, and full window-function support. CSV export. |
| **Practice** | 12 auto-graded challenges (easy → hard). Your query result is compared against a reference solution; hints provided. |
| **Quiz** | 141-question interview bank across 16 topics, filterable by topic and length, every answer explained. |
| **AI Tutor** | Anthropic-powered SQL mentor that gives hints first, reviews your queries, and generates practice problems — schema-aware. |
| **Progress** | XP, levels, streaks, achievement badges, and personalised next-step recommendations. |

> 💡 A fully working single-file prototype of all of the above is also available as `sql-mastery-pro.html` — open it in any browser, no install required.

---

## 🧱 Stack

- **Frontend** — Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Database / ORM** — PostgreSQL + Prisma
- **Auth** — NextAuth (Google + GitHub OAuth, JWT sessions)
- **Playground engine** — sql.js (SQLite/WASM, client-side)
- **AI Tutor** — Anthropic API (server-side route)
- **Testing** — Jest + React Testing Library (unit), Cypress (e2e)

---

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    then fill in DATABASE_URL, OAuth credentials, and ANTHROPIC_API_KEY

# 3. Set up the database
npx prisma migrate dev --name init
npx prisma db seed          # loads lessons, challenges, and the quiz bank

# 4. Run
npm run dev                 # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Base URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth |
| `ANTHROPIC_API_KEY` | Powers the AI Tutor route |

---

## 🏗️ Architecture

```
prisma/
  schema.prisma            users, lessons, challenges, quiz, attempts, progress
  seed.ts                  seeds content from src/content/*
src/
  content/                 lessons, challenges, quiz bank, playground datasets (content-as-code)
  app/
    (app)/                 learn, practice, quiz, playground, progress, tutor
    api/                   quiz, progress, challenge submit, tutor proxy, auth
  components/              SqlPlayground (sql.js), QuizRunner, LessonView, shells
  lib/                     prisma client, auth config, grading, xp/levels, gamification
.github/workflows/ci.yml   lint, type-check, unit tests, production build on every push
```

### Key design decisions

- **User SQL never touches Postgres.** The playground and challenge grader run sql.js *client-side*; the server only persists results. This removes the entire SQL-injection / query-sandboxing problem class — arbitrary user queries can only ever affect their own browser tab.
- **Deterministic grading.** `src/lib/grading.ts` runs the user query and the reference solution against the same seeded in-memory SQLite DB, then compares **normalised result sets** (order-insensitive unless the challenge says otherwise, with numeric rounding tolerance).
- **Content as code.** Lessons, challenges, and the quiz bank live in `src/content/` and are seeded into Postgres, so they can later be edited through an admin UI without a redeploy.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Jest unit tests |
| `npm run e2e` | Open Cypress |
| `npm run prisma:seed` | Seed content into the database |

---

## ☁️ Deployment

- **Frontend + API** → Vercel (`npm run build` must pass — CI enforces this)
- **Database** → Supabase, Railway, or AWS RDS
- Set the same environment variables in your host's dashboard. Run `npx prisma migrate deploy` against the production database, then seed once.

---

## 🗺️ Roadmap

- [ ] Port the full lesson / challenge / quiz content from the prototype into `src/content/`
- [ ] Flesh out the page components (quiz runner first)
- [ ] Badge definitions + evaluation (`src/lib/gamification.ts`)
- [ ] Mock interview mode (`src/app/(app)/interview/`)
- [ ] Admin content editor (`src/app/admin/`)
- [ ] Spaced-repetition review queue for missed quiz questions

---

## 🤝 Contributing

Issues and PRs welcome. Please run `npm run lint && npm test`