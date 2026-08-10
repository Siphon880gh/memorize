import { describe, expect, it } from "vitest";
import { emptyStats, type Passage } from "../types";
import { computeMemorizationPercent, recordAttempt } from "./stats";

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
});
