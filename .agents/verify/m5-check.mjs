#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of ["src/lib/stats.ts", "src/lib/stats.test.ts", "src/lib/ordering.ts", "src/ui/training.ts"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const ordering = readFileSync(join(root, "src/lib/ordering.ts"), "utf8");
if (!ordering.includes("applyHint")) fail("missing applyHint");
const training = readFileSync(join(root, "src/ui/training.ts"), "utf8");
if (!training.includes("Bring the hint count down to 0")) {
  fail("missing zero-hint goal messaging");
}
if (!training.includes("recordAttempt")) fail("reconstruct not recording attempts");

if (errors.length) {
  console.error("M5 VERIFY FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("M5 VERIFY PASS");
