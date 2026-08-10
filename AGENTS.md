# AGENTS — Memorize Script

## Reading order

1. `.agents/state.json` — where we are
2. `.agents/milestones.json` — what to build next
3. `PRODUCT.md` + `EPIC_MAP.md`
4. `docs/DATA_MODEL.md` (after M0)
5. `AGENTS_LOOP-Continue-Milestone.md` when looping

## Rules

- Implement only `current_milestone_id` (and its listed deliverables).
- Prefer AUTO verification; classify HUMAN_REQUIRED only when automation cannot assert the acceptance item.
- No LLM provider API usage in MVP milestones.
- No backend/accounts in MVP.
- Update `.agents/state.json` every tick.
- Error-fix budget: **5** rounds per failure cluster, then STOP with handoff.

## Commands (once scaffolded in M1+)

- `npm test` — unit tests
- `npm run build` — production build
- `npm run verify` — full milestone verify suite (M10 wires this; earlier milestones use per-id checks)
