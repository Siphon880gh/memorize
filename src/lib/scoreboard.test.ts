import { describe, expect, it } from "vitest";
import { sortScoreboard, toScoreboardRows, type ScoreboardRow } from "./scoreboard";
import { emptyStats, type Passage } from "../types";

function p(partial: Partial<Passage> & { id: string; title: string }): Passage {
  return {
    type: "custom",
    text: "",
    createdAt: "",
    updatedAt: "",
    segments: [],
    segmentNotes: {},
    reductions: {},
    visualAnchors: [],
    stageProgress: {},
    attempts: [],
    stats: emptyStats(),
    ...partial,
  };
}

describe("scoreboard", () => {
  it("maps metrics from passages", () => {
    const rows = toScoreboardRows([
      p({
        id: "1",
        title: "A",
        stats: {
          ...emptyStats(),
          bestHintCount: 1,
          latestHintCount: 2,
          attemptCount: 3,
          zeroHintCompletions: 1,
          memorizationPercent: 70,
          bestTimeMs: 1000,
          lastPracticedAt: "2026-01-02T00:00:00.000Z",
        },
      }),
    ]);
    expect(rows[0]?.bestHintCount).toBe(1);
    expect(rows[0]?.memorizationPercent).toBe(70);
  });

  it("sorts by mastery and last practiced", () => {
    const rows: ScoreboardRow[] = [
      {
        id: "a",
        title: "A",
        bestHintCount: 0,
        latestHintCount: 0,
        attemptCount: 1,
        zeroHintCompletions: 1,
        memorizationPercent: 40,
        bestTimeMs: 1,
        lastPracticedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "b",
        title: "B",
        bestHintCount: 0,
        latestHintCount: 0,
        attemptCount: 1,
        zeroHintCompletions: 1,
        memorizationPercent: 90,
        bestTimeMs: 1,
        lastPracticedAt: "2026-02-01T00:00:00.000Z",
      },
    ];
    expect(sortScoreboard(rows, "mastery")[0]?.id).toBe("b");
    expect(sortScoreboard(rows, "lastPracticed")[0]?.id).toBe("b");
  });
});
