import { describe, expect, it } from "vitest";
import {
  applyHint,
  gradeOrder,
  moveItem,
  reconstructCardLabel,
  segmentFirstWord,
  segmentKeywords,
  shuffleItems,
} from "./ordering";

describe("ordering", () => {
  it("grades correct, partial, and empty", () => {
    expect(gradeOrder(["a", "b"], ["a", "b"]).allCorrect).toBe(true);
    expect(gradeOrder(["b", "a"], ["a", "b"]).correctPositions).toEqual([false, false]);
    expect(gradeOrder([], ["a"]).allCorrect).toBe(false);
  });

  it("moves items for keyboard reorder", () => {
    expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });

  it("hint places only the next correct segment", () => {
    const correct = ["a", "b", "c"];
    const first = applyHint(["c", "b", "a"], correct);
    expect(first.hintedIndex).toBe(0);
    expect(first.ids[0]).toBe("a");
    expect(first.ids).toEqual(["a", "c", "b"]);
    const second = applyHint(first.ids, correct);
    expect(second.hintedIndex).toBe(1);
    expect(second.ids.slice(0, 2)).toEqual(["a", "b"]);
  });

  it("shuffle changes order when possible", () => {
    const items = [1, 2, 3, 4];
    let n = 0;
    const rng = () => {
      const seq = [0.9, 0.1, 0.5, 0.2];
      return seq[n++ % seq.length]!;
    };
    expect(shuffleItems(items, rng)).not.toEqual(items);
  });

  it("builds reconstruct cues and reveals full text when placed correctly", () => {
    const line = "Give us this day our daily bread.";
    expect(segmentFirstWord(line)).toBe("Give");
    expect(segmentKeywords(line)).toContain("daily");
    expect(reconstructCardLabel(line, "first_word", false)).toEqual({
      text: "Give",
      revealed: false,
    });
    expect(reconstructCardLabel(line, "keywords", false).revealed).toBe(false);
    expect(reconstructCardLabel(line, "full", false)).toEqual({
      text: line,
      revealed: false,
    });
    expect(reconstructCardLabel(line, "first_word", true)).toEqual({
      text: line,
      revealed: true,
    });
  });
});
