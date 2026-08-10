#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of ["README.md", "src/lib/backup.ts", "src/lib/backup.test.ts", "src/ui/library.ts"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const readme = readFileSync(join(root, "README.md"), "utf8");
if (!readme.includes("localStorage") || !readme.includes("ChatGPT")) fail("README missing workflow docs");
const library = readFileSync(join(root, "src/ui/library.ts"), "utf8");
if (!library.includes("exportDocument") || !library.includes("importDocument")) fail("export/import UI missing");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (pkg.scripts?.verify !== "node .agents/verify/run-all.mjs") fail("npm run verify script incorrect");

if (errors.length) { console.error("M10 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("M10 VERIFY PASS");
