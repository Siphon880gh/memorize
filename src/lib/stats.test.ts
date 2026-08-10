import { describe, expect, it } from "vitest";
import { emptyStats, type Passage } from "../types";
import { computeMemorizationPercent, recordAttempt, resetMastery } from "./stats";

function basePassage(): Passage {
  return {
    id: "p1",
    type: "custom",
    title: "T",
    text: "A. B. C.",
    createdAt: "",
    updatedAt: "",
    segments: [
      { id: "a", index: 0, text: "A." },
      { id: "b", index: 1, text: "B." },
      { id: "c", index: 2, text: "C." },
    ],
    segmentNotes: {},
    reductions: {},
    visualAnchors: [],
    stageProgress: { read: { completed: true } },
    attempts: [],
    stats: emptyStats(),
  };
}

describe("stats", () => {
  it("records attempts and zero-hint completions", () => {
    let p = recordAttempt(basePassage(), {
      stage: "reconstruct",
      hintsUsed: 0,
      durationMs: 1200,
      success: true,
    });
    expect(p.stats.zeroHintCompletions).toBe(1);
    expect(p.stats.bestHintCount).toBe(0);
    expect(p.stats.attemptCount).toBe(1);
    p = recordAttempt(p, {
      stage: "reconstruct",
      hintsUsed: 2,
      durationMs: 900,
      success: true,
    });
    expect(p.stats.bestHintCount).toBe(0);
    expect(p.stats.latestHintCount).toBe(2);
    expect(p.stats.bestTimeMs).toBe(900);
  });

  it("computes memorization percent in range", () => {
    const p = recordAttempt(basePassage(), {
      stage: "reconstruct",
      hintsUsed: 0,
      durationMs: 1000,
      success: true,
    });
    const pct = computeMemorizationPercent(p);
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it("stores hint event details on attempts", () => {
    const p = recordAttempt(basePassage(), {
      stage: "recall",
      hintsUsed: 1,
      hintEvents: [
        {
          kind: "reveal_original",
          at: "2026-01-01T00:00:00.000Z",
          detail: "Revealed the full original passage",
        },
      ],
      durationMs: 500,
      success: true,
    });
    expect(p.attempts[0]?.hintEvents).toHaveLength(1);
    expect(p.stats.zeroHintCompletions).toBe(0);
  });

  it("resets mastery progress and optionally clears study content", () => {
    const seeded: Passage = {
      ...basePassage(),
      masteredAt: "2026-01-01T00:00:00.000Z",
      stageProgress: {
        read: { completed: true },
        recall: { completed: true },
        master: { completed: true },
      },
      segmentNotes: { a: "note" },
      reductions: { keywords: "Give · bread" },
      visualAnchors: [
        {
          segmentId: "a",
          concept: "c",
          imagePrompt: "p",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      stats: { ...emptyStats(), zeroHintCompletions: 2, bestHintCount: 0, attemptCount: 3 },
      attempts: [
        {
          id: "1",
          stage: "recall",
          hintsUsed: 0,
          durationMs: 1,
          zeroHint: true,
          completedAt: "2026-01-01T00:00:00.000Z",
          success: true,
        },
      ],
    };
    const kept = resetMastery(seeded, "keep_content");
    expect(kept.masteredAt).toBeNull();
    expect(kept.stageProgress).toEqual({});
    expect(kept.attempts).toEqual([]);
    expect(kept.stats.zeroHintCompletions).toBe(0);
    expect(kept.segmentNotes.a).toBe("note");
    expect(kept.reductions.keywords).toBe("Give · bread");
    expect(kept.visualAnchors).toHaveLength(1);

    const cleared = resetMastery(seeded, "clear_content");
    expect(cleared.segmentNotes).toEqual({});
    expect(cleared.reductions).toEqual({});
    expect(cleared.visualAnchors).toEqual([]);
  });
});
