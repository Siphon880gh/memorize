#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of ["public/assets/js/lib/segment.js", "public/assets/js/ui/training.js"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
if (!training.includes("read") || !training.includes("understand")) fail("training missing read/understand");
const t = spawnSync("node", ["--test", "tests/js/lib.test.js"], { cwd: root, encoding: "utf8" });
if (t.status !== 0 || !t.stdout.includes("segmenter")) fail("segmenter tests not ok");
if (errors.length) { console.error("P4 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P4 VERIFY PASS");
