import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync("public/assets/js/ui/library.js", "utf8");

test("all passage titles are accessible open controls without duplicate Open buttons", () => {
  assert.match(source, /class="passage-title-link"/);
  assert.match(source, /aria-label="Open \$\{escapeAttr\(p\.title\)\}"/);
  assert.match(source, /const openAttr = key \?/);
  assert.match(source, /data-open-starter/);
  assert.match(source, /data-open="\$\{p\.id\}"/);
  assert.doesNotMatch(source, />Open<\/button>/);
});
