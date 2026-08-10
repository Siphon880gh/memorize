#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of [
  "public/assets/js/lib/backup.js",
  "README.md",
  ".agents/verify/run-php.mjs",
  "tests/js/lib.test.js",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const readme = readFileSync(join(root, "README.md"), "utf8");
if (!readme.includes("php -S localhost:8080 -t public")) fail("README missing php -S command");
if (!readme.includes("localStorage")) fail("README missing localStorage");
if (errors.length) { console.error("P9 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P9 VERIFY PASS");
