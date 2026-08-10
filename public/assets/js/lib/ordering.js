function toOrderItems(segments) {
  return segments.slice().sort((a, b) => a.index - b.index).map((s) => ({ id: s.id, text: s.text }));
}
function shuffleItems(items, rng = Math.random) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.length > 1 && arr.every((v, i) => v === items[i])) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}
function gradeOrder(currentIds, correctIds) {
  const correctPositions = currentIds.map((id, i) => id === correctIds[i]);
  const allCorrect = correctPositions.every(Boolean) && currentIds.length === correctIds.length;
  const nextHintIndex = correctPositions.findIndex((ok) => !ok);
  return {
    correctPositions,
    allCorrect,
    nextHintIndex: nextHintIndex === -1 ? correctIds.length : nextHintIndex
  };
}
function moveItem(items, from, to) {
  if (from < 0 || from >= items.length || to < 0 || to >= items.length) return items.slice();
  const next = items.slice();
  const [picked] = next.splice(from, 1);
  next.splice(to, 0, picked);
  return next;
}
function applyHint(currentIds, correctIds) {
  const { nextHintIndex } = gradeOrder(currentIds, correctIds);
  if (nextHintIndex >= correctIds.length) {
    return { ids: currentIds.slice(), hintedIndex: -1 };
  }
  const needId = correctIds[nextHintIndex];
  const from = currentIds.indexOf(needId);
  if (from === -1) return { ids: currentIds.slice(), hintedIndex: -1 };
  return { ids: moveItem(currentIds, from, nextHintIndex), hintedIndex: nextHintIndex };
}
export {
  applyHint,
  gradeOrder,
  moveItem,
  shuffleItems,
  toOrderItems
};
