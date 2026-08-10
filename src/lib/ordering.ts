import type { Segment } from "../types";

export type OrderItem = { id: string; text: string };

export function toOrderItems(segments: Segment[]): OrderItem[] {
  return segments
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((s) => ({ id: s.id, text: s.text }));
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
