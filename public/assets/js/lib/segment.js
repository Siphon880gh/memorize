import { newId } from "../types.js";
function segmentText(text) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const rough = normalized.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const pieces = [];
  for (const chunk of rough) {
    if (chunk.length > 80 && /[;:—]/.test(chunk)) {
      const parts = chunk.split(/\s*[;:—]\s*/).map((s) => s.trim()).filter(Boolean);
      pieces.push(...parts);
    } else {
      pieces.push(chunk);
    }
  }
  return pieces.map((t, index) => ({
    id: newId(),
    index,
    text: t
  }));
}
function ensureSegments(text, existing) {
  const next = segmentText(text);
  if (existing.length === next.length && existing.every((s, i) => s.text === next[i]?.text)) {
    return existing;
  }
  return next.map((seg, i) => {
    const prev = existing[i];
    if (prev && prev.text === seg.text) return { ...prev, index: i };
    return seg;
  });
}
export {
  ensureSegments,
  segmentText
};
