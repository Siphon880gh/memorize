#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of ["public/assets/js/lib/visualPrompt.js", "tests/js/lib.test.js", "public/assets/js/ui/training.js"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
if (!training.includes("renderVisualize")) fail("missing visualize UI");
if (!training.includes('id: "visualize", label: "Visualize", ready: true')) fail("visualize not ready");
function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else if (full.endsWith(".js")) acc.push(full);
  }
  return acc;
}
for (const file of walk(join(root, "public"))) {
  const body = readFileSync(file, "utf8");
  if (/openai|stability\.ai|replicate\.com/.test(body) && /fetch\(|axios/.test(body)) {
    fail(`possible image API client in ${file}`);
  }
}
if (errors.length) { console.error("M7 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("M7 VERIFY PASS");
