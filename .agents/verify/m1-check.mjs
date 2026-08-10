#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of [
  "public/index.php",
  "public/assets/js/app.js",
  "public/assets/app.css",
  "public/assets/js/storage/repository.js",
  "public/assets/js/ui/library.js",
  "tests/js/repository.test.js",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const jsFiles = walk(join(root, "public")).filter((f) => f.endsWith(".js"));
const banned = [/from ['"]openai['"]/, /api\.openai\.com/, /@anthropic-ai/, /from ['"]anthropic['"]/];
for (const file of jsFiles) {
  const body = readFileSync(file, "utf8");
  for (const re of banned) {
    if (re.test(body)) fail(`banned LLM client pattern in ${file}: ${re}`);
  }
}

const shell = readFileSync(join(root, "public/index.php"), "utf8");
if (!shell.includes("assets/js/app.js")) fail("public/index.php must load app.js");

if (errors.length) {
  console.error("M1 VERIFY FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("M1 VERIFY PASS");
