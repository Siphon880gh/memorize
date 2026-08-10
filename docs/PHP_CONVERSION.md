# PHP Conversion

## Why

Run with PHP only — no `npm install` / Vite required for daily use.

## Stack (frozen)

| Piece | Choice |
|-------|--------|
| Server | PHP built-in: `php -S localhost:8080 -t public` |
| Shell | `public/index.php` |
| UI logic | Vanilla ES modules under `public/assets/js/` |
| Styles | `public/assets/app.css` |
| Persistence | Browser `localStorage` key `memorize-script.v1` (unchanged) |
| AI | Copy/paste prompts only |
| Legacy | Vite/TS tree under `src/` until P10 marks it legacy |

## Layout

```
public/
  index.php
  assets/
    app.css
    js/
      app.js
      repository.js
      types.js
      data/starters.js
      lib/...
      ui/...
tests/js/          # node --test (verify only; not needed to run app)
.agents/milestones-php.json
AGENTS_LOOP-Convert-PHP.md
```

## Feature parity checklist

- [x] Library CRUD
- [x] Psalm 91 starter (empty text + reference)
- [x] Daily Bread Prayer starter (KJV text)
- [x] Stages: read, understand, reduce, visualize, reconstruct, recall, master
- [x] Progressive hints + stats + scoreboard
- [x] Share (bible omits body)
- [x] Export / import backup
- [x] Hash routes: `#passage/:id/:stage`, `#scoreboard`, `#share/...`

## Agent track

- Milestones: `.agents/milestones-php.json` (P0–P10)
- Loop: `AGENTS_LOOP-Convert-PHP.md`
- State: `.agents/state.json` → `php_conversion`
