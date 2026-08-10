import { describe, expect, it } from "vitest";
import { buildImagePrompt, inferConcept } from "./visualPrompt";

describe("visualPrompt", () => {
  it("builds prompt including segment text and concept", () => {
    const segment = { id: "1", index: 0, text: "He will cover you with his feathers" };
    const prompt = buildImagePrompt(segment, "protective wings");
    expect(prompt).toContain("protective wings");
    expect(prompt).toContain(segment.text);
    expect(prompt).toContain("no text overlay");
  });

  it("infers a short concept", () => {
    expect(inferConcept("Refuge and fortress under shadow")).toContain("Refuge");
  });
});
