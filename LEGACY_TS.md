# Legacy Vite / TypeScript tree

The `src/`, `index.html`, `vite.config.ts`, and `package.json` tooling were used to build the first MVP.

**They are not required to run the app.** Prefer:

```bash
php -S localhost:8080 -t public
```

Canonical runtime assets live under `public/`.

If you change TypeScript sources for reference, regenerate browser assets with esbuild (optional):

```bash
npx esbuild src/main.ts --bundle --format=iife --outfile=public/assets/js/app.js
```

Agent history for the TS MVP: `.agents/milestones.json` + `AGENTS_LOOP-Continue-Milestone.md` (drained).  
PHP conversion track: `.agents/milestones-php.json` + `AGENTS_LOOP-Convert-PHP.md`.
