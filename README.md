# Memorize Script

Client-side training app for memorizing scriptures, speeches, monologues, and other spoken material.

**Path:** Read → Understand → Reduce → Visualize → Reconstruct → Recall → Master

## Run (PHP)

Requires PHP 7.4+ (MAMP) or 8+. No `npm install`.

**MAMP / Apache (this repo under `weng/app/sp/memorize`):**

http://localhost:8888/weng/app/sp/memorize/

**Built-in PHP server:**

```bash
cd /path/to/memorize
php -S localhost:8080 -t public
```

Open http://localhost:8080

## Develop

Yes — this is a **PHP + vanilla JS** app. Edit under `public/` only:

- `public/index.php` — page shell
- `public/assets/js/app.js` — **canonical UI** (what the browser loads)
- `public/assets/js/tour.js`
- `public/assets/app.css`

`public/assets/js/lib/` (+ related verify helpers) support `node --test` checks. Do not reintroduce Vite/npm for day-to-day work. The old TypeScript tree was removed ([`LEGACY_TS.md`](LEGACY_TS.md)).

## Data

Progress lives in browser `localStorage` under `memorize-script.v1`. Use **Export** / **Import** on the library screen to back up or restore.

## ChatGPT workflow (no API keys)

The app never calls the ChatGPT API.

1. In **Reduce** or **Visualize**, copy the ready-made prompt.
2. Paste it into ChatGPT (text or image generation).
3. Paste the result back into the app.

## Starters

- **Psalm 91** — reference metadata + Bible Gateway link; you paste wording you may use.
- **Daily Bread Prayer** — Lord's Prayer (Matthew 6:9–13, KJV public domain).

## Sharing

Share links carry title / type / Bible reference (and text when included). Opening a share link adds/opens that passage in the library.

## Verify (optional, for agents/devs)

Node is only needed for automated checks, not to run the app:

```bash
node .agents/verify/run-php.mjs
```
