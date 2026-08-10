#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);

for (const p of [
  "docs/PHP_CONVERSION.md",
  ".agents/milestones-php.json",
  "AGENTS_LOOP-Convert-PHP.md",
  ".agents/state.json",
]) {
  if (!existsSync(join(root, p))) fail(`missing ${p}`);
}

const state = JSON.parse(readFileSync(join(root, ".agents/state.json"), "utf8"));
const php = state.php_conversion;
if (!php) fail("state.php_conversion missing");
else {
  for (const key of ["status", "current_milestone_id", "completed", "decisions"]) {
    if (php[key] === undefined) fail(`php_conversion.${key} missing`);
  }
  const d = php.decisions || {};
  if (d.run_command !== "php -S localhost:8080 -t public") fail("run_command mismatch");
  if (d.storage_key !== "memorize-script.v1") fail("storage_key mismatch");
  if (d.no_npm_to_run !== true) fail("no_npm_to_run must be true");
}

const milestones = JSON.parse(readFileSync(join(root, ".agents/milestones-php.json"), "utf8"));
if (!Array.isArray(milestones.php_milestone_ids) || milestones.php_milestone_ids.length < 11) {
  fail("php_milestone_ids incomplete");
}

const doc = readFileSync(join(root, "docs/PHP_CONVERSION.md"), "utf8");
for (const token of ["php -S", "localStorage", "parity", "public/"]) {
  if (!doc.includes(token)) fail(`PHP_CONVERSION.md missing ${token}`);
}

if (errors.length) {
  console.error("P0 VERIFY FAIL");
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}
console.log("P0 VERIFY PASS");
