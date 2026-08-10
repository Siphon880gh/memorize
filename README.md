# Memorize Script

Client-side training app for memorizing scriptures, speeches, monologues, and other spoken material.

**Path:** Read → Understand → Reduce → Visualize → Reconstruct → Recall → Master

## Run locally

```bash
npm install
npm run dev
```

Build / test / verify:

```bash
npm test
npm run build
npm run verify
```

## Data

All progress lives in `localStorage` under `memorize-script.v1`. Use **Export** / **Import** on the library screen to back up or restore.

## ChatGPT workflow (no API keys)

The MVP never calls the ChatGPT API.

1. In **Reduce** or **Visualize**, copy the ready-made prompt.
2. Paste it into ChatGPT (text or image generation).
3. Paste the result back into the app.

## Sharing

Share links carry title / type / Bible reference. Bible shares omit translation text by default so copyrighted wording is not embedded in URLs. Recipients paste their own allowed text.

## Psalm 91 starter

Adds reference metadata and a Bible Gateway link only — you supply the wording you have rights to use.
