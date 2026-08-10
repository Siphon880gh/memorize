const STORAGE_KEY = "memorize-script.v1";
const SCHEMA_VERSION = 1;
const PASSAGE_TYPES = [
  "bible",
  "speech",
  "acting_script",
  "monologue",
  "presentation",
  "poem",
  "song_spoken",
  "custom"
];
function emptyStats() {
  return {
    bestHintCount: null,
    latestHintCount: null,
    attemptCount: 0,
    zeroHintCompletions: 0,
    bestTimeMs: null,
    lastPracticedAt: null,
    memorizationPercent: 0
  };
}
function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
export {
  PASSAGE_TYPES,
  SCHEMA_VERSION,
  STORAGE_KEY,
  emptyStats,
  newId
};
