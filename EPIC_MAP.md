# Epic Map — Memorize Script

Status legend: `planned` · `in_progress` · `done` · `later`

| Epic | Name | Status | Milestones |
|------|------|--------|------------|
| E0 | Foundations & frozen decisions | done | M0 |
| E1 | Passage library & local persistence | in_progress | M1 |
| E2 | Read / Understand + segmentation | planned | M2 |
| E3 | Progressive reduction + ChatGPT paste | planned | M3 |
| E4 | Reconstruct (ordering) + progressive hints | planned | M4, M5 |
| E5 | Personal scoreboard / mastery metrics | planned | M6 |
| E6 | Visual memory anchors | planned | M7 |
| E7 | Passage sharing | planned | M8 |
| E8 | Training-path UX & hardening | planned | M9, M10 |
| E9 | Later platform (API / accounts) | later | M11, M12 |

## Product decisions (seed — freeze in M0)

- Stack: Vite + TypeScript + vanilla DOM (no React required for MVP)
- Storage: single versioned localStorage document
- AI: prompt templates only; never call paid APIs in MVP
- Sharing: encode type + title/reference (+ optional compressed custom text when user-owned)
- Sample: Psalm 91 as reference metadata only; user pastes their own licensed/allowed text

## MVP done when

All of `mvp_milestone_ids` in `.agents/milestones.json` are `done` in `.agents/state.json`.
