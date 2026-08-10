import type { ReductionLevel } from "../types";

export function firstWords(text: string): string {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((sentence) => {
      const word = sentence.split(/\s+/)[0] ?? "";
      return word;
    })
    .join(" · ");
}

export function firstLetters(text: string): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const ch = [...w].find((c) => /\p{L}/u.test(c));
      return ch ? ch.toUpperCase() : "";
    })
    .filter(Boolean)
    .join(" ");
}

export function localReduction(level: ReductionLevel, original: string, stored?: string): string {
  switch (level) {
    case "full":
      return original;
    case "none":
      return "";
    case "first_words":
      return firstWords(original);
    case "first_letters":
      return firstLetters(original);
    case "essential":
    case "keywords":
      return stored?.trim() || "";
    default:
      return original;
  }
}

export function buildReductionPrompt(
  purpose: "essential" | "keywords",
  passageTitle: string,
  passageText: string,
): string {
  const goal =
    purpose === "essential"
      ? "a simplified version containing only the essential memory words"
      : "key words only (memory anchors) while preserving original sequence and meaning";

  return [
    "You are helping me memorize a spoken passage.",
    `Passage title: ${passageTitle}`,
    "",
    "Reduce the passage into " + goal + ".",
    "Rules:",
    "- Preserve the original sequence and meaning.",
    "- Do not reorder ideas.",
    "- Do not add commentary before or after the reduced text.",
    "- Return plain text only.",
    "",
    "Passage:",
    passageText,
  ].join("\n");
}

export const REDUCTION_LEVELS: { id: ReductionLevel; label: string; needsPaste: boolean }[] = [
  { id: "full", label: "Full text", needsPaste: false },
  { id: "essential", label: "Essential words", needsPaste: true },
  { id: "keywords", label: "Keywords only", needsPaste: true },
  { id: "first_words", label: "First words", needsPaste: false },
  { id: "first_letters", label: "First letters", needsPaste: false },
  { id: "none", label: "No hints", needsPaste: false },
];
