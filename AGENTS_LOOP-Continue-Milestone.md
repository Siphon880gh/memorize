# AGENTS_LOOP — Continue Milestone

Loop prompt for autonomously advancing **Memorize Script** through MVP milestones until drained, with automatic verification.

**Preferences:** commit = **YES** · push = **NO** · outer iterations = **infinite** (human stops) · error-fix budget = **5 rounds**

---

## PREFERENCES

| Preference | Value |
|------------|--------|
| Auto-commit | **YES** — after each milestone that passes verification |
| Auto-push | **NO** — unless human explicitly enables push later |
| Outer loop | **Infinite** until human stops, MVP drained, or a STOP condition |
| Error fix budget | **5 rounds** per stuck failure cluster |
| MVP scope | Only IDs in `mvp_milestone_ids` (M0–M10). Do not start M11/M12 unless human asks |
| Local skills | May create/update `.agents/skills/*` when repetition would waste tokens |

---

## OBJECTIVE

**Done (MVP):** Every ID in `.agents/milestones.json` → `mvp_milestone_ids` has a matching entry in `.agents/state.json` → `completed` (e.g. `M0.done`), with that milestone’s `verify.auto` commands returning PASS.

**Concrete Done signals:**
1. `paused: false` while looping; `current_milestone_id` advances through `implementation_order` for MVP IDs.
2. Each finished milestone listed under `completed`.
3. Automatic verification for that milestone returns **PASS**.
4. Changes committed for that milestone (local commit; no push required).

---

## CONTEXT

Always load before acting:

| Artifact | Path |
|----------|------|
| State | [`.agents/state.json`](.agents/state.json) |
| Milestones | [`.agents/milestones.json`](.agents/milestones.json) |
| Product | [`PRODUCT.md`](PRODUCT.md) |
| Epic map | [`EPIC_MAP.md`](EPIC_MAP.md) |
| Data model | [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) |
| This loop | [`AGENTS_LOOP-Continue-Milestone.md`](AGENTS_LOOP-Continue-Milestone.md) |
| Agent rules | [`AGENTS.md`](AGENTS.md) |
| Optional skills | [`.agents/skills/`](.agents/skills/) |

**Hard product constraints (never violate):**
- No ChatGPT/OpenAI (or other LLM) API calls in MVP.
- No backend/accounts/infra for MVP; localStorage only.
- Do not embed copyrighted Bible translation bodies into share URLs by default.
- Keep architecture open to non-Bible passage types.
- Prefer AUTO checks; do not invent HUMAN gates for unit-testable behavior.

---

## STEP-BY-STEP CADENCE (each loop tick)

### 0) Unpause & orient
1. Read `.agents/state.json` and `.agents/milestones.json`.
2. Set `paused: false`, `status: "loop_running"`, update `last_updated_iso`.
3. Resolve **next milestone**:
   - Use `current_milestone_id` if in progress and not completed.
   - Else first ID in `implementation_order` that is in `mvp_milestone_ids` and not in `completed` as `*.done`.
   - Respect `depends_on` — do not start a milestone whose deps are unfinished.
4. Load that milestone’s deliverables, acceptance, and `verify.commands`.
5. Load any matching skill under `.agents/skills/`.

### 1) Implement the current milestone (minimal scope)
1. Implement only what the milestone requires.
2. Create/update `verify` scripts under `.agents/verify/` so acceptance is machine-checkable.
3. If the same procedure will repeat, write or update a skill under `.agents/skills/<name>/SKILL.md`.
4. Do **not** expand into Later milestones (M11+) while MVP IDs remain open.

### 2) Automatic verification
Run the milestone’s `verify.commands` plus any global smoke that applies (see rubric). Return **PASS** or **FAIL** only.

### 3) On verification FAIL — fix loop (≤ 5 rounds)
1. Record failure in `.agents/state.json` under `loop` (`error_round`, milestone id, error summary).
2. Fix with **minimal** code changes.
3. Re-verify.
4. Count **every** failed verification round, including **new** errors after a prior fix, toward the **5-round** budget for this stuck issue.
5. If round 5 still FAIL → **STOP** (see STOP CONDITIONS) and write a human handoff summary.

### 4) On verification PASS — close milestone
1. Mark milestone done in `state.json` (`completed` += `M#.done`; advance `current_milestone_id`; clear `loop.error_round`).
2. Update `EPIC_MAP.md` status lightly if useful.
3. **Commit** (see Commit protocol).
4. Immediately continue to the next MVP milestone.

### 5) Human verification gate (rare)
Stop and ask the human **only if** the milestone `verify.mode` is `HUMAN_REQUIRED` or an acceptance item truly cannot be automated after attempting browser/unit automation.  
Then: write what to check, set `status: "awaiting_human_verification"`, **do not** invent a PASS. Resume on human “approved” / “continue”.

---

## VERIFICATION RUBRIC

Return **PASS** only if all applicable checks succeed.

### Global smoke (when `src/` exists)
- [ ] `npm test` passes when package scripts exist
- [ ] `npm run build` passes when package scripts exist
- [ ] No `openai` / official LLM SDK imports under `src/`
- [ ] No committed `.env` with API keys
- [ ] Share helpers (once present) omit Bible body text by default

### Per-milestone
Run exactly the `verify.commands` listed on the current milestone in `milestones.json`. If a command/script is missing, **create it** as part of the milestone before claiming PASS.

**PASS** = all acceptance bullets satisfied with evidence (command output).  
**FAIL** = any acceptance bullet unmet or smoke broken.

---

## COMMIT PROTOCOL

After each PASS milestone:

```bash
git status
git diff
git log -5 --oneline
git add -A   # exclude .env / secrets
git commit -m "$(cat <<'EOF'
Complete <MILESTONE_ID>: <short why>

EOF
)"
```

- Do **not** push unless human enables it.
- Never force-push `main`/`master`.
- If pre-commit hooks modify files, create a **new** commit (do not amend unless amend rules are fully met).

If git repo is not initialized: `git init` once on first PASS commit, create initial branch, then commit.

---

## STOP CONDITIONS / ESCAPE HATCHES

| Condition | Action |
|-----------|--------|
| Human stops the agent/loop | Halt; leave `state.json` consistent |
| Verification FAIL for **5 rounds** on the same stuck issue (including new errors after fixes) | **STOP**; write handoff; set `status: "blocked_error_budget"` |
| Human verification absolutely required | **STOP**; `awaiting_human_verification` |
| About to add LLM API / backend in MVP | **STOP**; do not commit that change |
| All MVP milestones `*.done` | Set `status: "mvp_complete"`; **STOP** looping (Later only on human request) |
| Accidental secrets in tree | **STOP**; scrub; do not commit secrets |

### Handoff summary (required on error-budget STOP)

Write `.agents/loop-handoff.md` containing:
1. `current_milestone_id` and work in progress
2. Last 5 fix attempts (what changed, what error resulted)
3. Current error text / command
4. Hypotheses not yet tried
5. Exact command for the human to reproduce

Also set in `state.json`:
```json
"paused": true,
"status": "blocked_error_budget",
"loop": {
  "handoff_file": ".agents/loop-handoff.md",
  "failed_milestone_id": "M#",
  "error_round": 5
}
```

---

## STATE UPDATES (every tick)

Keep `.agents/state.json` accurate:
- `current_milestone_id`, `current_epic_id`
- `paused`, `status`, `last_updated_iso`
- `completed[]`
- `loop`: `{ "tick": N, "error_round": 0..5, "last_verify": "PASS|FAIL", "skill_used": "..." }`

---

## LOCAL SKILLS (optional efficiency)

Path: `.agents/skills/<skill-name>/SKILL.md`

When to create:
- Same verify/fix sequence used ≥2 times
- Milestone-specific runbooks

Self-healing:
1. Skill fails → log guess in skill “Failures” section
2. Try alternate
3. On success → update skill steps
4. If purpose diverges → **new** skill file

Suggested starter skills (create on demand):
- `milestone-orient` — read state, pick next milestone
- `verify-no-llm-api` — grep guard for provider SDKs
- `git-commit-milestone` — status/diff/log/commit

---

## LOOP PROMPT (paste / feed to `/loop`)

```
Continue the Memorize Script milestone plan using AGENTS_LOOP-Continue-Milestone.md.

PREFERENCES: auto-commit YES; auto-push NO; outer iterations infinite until I stop you or MVP is drained; error-fix budget 5 rounds.

1. Read .agents/state.json and .agents/milestones.json. Unpause if needed. Pick the next incomplete MVP milestone by implementation_order and depends_on.
2. Implement that milestone with minimal scope; create/update .agents/verify/* and tests so acceptance is AUTO.
3. Run automatic verification (milestone verify.commands + smoke). PASS or FAIL only.
4. On FAIL: fix and re-verify; count rounds (max 5 including new errors). At 5 FAIL → STOP, write .agents/loop-handoff.md, set blocked_error_budget.
5. On PASS: update state (M#.done), commit locally (no push), then continue to the next MVP milestone.
6. Stop for human only if acceptance truly cannot be automated; otherwise keep going.
7. Obey hard constraints: no LLM API, no backend, no copyrighted Bible text in default share URLs.
8. When all mvp_milestone_ids are done, set status mvp_complete and STOP.
```

---

## HOW TO RUN

### Option A — Cursor `/loop` (preferred)

```text
/loop Read AGENTS_LOOP-Continue-Milestone.md and execute one continue tick from the LOOP PROMPT section. After PASS, schedule the next tick immediately (dynamic). Stop only on human verification needed, 5-round fix budget exhausted, or mvp_complete.
```

### Option B — Single long Agent session

Paste the **LOOP PROMPT** block and say: “Run until mvp_complete or stop condition; commit after each milestone; no push.”

---

## PASS / FAIL (per tick)

| Result | Meaning |
|--------|---------|
| **PASS** | Current milestone acceptance met; state updated; commit done; ready for next |
| **FAIL** | Verification failed this round; increment `loop.error_round`; fix and retry |
| **STOP** | Error budget (5), human gate, constraint violation, or `mvp_complete` |

Do not return a vague “made progress” without PASS/FAIL/STOP.
