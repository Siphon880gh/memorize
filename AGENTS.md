# AGENTS — Memorize Script

## Canonical runtime

**PHP + vanilla JS** under `public/`.

```bash
php -S localhost:8080 -t public
```

## Reading order

1. `.agents/state.json` — especially `php_conversion` for the active PHP track
2. `.agents/milestones-php.json` — PHP conversion milestones (P0–P10)
3. `AGENTS_LOOP-Convert-PHP.md` — drain loop for PHP track
4. `docs/PHP_CONVERSION.md`, `PRODUCT.md`, `docs/DATA_MODEL.md`
5. Legacy TS MVP (historical): `.agents/milestones.json`, `AGENTS_LOOP-Continue-Milestone.md`, `src/`

## Rules

- End users must not need npm to run the app.
- Keep `memorize-script.v1` localStorage shape.
- No LLM provider API usage.
- Error-fix budget: **5** rounds per failure cluster on the active loop.
- Prefer AUTO verification via `.agents/verify/p*-check.mjs` and `node .agents/verify/run-php.mjs`.
