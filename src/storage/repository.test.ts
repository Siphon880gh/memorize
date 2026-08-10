import { describe, expect, it } from "vitest";
import { STORAGE_KEY } from "../types";
import {
  PassageRepository,
  emptyDocument,
  memoryStorage,
  migrateDocument,
} from "./repository";

describe("PassageRepository", () => {
  it("round-trips create across reload", () => {
    const storage = memoryStorage();
    const repo = new PassageRepository(storage);
    const created = repo.upsertPassage({
      type: "speech",
      title: "Gettysburg",
      text: "Four score and seven years ago",
    });
    expect(created.id).toBeTruthy();

    const reloaded = new PassageRepository(storage);
    const listed = reloaded.listPassages();
    expect(listed).toHaveLength(1);
    expect(listed[0]?.title).toBe("Gettysburg");
    expect(listed[0]?.text).toContain("Four score");
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!).schemaVersion).toBe(1);
  });

  it("updates and deletes passages", () => {
    const repo = new PassageRepository(memoryStorage());
    const p = repo.upsertPassage({ type: "custom", title: "A", text: "one" });
    repo.upsertPassage({ id: p.id, type: "custom", title: "B", text: "two" });
    expect(repo.getPassage(p.id)?.title).toBe("B");
    expect(repo.deletePassage(p.id)).toBe(true);
    expect(repo.getPassage(p.id)).toBeUndefined();
  });

  it("migrates missing fields on load", () => {
    const doc = migrateDocument({
      schemaVersion: 1,
      passages: [{ id: "x", title: "T", text: "hello" }],
    });
    expect(doc.passages[0]?.stats.attemptCount).toBe(0);
    expect(doc.settings.aiMode).toBe("copy_paste");
    expect(emptyDocument().passages).toEqual([]);
  });
});
