# Scripture / Spoken-Script Memorization App

Client-side web app that turns orator/actor memorization techniques into interactive exercises.

## Core question

How do experienced orators and actors memorize long scripts, and how can those techniques become interactive memorization exercises?

## Training path

**Read → Understand → Reduce → Visualize → Reconstruct → Recall → Master**

## Hard constraints (MVP)

- No ChatGPT/OpenAI API calls (no ongoing API cost). When AI helps, ship a copy/paste prompt; user pastes results back.
- Persist passages, progress, exercises, memory aids, and settings in **localStorage** only.
- No backend, accounts, or paid infra for MVP.
- Architecture supports Bible passages, speeches, acting scripts, monologues, presentations, poems, and custom text.
- Do not embed copyrighted Bible translation text in share URLs; prefer reference + user-supplied text.

## Memorization methods (MVP)

1. Progressive script reduction (full → essential → keywords → first words → first letters → none)
2. Visual memory / image association (image-generation prompts, local storage of prompts + segments)
3. Sentence/phrase ordering (drag-and-drop + keyboard, check, highlight, reshuffle)
4. Progressive hints (reveal next correct phrase; drive hint count toward 0)
5. Personal scoreboard (localStorage)
6. Passage sharing (reference/title oriented URLs, clipboard, Web Share API)

## Reference (visual ideas only)

Psalm 91 (NIV) on Bible Gateway — use as a **reference flow**, not as bundled copyrighted text:
https://www.biblegateway.com/passage/?search=Psalm%2091&version=NIV
