# AGENTS_LOOP — Convert to PHP

Separate loop for draining the **PHP conversion** milestone track (`P0`–`P10`) in [`.agents/milestones-php.json`](.agents/milestones-php.json).

**Preferences:** commit = **YES** · push = **NO** · outer iterations = **infinite** until drained · error-fix budget = **5 rounds**

Do **not** use [`AGENTS_LOOP-Continue-Milestone.md`](AGENTS_LOOP-Continue-Milestone.md) for this track (that loop drained the TS MVP).

---

## PREFERENCES

| Preference | Value |
|------------|--------|
| Auto-commit | **YES** after each PASS milestone |
| Auto-push | **NO** |
| Outer loop | Infinite until `php_complete` or STOP |
| Error fix budget | **5 rounds** per failure cluster |
| Scope | Only `php_milestone_ids` (P0–P10) |
| Product parity | Same localStorage app; no LLM API; no accounts |

---

## OBJECTIVE

**Done:** Every ID in `milestones-php.json` → `php_milestone_ids` appears in `.agents/state.json` → `php_conversion.completed` as `P#.done`, and `php_conversion.status` is `php_complete`.

---

## CONTEXT

| Artifact | Path |
|----------|------|
| State | [`.agents/state.json`](.agents/state.json) → `php_conversion` |
| PHP milestones | [`.agents/milestones-php.json`](.agents/milestones-php.json) |
| Conversion notes | [`docs/PHP_CONVERSION.md`](docs/PHP_CONVERSION.md) |
| Product / data model | [`PRODUCT.md`](PRODUCT.md), [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) |
| This loop | [`AGENTS_LOOP-Convert-PHP.md`](AGENTS_LOOP-Convert-PHP.md) |
| Legacy TS (reference while porting) | `src/` |

**Hard constraints:**
- Run path must be `php -S localhost:8080 -t public` (or equivalent) with **no npm install required to use the app**.
- Keep `memorize-script.v1` localStorage document shape.
- No ChatGPT/OpenAI API calls.
- Bible shares omit translation body by default.
- Prefer porting logic to `public/assets/js/**`; PHP serves the shell (`public/index.php`).
- Node may be used **only** for verify scripts/tests during conversion — not as a runtime dependency for end users.

---

## STEP-BY-STEP CADENCE (each tick)

### 0) Orient
1. Read `.agents/state.json` → `php_conversion` and `.agents/milestones-php.json`.
2. Set `php_conversion.paused: false`, `php_conversion.status: "loop_running"`, update timestamps.
3. Next milestone = `current_milestone_id` if open, else first `implementation_order` id not in `php_conversion.completed`.
4. Respect `depends_on`.

### 1) Implement (minimal)
Port only what the current P# requires. Reuse behavior from `src/` as the reference implementation.

### 2) Verify
Run the milestone’s `verify.commands`. PASS or FAIL only.

### 3) On FAIL (≤ 5 rounds)
Record `php_conversion.loop.error_round`, fix minimally, re-verify. At 5 → STOP, write `.agents/loop-handoff-php.md`, set `blocked_error_budget`.

### 4) On PASS
1. Append `P#.done` to `php_conversion.completed`; advance `current_milestone_id`.
2. Commit locally (no push).
3. Continue to next P#.

### 5) Human gate
Only if acceptance cannot be automated. Set `awaiting_human_verification`.

---

## STOP CONDITIONS

| Condition | Action |
|-----------|--------|
| Human stops | Halt; keep state consistent |
| 5 failed fix rounds | STOP + `.agents/loop-handoff-php.md` |
| Human verification required | STOP |
| All `php_milestone_ids` done | `php_conversion.status = php_complete`; **STOP** |
| About to require npm to *run* the app | STOP; redesign |

---

## LOOP PROMPT (for `/loop`)

```
Continue the Memorize Script PHP conversion using AGENTS_LOOP-Convert-PHP.md.

PREFERENCES: auto-commit YES; auto-push NO; error-fix budget 5; drain P0–P10 only.

1. Read .agents/state.json php_conversion + .agents/milestones-php.json. Pick next incomplete P#.
2. Implement minimal scope for that milestone under public/ (and docs/verify as required).
3. Run verify.commands. PASS or FAIL only.
4. On FAIL: fix ≤5 rounds then STOP with .agents/loop-handoff-php.md.
5. On PASS: update php_conversion state, commit, continue.
6. Stop when php_complete, human gate, or error budget.
7. Constraints: php -S -t public; no npm to run; localStorage v1; no LLM API.
```

## HOW TO RUN

```text
/loop Read AGENTS_LOOP-Convert-PHP.md and execute one continue tick from the LOOP PROMPT. After PASS, schedule the next tick immediately (dynamic). Stop only on human verification, 5-round budget, or php_complete.
```

---

## PASS / FAIL / STOP

| Result | Meaning |
|--------|---------|
| **PASS** | Current P# verified; committed; continue |
| **FAIL** | Increment error_round; fix |
| **STOP** | Budget, human gate, or `php_complete` |
