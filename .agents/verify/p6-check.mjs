#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of [
  "public/assets/js/lib/ordering.js",
  "public/assets/js/lib/stats.js",
  "public/assets/js/ui/training.js",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
if (!training.includes("Bring the hint count down to 0")) fail("missing zero-hint goal copy");
if (!training.includes("applyHint") && !training.includes("recordAttempt")) {
  // bundled names may differ in app.js; modular training should have them
  if (!readFileSync(join(root, "public/assets/js/app.js"), "utf8").includes("Bring the hint count down to 0")) {
    fail("hint goal missing from training/app");
  }
}
if (!readFileSync(join(root, "public/assets/js/lib/ordering.js"), "utf8").includes("applyHint")) {
  fail("ordering missing applyHint");
}
if (errors.length) { console.error("P6 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P6 VERIFY PASS");
