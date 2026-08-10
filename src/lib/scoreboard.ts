import type { Passage } from "../types";

export type ScoreboardRow = {
  id: string;
  title: string;
  bestHintCount: number | null;
  latestHintCount: number | null;
  attemptCount: number;
  zeroHintCompletions: number;
  memorizationPercent: number;
  bestTimeMs: number | null;
  lastPracticedAt: string | null;
};

export function toScoreboardRows(passages: Passage[]): ScoreboardRow[] {
  return passages.map((p) => ({
    id: p.id,
    title: p.title,
    bestHintCount: p.stats.bestHintCount,
    latestHintCount: p.stats.latestHintCount,
    attemptCount: p.stats.attemptCount,
    zeroHintCompletions: p.stats.zeroHintCompletions,
    memorizationPercent: p.stats.memorizationPercent,
    bestTimeMs: p.stats.bestTimeMs,
    lastPracticedAt: p.stats.lastPracticedAt,
  }));
}

export function sortScoreboard(
  rows: ScoreboardRow[],
  by: "lastPracticed" | "mastery" = "lastPracticed",
): ScoreboardRow[] {
  const copy = rows.slice();
  if (by === "mastery") {
    return copy.sort((a, b) => b.memorizationPercent - a.memorizationPercent);
  }
  return copy.sort((a, b) => {
    const at = a.lastPracticedAt ?? "";
    const bt = b.lastPracticedAt ?? "";
    return bt.localeCompare(at);
  });
}
