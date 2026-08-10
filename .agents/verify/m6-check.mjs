#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of ["public/assets/js/lib/scoreboard.js", "tests/js/lib.test.js", "public/assets/js/ui/scoreboard.js"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
if (!readFileSync(join(root, "public/assets/js/ui/scoreboard.js"), "utf8").includes("Scoreboard")) fail("scoreboard view missing");
if (errors.length) { console.error("M6 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("M6 VERIFY PASS");
