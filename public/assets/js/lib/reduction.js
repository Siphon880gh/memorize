function firstWords(text) {
  return text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean).map((sentence) => {
    const word = sentence.split(/\s+/)[0] ?? "";
    return word;
  }).join(" \xB7 ");
}
function firstLetters(text) {
  return text.split(/\s+/).filter(Boolean).map((w) => {
    const ch = [...w].find((c) => /\p{L}/u.test(c));
    return ch ? ch.toUpperCase() : "";
  }).filter(Boolean).join(" ");
}
function localReduction(level, original, stored) {
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
function buildReductionPrompt(purpose, passageTitle, passageText) {
  const goal =
    purpose === "essential"
      ? "Essentials — condensed: tight essential anchors only (fewest words that still preserve sequence and meaning)"
      : "Essentials — expanded: a reduced cue that keeps short essential phrases (not the full original wording)";
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
    passageText
  ].join("\n");
}

/** Harder cues score higher when declared as Reduce proficiency. First letters = top. */
const REDUCE_PROFICIENCY = [
  { id: "keywords", label: "Essentials — expanded", score: 0.35 },
  { id: "essential", label: "Essentials — condensed", score: 0.5 },
  { id: "first_words", label: "First words", score: 0.75 },
  { id: "first_letters", label: "First letters", score: 1 },
  { id: "none", label: "No hints", score: 0.9 },
];

const REDUCTION_LEVELS = [
  { id: "full", label: "Full text", needsPaste: false },
  { id: "keywords", label: "Essentials — expanded", needsPaste: true },
  { id: "essential", label: "Essentials — condensed", needsPaste: true },
  { id: "first_words", label: "First words", needsPaste: false },
  { id: "first_letters", label: "First letters", needsPaste: false },
  { id: "none", label: "No hints", needsPaste: false }
];

function reduceProficiencyScore(level) {
  return REDUCE_PROFICIENCY.find((p) => p.id === level)?.score ?? 0;
}

function reduceProficiencyLabel(level) {
  return REDUCE_PROFICIENCY.find((p) => p.id === level)?.label
    ?? REDUCTION_LEVELS.find((l) => l.id === level)?.label
    ?? level
    ?? "—";
}

export {
  REDUCTION_LEVELS,
  REDUCE_PROFICIENCY,
  buildReductionPrompt,
  firstLetters,
  firstWords,
  localReduction,
  reduceProficiencyLabel,
  reduceProficiencyScore,
};
