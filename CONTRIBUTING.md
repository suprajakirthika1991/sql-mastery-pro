# Contributing

Thanks for your interest in improving SQL Mastery Pro!

## Development setup
See the [Quick start](./README.md#-quick-start) in the README.

## Before opening a pull request
```bash
npm run lint
npx tsc --noEmit
npm test
```
The CI workflow runs these same checks plus a production build, so green locally usually means green on CI.

## Adding content
- **Lessons** → `src/content/lessons.ts`
- **Challenges** → `src/content/challenges.ts` (include a tested reference `solution`)
- **Quiz questions** → `src/content/quiz.ts`

After editing content, re-run `npx prisma db seed` to load it into your local database.

## Commit style
Short, imperative subject lines (e.g. `Add recursive CTE lesson`). Group related changes into one commit.
