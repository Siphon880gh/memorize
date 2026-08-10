# Data Model — Memorize Script (schema v1)

Storage key: `memorize-script.v1` (localStorage JSON document).

## Root document

```ts
type RootDocument = {
  schemaVersion: 1;
  settings: Settings;
  passages: Passage[];
};
```

## Settings

```ts
type Settings = {
  /** Reserved; MVP has no provider calls */
  aiMode: "copy_paste";
  /** Optional UI prefs */
  theme?: "system" | "light" | "dark";
};
```

## Passage

```ts
type PassageType =
  | "bible"
  | "speech"
  | "acting_script"
  | "monologue"
  | "presentation"
  | "poem"
  | "song_spoken"
  | "custom";

type TrainingStage =
  | "read"
  | "understand"
  | "reduce"
  | "visualize"
  | "reconstruct"
  | "recall"
  | "master";

type ReductionLevel =
  | "full"
  | "essential"
  | "keywords"
  | "first_words"
  | "first_letters"
  | "none";

type Passage = {
  id: string;
  type: PassageType;
  title: string;
  /** e.g. "Psalm 91" — preferred for bible shares */
  bibleReference?: string;
  versionHint?: string;
  bibleGatewayUrl?: string;
  /** User-supplied text; authoritative wording */
  text: string;
  createdAt: string;
  updatedAt: string;
  segments: Segment[];
  segmentNotes: Record<string, string>;
  reductions: Partial<Record<ReductionLevel, string>>;
  reductionMeta?: { promptUsed?: string; updatedAt?: string };
  visualAnchors: VisualAnchor[];
  stageProgress: Partial<Record<TrainingStage, { completed: boolean; updatedAt?: string }>>;
  attempts: Attempt[];
  stats: PassageStats;
  masteredAt?: string | null;
};
```

## Segment

```ts
type Segment = {
  id: string;
  index: number;
  text: string;
};
```

## VisualAnchor

```ts
type VisualAnchor = {
  segmentId: string;
  concept: string;
  imagePrompt: string;
  userNote?: string;
  imageUrl?: string;
  updatedAt: string;
};
```

## Attempt

```ts
type Attempt = {
  id: string;
  stage: "reconstruct" | "recall" | "master";
  hintsUsed: number;
  durationMs: number;
  zeroHint: boolean;
  completedAt: string;
  success: boolean;
};
```

## PassageStats

```ts
type PassageStats = {
  bestHintCount: number | null;
  latestHintCount: number | null;
  attemptCount: number;
  zeroHintCompletions: number;
  bestTimeMs: number | null;
  lastPracticedAt: string | null;
  memorizationPercent: number;
};
```

## Share payload (URL)

```ts
type SharePayload = {
  v: 1;
  type: PassageType;
  title: string;
  bibleReference?: string;
  versionHint?: string;
  /** Only when user explicitly shares owned custom text */
  text?: string;
};
```

Bible/reference shares **omit** `text` by default.

## ChatGPT prompt contract

```ts
type PromptBundle = {
  purpose: "reduce_essential" | "reduce_keywords" | "visual_image";
  copyText: string;
  expectsPaste: "reduction_text" | "image_prompt_notes";
};
```

The app never sends these to a network LLM API in MVP; the user copies `copyText` externally and pastes results back.
