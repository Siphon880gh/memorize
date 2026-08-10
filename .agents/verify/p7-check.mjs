#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of [
  "public/assets/js/lib/visualPrompt.js",
  "public/assets/js/lib/scoreboard.js",
  "public/assets/js/lib/share.js",
  "public/assets/js/ui/scoreboard.js",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const share = readFileSync(join(root, "public/assets/js/lib/share.js"), "utf8");
if (!share.includes('type === "bible"') && !share.includes("type === 'bible'")) {
  fail("bible omit-text guard missing");
}
const t = spawnSync("node", ["--test", "tests/js/lib.test.js"], { cwd: root, encoding: "utf8" });
if (t.status !== 0) fail("lib tests failed");
if (errors.length) { console.error("P7 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P7 VERIFY PASS");
