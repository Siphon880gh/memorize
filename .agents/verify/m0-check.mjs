#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const errors = [];

function fail(msg) {
  errors.push(msg);
}

const statePath = join(root, ".agents/state.json");
const milestonesPath = join(root, ".agents/milestones.json");
const dataModelPath = join(root, "docs/DATA_MODEL.md");

if (!existsSync(statePath)) fail("missing .agents/state.json");
if (!existsSync(milestonesPath)) fail("missing .agents/milestones.json");
if (!existsSync(dataModelPath)) fail("missing docs/DATA_MODEL.md");

let state;
let milestones;
try {
  state = JSON.parse(readFileSync(statePath, "utf8"));
  milestones = JSON.parse(readFileSync(milestonesPath, "utf8"));
} catch (e) {
  fail(`JSON parse error: ${e.message}`);
}

if (state) {
  const d = state.decisions || {};
  for (const key of [
    "stack",
    "storage_key",
    "schema_version",
    "training_stages",
    "passage_types",
    "reduction_levels",
    "share_policy",
    "no_llm_api_mvp",
    "no_backend_mvp",
    "error_fix_budget_rounds",
  ]) {
    if (d[key] === undefined || d[key] === null) fail(`decisions.${key} missing`);
  }
  if (d.no_llm_api_mvp !== true) fail("decisions.no_llm_api_mvp must be true");
  if (d.no_backend_mvp !== true) fail("decisions.no_backend_mvp must be true");
  if (d.error_fix_budget_rounds !== 5) fail("decisions.error_fix_budget_rounds must be 5");
  if (!Array.isArray(d.training_stages) || d.training_stages.length !== 7) {
    fail("decisions.training_stages must have 7 stages");
  }
  if (d.storage_key !== "memorize-script.v1") fail("unexpected storage_key");
}

if (milestones) {
  if (!Array.isArray(milestones.mvp_milestone_ids) || milestones.mvp_milestone_ids.length === 0) {
    fail("mvp_milestone_ids must be non-empty");
  }
  for (const id of ["M0", "M1", "M10"]) {
    if (!milestones.mvp_milestone_ids.includes(id)) fail(`mvp_milestone_ids missing ${id}`);
  }
}

if (existsSync(dataModelPath)) {
  const body = readFileSync(dataModelPath, "utf8");
  for (const token of ["Passage", "Segment", "Attempt", "VisualAnchor", "SharePayload"]) {
    if (!body.includes(token)) fail(`DATA_MODEL.md must mention ${token}`);
  }
}

if (errors.length) {
  console.error("M0 VERIFY FAIL");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log("M0 VERIFY PASS");
process.exit(0);
