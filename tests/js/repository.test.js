import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PassageRepository,
  memoryStorage,
  migrateDocument,
  emptyDocument,
} from "../../public/assets/js/storage/repository.js";
import { STORAGE_KEY } from "../../public/assets/js/types.js";

test("round-trips create across reload", () => {
  const storage = memoryStorage();
  const repo = new PassageRepository(storage);
  const created = repo.upsertPassage({
    type: "speech",
    title: "Gettysburg",
    text: "Four score and seven years ago",
  });
  assert.ok(created.id);
  const reloaded = new PassageRepository(storage);
  const listed = reloaded.listPassages();
  assert.equal(listed.length, 1);
  assert.equal(listed[0].title, "Gettysburg");
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).schemaVersion, 1);
});

test("updates and deletes", () => {
  const repo = new PassageRepository(memoryStorage());
  const p = repo.upsertPassage({ type: "custom", title: "A", text: "one" });
  repo.upsertPassage({ id: p.id, type: "custom", title: "B", text: "two" });
  assert.equal(repo.getPassage(p.id).title, "B");
  assert.equal(repo.deletePassage(p.id), true);
  assert.equal(repo.getPassage(p.id), undefined);
});

test("migrate fills defaults", () => {
  const doc = migrateDocument({
    schemaVersion: 1,
    passages: [{ id: "x", title: "T", text: "hello" }],
  });
  assert.equal(doc.passages[0].stats.attemptCount, 0);
  assert.equal(doc.settings.aiMode, "copy_paste");
  assert.deepEqual(emptyDocument().passages, []);
});
