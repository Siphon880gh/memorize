# Memorize Script

Client-side training app for memorizing scriptures, speeches, monologues, and other spoken material.

**Path:** Read → Understand → Reduce → Visualize → Reconstruct → Recall → Master

## Run (PHP — preferred)

Requires PHP 8+. No `npm install`.

```bash
cd /path/to/memorize-script
php -S localhost:8080 -t public
```

Open http://localhost:8080

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

Share links carry title / type / Bible reference. Bible shares omit translation text by default.

## Verify (optional, for agents/devs)

Node is only needed for automated checks, not to run the app:

```bash
node .agents/verify/run-php.mjs
```

## Legacy TypeScript

The original Vite/TS tree under `src/` is documented in [`LEGACY_TS.md`](LEGACY_TS.md). It is not required to run the PHP app.
