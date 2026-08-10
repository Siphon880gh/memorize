/** Normalize text for recall comparison (case, punctuation, whitespace). */
export function normalizeRecall(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type RecallGrade = {
  ok: boolean;
  similarity: number;
  empty: boolean;
};

/**
 * Grade a typed recall against the original passage.
 * Requires strong token overlap so "asdf" cannot pass.
 */
export function gradeRecall(original: string, attempt: string): RecallGrade {
  const expected = normalizeRecall(original);
  const got = normalizeRecall(attempt);
  if (!got) return { ok: false, similarity: 0, empty: true };
  if (!expected) return { ok: false, similarity: 0, empty: false };
  if (expected === got) return { ok: true, similarity: 1, empty: false };

  const ta = expected.split(" ").filter(Boolean);
  const tb = got.split(" ").filter(Boolean);
  const setA = new Set(ta);
  const setB = new Set(tb);
  let inter = 0;
  for (const t of setB) if (setA.has(t)) inter += 1;
  const union = new Set([...setA, ...setB]).size || 1;
  const jaccard = inter / union;
  const coverage = setA.size ? inter / setA.size : 0;
  const lenRatio =
    Math.min(expected.length, got.length) / Math.max(expected.length, got.length);
  const similarity = jaccard * 0.55 + coverage * 0.35 + lenRatio * 0.1;
  const ok = coverage >= 0.8 && jaccard >= 0.72 && similarity >= 0.78;
  return { ok, similarity, empty: false };
}
