# PHP Conversion

## Why

Run with PHP only — no `npm install` / Vite required for daily use.

## Stack (frozen)

| Piece | Choice |
|-------|--------|
| Server | PHP built-in: `php -S localhost:8080 -t public` |
| Shell | `public/index.php` |
| UI logic | Vanilla JS: `public/assets/js/app.js` (+ `tour.js`) |
| Styles | `public/assets/app.css` |
| Persistence | Browser `localStorage` key `memorize-script.v1` (unchanged) |
| AI | Copy/paste prompts only |
| Legacy | Former Vite/TS `src/` removed (`LEGACY_TS.md`; still in git history) |

## Layout

```
index.php                 # Apache/MAMP entry → public/index.php
public/
  index.php
  assets/
    app.css
    js/
      app.js              # canonical UI (what the browser loads)
      tour.js
      lib/ … types.js …   # small helpers used by node --test verify
tests/js/                 # node --test (verify only; not needed to run app)
.agents/milestones-php.json
AGENTS_LOOP-Convert-PHP.md
```

## Feature parity checklist

- [x] Library CRUD
- [x] Psalm 91 starter (empty text + reference)
- [x] Daily Bread Prayer starter (ESV text)
- [x] Stages: read, understand, reduce, visualize, reconstruct, recall, master
- [x] Progressive hints + stats + scoreboard
- [x] Share (bible omits body)
- [x] Export / import backup
- [x] Hash routes: `#passage/:id/:stage`, `#scoreboard`, `#share/...`

## Agent track

- Milestones: `.agents/milestones-php.json` (P0–P10)
- Loop: `AGENTS_LOOP-Convert-PHP.md`
- State: `.agents/state.json` → `php_conversion`
