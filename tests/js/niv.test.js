import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const dataDir = join(process.cwd(), "public/assets/js/data");
const starterFiles = readdirSync(dataDir)
  .filter((name) => name.startsWith("sample") && name.endsWith(".js"));

test("every bundled Scripture starter uses NIV metadata and links", () => {
  assert.ok(starterFiles.length > 0, "expected Scripture starter files");

  for (const name of starterFiles) {
    const source = readFileSync(join(dataDir, name), "utf8");
    const passageCount = (source.match(/bibleReference:/g) ?? []).length;
    const nivHintCount = (source.match(/versionHint: "NIV"/g) ?? []).length;
    const nivLinkCount = (source.match(/&version=NIV/g) ?? []).length;

    assert.equal(nivHintCount, passageCount, `${name} has a non-NIV version hint`);
    assert.equal(nivLinkCount, passageCount, `${name} has a non-NIV Bible Gateway link`);
    assert.doesNotMatch(source, /\bESV\b|English Standard Version/);
  }
});

test("canonical browser bundle contains NIV starter wording", () => {
  const bundle = readFileSync(join(process.cwd(), "public/assets/js/app.js"), "utf8");

  assert.match(bundle, /Whoever dwells in the shelter of the Most High/);
  assert.match(bundle, /The LORD is my shepherd, I lack nothing/);
  assert.match(bundle, /Give us today our daily bread/);
  assert.match(bundle, /versionHint: "NIV"/);
  assert.doesNotMatch(bundle, /versionHint: "ESV"|&version=ESV/);
});
