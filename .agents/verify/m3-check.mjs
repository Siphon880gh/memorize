#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of ["public/assets/js/lib/reduction.js", "tests/js/lib.test.js", "public/assets/js/ui/training.js"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}

const reduction = readFileSync(join(root, "public/assets/js/lib/reduction.js"), "utf8");
if (!reduction.includes("buildReductionPrompt")) fail("missing buildReductionPrompt");
if (!reduction.includes("Preserve the original sequence")) fail("prompt missing sequence rule");

const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
if (!training.includes("renderReduce") && !training.includes("Reduce")) fail("Reduce UI missing");
if (!/id:\s*"reduce".*ready:\s*true/s.test(training) && !training.includes('id: "reduce", label: "Reduce", ready: true')) {
  fail("reduce stage not ready");
}

const src = readFileSync(join(root, "public/assets/js/lib/reduction.js"), "utf8") + readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
if (/api\.openai\.com|from ['"]openai['"]/.test(src)) fail("LLM API usage detected");

if (errors.length) {
  console.error("M3 VERIFY FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("M3 VERIFY PASS");
