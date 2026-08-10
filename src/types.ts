export type PassageType =
  | "bible"
  | "speech"
  | "acting_script"
  | "monologue"
  | "presentation"
  | "poem"
  | "song_spoken"
  | "custom";

export type TrainingStage =
  | "read"
  | "understand"
  | "reduce"
  | "visualize"
  | "reconstruct"
  | "recall"
  | "master";

export type ReductionLevel =
  | "full"
  | "essential"
  | "keywords"
  | "first_words"
  | "first_letters"
  | "none";

export type Segment = {
  id: string;
  index: number;
  text: string;
};

export type VisualAnchor = {
  segmentId: string;
  concept: string;
  imagePrompt: string;
  userNote?: string;
  imageUrl?: string;
  updatedAt: string;
};

export type Attempt = {
  id: string;
  stage: "reconstruct" | "recall" | "master";
  hintsUsed: number;
  durationMs: number;
  zeroHint: boolean;
  completedAt: string;
  success: boolean;
};

export type PassageStats = {
  bestHintCount: number | null;
  latestHintCount: number | null;
  attemptCount: number;
  zeroHintCompletions: number;
  bestTimeMs: number | null;
  lastPracticedAt: string | null;
  memorizationPercent: number;
};

export type Passage = {
  id: string;
  type: PassageType;
  title: string;
  bibleReference?: string;
  versionHint?: string;
  bibleGatewayUrl?: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  segments: Segment[];
  segmentNotes: Record<string, string>;
  reductions: Partial<Record<ReductionLevel, string>>;
  reductionMeta?: {
    promptUsed?: string;
    updatedAt?: string;
    lastLevel?: ReductionLevel;
  };
  visualAnchors: VisualAnchor[];
  stageProgress: Partial<
    Record<TrainingStage, { completed: boolean; updatedAt?: string }>
  >;
  attempts: Attempt[];
  stats: PassageStats;
  masteredAt?: string | null;
};

export type Settings = {
  aiMode: "copy_paste";
  theme?: "system" | "light" | "dark";
};

export type RootDocument = {
  schemaVersion: 1;
  settings: Settings;
  passages: Passage[];
};

export const STORAGE_KEY = "memorize-script.v1";
export const SCHEMA_VERSION = 1 as const;

export const PASSAGE_TYPES: PassageType[] = [
  "bible",
  "speech",
  "acting_script",
  "monologue",
  "presentation",
  "poem",
  "song_spoken",
  "custom",
];

export function emptyStats(): PassageStats {
  return {
    bestHintCount: null,
    latestHintCount: null,
    attemptCount: 0,
    zeroHintCompletions: 0,
    bestTimeMs: null,
    lastPracticedAt: null,
    memorizationPercent: 0,
  };
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
