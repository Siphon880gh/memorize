#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
if (!existsSync(join(root, "public/assets/js/lib/reduction.js"))) fail("missing reduction.js");
const reduction = readFileSync(join(root, "public/assets/js/lib/reduction.js"), "utf8");
if (!reduction.includes("Preserve the original sequence")) fail("prompt missing sequence rule");
const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
if (!/reduce/i.test(training)) fail("training missing reduce");
function walk(dir, acc = []) {
  for (const n of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, n.name);
    if (n.isDirectory()) walk(f, acc);
    else if (f.endsWith(".js")) acc.push(f);
  }
  return acc;
}
for (const f of walk(join(root, "public"))) {
  const body = readFileSync(f, "utf8");
  if (/api\.openai\.com|from ['"]openai['"]/.test(body)) fail(`LLM API in ${f}`);
}
if (errors.length) { console.error("P5 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P5 VERIFY PASS");
