#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of [
  "README.md",
  "public/assets/js/lib/backup.js",
  "public/assets/js/ui/library.js",
  "public/assets/js/app.js",
  ".agents/verify/run-php.mjs",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const readme = readFileSync(join(root, "README.md"), "utf8");
if (!readme.includes("localStorage") || !readme.includes("ChatGPT")) fail("README missing workflow docs");
const library = readFileSync(join(root, "public/assets/js/ui/library.js"), "utf8");
if (!library.includes("exportDocument") || !library.includes("importDocument")) fail("export/import UI missing");
const app = readFileSync(join(root, "public/assets/js/app.js"), "utf8");
if (!app.includes("exportDocument") || !app.includes("importDocument")) {
  fail("public app.js missing export/import");
}
const pkgPath = join(root, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.scripts?.verify && pkg.scripts.verify !== "node .agents/verify/run-php.mjs") {
    fail("package.json verify script should point at run-php.mjs");
  }
}

if (errors.length) { console.error("M10 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("M10 VERIFY PASS");
