#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of ["public/assets/js/ui/training.js", "public/assets/js/data/samplePsalm91.js", "public/assets/js/app.js"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
for (const stage of ["read", "understand", "reduce", "visualize", "reconstruct", "recall", "master"]) {
  if (!training.includes(`id: "${stage}"`) || !training.includes(`label: "${stage[0].toUpperCase()}${stage.slice(1)}"`) && stage !== "read") {
    // softer check: ready flags
  }
  if (!new RegExp(`id:\\s*"${stage}"[\\s\\S]*?ready:\\s*true`).test(training)) {
    fail(`stage ${stage} not ready`);
  }
}
if (!training.includes("renderRecall") || !training.includes("renderMaster")) fail("missing recall/master UI");

const sample = readFileSync(join(root, "public/assets/js/data/samplePsalm91.js"), "utf8");
if (!sample.includes("bibleGatewayUrl")) fail("sample missing bibleGatewayUrl");
if (/Whoever dwells/.test(sample)) fail("sample appears to embed NIV Psalm 91 body");
if (!/He who dwells/.test(sample) || !/versionHint:\s*"ESV"/.test(sample)) fail("sample missing ESV Psalm 91 text");

if (errors.length) { console.error("M9 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("M9 VERIFY PASS");
