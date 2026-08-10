import { describe, expect, it } from "vitest";
import {
  buildReductionPrompt,
  firstLetters,
  firstWords,
  localReduction,
} from "./reduction";

describe("reduction helpers", () => {
  const sample = "The Lord is my shepherd. I shall not want.";

  it("builds deterministic first-word cues", () => {
    expect(firstWords(sample)).toBe("The · I");
  });

  it("builds first-letter cues", () => {
    expect(firstLetters(sample)).toBe("T L I M S I S N W");
  });

  it("localReduction covers built-in levels", () => {
    expect(localReduction("full", sample)).toBe(sample);
    expect(localReduction("none", sample)).toBe("");
    expect(localReduction("first_words", sample)).toBe("The · I");
    expect(localReduction("essential", sample, "Lord shepherd want")).toBe(
      "Lord shepherd want",
    );
  });

  it("prompt includes passage and sequence instruction", () => {
    const prompt = buildReductionPrompt("essential", "Psalm 23", sample);
    expect(prompt).toContain(sample);
    expect(prompt).toContain("Preserve the original sequence");
    expect(prompt).toContain("Psalm 23");
  });
});
