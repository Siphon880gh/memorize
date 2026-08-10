import type { Attempt, HintEvent, Passage, PassageStats, TrainingStage } from "../types";
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
    hintEvents?: HintEvent[];
    durationMs: number;
    success: boolean;
  },
): Passage {
  const completedAt = new Date().toISOString();
  const events = input.hintEvents ?? [];
  const hintsUsed = Math.max(input.hintsUsed, events.length);
  const zeroHint = input.success && hintsUsed === 0;
  const attempt: Attempt = {
    id: newId(),
    stage: input.stage,
    hintsUsed,
    hintEvents: events,
    durationMs: input.durationMs,
    zeroHint,
    completedAt,
    success: input.success,
  };
  const stats: PassageStats = { ...(passage.stats ?? emptyStats()) };
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
  const updated: Passage = {
    ...passage,
    attempts: [...passage.attempts, attempt],
    stats,
    updatedAt: completedAt,
  };
  updated.stats.memorizationPercent = computeMemorizationPercent(updated);
  return updated;
}

/** Clear mastery progress and optionally wipe study notes / anchors / reductions. */
export function resetMastery(
  passage: Passage,
  mode: "keep_content" | "clear_content",
): Passage {
  const now = new Date().toISOString();
  const base: Passage = {
    ...passage,
    masteredAt: null,
    stageProgress: {},
    attempts: [],
    stats: emptyStats(),
    updatedAt: now,
  };
  if (mode === "clear_content") {
    return {
      ...base,
      segmentNotes: {},
      reductions: {},
      reductionMeta: undefined,
      visualAnchors: [],
    };
  }
  return base;
}

export function hintKindLabel(kind: HintEvent["kind"]): string {
  switch (kind) {
    case "place_hint":
      return "Hint button";
    case "reveal_original":
      return "Reveal full text";
    case "full_cue":
      return "Full-segment cue";
    default:
      return kind;
  }
}
