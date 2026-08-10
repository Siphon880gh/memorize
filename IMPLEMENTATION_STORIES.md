# Implementation Stories — Memorize Script

Stories are grouped by milestone. Check off when the milestone closes.

## M0 — Freeze MVP interfaces & data model
- [x] S0.1 Freeze stack + storage key + schema version in state
- [x] S0.2 Write `docs/DATA_MODEL.md` (Passage, Segment, Attempt, …)
- [x] S0.3 Add `.agents/verify/m0-check.mjs` and get PASS

## M1 — Scaffold + passage CRUD
- [ ] S1.1 Vite + TS app boots
- [ ] S1.2 Repository load/save/migrate + tests
- [ ] S1.3 Library UI create/edit/delete

## M2 — Segmentation + Read / Understand
- [ ] S2.1 Segmenter + tests
- [ ] S2.2 Read stage UI
- [ ] S2.3 Understand stage + notes persistence

## M3 — Progressive reduction + ChatGPT paste
- [ ] S3.1 Local reducers (first words/letters/none)
- [ ] S3.2 Prompt templates for essential/keywords
- [ ] S3.3 Paste-back + practice levels

## M4 — Ordering exercise
- [ ] S4.1 Shuffle + grade + highlight
- [ ] S4.2 Drag-and-drop
- [ ] S4.3 Keyboard reorder

## M5 — Hints + attempt metrics
- [ ] S5.1 Next-phrase hints
- [ ] S5.2 Attempt/stats persistence
- [ ] S5.3 “Bring hints to 0” messaging

## M6 — Personal scoreboard
- [ ] S6.1 Aggregate metrics view
- [ ] S6.2 Sort + navigate to passage

## M7 — Visual memory
- [ ] S7.1 Image prompt builder
- [ ] S7.2 Anchor persistence
- [ ] S7.3 Copy/paste workflow UI

## M8 — Sharing
- [ ] S8.1 Encode/decode share payload
- [ ] S8.2 Bible default omits body text
- [ ] S8.3 Clipboard + Web Share

## M9 — Training path UX
- [ ] S9.1 Seven-stage navigator
- [ ] S9.2 Recall + Master
- [ ] S9.3 Psalm 91 reference starter (no bundled NIV body)

## M10 — Hardening
- [ ] S10.1 Export/import backup
- [ ] S10.2 `npm run verify`
- [ ] S10.3 README
