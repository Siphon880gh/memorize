#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of [
  "public/assets/js/lib/segment.js",
  "tests/js/lib.test.js",
  "public/assets/js/ui/training.js",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}

const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
for (const token of ["read", "understand", "segmentNotes"]) {
  if (!training.includes(token)) fail(`training.ts missing ${token}`);
}

if (errors.length) {
  console.error("M2 VERIFY FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("M2 VERIFY PASS");
