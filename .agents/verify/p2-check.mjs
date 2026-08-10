#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of [
  "public/assets/js/types.js",
  "public/assets/js/repository.js",
  "public/assets/js/storage/repository.js",
  "tests/js/repository.test.js",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const t = spawnSync("node", ["--test", "tests/js/repository.test.js"], { cwd: root, encoding: "utf8" });
if (t.status !== 0) fail("repository tests failed\n" + t.stdout + t.stderr);
if (errors.length) { console.error("P2 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P2 VERIFY PASS");
