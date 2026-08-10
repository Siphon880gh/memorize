import type { Attempt, Passage, PassageStats, TrainingStage } from "../types";
import { emptyStats, newId } from "../types";

const STAGES: TrainingStage[] = [
  "read",
  "understand",
  "reduce",
  "visualize",
  "reconstruct",
  "recall",
  "master",
];

export function computeMemorizationPercent(passage: Passage): number {
  const segmentCount = Math.max(passage.segments.length, 1);
  const zeroHintBonus = passage.stats.zeroHintCompletions > 0 || passage.attempts.some((a) => a.zeroHint) ? 1 : 0;
  const best = passage.stats.bestHintCount;
  const hintFactor =
    best === null ? 0 : 1 - Math.min(best, segmentCount) / segmentCount;
  const completedStages = STAGES.filter((s) => passage.stageProgress[s]?.completed).length;
  const stageFactor = completedStages / 7;
  return Math.round(
    Math.max(0, Math.min(100, zeroHintBonus * 40 + hintFactor * 40 + stageFactor * 20)),
  );
}

export function recordAttempt(
  passage: Passage,
  input: {
    stage: Attempt["stage"];
    hintsUsed: number;
    durationMs: number;
    success: boolean;
  },
): Passage {
  const completedAt = new Date().toISOString();
  const zeroHint = input.success && input.hintsUsed === 0;
  const attempt: Attempt = {
    id: newId(),
    stage: input.stage,
    hintsUsed: input.hintsUsed,
    durationMs: input.durationMs,
    zeroHint,
    completedAt,
    success: input.success,
  };
  const stats: PassageStats = { ...(passage.stats ?? emptyStats()) };
  stats.attemptCount += 1;
  stats.latestHintCount = input.hintsUsed;
  stats.lastPracticedAt = completedAt;
  if (input.success) {
    if (stats.bestHintCount === null || input.hintsUsed < stats.bestHintCount) {
      stats.bestHintCount = input.hintsUsed;
    }
    if (stats.bestTimeMs === null || input.durationMs < stats.bestTimeMs) {
      stats.bestTimeMs = input.durationMs;
    }
    if (zeroHint) stats.zeroHintCompletions += 1;
  }
  const updated: Passage = {
    ...passage,
    attempts: [...passage.attempts, attempt],
    stats,
    updatedAt: completedAt,
  };
  updated.stats.memorizationPercent = computeMemorizationPercent(updated);
  return updated;
}
