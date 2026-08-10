#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of ["src/lib/ordering.ts", "src/lib/ordering.test.ts", "src/ui/training.ts"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const training = readFileSync(join(root, "src/ui/training.ts"), "utf8");
if (!training.includes("renderReconstruct")) fail("missing renderReconstruct");
if (!training.includes('id: "reconstruct", label: "Reconstruct", ready: true')) {
  fail("reconstruct stage not ready");
}
if (!training.includes("draggable")) fail("missing drag-and-drop");
if (!training.includes("ArrowUp")) fail("missing keyboard reorder");

if (errors.length) {
  console.error("M4 VERIFY FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}
console.log("M4 VERIFY PASS");
