# Epic Map — Memorize Script

Status legend: `planned` · `in_progress` · `done` · `later`

| Epic | Name | Status | Milestones |
|------|------|--------|------------|
| E0 | Foundations & frozen decisions | done | M0 |
| E1 | Passage library & local persistence | done | M1 |
| E2 | Read / Understand + segmentation | done | M2 |
| E3 | Progressive reduction + ChatGPT paste | done | M3 |
| E4 | Reconstruct (ordering) + progressive hints | done | M4, M5 |
| E5 | Personal scoreboard / mastery metrics | done | M6 |
| E6 | Visual memory anchors | done | M7 |
| E7 | Passage sharing | done | M8 |
| E8 | Training-path UX & hardening | done | M9, M10 |
| E9 | Later platform (API / accounts) | later | M11, M12 |

## Product decisions (frozen in M0)

- Stack: Vite + TypeScript + vanilla DOM
- Storage: `memorize-script.v1` localStorage document
- AI: prompt templates only; never call paid APIs in MVP
- Sharing: encode type + title/reference (+ optional compressed custom text when user-owned)
- Sample: Psalm 91 as reference metadata only; user pastes their own licensed/allowed text

## MVP done when

All of `mvp_milestone_ids` in `.agents/milestones.json` are `done` in `.agents/state.json`.

**MVP status: complete** (`status: mvp_complete`).

## PHP conversion (P0–P10)

| Epic | Name | Status | Milestones |
|------|------|--------|------------|
| E-PHP0 | Freeze PHP decisions | done | P0 |
| E-PHP1 | Shell + repository | done | P1, P2 |
| E-PHP2 | Library + Read/Understand | done | P3, P4 |
| E-PHP3 | Reduce + Reconstruct/hints | done | P5, P6 |
| E-PHP4 | Visual / scoreboard / share / master path | done | P7, P8 |
| E-PHP5 | Backup, docs, PHP canonical | done | P9, P10 |

Track: `.agents/milestones-php.json` · Loop: `AGENTS_LOOP-Convert-PHP.md` · State: `php_conversion.status = php_complete`

Run: `php -S localhost:8080 -t public`
