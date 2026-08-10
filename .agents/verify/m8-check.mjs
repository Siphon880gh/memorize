#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of ["public/assets/js/lib/share.js", "tests/js/lib.test.js", "public/assets/js/ui/sharePanel.js"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const share = readFileSync(join(root, "public/assets/js/lib/share.js"), "utf8");
if (!share.includes("type === \"bible\"")) fail("bible omit-text guard missing");
if (errors.length) { console.error("M8 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("M8 VERIFY PASS");
