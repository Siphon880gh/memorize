#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of [
  "package.json",
  "vite.config.ts",
  "index.html",
  "src/main.ts",
  "src/storage/repository.ts",
  "src/ui/library.ts",
  "src/storage/repository.test.ts",
  "dist/index.html",
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

const srcFiles = walk(join(root, "src")).filter((f) => f.endsWith(".ts") || f.endsWith(".js"));
const banned = [/from ['"]openai['"]/, /api\.openai\.com/, /@anthropic-ai/, /from ['"]anthropic['"]/];
for (const file of srcFiles) {
  const body = readFileSync(file, "utf8");
  for (const re of banned) {
    if (re.test(body)) fail(`banned LLM client pattern in ${file}: ${re}`);
  }
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (!pkg.scripts?.test || !pkg.scripts?.build) fail("package.json missing test/build scripts");

if (errors.length) {
  console.error("M1 VERIFY FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("M1 VERIFY PASS");
