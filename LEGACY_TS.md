# Legacy Vite / TypeScript (removed)

The original Vite/TypeScript MVP lived under `src/`. That tree was removed after the PHP conversion.

**Active codebase:** `public/` (PHP shell + vanilla JS). History of the TS MVP remains in git and in `.agents/milestones.json` / `AGENTS_LOOP-Continue-Milestone.md`.

```bash
php -S localhost:8080 -t public
```

No `npm install` or TypeScript build is required.
