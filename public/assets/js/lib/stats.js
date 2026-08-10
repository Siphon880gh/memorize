import { emptyStats, newId } from "../types.js";
import { reduceProficiencyScore } from "./reduction.js";

const STAGES = [
  "read",
  "understand",
  "reduce",
  "visualize",
  "reconstruct",
  "recall",
  "master"
];

function computeMemorizationPercent(passage) {
  const segmentCount = Math.max(passage.segments.length, 1);
  const zeroHintBonus = passage.stats.zeroHintCompletions > 0 || passage.attempts.some((a) => a.zeroHint) ? 1 : 0;
  const best = passage.stats.bestHintCount;
  const hintFactor = best === null ? 0 : 1 - Math.min(best, segmentCount) / segmentCount;
  const completedStages = STAGES.filter((s) => passage.stageProgress[s]?.completed).length;
  const stageFactor = completedStages / 7;
  const reduceFactor = reduceProficiencyScore(passage.reduceProficiency);
  return Math.round(
    Math.max(
      0,
      Math.min(
        100,
        zeroHintBonus * 30 + hintFactor * 30 + stageFactor * 20 + reduceFactor * 20,
      ),
    ),
  );
}

function recordAttempt(passage, input) {
  const completedAt = new Date().toISOString();
  const events = input.hintEvents ?? [];
  const hintsUsed = Math.max(input.hintsUsed, events.length);
  const zeroHint = input.success && hintsUsed === 0;
  const attempt = {
    id: newId(),
    stage: input.stage,
    hintsUsed,
    hintEvents: events,
    durationMs: input.durationMs,
    zeroHint,
    completedAt,
    success: input.success
  };
  const stats = { ...passage.stats ?? emptyStats() };
  stats.attemptCount += 1;
  stats.latestHintCount = hintsUsed;
  stats.lastPracticedAt = completedAt;
  if (input.success) {
    if (stats.bestHintCount === null || hintsUsed < stats.bestHintCount) {
      stats.bestHintCount = hintsUsed;
    }
    if (stats.bestTimeMs === null || input.durationMs < stats.bestTimeMs) {
      stats.bestTimeMs = input.durationMs;
    }
    if (zeroHint) stats.zeroHintCompletions += 1;
  }
  const updated = {
    ...passage,
    attempts: [...passage.attempts, attempt],
    stats,
    updatedAt: completedAt
  };
  updated.stats.memorizationPercent = computeMemorizationPercent(updated);
  return updated;
}

function resetMastery(passage, mode) {
  const now = new Date().toISOString();
  const base = {
    ...passage,
    masteredAt: null,
    stageProgress: {},
    attempts: [],
    stats: emptyStats(),
    reduceProficiency: undefined,
    updatedAt: now
  };
  if (mode === "clear_content") {
    return {
      ...base,
      segmentNotes: {},
      reductions: {},
      reductionMeta: undefined,
      visualAnchors: []
    };
  }
  return base;
}

export {
  computeMemorizationPercent,
  recordAttempt,
  resetMastery
};
