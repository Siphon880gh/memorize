import type { Segment } from "../types";

export type OrderItem = { id: string; text: string };

export type ReconstructCueMode = "first_word" | "keywords" | "full";

const KEYWORD_STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "is",
  "are",
  "be",
  "as",
  "it",
  "at",
  "by",
  "from",
  "with",
  "our",
  "us",
  "we",
  "thy",
  "thou",
  "thee",
  "ye",
  "that",
  "this",
  "his",
  "her",
  "their",
  "my",
  "me",
  "i",
  "you",
  "your",
  "not",
  "but",
  "so",
  "if",
  "into",
  "unto",
]);

export function toOrderItems(segments: Segment[]): OrderItem[] {
  return segments
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((s) => ({ id: s.id, text: s.text }));
}

/** First word of a segment (punctuation stripped from the edges). */
export function segmentFirstWord(text: string): string {
  const word = text.trim().split(/\s+/).find(Boolean) ?? "";
  return word.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "") || word || "…";
}

/** Content-word cue for a segment (falls back to first word). */
export function segmentKeywords(text: string): string {
  const words = text
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, ""))
    .filter(Boolean);
  const keys = words.filter((w) => {
    const lower = w.toLowerCase();
    return lower.length > 2 && !KEYWORD_STOP.has(lower);
  });
  if (keys.length === 0) return segmentFirstWord(text);
  return keys.join(" · ");
}

/**
 * Label shown on a reconstruct card.
 * Correctly placed cards always reveal the full segment.
 */
export function reconstructCardLabel(
  fullText: string,
  mode: ReconstructCueMode,
  inCorrectPlace: boolean,
): { text: string; revealed: boolean } {
  if (inCorrectPlace) {
    return { text: fullText, revealed: true };
  }
  if (mode === "full") {
    return { text: fullText, revealed: false };
  }
  if (mode === "first_word") {
    return { text: segmentFirstWord(fullText), revealed: false };
  }
  return { text: segmentKeywords(fullText), revealed: false };
}

export function shuffleItems<T>(items: T[], rng: () => number = Math.random): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  // Avoid identical order when possible
  if (arr.length > 1 && arr.every((v, i) => v === items[i])) {
    [arr[0], arr[1]] = [arr[1]!, arr[0]!];
  }
  return arr;
}

export function gradeOrder(
  currentIds: string[],
  correctIds: string[],
): { correctPositions: boolean[]; allCorrect: boolean; nextHintIndex: number } {
  const correctPositions = currentIds.map((id, i) => id === correctIds[i]);
  const allCorrect = correctPositions.every(Boolean) && currentIds.length === correctIds.length;
  const nextHintIndex = correctPositions.findIndex((ok) => !ok);
  return {
    correctPositions,
    allCorrect,
    nextHintIndex: nextHintIndex === -1 ? correctIds.length : nextHintIndex,
  };
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length) return items.slice();
  const next = items.slice();
  const [picked] = next.splice(from, 1);
  next.splice(to, 0, picked!);
  return next;
}

export function applyHint(
  currentIds: string[],
  correctIds: string[],
): { ids: string[]; hintedIndex: number } {
  const { nextHintIndex } = gradeOrder(currentIds, correctIds);
  if (nextHintIndex >= correctIds.length) {
    return { ids: currentIds.slice(), hintedIndex: -1 };
  }
  const needId = correctIds[nextHintIndex]!;
  const from = currentIds.indexOf(needId);
  if (from === -1) return { ids: currentIds.slice(), hintedIndex: -1 };
  return { ids: moveItem(currentIds, from, nextHintIndex), hintedIndex: nextHintIndex };
}
