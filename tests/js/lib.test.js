import { test } from "node:test";
import assert from "node:assert/strict";
import { segmentText, ensureSegments } from "../../public/assets/js/lib/segment.js";
import {
  firstWords,
  firstLetters,
  localReduction,
  buildReductionPrompt,
} from "../../public/assets/js/lib/reduction.js";
import { applyHint, gradeOrder, isNextWordTile, moveItem, tokenizeWords } from "../../public/assets/js/lib/ordering.js";
import { recordAttempt } from "../../public/assets/js/lib/stats.js";
import { buildSharePayload, encodeSharePayload, decodeSharePayload } from "../../public/assets/js/lib/share.js";
import { sortScoreboard, toScoreboardRows } from "../../public/assets/js/lib/scoreboard.js";
import { buildImagePrompt, photographicMemoryItems } from "../../public/assets/js/lib/visualPrompt.js";
import { exportDocument, importDocument } from "../../public/assets/js/lib/backup.js";
import { emptyDocument } from "../../public/assets/js/storage/repository.js";
import { emptyStats } from "../../public/assets/js/types.js";

test("segmenter", () => {
  assert.deepEqual(segmentText("").map((s) => s.text), []);
  assert.deepEqual(segmentText("One. Two?").map((s) => s.text), ["One.", "Two?"]);
  const first = segmentText("Alpha. Beta.");
  assert.deepEqual(ensureSegments("Alpha. Beta.", first).map((s) => s.id), first.map((s) => s.id));
});

test("reduction", () => {
  const sample = "The Lord is my shepherd. I shall not want.";
  assert.equal(firstWords(sample), "The · I");
  assert.equal(firstLetters(sample), "T L I M S I S N W");
  assert.equal(localReduction("none", sample), "");
  const prompt = buildReductionPrompt("essential", "Psalm 23", sample);
  assert.match(prompt, /Preserve the original sequence/);
  assert.match(prompt, /Psalm 23/);
});

test("ordering hints", () => {
  assert.equal(gradeOrder(["a", "b"], ["a", "b"]).allCorrect, true);
  assert.deepEqual(moveItem(["a", "b", "c"], 2, 0), ["c", "a", "b"]);
  const first = applyHint(["c", "b", "a"], ["a", "b", "c"]);
  assert.equal(first.hintedIndex, 0);
  assert.deepEqual(first.ids, ["a", "c", "b"]);
});

test("word-game tiles", () => {
  assert.deepEqual(tokenizeWords("  The LORD is my shepherd.  "), ["The", "LORD", "is", "my", "shepherd."]);
  assert.deepEqual(tokenizeWords(""), []);
  assert.equal(isNextWordTile(0, 0), true);
  assert.equal(isNextWordTile(2, 1), false);
  assert.equal(isNextWordTile(2, 2), true);
});

test("stats + share + scoreboard + visual + backup", () => {
  const passage = {
    id: "p1",
    type: "custom",
    title: "T",
    text: "A. B.",
    createdAt: "",
    updatedAt: "",
    segments: [
      { id: "a", index: 0, text: "A." },
      { id: "b", index: 1, text: "B." },
    ],
    segmentNotes: {},
    reductions: {},
    visualAnchors: [],
    stageProgress: { read: { completed: true } },
    attempts: [],
    stats: emptyStats(),
  };
  const updated = recordAttempt(passage, {
    stage: "reconstruct",
    hintsUsed: 0,
    durationMs: 1000,
    success: true,
  });
  assert.equal(updated.stats.zeroHintCompletions, 1);

  const bible = buildSharePayload(
    { type: "bible", title: "Psalm 91", bibleReference: "Psalm 91", text: "SECRET" },
    { includeText: true },
  );
  assert.equal(bible.text, undefined);
  const custom = buildSharePayload(
    { type: "speech", title: "Mine", text: "Hello" },
    { includeText: true },
  );
  assert.equal(decodeSharePayload(encodeSharePayload(custom)).text, "Hello");

  const rows = toScoreboardRows([updated]);
  assert.equal(sortScoreboard(rows, "mastery")[0].id, "p1");

  const prompt = buildImagePrompt(passage.segments[0], "wings");
  assert.match(prompt, /wings/);
  assert.match(prompt, /A\./);

  const items = photographicMemoryItems({
    ...passage,
    text: "A. B.",
    visualAnchors: [
      { segmentId: "a", imageUrl: "https://example.com/a.jpg" },
      { segmentId: "b", userNote: "https://example.com/b.jpg" },
    ],
  });
  assert.equal(items.length, 2);
  assert.equal(items[0].text, "A.");
  assert.equal(items[1].text, "B.");
  assert.notEqual(items[0].text, "A. B.");
  assert.equal(items[0].url, "https://example.com/a.jpg");
  assert.equal(items[1].url, "https://example.com/b.jpg");
  assert.equal(items.findIndex((item) => item.id === "b"), 1);

  const doc = emptyDocument();
  doc.passages.push(updated);
  assert.equal(importDocument(exportDocument(doc)).passages[0].title, "T");
  assert.throws(() => importDocument("{nope"), /invalid JSON/);
  assert.throws(() => importDocument("[]"), /object/);
});
