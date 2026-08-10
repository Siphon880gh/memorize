import { describe, expect, it } from "vitest";
import { emptyDocument } from "../storage/repository";
import { exportDocument, importDocument } from "./backup";

describe("backup", () => {
  it("round-trips a document", () => {
    const doc = emptyDocument();
    doc.passages.push({
      id: "1",
      type: "custom",
      title: "T",
      text: "Hi",
      createdAt: "t",
      updatedAt: "t",
      segments: [],
      segmentNotes: {},
      reductions: {},
      visualAnchors: [],
      stageProgress: {},
      attempts: [],
      stats: {
        bestHintCount: null,
        latestHintCount: null,
        attemptCount: 0,
        zeroHintCompletions: 0,
        bestTimeMs: null,
        lastPracticedAt: null,
        memorizationPercent: 0,
      },
    });
    const again = importDocument(exportDocument(doc));
    expect(again.passages[0]?.title).toBe("T");
  });

  it("rejects garbage JSON", () => {
    expect(() => importDocument("{nope")).toThrow(/invalid JSON/);
    expect(() => importDocument("[]")).toThrow(/object/);
    expect(() => importDocument("{}")).toThrow(/schemaVersion/);
  });
});
