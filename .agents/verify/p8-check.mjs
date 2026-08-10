#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];
const fail = (m) => errors.push(m);
const training = readFileSync(join(root, "public/assets/js/ui/training.js"), "utf8");
for (const stage of ["read", "understand", "reduce", "visualize", "reconstruct", "recall", "master"]) {
  if (!new RegExp(`id:\\s*"${stage}"[\\s\\S]*?ready:\\s*true`).test(training)) {
    fail(`stage ${stage} not ready`);
  }
}
if (!training.includes("renderRecall") || !training.includes("renderMaster")) fail("missing recall/master");
const app = readFileSync(join(root, "public/assets/js/app.js"), "utf8");
if (!app.includes("scoreboard") || !app.includes("share")) fail("app missing scoreboard/share routes");
const daily = readFileSync(join(root, "public/assets/js/data/sampleDailyBread.js"), "utf8");
const psalm = readFileSync(join(root, "public/assets/js/data/samplePsalm91.js"), "utf8");
if (!/Our Father/.test(daily)) fail("Daily Bread missing KJV text");
if (!/He that dwelleth/.test(psalm) || !/versionHint:\s*"KJV"/.test(psalm)) fail("Psalm 91 missing KJV text");
if (!existsSync(join(root, "public/assets/js/data/starters.js"))) fail("missing starters.js");
if (errors.length) { console.error("P8 VERIFY FAIL"); errors.forEach((e) => console.error(" -", e)); process.exit(1); }
console.log("P8 VERIFY PASS");
