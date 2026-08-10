#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of [
  "public/assets/js/ui/library.js",
  "public/assets/js/data/starters.js",
  "public/assets/js/app.js",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const lib = readFileSync(join(root, "public/assets/js/ui/library.js"), "utf8");
if (!/Daily Bread|daily-bread|daily_bread/i.test(lib)) fail("library missing Daily Bread");
if (!/Psalm 91|psalm91|psalm-91/i.test(lib)) fail("library missing Psalm 91");
if (!/exportDocument|importDocument/.test(lib)) fail("library missing export/import");
const lint = spawnSync("php", ["-l", join(root, "public/index.php")]);
if (lint.status !== 0) fail("php -l failed");
if (errors.length) { console.error("P3 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P3 VERIFY PASS");
