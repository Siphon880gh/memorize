#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const verifyDir = join(root, ".agents/verify");

function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

// Historical MVP checks only. Active track: node .agents/verify/run-php.mjs
// (No npm install / Vite build — runtime is PHP + public/.)

const checks = readdirSync(verifyDir)
  .filter((f) => /^m\d+-check\.mjs$/.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

for (const file of checks) {
  run("node", [join(verifyDir, file)]);
}

console.log("ALL VERIFY PASS");
