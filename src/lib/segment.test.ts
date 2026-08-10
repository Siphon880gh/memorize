import { describe, expect, it } from "vitest";
import { ensureSegments, segmentText } from "./segment";

describe("segmentText", () => {
  it("returns empty for blank text", () => {
    expect(segmentText("")).toEqual([]);
    expect(segmentText("   \n")).toEqual([]);
  });

  it("splits multi-sentence passages", () => {
    const segs = segmentText("One. Two? Three!");
    expect(segs.map((s) => s.text)).toEqual(["One.", "Two?", "Three!"]);
    expect(segs.map((s) => s.index)).toEqual([0, 1, 2]);
  });

  it("splits long semicolon phrases", () => {
    const long =
      "A very long clause that keeps going for emphasis and imagery; another long clause that continues the thought with more detail and cadence";
    const segs = segmentText(long);
    expect(segs.length).toBeGreaterThan(1);
  });

  it("keep stable ids when text unchanged", () => {
    const first = segmentText("Alpha. Beta.");
    const again = ensureSegments("Alpha. Beta.", first);
    expect(again.map((s) => s.id)).toEqual(first.map((s) => s.id));
  });
});
