#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
for (const p of ["public/index.php", "public/assets/app.css", "public/assets/js/app.js"]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}
const html = readFileSync(join(root, "public/index.php"), "utf8");
if (!html.includes('id="app"')) fail("index.php missing #app");
if (!html.includes("/assets/app.css")) fail("index.php missing CSS");
if (!html.includes("/assets/js/app.js")) fail("index.php missing app.js");
const lint = spawnSync("php", ["-l", join(root, "public/index.php")], { encoding: "utf8" });
if (lint.status !== 0) fail("php -l failed");
if (errors.length) { console.error("P1 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P1 VERIFY PASS");
