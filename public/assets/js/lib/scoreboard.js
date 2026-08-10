function toScoreboardRows(passages) {
  return passages.map((p) => ({
    id: p.id,
    title: p.title,
    bestHintCount: p.stats.bestHintCount,
    latestHintCount: p.stats.latestHintCount,
    attemptCount: p.stats.attemptCount,
    zeroHintCompletions: p.stats.zeroHintCompletions,
    memorizationPercent: p.stats.memorizationPercent,
    bestTimeMs: p.stats.bestTimeMs,
    lastPracticedAt: p.stats.lastPracticedAt
  }));
}
function sortScoreboard(rows, by = "lastPracticed") {
  const copy = rows.slice();
  if (by === "mastery") {
    return copy.sort((a, b) => b.memorizationPercent - a.memorizationPercent);
  }
  return copy.sort((a, b) => {
    const at = a.lastPracticedAt ?? "";
    const bt = b.lastPracticedAt ?? "";
    return bt.localeCompare(at);
  });
}
export {
  sortScoreboard,
  toScoreboardRows
};
